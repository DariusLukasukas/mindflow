"use client";
import { Mic, Pause } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useEffect, useRef } from "react";

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
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const baseValueRef = useRef("");

  useEffect(() => {
    if (isListening && transcript) {
      const combined = baseValueRef.current
        ? `${baseValueRef.current} ${transcript}`
        : transcript;
      onChange(combined);
    }
  }, [transcript, isListening]);

  const handleFormSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    stopListening();
    resetTranscript();
    baseValueRef.current = "";
    onSubmit(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e as any);
    }
  };

  const startVoiceInput = () => {
    if (isListening) {
      stopListening();
      resetTranscript();
      baseValueRef.current = "";
    } else {
      baseValueRef.current = value;
      resetTranscript();
      startListening();
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="relative">
        <Textarea
          placeholder="What's on your mind?"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="relative min-h-8 border-0 pr-12 font-medium focus-visible:ring-0 focus-visible:ring-offset-0 md:text-base"
        />

        <Button
          type="button"
          aria-label={isListening ? "Stop voice input" : "Start voice input"}
          size={"icon"}
          variant={"ghost"}
          onClick={startVoiceInput}
          className="absolute top-2 right-2 bottom-2"
        >
          {isListening ? <Pause /> : <Mic />}
        </Button>
      </div>
    </form>
  );
}
