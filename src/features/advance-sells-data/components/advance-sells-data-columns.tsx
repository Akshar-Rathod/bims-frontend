import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Check, Eye, Pencil, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { AdvanceSellRecord } from '../data/advance-sells-data'

const BillNoCell = ({ value, onSave }: { value: string; onSave: (val: string) => void }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(value)

  if (isEditing) {
    return (
      <div className='flex items-center space-x-1'>
        <Input
          className='h-8 w-[100px]'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoFocus
        />
        <Button
          size='icon'
          variant='ghost'
          className='h-8 w-8 text-green-600 hover:text-green-700'
          onClick={() => {
            onSave(inputValue)
            setIsEditing(false)
          }}
        >
          <Check className='h-4 w-4' />
        </Button>
        <Button
          size='icon'
          variant='ghost'
          className='h-8 w-8 text-destructive hover:text-destructive'
          onClick={() => {
            setInputValue(value)
            setIsEditing(false)
          }}
        >
          <X className='h-4 w-4' />
        </Button>
      </div>
    )
  }

  return (
    <div
      className='flex cursor-pointer items-center space-x-2'
      onClick={() => setIsEditing(true)}
    >
      <span>{value || 'Add Bill No'}</span>
      <Pencil className='h-3 w-3 text-muted-foreground' />
    </div>
  )
}

export const advanceSellsDataColumns: ColumnDef<AdvanceSellRecord>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'billNo',
    header: 'Bill No',
    cell: ({ row, getValue }) => {
      const initialValue = getValue() as string
      return (
        <BillNoCell
          value={initialValue}
          onSave={(newVal) => {
            console.log(`Update Bill No for ${row.original.id}:`, newVal)
          }}
        />
      )
    },
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
