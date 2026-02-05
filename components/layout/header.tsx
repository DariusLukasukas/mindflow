"use client";
import { MoreHorizontalCircle01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ThemeSwitcher from "../ui/theme-switcher";
import { useAppStore } from "@/lib/store";
import { format } from "date-fns";
import { useState } from "react";

interface HeaderProps {
  onDeleteAll: () => void;
}

export default function Header({ onDeleteAll }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { openTimerDrawer, toggleBlur, toggleFocusMode, focusModeEnabled } =
    useAppStore((state) => state);

  return (
    <header className="flex items-center justify-end py-3 pl-3">
      {!focusModeEnabled && (
        <h2 className="text-belance mr-auto text-2xl font-extrabold">
          {format(new Date(), "EEEE")}
          <span className="inline-block size-1.5 rounded-full bg-green-500" />
        </h2>
      )}

      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button size={"icon"} variant={"ghost"}>
            <HugeiconsIcon
              icon={MoreHorizontalCircle01Icon}
              strokeWidth={2}
              fill="currentColor"
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align={"end"} className="min-w-52 p-1.5">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={toggleBlur}>
              Toggle blur
            </DropdownMenuItem>

            <DropdownMenuItem onClick={toggleFocusMode}>
              Focus mode
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                requestAnimationFrame(() => {
                  openTimerDrawer();
                });
              }}
            >
              Timer
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <div className="relative flex items-center justify-between rounded-xl px-3 py-1 text-sm">
              <span className="font-medium">Theme</span>
              <ThemeSwitcher />
            </div>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-destructive cursor-pointer"
            onClick={onDeleteAll}
          >
            Clear all thoughts
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
