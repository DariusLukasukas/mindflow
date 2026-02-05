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
import { useState } from "react";
import { ArrowUp01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function TimerDrawer() {
  const { timerDrawerOpen, setTimerDrawerOpen, startTimer } = useAppStore();

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(15);

  const incrementHours = () => setHours((h) => Math.min(23, h + 1));
  const decrementHours = () => setHours((h) => Math.max(0, h - 1));
  const incrementMinutes = () => setMinutes((m) => (m + 5) % 60);
  const decrementMinutes = () => setMinutes((m) => (m - 5 + 60) % 60);

  return (
    <Drawer open={timerDrawerOpen} onOpenChange={setTimerDrawerOpen}>
      <DrawerContent className="md:mx-auto md:max-w-2xl">
        <DrawerHeader>
          <DrawerTitle className="text-xl font-semibold">Timer</DrawerTitle>
          <DrawerDescription>
            Set a timer duration by selecting hours and minutes
          </DrawerDescription>
        </DrawerHeader>

        {/* Timer controls*/}
        <div className="p-4">
          {/* Time picker */}
          <div className="flex items-center justify-center gap-8 py-10">
            {/* Hours */}
            <div className="flex flex-col items-center gap-1">
              <Button size={"icon"} variant={"ghost"} onClick={incrementHours}>
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
                <span className="text-muted-foreground text-sm font-medium">
                  Hours
                </span>
              </div>
              <Button size={"icon"} variant={"ghost"} onClick={decrementHours}>
                <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={3} />
              </Button>
            </div>
            {/* Separator */}
            <div className="mb-8 text-4xl font-bold">:</div>
            {/* Minutes */}
            <div className="flex flex-col items-center gap-1">
              <Button
                size={"icon"}
                variant={"ghost"}
                onClick={incrementMinutes}
              >
                <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={3} />
              </Button>
              <Input
                type="text"
                min={0}
                max={59}
                value={minutes}
                onChange={(e) => {
                  const val = Math.min(
                    59,
                    Math.max(0, parseInt(e.target.value) || 0),
                  );
                  setMinutes(val);
                }}
                className="size-20 border-none text-center text-3xl font-bold focus-visible:ring-0 md:text-3xl"
              />
              <span className="text-muted-foreground text-sm font-medium">
                Minutes
              </span>
              <Button
                size={"icon"}
                variant={"ghost"}
                onClick={decrementMinutes}
              >
                <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={3} />
              </Button>
            </div>
          </div>

          {/* Presets */}
          <div className="space-y-3">
            <p className="font-semibold tracking-wide">Presets</p>

            <div className="flex flex-wrap gap-3">
              {[
                { label: "5", hours: 0, minutes: 5 },
                { label: "10", hours: 0, minutes: 10 },
                { label: "15", hours: 0, minutes: 15 },
                { label: "25", hours: 0, minutes: 25 },
                { label: "30", hours: 0, minutes: 30 },
                { label: "1", hours: 1, minutes: 0 },
              ].map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setHours(preset.hours);
                    setMinutes(preset.minutes);
                  }}
                  className="hover:bg-accent flex size-20 flex-col items-center justify-center gap-0.5 rounded-full border-none p-0"
                >
                  <span className="text-2xl font-semibold">{preset.label}</span>
                  <span className="text-orange-500">
                    {preset.hours > 0 ? "HR" : "MIN"}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DrawerFooter>
          <Button
            size={"lg"}
            className="h-12"
            onClick={() => {
              if (hours === 0 && minutes === 0) return;
              startTimer(hours, minutes);
            }}
          >
            Start
          </Button>
          <DrawerClose asChild>
            <Button size={"lg"} variant="outline" className="h-12">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
