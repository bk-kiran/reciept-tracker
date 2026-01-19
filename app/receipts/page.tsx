import PDFDropZone from '@/components/PDFDropZone'
import ReceiptList from '@/components/ReceiptList'

const Receipts = () => {
  return (
    <div className='container py-10 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl'>
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-10'>
            <PDFDropZone />
            <ReceiptList />
        </div>
    </div>
  )
}

export default Receipts