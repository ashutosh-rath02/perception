"use client";

import SectionContainer from "@/components/SectionContainer";
import { scaleLog } from "@visx/scale";
import { Wordcloud } from "@visx/wordcloud";
import { useEffect, useState } from "react";
import { Text } from "@visx/text";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { submitFeedback } from "../actions";
import { io } from "socket.io-client";

const socket = io("https://feedback-zk2h.onrender.com");

interface DisplayPageProps {
  feedbackName: string;
  initialData: { text: string; value: number }[];
}

const COLORS = ["#143059", "#2F6B9A", "#82a6c2"];

const DisplayPage = ({ feedbackName, initialData }: DisplayPageProps) => {
  const [words, setWords] = useState(initialData);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.emit("join-room", `room:${feedbackName}`);
  }, []);

  useEffect(() => {
    socket.on("room-update", (message: string) => {
      const data = JSON.parse(message) as {
        text: string;
        value: number;
      }[];

      data.map((newWord) => {
        const isWordAlreadyIncluded = words.some(
          (word) => word.text === newWord.text
        );

        if (isWordAlreadyIncluded) {
          // increment
          setWords((prev) => {
            const before = prev.find((word) => word.text === newWord.text);
            const rest = prev.filter((word) => word.text !== newWord.text);

            return [
              ...rest,
              { text: before!.text, value: before!.value + newWord.value },
            ];
          });
        } else if (words.length < 50) {
          // add to state
          setWords((prev) => [...prev, newWord]);
        }
      });
    });

    return () => {
      socket.off("room-update");
    };
  }, [words]);

  const fontScale = scaleLog({
    domain: [
      Math.min(...words.map((d) => d.value)),
      Math.max(...words.map((d) => d.value)),
    ],
    range: [10, 100],
  });

  const { mutate, isPending } = useMutation({
    mutationFn: submitFeedback,
  });

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-grid-zinc-50 pb-20">
      <SectionContainer className="flex flex-col items-center gap-6 pt-20">
        <h1 className="text-4xl sm:text-5xl font-bold text-center tracking-light text-balance">
          What people think about{" "}
          <span className="text-blue-600">{feedbackName}</span>
        </h1>

        <p className="text-sm">(updated in real-time)</p>

        <div className="aspect-square max-w-xl flex items-center justify-center">
          <Wordcloud
            words={words}
            width={500}
            height={500}
            fontSize={(data) => fontScale(data.value)}
            font={"Impact"}
            padding={2}
            spiral="archimedean"
            rotate={0}
            random={() => 0.5}
          >
            {(cloudWords) =>
              cloudWords.map((w, i) => (
                <Text
                  key={w.text}
                  fill={COLORS[i % COLORS.length]}
                  textAnchor="middle"
                  transform={`translate(${w.x}, ${w.y})`}
                  fontSize={w.size}
                  fontFamily={w.font}
                >
                  {w.text}
                </Text>
              ))
            }
          </Wordcloud>
        </div>
        <div className="max-w-lg w-full">
          <Label className="font-semibold tracking-tight text-lg pb-2">
            Here&apos;s what I think about {feedbackName}
          </Label>
          <div className="mt-1 flex gap-2 items-center">
            <Input
              value={input}
              onChange={({ target }) => setInput(target.value)}
              placeholder={`${feedbackName} is absolutely...`}
            />
            <Button
              disabled={isPending}
              onClick={() => mutate({ feedback: input, feedbackName })}
            >
              Share
            </Button>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};

export default DisplayPage;
