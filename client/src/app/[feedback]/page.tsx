import { redis } from "@/lib/redis";
import DisplayPage from "./DisplayPage";

interface PageProps {
  params: {
    feedback: string;
  };
}

const Feedback = async ({ params }: PageProps) => {
  const { feedback } = params;

  const initialData = await redis.zrange<(string | number)[]>(
    `room:${feedback}`,
    0,
    49,
    {
      withScores: true,
    }
  );
  const words: { text: string; value: number }[] = [];

  for (let i = 0; i < initialData.length; i++) {
    const [text, value] = initialData.slice(i, i + 2);

    if (typeof text === "string" && typeof value === "number") {
      words.push({ text, value });
    }
  }
  await redis.incr("served-requests");
  return <DisplayPage initialData={words} feedbackName={feedback} />;
};

export default Feedback;
