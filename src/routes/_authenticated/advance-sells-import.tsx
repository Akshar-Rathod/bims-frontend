import { createFileRoute } from '@tanstack/react-router'
import AdvanceSellsImport from '@/features/advance-sells-import/index'

export const Route = createFileRoute('/_authenticated/advance-sells-import')({
  component: AdvanceSellsImport,
})
