import { Thought } from "../types/types";

export const groupThoughtsByDay = (thoughts: Thought[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups: { label: string; thoughts: Thought[] }[] = [];
  const todayThoughts: Thought[] = [];
  const yesterdayThoughts: Thought[] = [];
  const olderGroups: Map<string, Thought[]> = new Map();

  thoughts.forEach((thought) => {
    const thoughtDate = new Date(thought.createdAt);
    thoughtDate.setHours(0, 0, 0, 0);

    if (thoughtDate.getTime() === today.getTime()) {
      todayThoughts.push(thought);
    } else if (thoughtDate.getTime() === yesterday.getTime()) {
      yesterdayThoughts.push(thought);
    } else {
      const dateKey = thoughtDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year:
          thoughtDate.getFullYear() !== today.getFullYear()
            ? "numeric"
            : undefined,
      });

      if (!olderGroups.has(dateKey)) {
        olderGroups.set(dateKey, []);
      }

      olderGroups.get(dateKey)!.push(thought);
    }
  });

  if (todayThoughts.length)
    groups.push({ label: "Today", thoughts: todayThoughts });
  if (yesterdayThoughts.length)
    groups.push({ label: "Yesterday", thoughts: yesterdayThoughts });

  // Add older groups in chronological order
  Array.from(olderGroups.entries())
    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
    .forEach(([date, thoughts]) => {
      groups.push({ label: date, thoughts });
    });

  return groups;
};
