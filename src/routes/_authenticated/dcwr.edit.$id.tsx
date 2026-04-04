import { createFileRoute } from '@tanstack/react-router'
import DCWREdit from '@/features/dcwr/dcwr-edit'

export const Route = createFileRoute('/_authenticated/dcwr/edit/$id')({
  component: DCWREdit,
})
