import { PencilIcon, SettingsIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function Navigation() {
  return (
    <nav className="fixed w-full left-0 top-0 text-foreground p-2 flex items-center justify-center">
      <div className="w-full flex justify-between items-center">
        <div></div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon">
            <PencilIcon aria-label="Edit" />
          </Button>
          <Button variant="ghost" size="icon">
            <SettingsIcon aria-label="Settings" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
