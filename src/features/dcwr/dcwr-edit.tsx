import { useParams } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useDCWR } from '@/hooks/use-dcwr'
import { DCWRForm } from './components/dcwr-form'

export default function DCWREdit() {
  const { id } = useParams({ from: '/_authenticated/dcwr/edit/$id' })
  const { dcwrs, isLoading } = useDCWR()
  
  const dcwr = dcwrs.find(d => d._id === id)

  if (isLoading) return <div className='p-8 text-center'>Loading...</div>
  if (!dcwr) return <div className='p-8 text-center'>DCWR not found</div>

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
          <h2 className='text-2xl font-bold tracking-tight'>Edit DCWR</h2>
          <p className='text-muted-foreground'>
            Modify the details of DCWR No: {dcwr.dcwrNo}
          </p>
        </div>
        <DCWRForm initialData={dcwr} isEdit={true} />
      </Main>
    </>
  )
}
