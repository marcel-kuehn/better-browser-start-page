import FaviconLoader from "@/components/shared/FaviconLoader";
import clsx from "clsx";
import type { AppLink } from "./types";
import { buttonVariants } from "@/components/ui/button";

export default function AppLink({ url, faviconUrl }: AppLink) {
  return (
    <a
      href={url}
      key={url}
      rel="noopener noreferrer"
      className={clsx([
        "w-16 min-w-16 h-16 min-h-16",
        buttonVariants({ variant: "outline" }),
      ])}
    >
      <FaviconLoader url={url} faviconUrl={faviconUrl} className="!h-6 !w-6" />
    </a>
  );
}
