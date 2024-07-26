"use client";

import SectionContainer from "@/components/SectionContainer";
import { useEffect, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { submitFeedback } from "../../actions";
import { io } from "socket.io-client";
import { motion } from "framer-motion";

const socket = io("http://localhost:8080");

interface DisplayPageProps {
  roomCode: string;
  initialData: { text: string; value: number }[];
}

const DisplayPage = ({ roomCode, initialData }: DisplayPageProps) => {
  const [words, setWords] = useState(initialData);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.emit("join-room", `room:${roomCode}`);
  }, [roomCode]);

  useEffect(() => {
    socket.on("room-update", (message: string) => {
      const data = JSON.parse(message) as {
        text: string;
        value: number;
      }[];

      setWords((prevWords) => {
        const newWords = [...prevWords];
        data.forEach((newWord) => {
          const existingWordIndex = newWords.findIndex(
            (word) => word.text === newWord.text
          );
          if (existingWordIndex !== -1) {
            newWords[existingWordIndex].value += newWord.value;
          } else if (newWords.length < 50) {
            newWords.push(newWord);
          }
        });
        return newWords.sort((a, b) => b.value - a.value).slice(0, 50);
      });
    });

    return () => {
      socket.off("room-update");
    };
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: submitFeedback,
  });

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-grid-zinc-50 pb-20">
      <SectionContainer className="flex flex-col items-center gap-6 pt-20">
        <h1 className="text-4xl sm:text-5xl font-bold text-center tracking-light text-balance">
          Room: <span className="text-blue-600">{roomCode}</span>
        </h1>

        <p className="text-sm">(updated in real-time)</p>

        <div className="relative w-full max-w-4xl h-[600px] border border-gray-200 rounded-lg">
          {words.map((word, index) => (
            <motion.div
              key={word.text}
              className="absolute bg-white p-2 rounded shadow"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              style={{
                left: `${Math.random() * 80}%`,
                top: `${Math.random() * 80}%`,
                fontSize: `${Math.min(word.value * 2 + 12, 36)}px`,
              }}
            >
              {word.text}
            </motion.div>
          ))}
        </div>
        <div className="max-w-lg w-full">
          <Label className="font-semibold tracking-tight text-lg pb-2">
            Share your thoughts
          </Label>
          <div className="mt-1 flex gap-2 items-center">
            <Input
              value={input}
              onChange={({ target }) => setInput(target.value)}
              placeholder="Enter your feedback..."
            />
            <Button
              disabled={isPending}
              onClick={() => mutate({ feedback: input, roomCode })}
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
