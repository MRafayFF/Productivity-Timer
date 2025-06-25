import { useState, useRef, useCallback } from 'react';

export interface AudioState {
  hasCustomAudio: boolean;
  audioStatus: string;
  isPlaying: boolean;
}

export function useAudio() {
  const [audioState, setAudioState] = useState<AudioState>({
    hasCustomAudio: false,
    audioStatus: 'No custom alarm selected',
    isPlaying: false,
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const initAudioContext = useCallback(async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      setAudioState(prev => ({ 
        ...prev, 
        audioStatus: 'Audio not supported in this browser' 
      }));
    }
  }, []);

  const handleAudioUpload = useCallback(async (file: File) => {
    if (!file) return;

    try {
      await initAudioContext();
      
      if (!audioContextRef.current) {
        throw new Error('Audio context not available');
      }

      setAudioState(prev => ({ 
        ...prev, 
        audioStatus: 'Loading audio file...' 
      }));

      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      
      audioBufferRef.current = audioBuffer;
      
      setAudioState(prev => ({
        ...prev,
        hasCustomAudio: true,
        audioStatus: `Custom alarm loaded: ${file.name}`,
      }));
    } catch (error) {
      console.error('Failed to load audio file:', error);
      setAudioState(prev => ({ 
        ...prev, 
        audioStatus: 'Failed to load audio file. Please try a different format.' 
      }));
    }
  }, [initAudioContext]);

  const playAlarm = useCallback(async () => {
    try {
      await initAudioContext();
      
      if (!audioContextRef.current || !audioBufferRef.current) {
        // Fallback to browser alert if no custom audio
        alert('🔔 Interval completed!');
        return;
      }

      // Stop any currently playing audio
      if (audioSourceRef.current) {
        audioSourceRef.current.stop();
      }

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBufferRef.current;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => {
        setAudioState(prev => ({ ...prev, isPlaying: false }));
        audioSourceRef.current = null;
      };

      audioSourceRef.current = source;
      setAudioState(prev => ({ ...prev, isPlaying: true }));
      
      source.start();
    } catch (error) {
      console.error('Failed to play alarm:', error);
      // Fallback to browser alert
      alert('🔔 Interval completed!');
    }
  }, [initAudioContext]);

  const stopAlarm = useCallback(() => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current = null;
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const testAlarm = useCallback(() => {
    playAlarm();
  }, [playAlarm]);

  return {
    audioState,
    handleAudioUpload,
    playAlarm,
    stopAlarm,
    testAlarm,
  };
}
