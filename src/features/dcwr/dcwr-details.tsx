import { useParams, useNavigate } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useDCWR } from '@/hooks/use-dcwr'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Edit } from 'lucide-react'

export default function DCWRDetails() {
  const { id } = useParams({ from: '/_authenticated/dcwr/details/$id' })
  const navigate = useNavigate()
  const { dcwrs, isLoading } = useDCWR()
  
  const dcwr = dcwrs.find(d => d._id === id)

  if (isLoading) return <div className='p-8 text-center'>Loading...</div>
  if (!dcwr) return <div className='p-8 text-center'>DCWR not found</div>

  const statusVariant = 
    dcwr.status === 'Verified' ? 'default' : 
    dcwr.status === 'Partial' ? 'secondary' : 'destructive'

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
          <div className='flex items-center space-x-4'>
            <Button variant='ghost' size='icon' onClick={() => window.history.back()}>
              <ArrowLeft className='h-5 w-5' />
            </Button>
            <div>
              <h2 className='text-2xl font-bold tracking-tight text-primary'>DCWR Details: {dcwr.dcwrNo}</h2>
              <p className='text-muted-foreground'>
                Comprehensive view of the Warranty Battery DCWR record.
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            {dcwr.status !== 'Verified' && (
              <Button onClick={() => navigate({ to: `/dcwr/edit/${dcwr._id}` })}>
                <Edit className='mr-2 h-4 w-4' />
                Edit DCWR
              </Button>
            )}
            <Badge variant={statusVariant as any} className='px-4 py-1 text-sm'>
              {dcwr.status}
            </Badge>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          <Card className='md:col-span-1'>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <label className='text-sm font-medium text-muted-foreground'>DCWR Number</label>
                <p className='text-lg font-semibold'>{dcwr.dcwrNo}</p>
              </div>
              <div>
                <label className='text-sm font-medium text-muted-foreground'>Date</label>
                <p className='text-lg font-semibold'>{dcwr.date}</p>
              </div>
              <div>
                <label className='text-sm font-medium text-muted-foreground'>Created At</label>
                <p className='text-sm'>{new Date(dcwr.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <label className='text-sm font-medium text-muted-foreground'>Last Updated</label>
                <p className='text-sm'>{new Date(dcwr.updatedAt).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className='md:col-span-2'>
            <CardHeader>
              <CardTitle>Item Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead className='text-center'>Expected</TableHead>
                    <TableHead className='text-center'>Arrived</TableHead>
                    <TableHead className='text-right'>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dcwr.items.map((item, index) => {
                    const isVerified = item.arrivedQuantity >= item.quantity
                    return (
                      <TableRow key={index}>
                        <TableCell className='font-medium'>{item.batteryType}</TableCell>
                        <TableCell>{item.batteryModel}</TableCell>
                        <TableCell className='text-center'>{item.quantity}</TableCell>
                        <TableCell className='text-center'>{item.arrivedQuantity}</TableCell>
                        <TableCell className='text-right'>
                          <Badge variant={isVerified ? 'outline' : 'destructive'} className={cn(isVerified && 'text-green-600 border-green-600')}>
                            {isVerified ? 'Completed' : 'Missing'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
