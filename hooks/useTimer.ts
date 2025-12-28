import { useEffect, useRef, useState } from "react";

interface UseTimerProps {
  initialSeconds: number;
  isEnabled: boolean;
}

export const useTimer = ({ initialSeconds, isEnabled }: UseTimerProps) => {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [isTimerFinished, setIsTimerFinished] = useState(
    !isEnabled || initialSeconds === 0,
  );
  const [timerStarted, setTimerStarted] = useState(false);
  const lastTimestampRef = useRef<number | null>(null);

  useEffect(() => {
    setRemainingSeconds(initialSeconds);
    setIsTimerFinished(!isEnabled || initialSeconds === 0);
    setTimerStarted(false);
  }, [initialSeconds, isEnabled]);

  useEffect(() => {
    if (!isEnabled || !timerStarted) return;

    lastTimestampRef.current = Date.now();

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerFinished(true);
          setTimerStarted(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Handle page visibility changes (browser tab active/inactive)
    const handleVisibilityChange = () => {
      if (!timerStarted) return;

      if (document.hidden) {
        // Tab became inactive
        lastTimestampRef.current = Date.now();
      } else if (lastTimestampRef.current) {
        // Tab became active again
        const elapsedMs = Date.now() - lastTimestampRef.current;
        const elapsedSec = Math.floor(elapsedMs / 1000);
        if (elapsedSec > 0) {
          setRemainingSeconds((prev) => {
            const next = Math.max(0, prev - elapsedSec);
            if (next === 0) {
              setIsTimerFinished(true);
              setTimerStarted(false);
            }
            return next;
          });
        }
        lastTimestampRef.current = Date.now();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isEnabled, timerStarted]);

  const startTimer = () => {
    if (!timerStarted && remainingSeconds > 0) {
      setIsTimerFinished(false);
      setTimerStarted(true);
      lastTimestampRef.current = Date.now();
    }
  };

  return {
    remainingSeconds,
    isTimerFinished,
    timerStarted,
    startTimer,
  };
};
