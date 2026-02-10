"use client";

import { useAppStore } from "@/lib/store";
import { Thought } from "@/types/types";
import { cn } from "@/lib/utils";
import { formatDistanceStrict } from "date-fns";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "../ui/textarea";

const NEW_THOUGHT_MS = 100;

interface ThoughtRowProps {
  thought: Thought;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
}

function ThoughtRow({ thought, onDelete, onUpdate }: ThoughtRowProps) {
  const blurEnabled = useAppStore((state) => state.blurEnabled);
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBlurred, setIsBlurred] = useState(() => {
    const timeSinceCreation = Date.now() - thought.createdAt;
    return timeSinceCreation >= NEW_THOUGHT_MS;
  });

  // Focus state
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(thought.content);

  const handleDropdownCloseAutoFocus = useCallback(
    (e: Event) => {
      if (isEditing) {
        e.preventDefault();
        const el = textareaRef.current;
        if (el) {
          el.focus();
          const len = el.value.length;
          el.setSelectionRange(len, len);
        }
      }
    },
    [isEditing],
  );

  useEffect(() => {
    const timeSinceCreation = Date.now() - thought.createdAt;
    const isNewThought = timeSinceCreation < NEW_THOUGHT_MS;

    if (isNewThought) {
      const timer = setTimeout(() => {
        setIsBlurred(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [thought.createdAt]);

  const cancelEditHandler = useCallback(() => {
    setIsEditing(false);
    setEditedContent(thought.content);
    setIsHovered(false);
  }, [thought.content]);

  const saveThoughtHandler = useCallback(() => {
    if (editedContent.trim() === thought.content.trim()) {
      cancelEditHandler();
      return;
    }

    const savedContent = editedContent.trim();
    onUpdate(thought.id, savedContent);
    setEditedContent(savedContent);
    setIsEditing(false);
    setIsHovered(false);
  }, [cancelEditHandler, editedContent, thought.id, thought.content, onUpdate]);

  const shouldBlur =
    blurEnabled && isBlurred && !isHovered && !isDropdownOpen && !isEditing;

  return (
    <>
      <li
        data-editing={isEditing}
        className="hover:bg-muted group data-[editing=true]:bg-muted relative flex flex-row items-center justify-between rounded-xl p-3 transition-colors duration-200 ease-out"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <time className="text-muted-foreground absolute -left-4 hidden -translate-x-full text-sm group-hover:block">
          {formatDistanceStrict(thought.createdAt, new Date(), {
            addSuffix: true,
          })}
        </time>

        <Textarea
          ref={textareaRef}
          id={`thought-row-${thought.id}`}
          readOnly={!isEditing}
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className={cn(
            "min-h-fit rounded-none border-none bg-transparent p-0 font-medium transition-all ease-in-out will-change-transform focus-visible:ring-0 focus-visible:ring-offset-0",
            isEditing ? "cursor-text" : "cursor-default",
            shouldBlur
              ? "opacity-60 blur-sm duration-1500"
              : "opacity-100 blur-none duration-200",
          )}
        />

        <DropdownMenu onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="More options"
              className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            onCloseAutoFocus={handleDropdownCloseAutoFocus}
          >
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
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

      {isEditing && (
        <div className="flex w-full flex-row gap-2">
          <Button
            size={"lg"}
            variant={"secondary"}
            onClick={cancelEditHandler}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            size={"lg"}
            variant={"default"}
            className="flex-1 bg-blue-500 text-white hover:bg-blue-500/80"
            onClick={saveThoughtHandler}
          >
            Save
          </Button>
        </div>
      )}
    </>
  );
}

export default memo(ThoughtRow);
