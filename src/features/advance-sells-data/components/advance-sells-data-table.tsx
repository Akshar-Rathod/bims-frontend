import { useState, useMemo } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useAdvanceSells, AdvanceSell } from '@/hooks/use-advance-sells'
import { Check, Eye, Pencil, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { showAlert } from '@/lib/swal'
import Swal from 'sweetalert2'
import { handlePrintSelected } from '../../advance-sells/utils/print-logic'
import { DataTablePagination } from '@/components/data-table'

const BillNoCell = ({ 
  value, 
  onSave 
}: { 
  value: string; 
  onSave: (val: string) => Promise<void> 
}) => {
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
          onClick={async () => {
            try {
              await onSave(inputValue)
              setIsEditing(false)
            } catch (error: any) {
              showAlert.error(error.response?.data?.message || 'Failed to update Bill No')
            }
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

export function AdvanceSellsDataTable() {
  const { advanceSells, updateBillNo, isLoading } = useAdvanceSells()
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<ColumnDef<AdvanceSell>[]>(() => [

    {
      accessorKey: '_id',
      header: 'ID',
    },
    {
      accessorKey: 'billNo',
      header: 'Bill No',
      cell: ({ row, getValue }) => {
        const initialValue = (getValue() as string) || ''
        return (
          <BillNoCell
            value={initialValue}
            onSave={async (newVal) => {
              await updateBillNo({ id: row.original._id, billNo: newVal })
              showAlert.success('Bill No updated')
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
      accessorKey: 'items',
      header: 'Barcodes',
      cell: ({ getValue }) => {
        const items = getValue() as AdvanceSell['items']
        return (
          <div className='flex flex-wrap gap-1'>
            {items.map((item, idx) => (
              <Badge key={`${item.barcode}-${idx}`} variant='outline'>
                {item.barcode}
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
          onClick={() => {
            const data = row.original
            const itemsHtml = data.items.map(item => `
              <div style="margin-bottom: 8px; padding: 8px; border: 1px solid #eee; border-radius: 4px; text-align: left;">
                <div style="font-family: monospace; font-size: 14px; margin-bottom: 4px;"><strong>Barcode:</strong> ${item.barcode}</div>
                <div style="font-size: 13px;"><strong>Type:</strong> ${item.batteryType}</div>
                <div style="font-size: 13px;"><strong>Model:</strong> ${item.batteryModel}</div>
              </div>
            `).join('')

            Swal.fire({
              title: 'Advance Sell Details',
              html: `
                <div style="text-align: left; font-size: 14px; line-height: 1.6;">
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px;">
                    <div><strong>Bill No:</strong> ${data.billNo || '<span style="color:#d33">Not Assigned</span>'}</div>
                    <div><strong>Date/Time:</strong> ${data.date} at ${data.time}</div>
                    <div><strong>Name:</strong> ${data.name}</div>
                    <div><strong>Location:</strong> ${data.location}</div>
                  </div>
                  <hr style="margin: 16px 0; border: 0; border-top: 1px solid #eee;" />
                  <h4 style="margin-bottom: 12px; font-weight: 600;">Battery Items (${data.items.length})</h4>
                  <div style="max-height: 300px; overflow-y: auto; padding-right: 8px;">
                    ${itemsHtml}
                  </div>
                </div>
              `,
              width: 500,
              showCloseButton: true,
              showConfirmButton: true,
              confirmButtonText: 'Close',
              confirmButtonColor: '#3085d6',
            })
          }}
        >
          <Eye className='h-4 w-4' />
        </Button>
      ),
    },
    {
      id: 'print',
      header: 'Print',
      cell: ({ row }) => (
        <div className='flex items-center justify-center'>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row for printing"
          />
        </div>
      ),
    },
  ], [updateBillNo])

  const unassignedSells = useMemo(() => 
    advanceSells.filter(sell => !sell.billNo), 
  [advanceSells])

  const table = useReactTable({
    data: unassignedSells,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      rowSelection,
      globalFilter,
    },
    enableRowSelection: true,
  })

  // Derive selected records dynamically based on row indices
  const selectedSells = useMemo(() => {
    const selectedIndices = Object.keys(rowSelection).map(Number)
    return selectedIndices.map(idx => unassignedSells[idx])
  }, [rowSelection, unassignedSells])

  if (isLoading) return <div className='p-4 text-center'>Loading sales data...</div>

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between gap-4 pb-2'>
        <div className='flex flex-1 items-center space-x-2'>
          <h2 className='text-lg font-medium whitespace-nowrap'>Pending Invoices</h2>
          <Input
            placeholder='Search all columns...'
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className='h-8 w-[150px] lg:w-[250px]'
          />
        </div>
        <Button 
          variant='secondary' 
          onClick={() => handlePrintSelected(selectedSells)}
          disabled={selectedSells.length === 0}
        >
          Print Selected ({selectedSells.length})
        </Button>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className='mt-auto' />
    </div>
  )
}
