import { useEffect } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
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
import { useDCWR } from '@/hooks/use-dcwr'
import { showAlert } from '@/lib/swal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DCWRVerify() {
  const { id } = useParams({ from: '/_authenticated/dcwr/verify/$id' })
  const navigate = useNavigate()
  const { dcwrs, isLoading, verifyDCWR } = useDCWR()
  
  const dcwr = dcwrs.find(d => d._id === id)

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      items: dcwr?.items.map(item => ({
        itemId: item._id,
        batteryType: item.batteryType,
        batteryModel: item.batteryModel,
        quantity: item.quantity,
        arrivedQuantity: item.arrivedQuantity,
      })) || []
    }
  })

  const { fields } = useFieldArray({
    control,
    name: 'items'
  })

  useEffect(() => {
    if (dcwr) {
      reset({
        items: dcwr.items.map(item => ({
          itemId: item._id,
          batteryType: item.batteryType,
          batteryModel: item.batteryModel,
          quantity: item.quantity,
          arrivedQuantity: item.arrivedQuantity,
        }))
      })
    }
  }, [dcwr, reset])

  const onSubmit = async (data: any) => {
    if (!dcwr) return
    try {
      await verifyDCWR({
        id: dcwr._id,
        items: data.items.map((item: any) => ({
          itemId: item.itemId,
          arrivedQuantity: item.arrivedQuantity,
        }))
      })
      showAlert.success('DCWR quantities verified successfully')
      navigate({ to: '/dcwr/unverified' })
    } catch (error: any) {
      showAlert.error('Failed to verify quantities')
    }
  }

  if (isLoading) return <div className='p-8 text-center'>Loading...</div>
  if (!dcwr) return <div className='p-8 text-center'>DCWR not found</div>

  return (
    <>
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Verify DCWR</h2>
            <p className='text-muted-foreground'>
              Update arrived quantities for DCWR No: {dcwr.dcwrNo}
            </p>
          </div>
          <Button variant='outline' onClick={() => navigate({ to: '/dcwr/unverified' })}>
            Back to List
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Item Verification Tally</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[200px]'>Battery Type</TableHead>
                    <TableHead>Battery Model</TableHead>
                    <TableHead className='text-center w-[100px]'>Expected</TableHead>
                    <TableHead className='text-center w-[120px]'>Arrived</TableHead>
                    <TableHead className='text-right w-[100px]'>Remaining</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => {
                    const expected = field.quantity
                    return (
                      <TableRow key={field.id} className='hover:bg-transparent'>
                        <TableCell className='py-4 font-medium'>{field.batteryType}</TableCell>
                        <TableCell className='py-4'>{field.batteryModel}</TableCell>
                        <TableCell className='py-4 text-center text-lg font-semibold'>{expected}</TableCell>
                        <TableCell className='py-4 text-center'>
                          <Input
                            type='number'
                            min={0}
                            className='h-9 w-24 mx-auto text-center font-medium'
                            {...register(`items.${index}.arrivedQuantity` as const, { valueAsNumber: true })}
                          />
                        </TableCell>
                        <TableCell className='py-4 text-right'>
                           <ArrivedDisplay control={control} index={index} expected={expected} />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              <div className='mt-8 flex justify-end space-x-4'>
                <Button variant='outline' type='button' onClick={() => navigate({ to: '/dcwr/unverified' })}>
                  Cancel
                </Button>
                <Button type='submit' size='lg'>Save Verification</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}

function ArrivedDisplay({ control, index, expected }: { control: any, index: number, expected: number }) {
    const arrived = useWatch({
        control,
        name: `items.${index}.arrivedQuantity`
    })
    const remaining = expected - (arrived || 0)
    
    return (
        <span className={cn(
            'text-lg font-bold transition-colors duration-200',
            remaining > 0 ? 'text-destructive' : 'text-green-600'
        )}>
            {remaining < 0 ? 0 : remaining}
        </span>
    )
}
