import { Button } from "@/components/ui/button";

interface TimerControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  disabled?: boolean;
}

export function TimerControls({
  isRunning,
  onStart,
  onPause,
  onReset,
  disabled = false,
}: TimerControlsProps) {
  const handleStartPause = () => {
    if (isRunning) {
      onPause();
    } else {
      onStart();
    }
  };

  return (
    <div className="flex justify-center space-x-4 mb-6">
      <Button
        onClick={handleStartPause}
        disabled={disabled}
        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
        size="lg"
      >
        <span className="material-icons text-2xl">
          {isRunning ? 'pause' : 'play_arrow'}
        </span>
      </Button>
      
      <Button
        onClick={onReset}
        disabled={disabled}
        className="bg-muted hover:bg-muted/80 text-muted-foreground rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
        size="lg"
      >
        <span className="material-icons text-2xl">stop</span>
      </Button>
    </div>
  );
}
