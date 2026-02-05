"use client";

import Header from "@/components/layout/header";
import ThoughtInput from "@/components/thoughts/thought-input";
import ThoughtList from "@/components/thoughts/thought-list";
import Timer from "@/components/timer/timer";
import TimerDrawer from "@/components/timer/timer-drawer";
import { groupThoughtsByDay } from "@/lib/group-thoughts";
import {
  addThought,
  deleteAllThoughts,
  deleteThought,
  loadThoughts,
} from "@/lib/storage";
import { Thought } from "@/types/types";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Page() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [input, setInput] = useState("");

  const thoughtGroups = useMemo(() => groupThoughtsByDay(thoughts), [thoughts]);

  useEffect(() => {
    setThoughts(loadThoughts());
  }, []);

  const handleSubmit = useCallback(
    (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (input.trim()) {
        const newThought = addThought(input);
        setThoughts((prev) => [newThought, ...prev]);
        setInput("");
      }
    },
    [input],
  );

  const handleDelete = useCallback((id: string) => {
    deleteThought(id);
    setThoughts((prev) => prev.filter((t: Thought) => t.id !== id));
  }, []);

  const handleDeleteAll = useCallback(() => {
    deleteAllThoughts();
    setThoughts([]);
  }, []);

  return (
    <div className="relative container mx-auto max-w-2xl space-y-4 px-2 pb-2 md:px-0">
      <Timer />

      <div className="pt-20">
        <Header onDeleteAll={handleDeleteAll} />
        <main className="flex flex-col gap-4">
          <ThoughtInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
          />
          <ThoughtList thoughtGroups={thoughtGroups} onDelete={handleDelete} />
        </main>
      </div>
      <TimerDrawer />
    </div>
  );
}
