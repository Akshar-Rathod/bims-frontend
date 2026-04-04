import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { useAdvanceSells } from '@/hooks/use-advance-sells'
import { useMemo, useState } from 'react'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  isWithinInterval, 
  eachDayOfInterval,
  subDays,
  parseISO
} from 'date-fns'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function AdvanceSellsChart() {
  const { advanceSells } = useAdvanceSells()
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week')

  const data = useMemo(() => {
    const now = new Date()
    let startDate: Date
    let endDate = now
    let groupingFormat: string
    let interval: Date[] = []

    if (timeframe === 'week') {
      startDate = subDays(now, 6) // Last 7 days including today
      groupingFormat = 'eee'
      interval = eachDayOfInterval({ start: startDate, end: endDate })
    } else if (timeframe === 'month') {
      startDate = startOfMonth(now)
      endDate = endOfMonth(now)
      groupingFormat = 'd MMM'
      interval = eachDayOfInterval({ start: startDate, end: endDate })
    } else {
      startDate = startOfYear(now)
      groupingFormat = 'MMM'
      // For year, we group by month
      const monthData: Record<string, number> = {}
      for (let i = 0; i < 12; i++) {
        monthData[format(new Date(now.getFullYear(), i, 1), 'MMM')] = 0
      }

      advanceSells.forEach(sell => {
        const sellDate = parseISO(sell.date)
        if (sellDate.getFullYear() === now.getFullYear()) {
          const month = format(sellDate, 'MMM')
          monthData[month] = (monthData[month] || 0) + 1
        }
      })

      return Object.entries(monthData).map(([name, total]) => ({ name, total }))
    }

    // Process Day-based intervals (Week/Month)
    const counts: Record<string, number> = {}
    interval.forEach(d => {
      counts[format(d, groupingFormat)] = 0
    })

    advanceSells.forEach(sell => {
      try {
        const sellDate = parseISO(sell.date)
        if (isWithinInterval(sellDate, { start: startDate, end: endDate })) {
          const label = format(sellDate, groupingFormat)
          if (counts[label] !== undefined) {
            counts[label] += 1
          }
        }
      } catch (e) {
        // Skip invalid dates
      }
    })

    return Object.entries(counts).map(([name, total]) => ({ name, total }))
  }, [advanceSells, timeframe])

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-end px-2'>
        <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as any)} className='w-[300px]'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='week'>Week</TabsTrigger>
            <TabsTrigger value='month'>Month</TabsTrigger>
            <TabsTrigger value='year'>Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ResponsiveContainer width='100%' height={350}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id='salesGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor='currentColor' stopOpacity={1} />
              <stop offset='100%' stopColor='currentColor' stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray='3 3' vertical={false} strokeOpacity={0.1} />
          <XAxis
            dataKey='name'
            stroke='#888888'
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
            interval={timeframe === 'month' ? 4 : 0} // Scale down for month view
          />
          <YAxis
            stroke='#888888'
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            dx={-10}
          />
          <Tooltip 
            cursor={{ fill: 'currentColor', opacity: 0.1 }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className='rounded-lg border bg-card p-3 shadow-md border-foreground/20'>
                    <p className='text-xs font-bold text-foreground uppercase tracking-wider mb-1'>{label}</p>
                    <div className='flex items-baseline space-x-2'>
                      <span className='text-2xl font-bold text-foreground'>{payload[0].value}</span>
                      <span className='text-xs text-muted-foreground'>Units</span>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar
            dataKey='total'
            fill='url(#salesGradient)'
            radius={[6, 6, 0, 0]}
            barSize={timeframe === 'month' ? 15 : 40}
            animationDuration={2000}
            className='text-foreground'
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
