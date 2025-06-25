import { Progress } from "@/components/ui/progress";

interface TimerDisplayProps {
  timeRemaining: number;
  currentInterval: number;
  totalIntervals: number;
  intervalDuration: number;
  totalElapsed: number;
}

export function TimerDisplay({
  timeRemaining,
  currentInterval,
  totalIntervals,
  intervalDuration,
  totalElapsed,
}: TimerDisplayProps) {
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = ((intervalDuration - timeRemaining) / intervalDuration) * 100;
  const totalDuration = intervalDuration * totalIntervals;

  return (
    <div className="text-center mb-8">
      <div className="text-6xl font-roboto-mono font-bold text-foreground mb-2">
        {formatTime(timeRemaining)}
      </div>
      <div className="text-lg text-muted-foreground mb-4">
        Interval {currentInterval} of {totalIntervals}
      </div>
      
      <div className="w-full bg-muted rounded-sm h-2 mb-4 overflow-hidden">
        <div 
          className="bg-primary h-2 rounded-sm transition-all duration-300 ease-linear"
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />
      </div>

      <div className="text-sm text-muted-foreground">
        Total: {formatTime(totalElapsed)} / {formatTime(totalDuration)}
      </div>
    </div>
  );
}
