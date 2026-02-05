"use client";

import { useAppStore } from "@/lib/store";
import { Thought } from "@/types/types";
import { cn } from "@/lib/utils";
import { formatDistanceStrict } from "date-fns";
import { memo, useEffect, useState } from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ThoughtRowProps {
  thought: Thought;
  onDelete: (id: string) => void;
}

function ThoughtRow({ thought, onDelete }: ThoughtRowProps) {
  const blurEnabled = useAppStore((state) => state.blurEnabled);
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const shouldBlur = blurEnabled && isBlurred && !isHovered && !isDropdownOpen;

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

      <DropdownMenu onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
            aria-label="More options"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => onDelete(thought.id)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
}

export default memo(ThoughtRow);
