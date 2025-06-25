import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AudioState } from "@/hooks/use-audio";

interface AudioControlsProps {
  audioState: AudioState;
  onAudioUpload: (file: File) => void;
  onTestAlarm: () => void;
  onStopAlarm: () => void;
}

export function AudioControls({
  audioState,
  onAudioUpload,
  onTestAlarm,
  onStopAlarm,
}: AudioControlsProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onAudioUpload(file);
    }
  };

  return (
    <div className="border-t border-border pt-6">
      <h3 className="text-lg font-medium text-foreground mb-4 text-center">
        Custom Alarm Sound
      </h3>
      
      <div className="flex flex-col space-y-6">
        {/* File Upload Section */}
        <div className="bg-muted/20 p-4 rounded-lg border border-border">
          <label className="block text-sm font-medium text-foreground mb-2">
            Upload Alarm Sound
          </label>
          <Input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="w-full h-12 text-sm text-muted-foreground bg-background border border-border rounded-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer cursor-pointer transition-all"
          />
        </div>
        
        {/* Control Buttons Section */}
        <div className="flex space-x-2">
          <Button
            onClick={onTestAlarm}
            disabled={audioState.isPlaying}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-4 rounded-full transition-colors duration-200 flex items-center justify-center min-h-[44px]"
          >
            <span className="material-icons mr-2">volume_up</span>
            Test Alarm
          </Button>
          
          <Button
            onClick={onStopAlarm}
            disabled={!audioState.isPlaying}
            className="bg-muted hover:bg-muted/80 text-muted-foreground py-3 px-4 rounded-full transition-colors duration-200 min-h-[44px]"
          >
            <span className="material-icons">stop</span>
          </Button>
        </div>
      </div>
      
      <div className="mt-3 text-sm text-muted-foreground text-center">
        {audioState.audioStatus}
      </div>
    </div>
  );
}
