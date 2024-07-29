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
import ShareDropdown from "@/components/ShareDropdown";

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
  const [expandedSentence, setExpandedSentence] = useState<string | null>(null);

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
    const containerWidth = feedbackRef.current?.clientWidth || 800;
    const containerHeight = feedbackRef.current?.clientHeight || 500;
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
        Object.values(newPositions).some(
          (pos) =>
            Math.abs(pos.x - x) < boxWidth && Math.abs(pos.y - y) < boxHeight
        ) &&
        attempts < maxAttempts
      );

      newPositions[sentence.text] = { x, y };
    });

    return newPositions;
  }, []);

  useEffect(() => {
    setPositions(generatePositions(sentences));
  }, [sentences, generatePositions]);

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
        return updatedSentences;
      });
    });

    return () => {
      socket.off("room-update");
    };
  }, [roomCode]);

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

  const handleSentenceClick = (sentenceText: string) => {
    setExpandedSentence(
      expandedSentence === sentenceText ? null : sentenceText
    );
  };

  return (
    <div className="w-full flex flex-col items-center justify-between min-h-screen">
      <SectionContainer className="flex flex-col items-center gap-6 w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Room: <span className="text-blue-600">{roomCode}</span>
          </h1>
          <div className="flex gap-2">
            <ShareDropdown roomCode={roomCode} />
            <Button
              onClick={takeScreenshot}
              variant="outline"
              className="text-sm"
            >
              Take Screenshot
            </Button>
          </div>
        </div>
        <div
          ref={feedbackRef}
          className="background relative w-full h-[300px] sm:h-[400px] md:h-[500px] border border-gray-200 rounded-lg p-4 overflow-hidden"
        >
          {sentences.map((sentence) => (
            <motion.div
              key={sentence.text}
              className="absolute p-2 rounded-lg shadow cursor-pointer"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                fontSize: `${Math.min(12 + sentence.value, 20)}px`,
                width: "120px",
                backgroundColor:
                  colorMap[sentence.text] || generateRandomColor(),
                color: "black",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace:
                  expandedSentence === sentence.text ? "normal" : "nowrap",
                left: positions[sentence.text]?.x || 0,
                top: positions[sentence.text]?.y || 0,
              }}
              onClick={() => handleSentenceClick(sentence.text)}
            >
              {sentence.text}
            </motion.div>
          ))}
        </div>

        <div className="w-full max-w-lg">
          <div className="mt-1 flex flex-col sm:flex-row gap-2 items-center">
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
              className="w-full sm:w-auto"
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
