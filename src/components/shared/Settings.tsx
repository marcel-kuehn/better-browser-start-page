import { useAppConfig } from "@/contexts/AppConfig/useAppConfig";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Theme } from "@/types";

export default function Settings() {
  const { getTheme, updateTheme } = useAppConfig();

  const theme = getTheme();

  return (
    <div className="grid flex-1 auto-rows-min gap-6">
      <div className="grid gap-3">
        <Label htmlFor="sheet-demo-name">Theme</Label>
        <Select
          value={theme}
          onValueChange={(value) => {
            console.log("Selected:", value); // Debug-Check
            updateTheme(value as Theme);
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="glassmorphism">
              Glassmorphism (default)
            </SelectItem>
            <SelectItem value="glassmorphism-dark">
              Glassmorphism Dark
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
