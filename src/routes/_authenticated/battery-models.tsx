import { createFileRoute } from '@tanstack/react-router'
import BatteryModels from '@/features/battery-models'

export const Route = createFileRoute('/_authenticated/battery-models')({
  component: BatteryModels,
})
