"use client";
import { Mic } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

interface ThoughtInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
}

export default function ThoughtInput({
  value,
  onChange,
  onSubmit,
}: ThoughtInputProps) {
  const [isListening, setIsListening] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as any);
    }
  };

  const startVoiceInput = () => {};

  return (
    <form onSubmit={onSubmit}>
      <div className="relative">
        <Textarea
          placeholder="What's on your mind?"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="relative min-h-8 border-0 font-medium focus-visible:ring-0 focus-visible:ring-offset-0 md:text-base"
        />
        <Button
          size={"icon"}
          variant={"ghost"}
          className="absolute right-2 bottom-2"
          aria-label="Voice input"
        >
          <Mic className={isListening ? "animate-pulse text-red-500" : ""} />
        </Button>
      </div>
    </form>
  );
}
