import { createFileRoute } from '@tanstack/react-router'
import { useAdvanceSells, AdvanceSell } from '@/hooks/use-advance-sells'
import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/advance-sells-print')({
  component: AdvanceSellsPrintPage,
  validateSearch: (search: Record<string, unknown>): { oneside?: string; secondside?: string } => {
    return {
      oneside: search.oneside as string | undefined,
      secondside: search.secondside as string | undefined,
    }
  },
})

function formatModel(model: string): string {
  if (!model || model === 'N/A') return ''
  const parts = model.split('-')
  if (parts.length > 1) {
    return parts[parts.length - 1].trim()
  }
  return model.trim()
}

function InvoiceBlock({ sell }: { sell: AdvanceSell }) {
  return (
    <div className='p-2 border border-black rounded bg-white w-full mb-2 print:border-black break-inside-avoid'>
      <div className='flex justify-between items-center mb-2'>
        <div>
          <h1 className='text-xl font-bold uppercase leading-none mb-0.5'>Amaron</h1>
          <h4 className='text-base font-bold uppercase leading-none'>Pitstop</h4>
        </div>
        <div className='text-right text-sm'>
          <p className='font-bold mb-0.5 uppercase'>Sitaram Enterprice</p>
          <p className='mb-0'>GST No. 24AADFD8092Q1ZV</p>
        </div>
      </div>

      <p className='font-bold text-sm mb-0.5 uppercase'>Advance Sells</p>
      <hr className='border-black mb-1' />

      <div className='flex justify-between text-sm mb-1'>
        <p>To: <strong>{sell.name}</strong></p>
        <p>Date: <strong>{sell.date}</strong></p>
      </div>
      <div className='flex justify-between text-xs mb-0.5'>
        <p>Place: <strong>{sell.location}</strong></p>
        <p>D.C. No.: <strong className='underline'>{sell._id}</strong></p>
      </div>

      <hr className='border-black mb-1' />

      <table className='w-full mb-1 text-xs border-collapse border border-black'>
        <thead className='bg-gray-100 print:bg-gray-100'>
          <tr>
            <th className='border border-black p-1 text-center font-semibold w-12'>Sr.</th>
            <th className='border border-black p-1 text-center font-semibold'>Product Details</th>
            <th className='border border-black p-1 text-center font-semibold w-16'>Qty.</th>
            <th className='border border-black p-1 text-center font-semibold w-12'>Sr.</th>
            <th className='border border-black p-1 text-center font-semibold'>Product Details</th>
            <th className='border border-black p-1 text-center font-semibold w-16'>Qty.</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.ceil(sell.items.length / 2) }).map((_, idx) => {
            const item1 = sell.items[idx * 2]
            const item2 = sell.items[idx * 2 + 1]
            return (
              <tr key={idx}>
                {/* First Column */}
                <td className='border border-black p-1 text-center'>{idx * 2 + 1}</td>
                <td className='border border-black p-1 text-center'>
                  {item1.barcode}
                  {formatModel(item1.batteryModel) && (
                    <><span className='mx-2'>→</span> {formatModel(item1.batteryModel)}</>
                  )}
                </td>
                <td className='border border-black p-1 text-center'>1</td>
                
                {/* Second Column */}
                {item2 ? (
                  <>
                    <td className='border border-black p-1 text-center'>{idx * 2 + 2}</td>
                    <td className='border border-black p-1 text-center'>
                      {item2.barcode}
                      {formatModel(item2.batteryModel) && (
                        <><span className='mx-2'>→</span> {formatModel(item2.batteryModel)}</>
                      )}
                    </td>
                    <td className='border border-black p-1 text-center'>1</td>
                  </>
                ) : (
                  <>
                    <td className='border border-black p-1'></td>
                    <td className='border border-black p-1'></td>
                    <td className='border border-black p-1'></td>
                  </>
                )}
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan={5} className='border border-black p-1 text-right font-semibold'>Total</th>
            <th className='border border-black p-1 text-center font-semibold'>{sell.items.length}</th>
          </tr>
        </tfoot>
      </table>

      <div className='flex justify-between w-full border-t border-black pt-1 mb-1 text-xs font-semibold'>
        <div className='w-1/2'>For, Sitaram Enterprice</div>
        <div className='w-1/2 text-right'>Receiver's Sign & Seal</div>
      </div>
      <div className='mt-1 text-xs font-semibold text-gray-700 italic border-t border-dashed pt-1'>
        Invoice {sell.billNo ? `#${sell.billNo}` : 'Pending ...'}
      </div>
    </div>
  )
}

function AdvanceSellsPrintPage() {
  const search = Route.useSearch() as any
  const oneside = search.oneside as string | undefined
  const secondside = search.secondside as string | undefined
  
  const { advanceSells, isLoading } = useAdvanceSells()

  if (isLoading) {
    return <div className='p-8 text-center'>Loading print data...</div>
  }

  const oneSideList = oneside ? advanceSells.filter(s => oneside.split('_').includes(s._id)) : []
  const secondSideList = secondside ? advanceSells.filter(s => secondside.split('_').includes(s._id)) : []

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col items-center py-8 print:py-0 print:bg-white text-black'>
      <div className='w-full max-w-[210mm] mx-auto bg-white p-8 shadow-sm print:shadow-none print:p-0'>
        
        {/* SIDE 1 */}
        {oneSideList.length > 0 && (
          <div className='w-full'>
            {oneSideList.map(sell => (
              <InvoiceBlock key={sell._id} sell={sell} />
            ))}
          </div>
        )}

        {/* PAGE BREAK BETWEEN SIDES */}
        {oneSideList.length > 0 && secondSideList.length > 0 && (
          <div className='break-before-page w-full h-[1px] print:block'></div>
        )}

        {/* SIDE 2 */}
        {secondSideList.length > 0 && (
          <div className='w-full'>
            {secondSideList.map(sell => (
              <InvoiceBlock key={sell._id} sell={sell} />
            ))}
          </div>
        )}
      </div>

      <div className='fixed bottom-8 right-8 print:hidden'>
        <Button size='lg' onClick={() => window.print()} className='shadow-lg'>
          <Printer className='mr-2 font-medium h-5 w-5' />
          Print Invoices
        </Button>
      </div>
    </div>
  )
}
