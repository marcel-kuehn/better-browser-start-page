export const normalizeUrl = (url: string | undefined): string => {
  if (!url) return "";

  try {
    return new URL(url).origin;
  } catch {
    return "";
  }
};

export const getDomain = (url: string | undefined): string => {
  if (!url) return "";

  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
};

export const getFaviconUrl = (url: string | undefined): string => {
  return `${normalizeUrl(url)}/favicon.ico`;
};

export const openUrl = (url: string | undefined) => {
  if (!url) return;

  window.open(url, "_self", "noopener,noreferrer");
};
