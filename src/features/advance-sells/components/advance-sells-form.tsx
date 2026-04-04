import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Copy, Trash2 } from 'lucide-react'
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
import { useAdvanceSells } from '@/hooks/use-advance-sells'
import { showAlert } from '@/lib/swal'

const advanceSellsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.string().min(1, 'Location is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  billNo: z.string().optional(),
  items: z.array(
    z.object({
      barcode: z.string().min(1, 'Barcode is required'),
      batteryType: z.string().min(1, 'Battery Type is required'),
      batteryModel: z.string().min(1, 'Battery Model is required'),
    })
  ).min(1, 'At least one item is required'),
}).superRefine((data, ctx) => {
  const barcodes = data.items.map(item => item.barcode)
  const duplicateBarcodes = barcodes.filter((barcode, index) => barcode !== '' && barcodes.indexOf(barcode) !== index)
  
  if (duplicateBarcodes.length > 0) {
    data.items.forEach((item, index) => {
      if (duplicateBarcodes.includes(item.barcode)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Duplicate barcode in form',
          path: ['items', index, 'barcode'],
        })
      }
    })
  }
})

type AdvanceSellsFormValues = z.infer<typeof advanceSellsSchema>

export function AdvanceSellsForm() {
  const { batteryTypes } = useBatteryTypes()
  const { batteryModels } = useBatteryModels()
  const { addAdvanceSell } = useAdvanceSells()

  const form = useForm<AdvanceSellsFormValues>({
    resolver: zodResolver(advanceSellsSchema),
    defaultValues: {
      name: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      billNo: '',
      items: [{ barcode: '', batteryType: '', batteryModel: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  async function onSubmit(data: AdvanceSellsFormValues) {
    try {
      await addAdvanceSell(data)
      showAlert.success('Advance Sells Form Submitted Successfully!')
      form.reset({
        name: '',
        location: '',
        date: new Date().toISOString().split('T')[0],
        time: '',
        billNo: '',
        items: [{ barcode: '', batteryType: '', batteryModel: '' }],
      })
    } catch (error: any) {
      showAlert.error(error.response?.data?.message || 'Failed to submit form')
    }
  }

  const handleDuplicateWithData = (index: number) => {
    const itemToDuplicate = form.getValues(`items.${index}`)
    append({
      barcode: '', // Barcode data does not copy
      batteryType: itemToDuplicate.batteryType,
      batteryModel: itemToDuplicate.batteryModel,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='location'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder='Enter location' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='billNo'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bill No (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder='Enter bill number' {...field} />
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
                  <Input 
                    type='date' 
                    {...field} 
                    onClick={() => {
                      if (!field.value) {
                        form.setValue('date', new Date().toISOString().split('T')[0])
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='time'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input 
                    type='time' 
                    {...field} 
                    onClick={() => {
                      if (!field.value) {
                        const now = new Date()
                        const timeString = now.toTimeString().split(':').slice(0, 2).join(':')
                        form.setValue('time', timeString)
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-md font-medium'>Battery Items</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className='grid grid-cols-1 items-end gap-4 rounded-lg border p-4 md:grid-cols-4'
              >
                <FormField
                  control={form.control}
                  name={`items.${index}.barcode`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Barcode</FormLabel>
                      <FormControl>
                        <Input placeholder='Scan barcode' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <div className='flex space-x-2'>
                  <Button
                    type='button'
                    variant='secondary'
                    size='icon'
                    title='Duplicate with data'
                    onClick={() => handleDuplicateWithData(index)}
                  >
                    <Copy className='h-4 w-4' />
                  </Button>
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
              onClick={() => append({ barcode: '', batteryType: '', batteryModel: '' })}
            >
              <Plus className='mr-2 h-4 w-4' />
              Add New Item Field
            </Button>
          </CardContent>
        </Card>

        <Button type='submit' className='w-full'>Submit Sales</Button>
      </form>
    </Form>
  )
}
