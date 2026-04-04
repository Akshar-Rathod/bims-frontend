import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Battery, Zap } from 'lucide-react'
import { showAlert } from '@/lib/swal'
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useBatteryTypes } from '@/hooks/use-battery-types'
import { useBatteryModels } from '@/hooks/use-battery-models'

// Form 1 Schema: Add New Battery Type
const batteryTypeSchema = z.object({
  batteryType: z.string().min(1, 'Battery Type is required.'),
})

type BatteryTypeForm = z.infer<typeof batteryTypeSchema>

// Form 2 Schema: Add New Battery Model
const batteryModelSchema = z.object({
  batteryType: z.string().min(1, 'Please select a battery type.'),
  batteryModel: z.string().min(1, 'Battery Model is required.'),
  batteryPrice: z.string().min(1, 'Battery Price is required.'),
})

type BatteryModelForm = z.infer<typeof batteryModelSchema>

export default function BatteryManagement() {
  const { batteryTypes, addBatteryType } = useBatteryTypes()
  const { addBatteryModel } = useBatteryModels()

  // Form 1: Battery Type
  const typeForm = useForm<BatteryTypeForm>({
    resolver: zodResolver(batteryTypeSchema),
    defaultValues: {
      batteryType: '',
    },
  })

  // Form 2: Battery Model
  const modelForm = useForm<BatteryModelForm>({
    resolver: zodResolver(batteryModelSchema),
    defaultValues: {
      batteryType: '',
      batteryModel: '',
      batteryPrice: '',
    },
  })

  const onTypeSubmit = async (data: BatteryTypeForm) => {
    try {
      await addBatteryType(data.batteryType)
      showAlert.success('Battery type added successfully')
      typeForm.reset()
    } catch (error: any) {
      showAlert.error(error.response?.data?.message || 'Failed to add battery type')
    }
  }

  const onModelSubmit = async (data: BatteryModelForm) => {
    try {
      await addBatteryModel({
        batteryType: data.batteryType,
        model: data.batteryModel,
        price: Number(data.batteryPrice),
      })
      showAlert.success('Battery model added successfully')
      modelForm.reset()
    } catch (error: any) {
      showAlert.error(error.response?.data?.message || 'Failed to add battery model')
    }
  }

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
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Battery Management</h2>
            <p className='text-muted-foreground'>
              Manage your battery types and models here.
            </p>
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-2'>
          {/* Form 1: Add New Battery Type */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Zap size={20} />
                Add New Battery Type
              </CardTitle>
              <CardDescription>
                Enter the name of the new battery type to add it to the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...typeForm}>
                <form
                  onSubmit={typeForm.handleSubmit(onTypeSubmit)}
                  className='space-y-4'
                >
                  <FormField
                    control={typeForm.control}
                    name='batteryType'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Battery Type</FormLabel>
                        <FormControl>
                          <Input placeholder='e.g. Lithium-Ion' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type='submit' className='w-full'>
                    Add Battery Type
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Form 2: Add New Battery Model */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Battery size={20} />
                Add New Battery Model
              </CardTitle>
              <CardDescription>
                Select a battery type and enter model details below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...modelForm}>
                <form
                  onSubmit={modelForm.handleSubmit(onModelSubmit)}
                  className='space-y-4'
                >
                  <FormField
                    control={modelForm.control}
                    name='batteryType'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Battery Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select Battery Type' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {batteryTypes.map((type) => (
                              <SelectItem key={type._id} value={type.id?.toString() || ''}>
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
                    control={modelForm.control}
                    name='batteryModel'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Battery Model</FormLabel>
                        <FormControl>
                          <Input placeholder='e.g. L-500' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={modelForm.control}
                    name='batteryPrice'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Battery Price</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='e.g. 5000'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type='submit' className='w-full'>
                    Add Battery Model
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
