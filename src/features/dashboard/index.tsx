import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useDCWR } from '@/hooks/use-dcwr'
import { useAdvanceSells } from '@/hooks/use-advance-sells'
import { ShoppingCart, Package, ClipboardCheck, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import { AdvanceSellsChart } from './components/advance-sells-chart'
import { DCWRStatusChart } from './components/dcwr-status-chart'
import { ScrollArea } from '@/components/ui/scroll-area'

export function Dashboard() {
  const { dcwrs } = useDCWR()
  const { advanceSells } = useAdvanceSells()

  const totalSales = advanceSells.length
  const pendingDCWRs = dcwrs.filter(d => d.status === 'Pending').length
  const partialDCWRs = dcwrs.filter(d => d.status === 'Partial').length
  const verifiedDCWRs = dcwrs.filter(d => d.status === 'Verified').length

  const recentActivity = [
    ...dcwrs.map(d => ({ ...d, type: 'DCWR' })),
    ...advanceSells.map(s => ({ ...s, type: 'Sale' }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
   .slice(0, 10)

  return (
    <>
      <Header>
        <div className='flex items-center space-x-2'>
          <h2 className='text-lg font-bold tracking-tight text-primary'>BIMS</h2>
        </div>
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6 flex flex-col space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>Battery Inventory & Management System</h1>
          <p className='text-muted-foreground'>
            Welcome to BIMS. Here is a summary of your battery operations.
          </p>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Total Advance Sales</CardTitle>
              <ShoppingCart className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{totalSales}</div>
              <p className='text-xs text-muted-foreground'>Total units sold via advance sells</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Pending DCWR</CardTitle>
              <AlertCircle className='h-4 w-4 text-destructive' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{pendingDCWRs}</div>
              <p className='text-xs text-muted-foreground'>Returns awaiting verification</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Partial DCWR</CardTitle>
              <Package className='h-4 w-4 text-secondary' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{partialDCWRs}</div>
              <p className='text-xs text-muted-foreground'>Returns partially verified</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Verified DCWR</CardTitle>
              <ClipboardCheck className='h-4 w-4 text-green-600' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{verifiedDCWRs}</div>
              <p className='text-xs text-muted-foreground'>Successfully completed returns</p>
            </CardContent>
          </Card>
        </div>

        <div className='mt-6 grid grid-cols-1 gap-4 lg:grid-cols-7'>
          <Card className='col-span-1 lg:col-span-4'>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
            </CardHeader>
            <CardContent className='ps-2'>
              <AdvanceSellsChart />
            </CardContent>
          </Card>
          <Card className='col-span-1 lg:col-span-3'>
            <CardHeader>
              <CardTitle>DCWR Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <DCWRStatusChart />
            </CardContent>
          </Card>
        </div>

        <div className='mt-6'>
          <Card>
            <CardHeader className='flex items-center justify-between'>
              <CardTitle className='text-lg'>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className='h-[300px] pr-4'>
                <div className='space-y-4'>
                  {recentActivity.map((activity: any) => (
                    <div key={activity._id} className='flex items-center justify-between border-b py-3 last:border-0 last:pb-0'>
                      <div className='flex items-center space-x-4'>
                        <div className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-full',
                          activity.type === 'DCWR' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        )}>
                          {activity.type === 'DCWR' ? <Package className='h-5 w-5' /> : <ShoppingCart className='h-5 w-5' />}
                        </div>
                        <div className='flex flex-col'>
                          <span className='text-sm font-bold leading-none'>
                            {activity.type === 'DCWR' ? `DCWR #${activity.dcwrNo}` : `Sale to ${activity.name}`}
                          </span>
                          <span className='mt-1 text-xs text-muted-foreground'>
                            {new Date(activity.date).toLocaleDateString()} {activity.time ? `at ${activity.time}` : ''}
                          </span>
                        </div>
                      </div>
                      <div className='flex items-center space-x-2'>
                        {activity.type === 'DCWR' ? (
                          <Badge 
                            variant={activity.status === 'Verified' ? 'default' : 'secondary'}
                            className={cn(
                              'text-[10px] h-5 px-1.5',
                              activity.status === 'Pending' && 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
                              activity.status === 'Partial' && 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20'
                            )}
                          >
                            {activity.status}
                          </Badge>
                        ) : (
                          <Badge variant='outline' className='text-[10px] h-5 px-1.5 text-green-600 border-green-600/20 bg-green-600/5'>
                            Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {recentActivity.length === 0 && (
                    <p className='text-center text-muted-foreground py-8'>No recent activity found.</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
