"use server";

import { redis } from "@/lib/redis";
import { redirect } from "next/navigation";

function generateRoomCode(length: number = 6): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export const createRoom = async () => {
  let roomCode: string = "";
  let isUnique = false;

  // Keep generating codes until we find a unique one
  while (!isUnique) {
    roomCode = generateRoomCode();
    const exists = await redis.sismember("existing-rooms", roomCode);
    if (!exists) {
      isUnique = true;
    }
  }

  await redis.sadd("existing-rooms", roomCode);
  redirect(`/room/${roomCode}`);
};

function sentenceFreq(text: string): { text: string; value: number }[] {
  const sentences = text
    .split(/[.!?]+/)
    .filter((sentence) => sentence.trim() !== "");
  const freqMap: Record<string, number> = {};

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (!freqMap[trimmedSentence]) freqMap[trimmedSentence] = 0;
    freqMap[trimmedSentence] += 1;
  }
  return Object.keys(freqMap).map((sentence) => ({
    text: sentence,
    value: freqMap[sentence],
  }));
}

export const submitFeedback = async ({
  feedback,
  roomCode,
}: {
  feedback: string;
  roomCode: string;
}) => {
  const sentences = sentenceFreq(feedback);
  await Promise.all(
    sentences.map(async (sentence) => {
      await redis.zadd(
        `room:${roomCode}`,
        {
          incr: true,
        },
        { member: sentence.text, score: sentence.value }
      );
    })
  );

  await redis.incr("served-requests");
  await redis.publish(`room:${roomCode}`, JSON.stringify(sentences));

  return feedback;
};

export const checkRoomExists = async (roomCode: string): Promise<boolean> => {
  const exists = await redis.sismember("existing-rooms", roomCode);
  return exists === 1;
};
