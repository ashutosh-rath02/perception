import { redis } from "@/lib/redis";
import DisplayPage from "./DisplayPage";

interface PageProps {
  params: {
    code: string;
  };
}

const Room = async ({ params }: PageProps) => {
  const { code } = params;

  const initialData = await redis.zrange<(string | number)[]>(
    `room:${code}`,
    0,
    49,
    {
      withScores: true,
    }
  );
  const words: { text: string; value: number }[] = [];

  for (let i = 0; i < initialData.length; i += 2) {
    const [text, value] = initialData.slice(i, i + 2);

    if (typeof text === "string" && typeof value === "number") {
      words.push({ text, value });
    }
  }
  await redis.incr("served-requests");
  return <DisplayPage initialData={words} roomCode={code} />;
};

export default Room;
