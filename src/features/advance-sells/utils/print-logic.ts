import { AdvanceSell } from '@/hooks/use-advance-sells'
import { showAlert } from '@/lib/swal'

export function handlePrintSelected(selectedSells: AdvanceSell[]) {
  if (selectedSells.length === 0) {
    showAlert.warning('Please select at least one record to print!')
    return
  }

  const sideOneArr: string[] = []
  const sideTwoArr: string[] = []
  const maxInvoicesPerSide = 3
  let sideOneInvoiceCount = 0
  let sideTwoInvoiceCount = 0
  let sideOneBarLimit = 42
  let sideTwoBarLimit = 42
  let sideOneTotalBarcodes = 0
  let sideTwoTotalBarcodes = 0

  for (const sell of selectedSells) {
    const adsellId = sell._id
    const barcount = sell.items.length

    // Adjust barcode limits dynamically based on invoice count
    if (sideOneInvoiceCount === 1) sideOneBarLimit = 26
    if (sideOneInvoiceCount === 2) sideOneBarLimit = 14
    if (sideTwoInvoiceCount === 1) sideTwoBarLimit = 26
    if (sideTwoInvoiceCount === 2) sideTwoBarLimit = 14

    // Allocate to Side One if limits allow
    if (
      sideOneInvoiceCount < maxInvoicesPerSide &&
      sideOneTotalBarcodes + barcount <= sideOneBarLimit
    ) {
      sideOneArr.push(adsellId)
      sideOneTotalBarcodes += barcount
      sideOneInvoiceCount++
    }
    // Allocate to Side Two if limits allow
    else if (
      sideTwoInvoiceCount < maxInvoicesPerSide &&
      sideTwoTotalBarcodes + barcount <= sideTwoBarLimit
    ) {
      sideTwoArr.push(adsellId)
      sideTwoTotalBarcodes += barcount
      sideTwoInvoiceCount++
    }
    // If neither side can accommodate, show warning
    else {
      showAlert.warning(
        'Invoice limit exceeded',
        'Invoice limit exceeded or barcode count exceeds the limit for a single page side. Please reduce your selection and print in smaller batches.'
      )
      return // Stop further processing
    }
  }

  const oneSideIds = sideOneArr.join('_')
  const secondSideIds = sideTwoArr.join('_')
  const redirectUrl = `/advance-sells-print?oneside=${encodeURIComponent(oneSideIds)}&secondside=${encodeURIComponent(secondSideIds)}`
  
  // Open in a new tab so user doesn't lose their place in the table
  window.open(redirectUrl, '_blank')
}
