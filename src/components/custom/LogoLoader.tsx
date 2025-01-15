import { getDomain, getFaviconUrl } from "@/lib/url";
import clsx from "clsx";
import { GlobeIcon } from "lucide-react";
import { useState } from "react";

export default function LogoLoader({
  url,
  customLogoUrl,
  className,
}: {
  url: string;
  customLogoUrl?: string;
  className?: string;
}) {
  const src = customLogoUrl ?? getFaviconUrl(url);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <GlobeIcon
        className={clsx(["w-4 h-4 text-muted-foreground", className])}
        aria-label="Globe Icon"
      />
    );
  }

  return (
    <img
      className={clsx(["w-4 h-4", className])}
      src={src}
      alt={`Favicon of ${getDomain(src)}`}
      onError={() => setHasError(true)}
    />
  );
}
