"use client";

import { useAppStore } from "@/lib/store";
import { Thought } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDistanceStrict } from "date-fns";
import { memo, useEffect, useState } from "react";

interface ThoughtRowProps {
  thought: Thought;
  onDelete: (id: string) => void;
}

function ThoughtRow({ thought, onDelete }: ThoughtRowProps) {
  const blurEnabled = useAppStore((state) => state.blurEnabled);
  const [isHovered, setIsHovered] = useState(false);
  const [isBlurred, setIsBlurred] = useState(() => {
    const timeSinceCreation = Date.now() - thought.createdAt;
    return timeSinceCreation >= 100;
  });

  useEffect(() => {
    const timeSinceCreation = Date.now() - thought.createdAt;
    const isNewThought = timeSinceCreation < 100;

    if (isNewThought) {
      const timer = setTimeout(() => {
        setIsBlurred(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [thought.createdAt]);

  const shouldBlur = blurEnabled && isBlurred && !isHovered;

  return (
    <li
      className="hover:bg-muted group relative flex flex-row items-center justify-between rounded-xl p-3 transition-colors duration-200 ease-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <time className="text-muted-foreground absolute -left-4 hidden -translate-x-full text-sm group-hover:block">
        {formatDistanceStrict(thought.createdAt, new Date(), {
          addSuffix: true,
        })}
      </time>

      <p
        className={cn(
          "font-medium transition-all ease-in-out will-change-transform",

          shouldBlur
            ? "opacity-60 blur-sm duration-1500"
            : "opacity-100 blur-none duration-200",
        )}
      >
        {thought.content}
      </p>
    </li>
  );
}

export default memo(ThoughtRow);
