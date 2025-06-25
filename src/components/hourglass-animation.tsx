import { cn } from "@/lib/utils";

interface HourglassAnimationProps {
  isRunning: boolean;
  timeRemaining: number;
  intervalDuration: number;
}

export function HourglassAnimation({ 
  isRunning, 
  timeRemaining, 
  intervalDuration 
}: HourglassAnimationProps) {
  const progress = (intervalDuration - timeRemaining) / intervalDuration;
  
  const getHourglassIcon = () => {
    if (!isRunning) return "hourglass_empty";
    if (progress < 0.33) return "hourglass_top";
    if (progress < 0.66) return "hourglass_empty";
    return "hourglass_bottom";
  };

  return (
    <div className="flex justify-center mb-8">
      <div className="relative">
        <div className={cn(
          "text-8xl text-primary transition-all duration-1000", // Nothing OS red
          isRunning && "animate-flip"
        )}>
          <span className="material-icons text-8xl">
            {getHourglassIcon()}
          </span>
        </div>
      </div>
    </div>
  );
}
