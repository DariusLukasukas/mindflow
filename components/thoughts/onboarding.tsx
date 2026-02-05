"use client";
import { Thought } from "@/lib/types";
import { useEffect, useState } from "react";
import ThoughtList from "./thought-list";
import { Button } from "../ui/button";

import { motion, AnimatePresence } from "motion/react";

const ONBOARDING_MESSAGE = [
  {
    id: "onb-1",
    content: "Welcome to Mindflow! This is where your thoughts live.",
  },
  {
    id: "onb-2",
    content:
      "Thoughts automatically blur after 3 seconds to reduce distraction.",
  },
  { id: "onb-3", content: "Hover over a thought to read it." },
  {
    id: "onb-4",
    content: "Use the timer to track your focus sessions.",
  },
];

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [visibleThoughts, setVisibleThoughts] = useState<Thought[]>([]);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (visibleThoughts.length < ONBOARDING_MESSAGE.length) {
      // First thought appears immediately, others after 5 seconds
      const delay = visibleThoughts.length === 0 ? 0 : 5000;

      const timer = setTimeout(() => {
        const nextMessage = ONBOARDING_MESSAGE[visibleThoughts.length];
        const newThought: Thought = {
          id: nextMessage.id,
          content: nextMessage.content,
          createdAt: Date.now(),
        };

        setVisibleThoughts((prev) => [...prev, newThought]);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [visibleThoughts.length]);

  useEffect(() => {
    // When all thoughts are visible, wait before showing button
    if (visibleThoughts.length === ONBOARDING_MESSAGE.length && !showButton) {
      const timer = setTimeout(() => {
        setShowButton(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [visibleThoughts.length, showButton]);

  return (
    <div className="pt-20">
      <header className="flex items-center py-2 pl-3">
        <h2 className="text-2xl font-bold text-balance">Onboarding</h2>
      </header>
      {/* Seperator */}
      <div
        data-slot="separator"
        className="bg-border/50 mb-4 h-px w-full shrink-0"
      />

      <ThoughtList thoughts={visibleThoughts} onDelete={() => {}} />

      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="mt-2"
          >
            <Button
              size={"lg"}
              className="text-base"
              variant={"ghost"}
              onClick={onComplete}
            >
              Continue
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
