export const getTime = (locale?: string): string => {
  return new Date().toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getDate = (locale?: string): string => {
  return new Date().toLocaleDateString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};
