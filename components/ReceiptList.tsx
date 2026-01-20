"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Doc } from "@/convex/_generated/dataModel"
import { useRouter } from "next/navigation"
import { ChevronRight, FileText } from "lucide-react"


const ReceiptList = () => {
    const { user } = useUser()
    const receipts = useQuery(api.receipts.getReceipts, {
        userId: user?.id || "",
    })
    
    const router = useRouter()

    if (!user) {
        return (
            <div className="w-full">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Your Receipts</h2>
                </div>
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-12 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Please sign in to view your receipts</p>
                </div>
            </div>
        )
    }

    if (!receipts) {
        return (
            <div className="w-full">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Your Receipts</h2>
                </div>
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-12 text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 dark:border-blue-400 mx-auto mb-4"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Loading receipts...</p>
                </div>
            </div>
        )
    }

    if (receipts.length === 0) {
        return (
            <div className="w-full">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Your Receipts</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">0 receipts total</p>
                </div>
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-12 text-center">
                    <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">No receipts found</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Upload your first receipt to get started</p>
                </div>
            </div>
        )
    }


    const formatCompactDate = (timestamp: number) => {
        const date = new Date(timestamp)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })
    }

    return (
        <div className="w-full">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Your Receipts</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {receipts.length} {receipts.length === 1 ? 'receipt' : 'receipts'} total
                </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
                <div className="flex justify-center overflow-x-auto md:overflow-x-visible">
                    <div className="w-[95%] max-w-full">
                        <Table className="w-full" style={{ tableLayout: 'fixed' }}>
                            <colgroup>
                                <col style={{ width: '5%' }} />
                                <col style={{ width: '28%' }} />
                                <col style={{ width: '12%' }} />
                                <col style={{ width: '8%' }} />
                                <col style={{ width: '10%' }} />
                                <col style={{ width: '12%' }} />
                                <col style={{ width: '5%' }} />
                            </colgroup>
                            <TableHeader>
                                <TableRow className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                                    <TableHead className="text-center px-3 text-sm font-semibold">Type</TableHead>
                                    <TableHead className="text-left px-3 text-sm font-semibold">Name</TableHead>
                                    <TableHead className="hidden sm:table-cell px-3 text-sm font-semibold">Uploaded</TableHead>
                                    <TableHead className="text-right px-3 text-sm font-semibold">Size</TableHead>
                                    <TableHead className="text-right px-3 text-sm font-semibold">Total</TableHead>
                                    <TableHead className="text-center px-3 text-sm font-semibold">Status</TableHead>
                                    <TableHead className="text-right px-3"> </TableHead>
                                </TableRow>
                            </TableHeader>

                        <TableBody>
                            {receipts.map((receipt: Doc<"receipts">, index: number) => {
                                const fileName = receipt.fileDisplayName || receipt.fileName
                                return (
                                    <TableRow 
                                        key={receipt._id}
                                        className={`cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-800 ${
                                            index % 2 === 0 
                                                ? "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50" 
                                                : "bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800/70"
                                        }`}
                                        onClick={() => router.push(`/receipt/${receipt._id}`)}
                                    >
                                        <TableCell className="text-center px-3 py-3 overflow-hidden">
                                            <FileText className="h-4 w-4 text-red-500 dark:text-red-400 mx-auto flex-shrink-0" />
                                        </TableCell>

                                        <TableCell className="font-medium text-gray-900 dark:text-gray-100 px-3 py-3 overflow-hidden">
                                            <div 
                                                className="truncate text-sm"
                                                title={fileName}
                                                style={{ maxWidth: '100%' }}
                                            >
                                                {fileName}
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-gray-600 dark:text-gray-400 text-xs whitespace-nowrap px-3 py-3 overflow-hidden hidden sm:table-cell">
                                            {formatCompactDate(receipt.uploadedAt)}
                                        </TableCell>

                                        <TableCell className="text-gray-600 dark:text-gray-400 text-xs whitespace-nowrap text-right px-3 py-3 overflow-hidden">
                                            {formatBytes(receipt.size)}
                                        </TableCell>

                                        <TableCell className="font-medium text-gray-900 dark:text-gray-100 text-xs whitespace-nowrap text-right px-3 py-3 overflow-hidden">
                                            {receipt.transactionAmount ? (
                                                <span>
                                                    {receipt.currency && receipt.currency !== 'USD' ? receipt.currency : ''}
                                                    {receipt.transactionAmount}
                                                    {!receipt.currency || receipt.currency === 'USD' ? ' USD' : ''}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 dark:text-gray-500">-</span>
                                            )}
                                        </TableCell>

                                        <TableCell className="text-center px-3 py-3 overflow-visible">
                                            <span
                                                className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap
                                                ${
                                                    receipt.status === "pending" 
                                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                                                    receipt.status === "processed" 
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                                                        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" 
                                                }`}
                                            >
                                                {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
                                            </span>
                                        </TableCell>

                                        <TableCell className="text-right px-3 py-3 overflow-visible">
                                            <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReceiptList

const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const units = ["Bytes", "KB", "MB", "GB", "TB"]
    const index = Math.floor(Math.log(bytes) / Math.log(1024))
    return parseFloat((bytes / Math.pow(k, index)).toFixed(2)) + " " + units[index]
}