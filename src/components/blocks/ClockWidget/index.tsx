import { useEffect, useState } from "react";
import type { ClockWidget } from "./types";
import { Widget } from "@/components/shared/Widget";

const getTime = (): string => {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getDate = (): string => {
  return new Date().toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

export function ClockWidget({ ...props }: ClockWidget) {
  const [time, setTime] = useState(getTime());
  const [date, setDate] = useState(getDate());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTime());
      setDate(getDate());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Widget
      className="text-center flex justify-center items-center flex-col"
      {...props}
    >
      <p className="text-foreground text-7xl font-semibold letter-spacing-wide">
        {time}
      </p>
      <p className="text-muted-foreground text-lg">{date}</p>
    </Widget>
  );
}
