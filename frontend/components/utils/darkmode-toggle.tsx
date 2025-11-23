import { useDarkMode } from "@/lib/store/darkModeStore";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

interface DarkModeToggleProp extends ComponentPropsWithoutRef<"button"> {
  className?: string;
}

export default function DarkModeToggle({
  className,
  ...props
}: DarkModeToggleProp) {
  const { isDark, toggle } = useDarkMode();

  return (
    <Button
      variant="ghost"
      onClick={toggle}
      className={cn("h-9 w-9", className)}
      {...props}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
