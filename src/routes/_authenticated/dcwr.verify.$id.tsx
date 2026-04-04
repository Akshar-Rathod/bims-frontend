import { createFileRoute } from '@tanstack/react-router'
import DCWRVerify from '@/features/dcwr/dcwr-verify'

export const Route = createFileRoute('/_authenticated/dcwr/verify/$id')({
  component: DCWRVerify,
})
