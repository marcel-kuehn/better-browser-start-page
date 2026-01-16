import { Widget } from "@/components/shared/Widget";
import type { StopWatchWidget } from "./types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatElapsedTime } from "./helper";
import { PauseIcon, PlayIcon, RotateCcwIcon } from "lucide-react";

export default function StopWatchWidget(props: StopWatchWidget) {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (startTime === null) return;
      setElapsedTime(Date.now() - startTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const getActionButtons = () => {
    const isPaused = startTime === null && elapsedTime !== null;
    const isNotStarted = startTime === null && elapsedTime === null;

    const pauseButton = (
      <Button
        size="icon"
        onClick={() => {
          if (startTime !== null) {
            setElapsedTime(Date.now() - startTime);
          }
          setStartTime(null);
        }}
      >
        <PauseIcon aria-label="Pause" />
      </Button>
    );

    const resumeButton = (
      <Button
        size="icon"
        onClick={() => {
          setStartTime(Date.now() - (elapsedTime ?? 0));
        }}
      >
        <PlayIcon aria-label={elapsedTime ? "Resume" : "Start"} />
      </Button>
    );

    const resetButton = (
      <Button
        size="icon"
        onClick={() => {
          setStartTime(null);
          setElapsedTime(null);
        }}
      >
        <RotateCcwIcon aria-label="Reset" />
      </Button>
    );

    if (isNotStarted) {
      return resumeButton;
    }

    if (isPaused) {
      return (
        <>
          {resumeButton} {resetButton}
        </>
      );
    }

    return (
      <>
        {pauseButton} {resetButton}
      </>
    );
  };

  return (
    <Widget
      {...props}
      className="flex flex-col items-center justify-center text-center gap-2"
    >
      <p className="text-foreground text-6xl font-semibold letter-spacing-wide">
        {elapsedTime !== null ? formatElapsedTime(elapsedTime) : "00:00"}
      </p>
      <div className="flex gap-2">{getActionButtons()}</div>
    </Widget>
  );
}
