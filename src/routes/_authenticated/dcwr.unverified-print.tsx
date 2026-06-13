import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useDCWR } from '@/hooks/use-dcwr'
import { Button } from '@/components/ui/button'
import { Printer, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/dcwr/unverified-print')({
  component: UnverifiedDCWRPrintPage,
})

function UnverifiedDCWRPrintPage() {
  const { dcwrs, isLoading } = useDCWR()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50 text-black'>
        <p className='text-lg font-medium animate-pulse'>Loading print data...</p>
      </div>
    )
  }

  const unverifiedList = dcwrs.filter((d) => d.status !== 'Verified')

  // Calculate total items across all unverified DCWRs
  const totalItemsCount = unverifiedList.reduce(
    (acc, dcwr) => acc + dcwr.items.length,
    0
  )

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col items-center py-8 print:py-0 print:bg-white text-black font-sans'>
      {/* Back & Print Controls Panel - Hidden on Print */}
      <div className='w-full max-w-[210mm] mb-6 flex justify-between items-center px-4 print:hidden'>
        <Button
          variant='outline'
          onClick={() => navigate({ to: '/dcwr/unverified' })}
          className='bg-white border-gray-300 hover:bg-gray-100 text-gray-700'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to list
        </Button>
        <Button
          onClick={() => window.print()}
          className='bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition-all'
        >
          <Printer className='mr-2 h-4 w-4' />
          Print Report
        </Button>
      </div>

      {/* Main Printable Sheet - Sized to Standard A4 width */}
      <div className='w-full max-w-[210mm] mx-auto bg-white p-8 border border-gray-200 rounded-lg shadow-sm print:shadow-none print:border-none print:p-0'>
        {/* Report Header */}
        <div className='flex justify-between items-start border-b border-gray-400 pb-4 mb-6'>
          <div>
            <h1 className='text-2xl font-bold uppercase tracking-tight text-gray-900'>
              Sitaram Enterprise
            </h1>
            <p className='text-xs text-gray-600 uppercase font-semibold mt-0.5'>
              Amaron Pitstop Dealer
            </p>
            <p className='text-xs text-gray-500 mt-1'>
              GST No. 24AADFD8092Q1ZV
            </p>
          </div>
          <div className='text-right'>
            <h2 className='text-lg font-bold text-gray-900 uppercase'>
              Unverified DCWR Report
            </h2>
            <p className='text-xs text-gray-500 mt-1'>Generated on: {currentDate}</p>
            <p className='text-xs text-gray-500 font-medium'>
              Status Filter: <span className='text-red-600 font-bold'>Unverified / Pending</span>
            </p>
          </div>
        </div>

        {/* Report Summary Dashboard */}
        <div className='grid grid-cols-3 gap-4 mb-6 bg-gray-50 border border-gray-200 rounded p-4 print:bg-white print:border-gray-300'>
          <div>
            <p className='text-xs text-gray-500 font-medium uppercase'>Total Unverified DCWRs</p>
            <p className='text-xl font-bold text-gray-800'>{unverifiedList.length}</p>
          </div>
          <div>
            <p className='text-xs text-gray-500 font-medium uppercase'>Total Unique Items</p>
            <p className='text-xl font-bold text-gray-800'>{totalItemsCount}</p>
          </div>
          <div className='text-right'>
            <p className='text-xs text-gray-500 font-medium uppercase'>Print Reference</p>
            <p className='text-xs font-mono font-bold text-gray-700 mt-1'>BIMS-UNV-RPT</p>
          </div>
        </div>

        {/* DCWR Records Details */}
        {unverifiedList.length === 0 ? (
          <div className='text-center py-12 border border-dashed border-gray-300 rounded'>
            <p className='text-gray-500 font-medium'>No unverified DCWR records found.</p>
          </div>
        ) : (
          <div className='space-y-8'>
            {unverifiedList.map((dcwr, index) => (
              <div
                key={dcwr._id}
                className='border border-gray-300 rounded p-4 bg-white break-inside-avoid print:border-gray-400 print:mb-6'
              >
                {/* DCWR Title Row */}
                <div className='flex justify-between items-center border-b border-gray-200 pb-2 mb-3'>
                  <div>
                    <span className='text-xs text-gray-500 font-bold uppercase mr-2'>
                      #{index + 1}
                    </span>
                    <strong className='text-sm text-gray-900'>
                      DCWR No: <span className='underline'>{dcwr.dcwrNo}</span>
                    </strong>
                  </div>
                  <div className='flex items-center space-x-3 text-xs'>
                    <span className='text-gray-600'>
                      Date: <strong>{dcwr.date}</strong>
                    </span>
                    <span className='px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-red-200 bg-red-50 text-red-700 print:bg-transparent print:border-gray-400 print:text-black'>
                      {dcwr.status}
                    </span>
                  </div>
                </div>

                {/* DCWR Items Table */}
                <table className='w-full text-left text-xs border-collapse border border-gray-300'>
                  <thead>
                    <tr className='bg-gray-100 print:bg-gray-100 border-b border-gray-300'>
                      <th className='border border-gray-300 p-2 font-semibold w-12 text-center'>
                        Sr.
                      </th>
                      <th className='border border-gray-300 p-2 font-semibold'>
                        Battery Model
                      </th>
                      <th className='border border-gray-300 p-2 font-semibold w-28'>
                        Battery Type
                      </th>
                      <th className='border border-gray-300 p-2 font-semibold w-24 text-center'>
                        Expected Qty
                      </th>
                      <th className='border border-gray-300 p-2 font-semibold w-24 text-center'>
                        Arrived Qty
                      </th>
                      <th className='border border-gray-300 p-2 font-semibold w-24 text-center'>
                        Discrepancy
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dcwr.items.map((item, idx) => {
                      const discrepancy = item.quantity - (item.arrivedQuantity || 0)
                      return (
                        <tr key={item._id || idx} className='border-b border-gray-300 last:border-0'>
                          <td className='border border-gray-300 p-2 text-center'>{idx + 1}</td>
                          <td className='border border-gray-300 p-2 font-medium'>{item.batteryModel}</td>
                          <td className='border border-gray-300 p-2 text-gray-700'>{item.batteryType}</td>
                          <td className='border border-gray-300 p-2 text-center font-semibold'>{item.quantity}</td>
                          <td className='border border-gray-300 p-2 text-center'>{item.arrivedQuantity || 0}</td>
                          <td className='border border-gray-300 p-2 text-center'>
                            <span className={discrepancy > 0 ? 'text-red-600 font-bold' : 'text-gray-600'}>
                              {discrepancy > 0 ? `-${discrepancy}` : discrepancy}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* Print Signatures */}
        <div className='mt-12 pt-8 border-t border-gray-300 grid grid-cols-2 gap-8 text-xs font-semibold'>
          <div>
            <p className='text-gray-500 mb-12'>Prepared By</p>
            <div className='border-b border-gray-400 w-48'></div>
            <p className='text-gray-700 mt-2'>Signature & Name</p>
          </div>
          <div className='text-right flex flex-col items-end'>
            <p className='text-gray-500 mb-12'>Authorized Sign Seal</p>
            <div className='border-b border-gray-400 w-48'></div>
            <p className='text-gray-700 mt-2'>For, Sitaram Enterprise</p>
          </div>
        </div>
      </div>
    </div>
  )
}
