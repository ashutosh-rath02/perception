"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useMutation } from "@tanstack/react-query";
import { createFeedback } from "@/app/actions";

const FeedbackContainer = () => {
  const [input, setInput] = useState<string>("");

  const { mutate, error, isPending } = useMutation({
    mutationFn: createFeedback,
  });

  return (
    <div className="mt-12 flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={({ target }) => setInput(target.value)}
          className="bg-white min-w-64"
          placeholder="Enter feedback here..."
        />
        <Button
          disabled={isPending}
          onClick={() => mutate({ feedbackName: input })}
        >
          Create
        </Button>
      </div>

      {error ? <p className="text-sm text-red-600">e{error.message}</p> : null}
    </div>
  );
};

export default FeedbackContainer;
