"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useMutation } from "@tanstack/react-query";
import { createRoom, checkRoomExists } from "@/app/actions";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

const RoomContainer = () => {
  const [joinCode, setJoinCode] = useState<string>("");
  const router = useRouter();

  const {
    mutate: createNewRoom,
    error: createError,
    isPending: isCreatePending,
  } = useMutation({
    mutationFn: createRoom,
    onSuccess: (roomCode) => {
      if (roomCode) {
        router.push(`/room/${roomCode}`);
      }
    },
  });

  const { mutate: checkRoom, isPending: isCheckPending } = useMutation({
    mutationFn: checkRoomExists,
    onSuccess: (exists) => {
      if (exists) {
        router.push(`/room/${joinCode}`);
      } else {
        toast({
          title: "Error",
          description: "No such room exists.",
          variant: "destructive",
        });
      }
    },
  });

  const handleJoinRoom = () => {
    if (joinCode.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a room code.",
        variant: "destructive",
      });
      return;
    }
    checkRoom(joinCode);
  };

  const isPending = isCreatePending || isCheckPending;

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
        <Button disabled={isPending} onClick={handleJoinRoom}>
          Join Room
        </Button>
      </div>

      {createError ? (
        <p className="text-sm text-red-600">{createError.message}</p>
      ) : null}
    </div>
  );
};

export default RoomContainer;
