import { useEffect, useState } from 'react';
import type { ClockWidget } from './types';
import { Widget } from '@/components/shared/Widget';
import { getDate, getTime } from './helpers';
import { useAppConfig } from '@/contexts/AppConfig/useAppConfig';

export function ClockWidget({ ...props }: ClockWidget) {
  const { getLanguage } = useAppConfig();
  const language = getLanguage();
  const [time, setTime] = useState(getTime(language));
  const [date, setDate] = useState(getDate(language));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTime(language));
      setDate(getDate(language));
    }, 1000);
    return () => clearInterval(interval);
  }, [language]);

  return (
    <Widget className="flex flex-col items-center justify-center text-center" {...props}>
      <p className="text-foreground letter-spacing-wide text-6xl font-semibold">{time}</p>
      <p className="text-muted-foreground text-lg">{date}</p>
    </Widget>
  );
}
