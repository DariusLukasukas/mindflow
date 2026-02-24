"use client";

import {
  DarkModeIcon,
  Sun03Icon,
  Moon02Icon,
} from "@hugeicons/core-free-icons";
import { useTheme } from "next-themes";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
  {
    icon: Sun03Icon,
    label: "Light",
  },
  {
    icon: Moon02Icon,
    label: "Dark",
  },
  {
    icon: DarkModeIcon,
    label: "System",
  },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const handleThemeChange = (theme: string) => {
    setTheme(theme.toLocaleLowerCase());
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-muted relative flex flex-row items-center gap-1 rounded-full p-1">
      {THEME_OPTIONS.map((themeOption) => (
        <Tooltip key={themeOption.label}>
          <TooltipTrigger asChild>
            <button
              onClick={() => handleThemeChange(themeOption.label)}
              className={cn(
                "flex size-6 items-center justify-center rounded-full",
                mounted && themeOption.label.toLowerCase() === theme
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              <HugeiconsIcon
                icon={themeOption.icon}
                strokeWidth={2}
                size={20}
              />
              <span className="sr-only">{themeOption.label}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>{themeOption.label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
