"use server";

import { redis } from "@/lib/redis";
import { error } from "console";
import { redirect } from "next/navigation";

export const createFeedback = async ({
  feedbackName,
}: {
  feedbackName: string;
}) => {
  const regex = /^[a-zA-Z0-9-_]+$/;
  if (!feedbackName || feedbackName.length > 50) {
    return { error: "Feedback must be between 1 and 50 characters" };
  }
  if (!regex.test(feedbackName)) {
    return { error: "Only letter, numbers and hyphens allowed" };
  }

  await redis.sadd("existing-feedback", feedbackName);
  redirect(`/${feedbackName}`);
};

function wordFreq(text: string): { text: string; value: number }[] {
  const words: string[] = text.replace(/\./g, "").split(/\s/);
  const freqMap: Record<string, number> = {};

  for (const w of words) {
    if (!freqMap[w]) freqMap[w] = 0;
    freqMap[w] += 1;
  }
  return Object.keys(freqMap).map((word) => ({
    text: word,
    value: freqMap[word],
  }));
}

export const submitFeedback = async ({
  feedback,
  feedbackName,
}: {
  feedback: string;
  feedbackName: string;
}) => {
  const words = wordFreq(feedback);
  await Promise.all(
    words.map(async (word) => {
      await redis.zadd(
        `room:${feedbackName}`,
        {
          incr: true,
        },
        { member: word.text, score: word.value }
      );
    })
  );

  await redis.incr("served-requests");
  await redis.publish(`room:${feedbackName}`, words);

  return feedback;
};
