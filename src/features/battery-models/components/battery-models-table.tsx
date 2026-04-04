import { useState, useMemo } from 'react'
import {
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/data-table'
import { useBatteryModels, BatteryModel } from '@/hooks/use-battery-models'
import { useBatteryTypes } from '@/hooks/use-battery-types'
import { MoreHorizontal, Edit, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { showAlert } from '@/lib/swal'
import { Label } from '@/components/ui/label'

export function BatteryModelsTable() {
  const { batteryModels, deleteBatteryModel, updateBatteryModel, addBatteryModel, isLoading } = useBatteryModels()
  const { batteryTypes } = useBatteryTypes()
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  // Modal states
  const [selectedModel, setSelectedModel] = useState<BatteryModel | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  
  const [editName, setEditName] = useState('')
  const [editPrice, setEditPrice] = useState<number>(0)

  // Add states
  const [newModel, setNewModel] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newType, setNewType] = useState('')

  const handleEdit = (model: BatteryModel) => {
    setSelectedModel(model)
    setEditName(model.model)
    setEditPrice(model.price)
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (model: BatteryModel) => {
    setSelectedModel(model)
    setIsDeleteDialogOpen(true)
  }

  const onAdd = async () => {
    if (!newModel.trim() || !newType || !newPrice) {
      showAlert.error('Please fill all fields')
      return
    }
    try {
      await addBatteryModel({
        batteryType: newType,
        model: newModel,
        price: parseFloat(newPrice)
      })
      showAlert.success('Battery model added successfully')
      setIsAddDialogOpen(false)
      setNewModel('')
      setNewPrice('')
    } catch (error: any) {
      showAlert.error('Failed to add battery model')
    }
  }

  const onUpdate = async () => {
    if (!selectedModel) return
    try {
      await updateBatteryModel({ id: selectedModel._id, model: editName, price: editPrice })
      showAlert.success('Battery model updated successfully')
      setIsEditDialogOpen(false)
    } catch (error: any) {
      showAlert.error('Failed to update battery model')
    }
  }

  const onDelete = async () => {
    if (!selectedModel) return
    try {
      await deleteBatteryModel(selectedModel._id)
      showAlert.success('Battery model deleted successfully')
      setIsDeleteDialogOpen(false)
    } catch (error: any) {
      showAlert.error('Failed to delete battery model')
    }
  }

  const columns = useMemo<ColumnDef<BatteryModel>[]>(() => [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'batteryType.id',
      header: 'Type ID',
    },
    {
      accessorKey: 'batteryType.name',
      header: 'Battery Type',
    },
    {
      accessorKey: 'model',
      header: 'Battery Model',
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => {
        const price = parseFloat(row.getValue('price'))
        const formatted = new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
        }).format(price)
        return <div className='font-medium'>{formatted}</div>
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const item = row.original

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
              <DropdownMenuItem onClick={() => handleEdit(item)}>
                <Edit className='mr-2 h-4 w-4' />
                Update
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className='text-destructive'
                onClick={() => handleDeleteClick(item)}
              >
                <Trash2 className='mr-2 h-4 w-4' />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ], [deleteBatteryModel])

  const table = useReactTable({
    data: batteryModels,
    columns,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  if (isLoading) return <div className='p-4 text-center'>Loading battery models...</div>

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='flex items-center justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <h2 className='text-lg font-medium'>Battery Models</h2>
          <Button size='sm' onClick={() => setIsAddDialogOpen(true)}>
            <Plus className='mr-2 h-4 w-4' />
            Add Model
          </Button>
        </div>
        <Input
          placeholder='Search models...'
          value={globalFilter ?? ''}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className='max-w-sm'
        />
      </div>
      <div className='overflow-hidden rounded-md border'>
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

      {/* Add Modal */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Battery Model</DialogTitle>
            <DialogDescription>
              Create a new battery model entry.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='newType' className='text-right'>
                Battery Type
              </Label>
              <div className='col-span-3'>
                <Select value={newType} onValueChange={setNewType}>
                  <SelectTrigger id='newType' className='size-full'>
                    <SelectValue placeholder='Select Type' />
                  </SelectTrigger>
                  <SelectContent>
                    {batteryTypes.map((t) => (
                      <SelectItem key={t._id} value={t.id?.toString() || ''}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='newModel' className='text-right'>
                Model Name
              </Label>
              <Input
                id='newModel'
                value={newModel}
                onChange={(e) => setNewModel(e.target.value)}
                placeholder='e.g. SL-150'
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='newPrice' className='text-right'>
                Price
              </Label>
              <Input
                id='newPrice'
                type='number'
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder='0.00'
                className='col-span-3'
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={onAdd}>Create Model</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Battery Model</DialogTitle>
            <DialogDescription>
              Modify the model name and price.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='model' className='text-right'>
                Model Name
              </Label>
              <Input
                id='model'
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='price' className='text-right'>
                Price
              </Label>
              <Input
                id='price'
                type='number'
                value={editPrice}
                onChange={(e) => setEditPrice(parseFloat(e.target.value))}
                className='col-span-3'
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={onUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              battery model "{selectedModel?.model}" and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              onClick={onDelete}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
