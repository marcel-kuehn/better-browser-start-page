import { useAppConfig } from '@/contexts/AppConfig/useAppConfig'
import { CopyButton } from './CopyButton'
import { Label } from '../ui/label'

export default function ConfigExport() {
  const { config } = useAppConfig()

  return (
    <div className="grid gap-3">
      <Label className="font-medium">Export configuration</Label>
      <CopyButton textToCopy={JSON.stringify(config, null, 2)}>Copy current config</CopyButton>
    </div>
  )
}
