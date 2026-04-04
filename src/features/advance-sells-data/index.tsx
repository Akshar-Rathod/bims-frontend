import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { AdvanceSellsDataTable } from './components/advance-sells-data-table'
import { UploadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'


export default function AdvanceSellsData() {
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
            <h2 className='text-2xl font-bold tracking-tight'>Advance Sells Data</h2>
            <p className='text-muted-foreground'>
              Manage and view all advanced sales records.
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <Button asChild>
              <Link to='/advance-sells-import'>
                <UploadCloud className='mr-2 h-4 w-4' />
                Import CSV
              </Link>
            </Button>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <AdvanceSellsDataTable />
        </div>
      </Main>
    </>
  )
}
