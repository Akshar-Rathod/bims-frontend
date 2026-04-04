import { createFileRoute } from '@tanstack/react-router'
import VerifiedDCWR from '@/features/dcwr/verified-dcwr'

export const Route = createFileRoute('/_authenticated/dcwr/verified')({
  component: VerifiedDCWR,
})
