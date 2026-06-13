import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'
import { DCWRTable } from './components/dcwr-table'

export default function UnverifiedDCWR() {
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
        <div className='mb-6 flex flex-col justify-between gap-y-2 sm:flex-row sm:items-center'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Unverified DCWR</h2>
            <p className='text-muted-foreground'>
              Manage and verify pending or partially arrived DCWR records.
            </p>
          </div>
          <Button
            onClick={() => window.open('/dcwr/unverified-print', '_blank')}
            className='space-x-1.5 self-start sm:self-auto'
          >
            <Printer className='h-4 w-4' />
            <span>Print Report</span>
          </Button>
        </div>
        <DCWRTable filterStatus='Unverified' />
      </Main>
    </>
  )
}

