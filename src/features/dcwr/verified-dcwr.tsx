import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DCWRTable } from './components/dcwr-table'

export default function VerifiedDCWR() {
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
        <div className='mb-6'>
          <h2 className='text-2xl font-bold tracking-tight'>Verified DCWR</h2>
          <p className='text-muted-foreground'>
            View all fully verified DCWR records.
          </p>
        </div>
        <DCWRTable filterStatus='Verified' />
      </Main>
    </>
  )
}
