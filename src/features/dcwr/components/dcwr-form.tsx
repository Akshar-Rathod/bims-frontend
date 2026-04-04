import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useBatteryTypes } from '@/hooks/use-battery-types'
import { useBatteryModels } from '@/hooks/use-battery-models'
import { useDCWR, DCWR } from '@/hooks/use-dcwr'
import { showAlert } from '@/lib/swal'
import { useEffect } from 'react'

const dcwrSchema = z.object({
  dcwrNo: z.string().min(1, 'DCWR No. is required'),
  date: z.string().min(1, 'Date is required'),
  items: z.array(
    z.object({
      _id: z.string().optional(),
      batteryType: z.string().min(1, 'Battery Type is required'),
      batteryModel: z.string().min(1, 'Battery Model is required'),
      quantity: z.number().min(1, 'Quantity must be at least 1'),
      arrivedQuantity: z.number().min(0),
    })
  ).min(1, 'At least one item is required'),
})

type DCWRFormValues = z.infer<typeof dcwrSchema>

interface DCWRFormProps {
  initialData?: DCWR
  isEdit?: boolean
}

export function DCWRForm({ initialData, isEdit = false }: DCWRFormProps) {
  const { batteryTypes } = useBatteryTypes()
  const { batteryModels } = useBatteryModels()
  const { addDCWR, updateDCWR } = useDCWR()

  const form = useForm<DCWRFormValues>({
    resolver: zodResolver(dcwrSchema),
    defaultValues: {
      dcwrNo: '',
      date: new Date().toISOString().split('T')[0],
      items: [{ batteryType: '', batteryModel: '', quantity: 1, arrivedQuantity: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        dcwrNo: initialData.dcwrNo,
        date: initialData.date,
        items: initialData.items.map(item => ({
          _id: item._id,
          batteryType: item.batteryType,
          batteryModel: item.batteryModel,
          quantity: item.quantity,
          arrivedQuantity: item.arrivedQuantity,
        })),
      })
    }
  }, [initialData, form])

  async function onSubmit(data: DCWRFormValues) {
    try {
      if (isEdit && initialData) {
        await updateDCWR({ id: initialData._id, data })
        showAlert.success('DCWR Updated Successfully!')
      } else {
        await addDCWR(data)
        showAlert.success('DCWR Form Submitted Successfully!')
        form.reset()
      }
    } catch (error: any) {
      showAlert.error(error.response?.data?.message || 'Failed to submit form')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='dcwrNo'
            render={({ field }) => (
              <FormItem>
                <FormLabel>DCWR No.</FormLabel>
                <FormControl>
                  <Input placeholder='Enter DCWR number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='date'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type='date' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-md font-medium'>DCWR Items</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4 pt-4'>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className='grid grid-cols-1 items-end gap-4 rounded-lg border p-4 md:grid-cols-4'
              >
                <FormField
                  control={form.control}
                  name={`items.${index}.batteryType`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Battery Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select type' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {batteryTypes.map((type) => (
                            <SelectItem key={type._id} value={type.name}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.batteryModel`}
                  render={({ field }) => {
                    const selectedType = form.watch(`items.${index}.batteryType`)
                    const filteredModels = selectedType 
                      ? batteryModels.filter(m => m.batteryType.name === selectedType)
                      : batteryModels

                    return (
                      <FormItem>
                        <FormLabel>Battery Model</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select model' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredModels.map((model) => (
                              <SelectItem key={model._id} value={model.model}>
                                {model.model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input 
                            type='number' 
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value))} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='flex justify-end'>
                  {fields.length > 1 && (
                    <Button
                      type='button'
                      variant='destructive'
                      size='icon'
                      onClick={() => remove(index)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='mt-2 w-full border-dashed'
              onClick={() => append({ batteryType: '', batteryModel: '', quantity: 1, arrivedQuantity: 0 })}
            >
              <Plus className='mr-2 h-4 w-4' />
              Add Item Row
            </Button>
          </CardContent>
        </Card>

        <Button type='submit' className='w-full'>{isEdit ? 'Update DCWR' : 'Submit DCWR'}</Button>
      </form>
    </Form>
  )
}
