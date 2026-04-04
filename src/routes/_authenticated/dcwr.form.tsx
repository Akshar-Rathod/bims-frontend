import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DCWRForm } from '@/features/dcwr/components/dcwr-form'

export const Route = createFileRoute('/_authenticated/dcwr/form')({
  component: () => (
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
          <h2 className='text-2xl font-bold tracking-tight'>DCWR Form</h2>
          <p className='text-muted-foreground'>
            Create a new Warranty Battery DCWR record.
          </p>
        </div>
        <DCWRForm />
      </Main>
    </>
  ),
})
