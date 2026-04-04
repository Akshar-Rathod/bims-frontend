import { ColumnDef } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { AdvanceSellRecord } from '../../advance-sells-data/data/advance-sells-data'

export const billsAssignedColumns: ColumnDef<AdvanceSellRecord>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'billNo',
    header: 'Bill No',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'location',
    header: 'Location',
  },
  {
    accessorKey: 'barcodes',
    header: 'Barcodes',
    cell: ({ getValue }) => {
      const barcodes = getValue() as string[]
      return (
        <div className='flex flex-wrap gap-1'>
          {barcodes.map((bc) => (
            <Badge key={bc} variant='outline'>
              {bc}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    accessorKey: 'time',
    header: 'Time',
  },
  {
    id: 'view',
    header: 'View',
    cell: ({ row }) => (
      <Button
        variant='ghost'
        size='icon'
        onClick={() => console.log('View record:', row.original.id)}
      >
        <Eye className='h-4 w-4' />
      </Button>
    ),
  },
  {
    id: 'print',
    header: 'Print',
    cell: ({ row }) => (
      <div className='flex items-center justify-center col-span-full'>
        <Checkbox
          onCheckedChange={(checked) => {
            console.log(`Print checked for ${row.original.id}:`, checked)
          }}
        />
      </div>
    ),
  },
]
