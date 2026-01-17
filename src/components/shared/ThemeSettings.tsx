import { useAppConfig } from '@/contexts/AppConfig/useAppConfig'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Theme } from '@/types'

export default function ThemeSettings() {
  const { getTheme, updateTheme } = useAppConfig()

  const theme = getTheme()
  const themeSelectId = 'theme'

  return (
    <div className="grid gap-3">
      <Label htmlFor={themeSelectId}>Theme</Label>
      <Select
        name={themeSelectId}
        value={theme}
        onValueChange={value => {
          updateTheme(value as Theme)
        }}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="glassmorphism">Glassmorphism (default)</SelectItem>
          <SelectItem value="glassmorphism-dark">Glassmorphism Dark</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
