export const replacePlaceholder = (text: string, placeholder: string, value: string) => {
  return text.replace(`{${placeholder}}`, value);
};

export const openUrl = (url: string | undefined) => {
  if (!url) return;

  window.open(url, '_self', 'noopener,noreferrer');
};
