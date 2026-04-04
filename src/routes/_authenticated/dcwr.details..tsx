import { createFileRoute } from '@tanstack/react-router'
import DCWRDetails from '@/features/dcwr/dcwr-details'

export const Route = createFileRoute('/_authenticated/dcwr/details/')({
  component: DCWRDetails,
})
