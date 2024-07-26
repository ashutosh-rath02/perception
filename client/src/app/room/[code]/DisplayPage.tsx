"use client";

import SectionContainer from "@/components/SectionContainer";
import { useEffect, useState, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { submitFeedback } from "../../actions";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";

// const socket = io("http://localhost:8080");
const socket = io("https://feedback-zk2h.onrender.com");

interface DisplayPageProps {
  roomCode: string;
  initialData: { text: string; value: number }[];
}

const DisplayPage = ({ roomCode, initialData }: DisplayPageProps) => {
  const [sentences, setSentences] = useState(initialData);
  const [input, setInput] = useState("");
  const feedbackRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<{
    [key: string]: { x: number; y: number };
  }>({});

  const generatePositions = useCallback(
    (newSentences: typeof sentences) => {
      const newPositions: { [key: string]: { x: number; y: number } } = {};
      newSentences.forEach((sentence) => {
        if (!positions[sentence.text]) {
          newPositions[sentence.text] = {
            x: Math.random() * 60,
            y: Math.random() * 80,
          };
        } else {
          newPositions[sentence.text] = positions[sentence.text];
        }
      });
      setPositions(newPositions);
    },
    [positions]
  );

  useEffect(() => {
    generatePositions(sentences);
  }, []);

  useEffect(() => {
    socket.emit("join-room", `room:${roomCode}`);

    socket.on("room-update", (message: string) => {
      const data = JSON.parse(message) as {
        text: string;
        value: number;
      }[];

      setSentences((prevSentences) => {
        const newSentences = [...prevSentences];
        data.forEach((newSentence) => {
          const existingSentenceIndex = newSentences.findIndex(
            (sentence) => sentence.text === newSentence.text
          );
          if (existingSentenceIndex !== -1) {
            newSentences[existingSentenceIndex].value += newSentence.value;
          } else if (newSentences.length < 50) {
            newSentences.push(newSentence);
          }
        });
        const updatedSentences = newSentences
          .sort((a, b) => b.value - a.value)
          .slice(0, 50);
        generatePositions(updatedSentences);
        return updatedSentences;
      });
    });

    return () => {
      socket.off("room-update");
    };
  }, [roomCode, generatePositions]);

  const { mutate, isPending } = useMutation({
    mutationFn: submitFeedback,
    onSuccess: (data) => {
      const newSentence = { text: data, value: 1 };
      setSentences((prev) => {
        const updated = [...prev, newSentence]
          .sort((a, b) => b.value - a.value)
          .slice(0, 50);
        generatePositions(updated);
        return updated;
      });
    },
  });

  const takeScreenshot = () => {
    if (feedbackRef.current) {
      html2canvas(feedbackRef.current).then((canvas) => {
        const link = document.createElement("a");
        link.download = `feedback-${roomCode}.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-between min-h-screen bg-grid-zinc-50 py-8">
      <SectionContainer className="flex flex-col items-center gap-6 w-full max-w-4xl">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-3xl font-bold text-gray-900">
            Room: <span className="text-blue-600">{roomCode}</span>
          </h1>
          <Button onClick={takeScreenshot} variant="outline">
            Take Screenshot
          </Button>
        </div>

        <p className="text-sm">(updated in real-time)</p>

        <div
          ref={feedbackRef}
          className="relative w-full h-[500px] border border-gray-200 rounded-lg p-4 overflow-hidden bg-white"
        >
          {sentences.map((sentence) => (
            <motion.div
              key={sentence.text}
              className="absolute bg-white p-2 rounded shadow"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                left: `${positions[sentence.text]?.x ?? 0}%`,
                top: `${positions[sentence.text]?.y ?? 0}%`,
                fontSize: `${Math.min(14 + sentence.value, 24)}px`,
                maxWidth: "80%",
              }}
            >
              {sentence.text}
            </motion.div>
          ))}
        </div>

        <div className="w-full max-w-lg">
          <div className="mt-1 flex gap-2 items-center">
            <Input
              value={input}
              onChange={({ target }) => setInput(target.value)}
              placeholder="Enter your feedback..."
              className="flex-grow"
            />
            <Button
              disabled={isPending}
              onClick={() => {
                mutate({ feedback: input, roomCode });
                setInput("");
              }}
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
