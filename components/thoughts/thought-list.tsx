"use client";
import { Thought } from "@/lib/types";
import ThoughtRow from "./thought-row";
import { memo } from "react";

interface ThoughtListProps {
  thoughtGroups: { label: string; thoughts: Thought[] }[];
  onDelete: (id: string) => void;
}

function ThoughtList({ thoughtGroups, onDelete }: ThoughtListProps) {
  return (
    <div className="flex flex-col gap-6">
      {thoughtGroups.map((group) => (
        <div key={group.label} className="flex flex-col">
          {group.label !== "Today" && (
            <>
              <h3 className="text-muted-foreground mb-2 px-3 text-base font-semibold">
                {group.label}
              </h3>
              <div className="bg-border/50 my-1 h-px w-full" />
            </>
          )}
          <ul className="flex flex-col">
            {group.thoughts.map((thought) => (
              <ThoughtRow
                key={thought.id}
                thought={thought}
                onDelete={onDelete}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default memo(ThoughtList);
