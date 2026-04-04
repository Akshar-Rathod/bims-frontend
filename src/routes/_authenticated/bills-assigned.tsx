import { createFileRoute } from '@tanstack/react-router'
import BillsAssigned from '@/features/bills-assigned/index'

export const Route = createFileRoute('/_authenticated/bills-assigned')({
  component: BillsAssigned,
})
