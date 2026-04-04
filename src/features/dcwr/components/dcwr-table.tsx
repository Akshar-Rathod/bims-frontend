import { useState, useMemo } from 'react'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useNavigate } from '@tanstack/react-router'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, ClipboardCheck, Trash2, Edit, Eye } from 'lucide-react'
import { useDCWR, DCWR } from '@/hooks/use-dcwr'
import { DataTablePagination } from '@/components/data-table'
import { showAlert } from '@/lib/swal'

interface DCWRTableProps {
  filterStatus?: 'Unverified' | 'Verified'
}

export function DCWRTable({ filterStatus }: DCWRTableProps) {
  const { dcwrs, isLoading, deleteDCWR } = useDCWR()
  const navigate = useNavigate()
  const [globalFilter, setGlobalFilter] = useState('')

  const handleVerify = (dcwr: DCWR) => {
    navigate({ to: `/dcwr/verify/${dcwr._id}` })
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteDCWR(id)
      showAlert.success('DCWR deleted successfully')
    } catch (error) {
      showAlert.error('Failed to delete DCWR')
    }
  }

  const columns = useMemo<ColumnDef<DCWR>[]>(() => [
    {
      accessorKey: 'dcwrNo',
      header: 'DCWR No.',
    },
    {
      accessorKey: 'date',
      header: 'Date',
    },
    {
      accessorKey: 'items',
      header: 'Items Count',
      cell: ({ row }: { row: any }) => row.original.items.length,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: { row: any }) => {
        const status = row.original.status
        const variant = 
          status === 'Verified' ? 'default' : 
          status === 'Partial' ? 'secondary' : 'destructive'
        return <Badge variant={variant as any}>{status}</Badge>
      },
    },
    {
      id: 'actions',
      cell: ({ row }: { row: any }) => {
        const dcwr = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate({ to: `/dcwr/details/${dcwr._id}` })}>
                <Eye className='mr-2 h-4 w-4' />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {dcwr.status !== 'Verified' && (
                <>
                  <DropdownMenuItem onClick={() => handleVerify(dcwr)}>
                    <ClipboardCheck className='mr-2 h-4 w-4 text-green-600' />
                    Verify Quantities
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate({ to: `/dcwr/edit/${dcwr._id}` })}>
                    <Edit className='mr-2 h-4 w-4 text-blue-600' />
                    Edit DCWR
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
{/*               <DropdownMenuItem 
                className='text-destructive'
                onClick={() => handleDelete(dcwr._id)}
              >
                <Trash2 className='mr-2 h-4 w-4' />
                Delete
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ], [deleteDCWR])

  const filteredData = useMemo(() => {
    if (!filterStatus) return dcwrs
    if (filterStatus === 'Verified') {
      return dcwrs.filter(d => d.status === 'Verified')
    }
    return dcwrs.filter(d => d.status !== 'Verified')
  }, [dcwrs, filterStatus])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      globalFilter,
    },
  })

  if (isLoading) return <div className='p-4 text-center'>Loading DCWR data...</div>

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between gap-4'>
        <Input
          placeholder='Search DCWRs...'
          value={globalFilter ?? ''}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className='max-w-sm'
        />
      </div>

      <div className='rounded-md border overflow-hidden'>
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

      <DataTablePagination table={table} />
    </div>
  )
}
