import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function GlobalLoader() {
  const isFetching = useIsFetching()
  const isMutating = useIsMutating()

  const isLoading = isFetching > 0 || isMutating > 0

  if (!isLoading) return null

  return (
    <div className={cn(
      'fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm transition-all duration-300',
      'animate-in fade-in'
    )}>
      <div className='flex flex-col items-center space-y-4 rounded-xl bg-card p-8 shadow-2xl border'>
        <Loader2 className='h-12 w-12 animate-spin text-primary' />
        <div className='flex flex-col items-center space-y-1'>
          <h3 className='text-xl font-bold tracking-tight text-foreground'>BIMS</h3>
          <p className='text-sm text-muted-foreground animate-pulse'>
            Processing data...
          </p>
        </div>
      </div>
    </div>
  )
}
