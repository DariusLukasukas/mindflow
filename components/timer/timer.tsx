"use client";

import { useAppStore } from "@/lib/store";
import { Play, Pause, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect } from "react";

// Format time as HH:MM:SS
const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function Timer() {
  const {
    timerActive,
    timeRemaining,
    pauseTimer,
    resumeTimer,
    stopTimer,
    decrementTime,
  } = useAppStore();

  useEffect(() => {
    if (!timerActive || timeRemaining === 0) return;

    const interval = setInterval(() => {
      decrementTime();
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, decrementTime]);

  const handlePlayPause = useCallback(() => {
    timerActive ? pauseTimer() : resumeTimer();
  }, [timerActive, pauseTimer, resumeTimer]);

  if (timeRemaining === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: -20 }}
        transition={{ type: "spring", stiffness: 500, damping: 30, mass: 1 }}
        className="absolute top-2 left-1/2 z-50 flex w-full max-w-sm -translate-x-1/2 items-center justify-between rounded-full bg-black p-3"
      >
        {/* Controls */}
        <div className="flex gap-2">
          <button
            onClick={handlePlayPause}
            aria-label={timerActive ? "Pause timer" : "Resume timer"}
            className="flex cursor-pointer items-center justify-center rounded-full bg-orange-400/40 p-2 text-orange-400"
          >
            {timerActive ? (
              <Pause fill="currentColor" />
            ) : (
              <Play fill="currentColor" />
            )}
          </button>
          <button
            onClick={() => stopTimer()}
            className="flex cursor-pointer items-center justify-center rounded-full bg-neutral-700 p-2 text-white"
          >
            <X fill="currentColor" />
          </button>
        </div>

        {/* Time display */}
        <div className="flex items-end gap-1 pr-3 select-none">
          <p className="text-sm font-medium text-orange-400">Timer</p>
          <div
            role="timer"
            className="text-right text-4xl leading-none font-light text-orange-400 lining-nums tabular-nums"
          >
            {formatTime(timeRemaining)}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
