import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { BatteryModelsTable } from './components/battery-models-table'
import { Button } from '@/components/ui/button'
import { UploadCloud } from 'lucide-react'
import { useRef } from 'react'
import { useBatteryModels } from '@/hooks/use-battery-models'
import { showAlert } from '@/lib/swal'

export default function BatteryModels() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addBulkBatteryModels } = useBatteryModels()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string
        const lines = text.split('\n').filter(line => line.trim() !== '')
        if (lines.length <= 1) {
          showAlert.error('CSV appears to be empty or properly formatted.')
          return
        }

        // CSV parsing logic:
        // Expected format: "id","battery_type_id","name","price","created_at","updated_at"
        const modelsToImport = []
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.replace(/^"|"$/g, '').trim())
          if (cols.length >= 4) {
            modelsToImport.push({
              id: cols[0],
              batteryType: cols[1],
              model: cols[2],
              price: cols[3]
            })
          }
        }

        if (modelsToImport.length > 0) {
          await addBulkBatteryModels(modelsToImport)
          showAlert.success(`Successfully mapped and imported ${modelsToImport.length} battery models!`)
        }
      } catch (err: any) {
        showAlert.error('Error importing CSV: ' + err.message)
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
    reader.readAsText(file)
  }

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
            <h2 className='text-2xl font-bold tracking-tight'>Battery Models</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of all battery models available in the system.
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
            />
            <Button onClick={() => fileInputRef.current?.click()}>
              <UploadCloud className="mr-2 h-4 w-4" />
              Import CSV
            </Button>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <BatteryModelsTable />
        </div>
      </Main>
    </>
  )
}
