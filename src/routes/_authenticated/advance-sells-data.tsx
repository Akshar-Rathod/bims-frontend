import { createFileRoute } from '@tanstack/react-router'
import AdvanceSellsData from '@/features/advance-sells-data/index'

export const Route = createFileRoute('/_authenticated/advance-sells-data')({
  component: AdvanceSellsData,
})
