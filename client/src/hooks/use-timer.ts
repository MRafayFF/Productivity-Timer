import { useState, useEffect, useRef, useCallback } from 'react';

export interface TimerState {
  isRunning: boolean;
  currentInterval: number;
  totalIntervals: number;
  intervalDuration: number; // in milliseconds
  timeRemaining: number;
  completedIntervals: CompletedInterval[];
  totalElapsed: number;
}

export interface CompletedInterval {
  interval: number;
  completedAt: Date;
}

export interface TimerSettings {
  intervalDuration: number; // in minutes
  totalIntervals: number;
}

const DEFAULT_INTERVAL_DURATION = 135; // 2h 15min in minutes
const DEFAULT_TOTAL_INTERVALS = 4;

export function useTimer(initialSettings?: TimerSettings) {
  const [settings, setSettings] = useState<TimerSettings>({
    intervalDuration: initialSettings?.intervalDuration || DEFAULT_INTERVAL_DURATION,
    totalIntervals: initialSettings?.totalIntervals || DEFAULT_TOTAL_INTERVALS,
  });

  const intervalDurationMs = settings.intervalDuration * 60 * 1000;

  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    currentInterval: 1,
    totalIntervals: settings.totalIntervals,
    intervalDuration: intervalDurationMs,
    timeRemaining: intervalDurationMs,
    completedIntervals: [],
    totalElapsed: 0,
  });

  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onIntervalCompleteRef = useRef<(() => void) | null>(null);

  const updateTimer = useCallback(() => {
    if (!startTimeRef.current) return;

    const now = Date.now();
    const elapsed = now - startTimeRef.current + pausedTimeRef.current;
    
    setTimerState(prev => {
      const remaining = Math.max(0, prev.intervalDuration - elapsed);
      
      // Check if interval is completed and handle it within the state update
      if (remaining === 0) {
        // Interval completed
        const newCompletedIntervals = [
          ...prev.completedIntervals,
          { interval: prev.currentInterval, completedAt: new Date() }
        ];

        // Trigger interval complete callback
        if (onIntervalCompleteRef.current) {
          setTimeout(() => onIntervalCompleteRef.current?.(), 0);
        }

        if (prev.currentInterval < prev.totalIntervals) {
          // Start next interval
          startTimeRef.current = Date.now();
          pausedTimeRef.current = 0;
          
          return {
            ...prev,
            currentInterval: prev.currentInterval + 1,
            timeRemaining: prev.intervalDuration,
            completedIntervals: newCompletedIntervals,
            totalElapsed: newCompletedIntervals.length * prev.intervalDuration,
          };
        } else {
          // All intervals completed
          startTimeRef.current = null;
          pausedTimeRef.current = 0;
          
          return {
            ...prev,
            isRunning: false,
            timeRemaining: 0,
            completedIntervals: newCompletedIntervals,
            totalElapsed: newCompletedIntervals.length * prev.intervalDuration,
          };
        }
      }
      
      return {
        ...prev,
        timeRemaining: remaining,
        totalElapsed: prev.completedIntervals.length * prev.intervalDuration + elapsed,
      };
    });
  }, []);

  useEffect(() => {
    if (timerState.isRunning) {
      intervalRef.current = setInterval(updateTimer, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isRunning, updateTimer]);

  // Handle page visibility changes to maintain timer accuracy
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, timer will continue in background
        return;
      } else {
        // Page is visible again, force update
        if (timerState.isRunning) {
          updateTimer();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [timerState.isRunning, updateTimer]);

  const startTimer = useCallback(() => {
    if (timerState.currentInterval > settings.totalIntervals) return;

    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
      pausedTimeRef.current = 0;
    } else {
      // Resuming from pause
      const now = Date.now();
      const pauseDuration = now - (startTimeRef.current + pausedTimeRef.current);
      startTimeRef.current = now - pausedTimeRef.current;
      pausedTimeRef.current = 0;
    }

    setTimerState(prev => ({ ...prev, isRunning: true }));
  }, [timerState.currentInterval, settings.totalIntervals]);

  const pauseTimer = useCallback(() => {
    if (startTimeRef.current) {
      const now = Date.now();
      pausedTimeRef.current = now - startTimeRef.current;
    }
    setTimerState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const resetTimer = useCallback(() => {
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
    
    const currentIntervalDurationMs = settings.intervalDuration * 60 * 1000;
    
    setTimerState({
      isRunning: false,
      currentInterval: 1,
      totalIntervals: settings.totalIntervals,
      intervalDuration: currentIntervalDurationMs,
      timeRemaining: currentIntervalDurationMs,
      completedIntervals: [],
      totalElapsed: 0,
    });
  }, [settings.intervalDuration, settings.totalIntervals]);

  const setOnIntervalComplete = useCallback((callback: () => void) => {
    onIntervalCompleteRef.current = callback;
  }, []);

  const updateSettings = useCallback((newSettings: TimerSettings) => {
    setSettings(newSettings);
    const newIntervalDurationMs = newSettings.intervalDuration * 60 * 1000;
    
    // Reset timer with new settings
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
    
    setTimerState({
      isRunning: false,
      currentInterval: 1,
      totalIntervals: newSettings.totalIntervals,
      intervalDuration: newIntervalDurationMs,
      timeRemaining: newIntervalDurationMs,
      completedIntervals: [],
      totalElapsed: 0,
    });
  }, []);

  return {
    timerState,
    settings,
    startTimer,
    pauseTimer,
    resetTimer,
    setOnIntervalComplete,
    updateSettings,
  };
}
