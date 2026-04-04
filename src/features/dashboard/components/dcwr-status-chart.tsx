import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useDCWR } from '@/hooks/use-dcwr'
import { useMemo, useState } from 'react'
import { 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  isWithinInterval, 
  subDays,
  parseISO
} from 'date-fns'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function DCWRStatusChart() {
  const { dcwrs } = useDCWR()
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week')

  const { filteredData, totalCount } = useMemo(() => {
    const now = new Date()
    let startDate: Date
    let endDate = now

    if (timeframe === 'week') {
      startDate = subDays(now, 6)
    } else if (timeframe === 'month') {
      startDate = startOfMonth(now)
      endDate = endOfMonth(now)
    } else {
      startDate = startOfYear(now)
    }

    const filtered = dcwrs.filter(d => {
      try {
        const dDate = parseISO(d.date)
        return isWithinInterval(dDate, { start: startDate, end: endDate })
      } catch (e) {
        return false
      }
    })

    const statusCounts = {
      Pending: filtered.filter(d => d.status === 'Pending').length,
      Partial: filtered.filter(d => d.status === 'Partial').length,
      Verified: filtered.filter(d => d.status === 'Verified').length,
    }

    return {
      totalCount: filtered.length,
      filteredData: [
        { name: 'Pending', value: statusCounts.Pending, color: '#ef4444' },
        { name: 'Partial', value: statusCounts.Partial, color: '#f59e0b' },
        { name: 'Verified', value: statusCounts.Verified, color: '#22c55e' },
      ].filter(item => item.value > 0)
    }
  }, [dcwrs, timeframe])

  return (
    <div className='flex flex-col space-y-4'>
      <div className='flex items-center justify-end px-2'>
        <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as any)} className='w-[300px]'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='week'>Week</TabsTrigger>
            <TabsTrigger value='month'>Month</TabsTrigger>
            <TabsTrigger value='year'>Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className='relative h-[350px] w-full'>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={filteredData}
              cx='50%'
              cy='50%'
              innerRadius={80}
              outerRadius={105}
              paddingAngle={8}
              dataKey='value'
              stroke='none'
              animationBegin={0}
              animationDuration={1500}
            >
              {filteredData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  className='hover:opacity-80 transition-opacity cursor-pointer'
                />
              ))}
            </Pie>
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className='rounded-lg border bg-card p-3 shadow-md border-foreground/20'>
                      <div className='flex items-center space-x-2'>
                          <div className='h-2 w-2 rounded-full' style={{ backgroundColor: payload[0].payload.color }} />
                          <span className='font-bold text-sm'>{payload[0].name}</span>
                      </div>
                      <p className='text-xs text-muted-foreground mt-1'>
                        Count: <span className='font-mono font-medium text-foreground'>{payload[0].value}</span>
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Legend 
              verticalAlign='bottom' 
              align='center'
              iconType='circle'
              wrapperStyle={{ paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none' style={{ marginBottom: '36px' }}>
          <span className='text-4xl font-extrabold tracking-tighter'>{totalCount}</span>
          <span className='text-[10px] uppercase tracking-widest text-muted-foreground font-medium'>Claims</span>
        </div>
      </div>
    </div>
  )
}
