import { Thought } from "../types/types";

const STORAGE_KEY = "MINDFLOW_THOUGHTS";

export const saveThoughts = (thoughts: Thought[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(thoughts));
};

export const loadThoughts = (): Thought[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const addThought = (content: string) => {
  const thoughts = loadThoughts();

  const newThought: Thought = {
    id: crypto.randomUUID(),
    content,
    createdAt: Date.now(),
  };
  thoughts.unshift(newThought);
  saveThoughts(thoughts);

  return newThought;
};

export const deleteThought = (id: string) => {
  const thoughts = loadThoughts().filter((t: Thought) => t.id !== id);
  saveThoughts(thoughts);
};

export const deleteAllThoughts = () => {
  localStorage.removeItem(STORAGE_KEY);
};
