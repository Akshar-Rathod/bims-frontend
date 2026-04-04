import { createFileRoute } from '@tanstack/react-router'
import AdvanceSells from '@/features/advance-sells/index'

export const Route = createFileRoute('/_authenticated/advance-sells')({
  component: AdvanceSells,
})
