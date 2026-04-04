import { useState, useRef } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { UploadCloud, Play, FileText, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { useBatteryTypes } from '@/hooks/use-battery-types'
import { useBatteryModels } from '@/hooks/use-battery-models'
import { apiClient } from '@/lib/api-client'
import { cn } from '@/lib/utils'

type ImportLog = {
  row: number
  name: string
  status: 'pending' | 'processing' | 'success' | 'error'
  message?: string
}

export default function AdvanceSellsImport() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [logs, setLogs] = useState<ImportLog[]>([])
  const [progress, setProgress] = useState(0)

  const { batteryTypes } = useBatteryTypes()
  const { batteryModels } = useBatteryModels()

  const typeIdToName = Object.fromEntries(batteryTypes.map(t => [t.id, t.name]))
  const modelIdToName = Object.fromEntries(batteryModels.map(m => [m.id, m.model]))

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setLogs([])
      setProgress(0)
    }
  }

  const startImport = async () => {
    if (!selectedFile) return

    setImporting(true)
    setLogs([])
    setProgress(0)

    try {
      const text = await selectedFile.text()
      const lines = text.split('\n').filter(line => line.trim() !== '')
      
      const parsedData: any[] = []
      for (let i = 0; i < lines.length; i++) {
        const re = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/
        const rowCols = lines[i].split(re).map(c => c.trim())
        const cols = rowCols.map(c => {
          let processed = c.replace(/^"|"$/g, '')
          return processed.replace(/""/g, '"')
        })

        if (cols.length >= 6) {
          if (cols[0].toLowerCase() === 'name' || cols[1].toLowerCase() === 'location') continue
          
          try {
            const itemsJson = cols[5]
            const rawItems = JSON.parse(itemsJson)
            const items = rawItems.map((item: any) => ({
              barcode: item.barcode || item.Barcode || '',
              batteryType: typeIdToName[item.battery_type] || typeIdToName[item.batteryType] || String(item.battery_type || item.batteryType || 'N/A'),
              batteryModel: modelIdToName[item.battery_model] || modelIdToName[item.batteryModel] || String(item.battery_model || item.batteryModel || 'N/A')
            }))

            const billNoVal = cols[4]
            const billNo = (billNoVal && billNoVal.toUpperCase() !== 'NULL') ? billNoVal : ''

            parsedData.push({
              name: cols[0],
              location: cols[1],
              date: cols[2],
              time: cols[3],
              billNo,
              items,
              originalRow: i + 1
            })
          } catch (e) {
            console.error('Line parse error', i, e)
          }
        }
      }

      if (parsedData.length === 0) {
        setImporting(false)
        return
      }

      const initialLogs: ImportLog[] = parsedData.map(d => ({
        row: d.originalRow,
        name: d.name,
        status: 'pending'
      }))
      setLogs(initialLogs)

      for (let i = 0; i < parsedData.length; i++) {
        const entry = parsedData[i]
        
        setLogs(prev => prev.map((log, idx) => idx === i ? { ...log, status: 'processing' } : log))

        try {
          await apiClient.post('/advance-sells', {
            name: entry.name,
            location: entry.location,
            date: entry.date,
            time: entry.time,
            billNo: entry.billNo,
            items: entry.items
          })

          setLogs(prev => prev.map((log, idx) => idx === i ? { ...log, status: 'success', message: 'Imported successfully' } : log))
        } catch (err: any) {
          const errMsg = err.response?.data?.message || err.message
          setLogs(prev => prev.map((log, idx) => idx === i ? { ...log, status: 'error', message: errMsg } : log))
        }

        setProgress(Math.round(((i + 1) / parsedData.length) * 100))
      }

    } catch (err: any) {
      console.error('Import process error', err)
    } finally {
      setImporting(false)
    }
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
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Advance Sells Bulk Import</h2>
            <p className='text-muted-foreground'>
              Upload your CSV file and process it with row-by-row logging.
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          <Card className='lg:col-span-1'>
            <CardHeader>
              <CardTitle className='text-lg'>Source File</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div 
                className={cn(
                  'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors',
                  selectedFile ? 'border-primary/50 bg-primary/5' : 'border-muted'
                )}
              >
                <div className='mb-4 rounded-full bg-primary/10 p-4 text-primary'>
                  <FileText className='h-8 w-8' />
                </div>
                {selectedFile ? (
                  <div className='space-y-1'>
                    <p className='font-medium'>{selectedFile.name}</p>
                    <p className='text-xs text-muted-foreground'>
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                ) : (
                  <p className='text-sm text-muted-foreground'>No file selected</p>
                )}
                
                <input
                  type='file'
                  accept='.csv'
                  className='hidden'
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                
                <Button 
                  variant='outline' 
                  className='mt-4 w-full'
                  onClick={() => fileInputRef.current?.click()}
                  disabled={importing}
                >
                  <UploadCloud className='mr-2 h-4 w-4' />
                  Select CSV
                </Button>
              </div>

              <Button 
                className='w-full' 
                disabled={!selectedFile || importing}
                onClick={startImport}
              >
                {importing ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className='mr-2 h-4 w-4' />
                    Start Import
                  </>
                )}
              </Button>

              {importing && (
                <div className='space-y-2'>
                  <div className='flex justify-between text-xs'>
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className='h-1' />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className='lg:col-span-2'>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle className='text-lg'>Import Logs</CardTitle>
              <div className='text-xs text-muted-foreground'>
                {logs.length > 0 && (
                  <span>
                    Total: {logs.length} | 
                    Success: {logs.filter(l => l.status === 'success').length} | 
                    Errors: {logs.filter(l => l.status === 'error').length}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className='h-[400px] overflow-y-auto rounded-md border bg-slate-50 p-4 dark:bg-slate-950'>
                {logs.length === 0 ? (
                  <div className='flex h-full flex-col items-center justify-center text-muted-foreground'>
                    <FileText className='mb-2 h-10 w-10 opacity-20' />
                    <p className='text-sm'>Start the process to see logs here</p>
                  </div>
                ) : (
                  <div className='space-y-2'>
                    {logs.map((log, index) => (
                      <div 
                        key={index} 
                        className={cn(
                          'flex items-start space-x-3 rounded-md border p-2 text-sm transition-colors',
                          log.status === 'processing' && 'border-primary/50 bg-primary/5',
                          log.status === 'success' && 'border-green-500/50 bg-green-500/10',
                          log.status === 'error' && 'border-destructive/50 bg-destructive/10'
                        )}
                      >
                        <div className='mt-0.5 shrink-0'>
                          {log.status === 'pending' && <div className='h-4 w-4 rounded-full border border-muted' />}
                          {log.status === 'processing' && <Loader2 className='h-4 w-4 animate-spin text-primary' />}
                          {log.status === 'success' && <CheckCircle2 className='h-4 w-4 text-green-500' />}
                          {log.status === 'error' && <XCircle className='h-4 w-4 text-destructive' />}
                        </div>
                        <div className='flex-1 overflow-hidden'>
                          <div className='flex justify-between'>
                            <span className='font-semibold'>Row {log.row}: {log.name}</span>
                            <span className={cn(
                              'text-[10px] font-bold uppercase',
                              log.status === 'success' && 'text-green-600',
                              log.status === 'error' && 'text-destructive',
                              log.status === 'processing' && 'text-primary'
                            )}>
                              {log.status}
                            </span>
                          </div>
                          {log.message && (
                            <p className='mt-1 truncate text-xs text-muted-foreground'>
                              {log.message}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
