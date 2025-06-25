import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="sm"
      className="fixed top-4 right-4 z-50 bg-background/80 backdrop-blur-sm border border-border hover:bg-accent hover:text-accent-foreground rounded-full"
    >
      <span className="material-icons text-lg">
        {isDark ? 'light_mode' : 'dark_mode'}
      </span>
    </Button>
  );
}