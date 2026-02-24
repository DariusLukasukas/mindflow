import { useAppStore } from "@/lib/store";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useCallback, useRef, useState } from "react";
import { ArrowUp01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";

const TIMER_PRESETS = [
  { label: "5", hours: 0, minutes: 5 },
  { label: "10", hours: 0, minutes: 10 },
  { label: "15", hours: 0, minutes: 15 },
  { label: "25", hours: 0, minutes: 25 },
  { label: "30", hours: 0, minutes: 30 },
  { label: "1", hours: 1, minutes: 0 },
] as const;

export default function TimerDrawer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(15);
  const { timerDrawerOpen, setTimerDrawerOpen, startTimer } = useAppStore();

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    if (e.deltaX === 0 && e.deltaY !== 0) {
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }, []);

  const incrementHours = () => setHours((h) => Math.min(23, h + 1));
  const decrementHours = () => setHours((h) => Math.max(0, h - 1));
  const incrementMinutes = () => setMinutes((m) => (m + 5) % 60);
  const decrementMinutes = () => setMinutes((m) => (m - 5 + 60) % 60);

  const handlePresetSelect = useCallback(
    (presetHours: number, presetMinutes: number) => {
      setHours(presetHours);
      setMinutes(presetMinutes);
    },
    [],
  );

  return (
    <Drawer open={timerDrawerOpen} onOpenChange={setTimerDrawerOpen}>
      <DrawerContent className="md:mx-auto md:max-w-lg">
        <DrawerHeader className="pb-6">
          <DrawerTitle className="text-xl font-semibold">Timer</DrawerTitle>
          <DrawerDescription className="sr-only">
            Set a timer duration by selecting hours and minutes
          </DrawerDescription>
        </DrawerHeader>

        {/* Timer controls*/}
        <div className="px-4">
          {/* Time picker */}
          <div className="flex items-center justify-center gap-2">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <Button
                size={"icon-lg"}
                variant={"ghost"}
                onClick={incrementHours}
              >
                <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={3} />
              </Button>

              <div className="flex flex-col items-center">
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={hours}
                  onChange={(e) => {
                    const val = Math.min(
                      23,
                      Math.max(0, parseInt(e.target.value) || 0),
                    );
                    setHours(val);
                  }}
                  className="size-20 border-none text-center text-3xl font-bold focus-visible:ring-0 md:text-3xl"
                />
                <span className="text-muted-foreground mt-1 font-semibold">
                  Hours
                </span>
              </div>
              <Button
                size={"icon-lg"}
                variant={"ghost"}
                onClick={decrementHours}
              >
                <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={3} />
              </Button>
            </div>
            {/* Separator */}
            <div className="text-muted-foreground mb-8 text-5xl font-bold">
              :
            </div>
            {/* Minutes */}
            <div className="flex flex-col items-center">
              <Button
                size={"icon-lg"}
                variant={"ghost"}
                onClick={incrementMinutes}
              >
                <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={3} />
              </Button>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={minutes}
                onChange={(e) => {
                  const val = Math.min(
                    59,
                    Math.max(0, parseInt(e.target.value) || 0),
                  );
                  setMinutes(val);
                }}
                className="size-20 border-none text-center text-4xl font-bold focus-visible:ring-0 md:text-4xl"
              />
              <span className="text-muted-foreground mt-1 font-semibold">
                Minutes
              </span>
              <Button
                size={"icon-lg"}
                variant={"ghost"}
                onClick={decrementMinutes}
              >
                <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={3} />
              </Button>
            </div>
          </div>

          {/* Presets */}
          <div className="space-y-4 py-4">
            <h3 className="text-foreground text-base font-semibold">Presets</h3>
            <div
              ref={scrollRef}
              onWheel={handleWheel}
              className="scrollbar-hide -mx-4 overflow-x-auto overflow-y-hidden px-4"
            >
              <div className="flex w-max gap-6">
                {TIMER_PRESETS.map((preset) => (
                  <motion.div
                    key={preset.label}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() =>
                        handlePresetSelect(preset.hours, preset.minutes)
                      }
                      className="hover:bg-accent flex size-20 shrink-0 flex-col items-center justify-center gap-0 rounded-full border-none p-0"
                    >
                      <span className="text-xl font-semibold">
                        {preset.label}
                      </span>
                      <span className="text-muted-foreground font-medium">
                        {preset.hours > 0 ? "HR" : "MIN"}
                      </span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <DrawerFooter>
          <Button
            size={"lg"}
            disabled={hours === 0 && minutes === 0}
            onClick={() => {
              startTimer(hours, minutes);
            }}
            className="dark:text-foreground h-12 bg-blue-500 text-base font-semibold hover:bg-blue-500"
          >
            Start
          </Button>
          <DrawerClose asChild>
            <Button
              size={"lg"}
              variant="outline"
              className="h-12 text-base font-semibold"
            >
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
