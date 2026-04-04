import { createFileRoute } from '@tanstack/react-router'
import BatteryManagement from '@/features/battery'

export const Route = createFileRoute('/_authenticated/battery')({
  component: BatteryManagement,
})
