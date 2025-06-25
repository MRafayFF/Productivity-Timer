import { cn } from "@/lib/utils";

interface StatusDotsProps {
  completedIntervals: number;
  totalIntervals: number;
}

export function StatusDots({ completedIntervals, totalIntervals }: StatusDotsProps) {
  return (
    <div className="flex justify-center space-x-3 mb-8">
      {Array.from({ length: totalIntervals }, (_, index) => (
        <div
          key={index}
          className={cn(
            "w-4 h-4 rounded-full shadow-lg transition-all duration-500 border",
            index < completedIntervals
              ? "bg-primary border-primary" // Nothing OS red for completed
              : "bg-transparent border-muted-foreground" // Empty for pending
          )}
        />
      ))}
    </div>
  );
}
