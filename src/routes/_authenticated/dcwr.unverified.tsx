import { createFileRoute } from '@tanstack/react-router'
import UnverifiedDCWR from '@/features/dcwr/unverified-dcwr'

export const Route = createFileRoute('/_authenticated/dcwr/unverified')({
  component: UnverifiedDCWR,
})
