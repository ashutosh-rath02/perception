"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useMutation } from "@tanstack/react-query";
import { createRoom } from "@/app/actions";
import { useRouter } from "next/navigation";

const RoomContainer = () => {
  const [joinCode, setJoinCode] = useState<string>("");
  const router = useRouter();

  const {
    mutate: createNewRoom,
    error,
    isPending,
  } = useMutation({
    mutationFn: createRoom,
  });

  const handleJoinRoom = () => {
    if (joinCode) {
      router.push(`/room/${joinCode}`);
    }
  };

  return (
    <div className="mt-12 flex flex-col gap-4">
      <Button
        disabled={isPending}
        onClick={() => createNewRoom()}
        className="w-full"
      >
        Create New Room
      </Button>

      <div className="flex gap-2">
        <Input
          value={joinCode}
          onChange={({ target }) => setJoinCode(target.value)}
          className="bg-white"
          placeholder="Enter room code..."
        />
        <Button onClick={handleJoinRoom}>Join Room</Button>
      </div>

      {error ? <p className="text-sm text-red-600">{error.message}</p> : null}
    </div>
  );
};

export default RoomContainer;
