import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface TimerSettings {
  intervalDuration: number; // in minutes
  totalIntervals: number;
}

interface TimerSettingsProps {
  settings: TimerSettings;
  onSettingsChange: (settings: TimerSettings) => void;
  disabled?: boolean;
}

const PRESET_DURATIONS = [
  { label: "25 min (Pomodoro)", value: 25 },
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "1 hour", value: 60 },
  { label: "1.5 hours", value: 90 },
  { label: "2 hours", value: 120 },
  { label: "2h 15min (Default)", value: 135 },
];

export function TimerSettingsDialog({ settings, onSettingsChange, disabled }: TimerSettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [customDuration, setCustomDuration] = useState(settings.intervalDuration.toString());
  const [isOpen, setIsOpen] = useState(false);

  const handlePresetChange = (value: string) => {
    const duration = parseInt(value);
    setLocalSettings(prev => ({ ...prev, intervalDuration: duration }));
    setCustomDuration(duration.toString());
  };

  const handleCustomDurationChange = (value: string) => {
    setCustomDuration(value);
    const duration = parseInt(value);
    if (!isNaN(duration) && duration > 0) {
      setLocalSettings(prev => ({ ...prev, intervalDuration: duration }));
    }
  };

  const handleIntervalsChange = (value: string) => {
    const intervals = parseInt(value);
    if (!isNaN(intervals) && intervals > 0 && intervals <= 10) {
      setLocalSettings(prev => ({ ...prev, totalIntervals: intervals }));
    }
  };

  const handleSave = () => {
    onSettingsChange(localSettings);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setLocalSettings(settings);
    setCustomDuration(settings.intervalDuration.toString());
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          className="text-muted-foreground hover:text-foreground"
        >
          <span className="material-icons mr-2">settings</span>
          Timer Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" aria-describedby="timer-settings-description">
        <DialogHeader>
          <DialogTitle>Timer Settings</DialogTitle>
          <p id="timer-settings-description" className="text-sm text-muted-foreground">
            Customize your interval timer duration and number of intervals
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="preset-duration">Interval Duration</Label>
            <Select onValueChange={handlePresetChange} value={localSettings.intervalDuration.toString()}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {PRESET_DURATIONS.map((preset) => (
                  <SelectItem key={preset.value} value={preset.value.toString()}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-duration">Custom Duration (minutes)</Label>
            <Input
              id="custom-duration"
              type="number"
              min="1"
              max="480"
              value={customDuration}
              onChange={(e) => handleCustomDurationChange(e.target.value)}
              placeholder="Enter minutes"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="total-intervals">Number of Intervals</Label>
            <Input
              id="total-intervals"
              type="number"
              min="1"
              max="10"
              value={localSettings.totalIntervals}
              onChange={(e) => handleIntervalsChange(e.target.value)}
              placeholder="Enter number of intervals"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            Total time: {Math.floor((localSettings.intervalDuration * localSettings.totalIntervals) / 60)}h {(localSettings.intervalDuration * localSettings.totalIntervals) % 60}m
          </div>
        </div>

        <div className="flex space-x-2 mt-6">
          <Button onClick={handleSave} className="flex-1">
            Save Settings
          </Button>
          <Button onClick={handleCancel} variant="outline" className="flex-1">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}