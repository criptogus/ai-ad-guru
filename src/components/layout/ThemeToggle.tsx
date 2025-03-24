
import React from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button 
      variant="ghost" 
      size="icon"
      className="mb-3 mx-auto block transition-all duration-300 hover:scale-[1.05]"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun size={20} className="text-amber-400" />
      ) : (
        <Moon size={20} className="text-indigo-500" />
      )}
    </Button>
  );
};

export default ThemeToggle;
