import { useEffect } from "react";
import { useTimer } from "@/hooks/use-timer";
import { useAudio } from "@/hooks/use-audio";
import { useToast } from "@/hooks/use-toast";
import { StatusDots } from "@/components/status-dots";
import { HourglassAnimation } from "@/components/hourglass-animation";
import { TimerDisplay } from "@/components/timer-display";
import { TimerControls } from "@/components/timer-controls";
import { AudioControls } from "@/components/audio-controls";
import { IntervalHistory } from "@/components/interval-history";
import { ThemeToggle } from "@/components/theme-toggle";
import { TimerSettingsDialog } from "@/components/timer-settings";
import { AdSenseBanner } from "@/components/adsense-banner";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function TimerPage() {
  const { timerState, settings, startTimer, pauseTimer, resetTimer, setOnIntervalComplete, updateSettings } = useTimer();
  const { audioState, handleAudioUpload, playAlarm, stopAlarm, testAlarm } = useAudio();
  const { toast } = useToast();

  const handleDownloadProject = async () => {
    try {
      const response = await fetch('/api/download-project');
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'interval-timer-project.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download Started",
        description: "Your project zip file is downloading.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download the project. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  // Set up interval completion handler
  useEffect(() => {
    setOnIntervalComplete(() => {
      playAlarm();
      toast({
        title: "Interval Completed!",
        description: `Interval ${timerState.currentInterval} of ${timerState.totalIntervals} completed.`,
        duration: 5000,
      });
    });
  }, [setOnIntervalComplete, playAlarm, toast, timerState.currentInterval, timerState.totalIntervals]);

  // Show completion notification when all intervals are done
  useEffect(() => {
    if (timerState.completedIntervals.length === timerState.totalIntervals && 
        timerState.completedIntervals.length > 0) {
      toast({
        title: "All Intervals Completed! 🎉",
        description: "Congratulations! You've completed all 4 intervals.",
        duration: 10000,
      });
    }
  }, [timerState.completedIntervals.length, timerState.totalIntervals, toast]);

  const isCompleted = timerState.completedIntervals.length === timerState.totalIntervals;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <ThemeToggle />
      
      {/* Download Button */}
      <div className="fixed top-4 left-4 z-10">
        <Button
          onClick={handleDownloadProject}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Project
        </Button>
      </div>
      
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Interval Timer</h1>
          <p className="text-muted-foreground">
            {timerState.totalIntervals} intervals × {Math.floor(settings.intervalDuration / 60)}h {settings.intervalDuration % 60}m each
          </p>
          <div className="mt-4">
            <TimerSettingsDialog
              settings={settings}
              onSettingsChange={updateSettings}
              disabled={timerState.isRunning}
            />
          </div>
        </div>

        {/* Main Timer Card */}
        <div className="bg-card border border-border rounded-sm shadow-xl p-8 mb-6">
          <StatusDots 
            completedIntervals={timerState.completedIntervals.length}
            totalIntervals={timerState.totalIntervals}
          />

          <HourglassAnimation
            isRunning={timerState.isRunning}
            timeRemaining={timerState.timeRemaining}
            intervalDuration={timerState.intervalDuration}
          />

          <TimerDisplay
            timeRemaining={timerState.timeRemaining}
            currentInterval={timerState.currentInterval}
            totalIntervals={timerState.totalIntervals}
            intervalDuration={timerState.intervalDuration}
            totalElapsed={timerState.totalElapsed}
          />

          <TimerControls
            isRunning={timerState.isRunning}
            onStart={startTimer}
            onPause={pauseTimer}
            onReset={resetTimer}
            disabled={isCompleted}
          />

          <AudioControls
            audioState={audioState}
            onAudioUpload={handleAudioUpload}
            onTestAlarm={testAlarm}
            onStopAlarm={stopAlarm}
          />
        </div>

        <IntervalHistory
          completedIntervals={timerState.completedIntervals}
          totalIntervals={timerState.totalIntervals}
        />

        {/* AdSense Banner */}
        <AdSenseBanner />

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Timer continues running even when tab is not active</p>
        </div>
      </div>
    </div>
  );
}
