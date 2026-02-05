import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppState {
  // Onboarding state
  onboardingCompleted: boolean;
  // Onboarding actions
  setOnboardingCompleted: (completed: boolean) => void;

  // Blur state
  blurEnabled: boolean;
  // Blur actions
  toggleBlur: () => void;
  setBlurEnabled: (enabled: boolean) => void;

  // Focus mode state
  focusModeEnabled: boolean;
  // Focus mode actions
  toggleFocusMode: () => void;

  // Drawer state
  timerDrawerOpen: boolean;
  // Drawer actions
  setTimerDrawerOpen: (open: boolean) => void;
  openTimerDrawer: () => void;
  closeTimerDrawer: () => void;

  // Timer state
  timerActive: boolean;
  timerDuration: number;
  timeRemaining: number;
  // Timer actions
  startTimer: (hours: number, minutes: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  decrementTime: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      onboardingCompleted: false,
      setOnboardingCompleted: (completed) =>
        set({ onboardingCompleted: completed }),

      focusModeEnabled: false,
      toggleFocusMode: () =>
        set((state) => ({ focusModeEnabled: !state.focusModeEnabled })),

      blurEnabled: true,
      toggleBlur: () => set((state) => ({ blurEnabled: !state.blurEnabled })),
      setBlurEnabled: (enabled) => set({ blurEnabled: enabled }),

      timerDrawerOpen: false,
      setTimerDrawerOpen: (open) => set({ timerDrawerOpen: open }),
      openTimerDrawer: () => set({ timerDrawerOpen: true }),
      closeTimerDrawer: () => set({ timerDrawerOpen: false }),

      // Timer state
      timerActive: false,
      timerDuration: 0,
      timeRemaining: 0,
      // Timer actions
      startTimer: (hours, minutes) => {
        const totalSeconds = hours * 3600 + minutes * 60;
        set({
          timerActive: true,
          timerDuration: totalSeconds,
          timeRemaining: totalSeconds,
          timerDrawerOpen: false,
        });
      },
      pauseTimer: () => set({ timerActive: false }),
      resumeTimer: () => set({ timerActive: true }),
      stopTimer: () =>
        set({
          timerActive: false,
          timerDuration: 0,
          timeRemaining: 0,
        }),
      decrementTime: () =>
        set((state) => {
          const newTime = Math.max(0, state.timeRemaining - 1);
          return {
            timeRemaining: newTime,
            timerActive: newTime > 0 ? state.timerActive : false,
          };
        }),
    }),
    {
      name: "MINDFLOW_SETTINGS",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        onboardingCompleted: state.onboardingCompleted,
        blurEnabled: state.blurEnabled,
      }),
    },
  ),
);
