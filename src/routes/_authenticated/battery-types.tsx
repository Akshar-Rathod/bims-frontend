import { createFileRoute } from '@tanstack/react-router'
import BatteryTypes from '@/features/battery-types'

export const Route = createFileRoute('/_authenticated/battery-types')({
  component: BatteryTypes,
})
