"use client";

import SectionContainer from "@/components/SectionContainer";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { submitFeedback } from "../../actions";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";

const socket = io("http://localhost:8080");
// const socket = io("https://feedback-zk2h.onrender.com");

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

  const generateRandomColor = () => {
    return (
      "rgb(" +
      (Math.floor(Math.random() * 56) + 200) +
      ", " +
      (Math.floor(Math.random() * 56) + 200) +
      ", " +
      (Math.floor(Math.random() * 56) + 200) +
      ")"
    );
  };

  const generatePositions = useCallback((newSentences: typeof sentences) => {
    const boxWidth = 150;
    const boxHeight = 60;
    const containerWidth = 800;
    const containerHeight = 500;
    const padding = 10;

    const newPositions: { [key: string]: { x: number; y: number } } = {};

    newSentences.forEach((sentence) => {
      let x: number, y: number;
      let attempts = 0;
      const maxAttempts = 50;

      do {
        x = Math.random() * (containerWidth - boxWidth - 2 * padding) + padding;
        y =
          Math.random() * (containerHeight - boxHeight - 2 * padding) + padding;

        attempts++;
      } while (
        // Check for overlaps (simplified)
        Object.values(newPositions).some(
          (pos) =>
            Math.abs(pos.x - x) < boxWidth && Math.abs(pos.y - y) < boxHeight
        ) &&
        attempts < maxAttempts
      );

      newPositions[sentence.text] = {
        x: x,
        y: y,
      };
    });

    setPositions(newPositions);
  }, []);

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

  const generateColorMap = useCallback(() => {
    const colorMap: { [key: string]: string } = {};
    sentences.forEach((sentence) => {
      colorMap[sentence.text] = generateRandomColor();
    });
    return colorMap;
  }, [sentences]);

  const colorMap = useMemo(() => generateColorMap(), [generateColorMap]);

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
    <div className="w-full flex flex-col items-center justify-between min-h-screen">
      <SectionContainer className="flex flex-col items-center gap-6 w-full max-w-4xl">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-3xl font-bold text-gray-900">
            Room: <span className="text-blue-600">{roomCode}</span>
          </h1>
          <Button onClick={takeScreenshot} variant="outline">
            Take Screenshot
          </Button>
        </div>
        <div
          ref={feedbackRef}
          className="background relative w-full h-[500px] border border-gray-200 rounded-lg p-4 overflow-hidden"
        >
          {sentences.map((sentence) => (
            <motion.div
              key={sentence.text}
              className="absolute p-2 rounded-lg shadow"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                left: `${positions[sentence.text]?.x ?? 0}px`,
                top: `${positions[sentence.text]?.y ?? 0}px`,
                fontSize: `${Math.min(14 + sentence.value, 24)}px`,
                width: "150px",
                backgroundColor:
                  colorMap[sentence.text] || generateRandomColor(),
                color: "black",
                overflow: "hidden",
                textOverflow: "wrap",
                whiteSpace: "wrap",
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
