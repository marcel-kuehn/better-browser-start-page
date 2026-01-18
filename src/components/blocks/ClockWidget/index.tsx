import { useEffect, useState } from 'react';
import type { ClockWidget } from './types';
import { Widget } from '@/components/shared/Widget';

const getTime = (): string => {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getDate = (): string => {
  return new Date().toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
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
    <Widget className="flex flex-col items-center justify-center text-center" {...props}>
      <p className="text-foreground letter-spacing-wide text-6xl font-semibold">{time}</p>
      <p className="text-muted-foreground text-lg">{date}</p>
    </Widget>
  );
}
