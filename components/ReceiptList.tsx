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


    return (
        <div className="w-full">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Your Receipts</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {receipts.length} {receipts.length === 1 ? 'receipt' : 'receipts'} total
                </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
                <div className="[&_div[data-slot=table-container]]:!overflow-x-visible [&_div[data-slot=table-container]]:!overflow-visible">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow className="bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <TableHead className="w-[35px] text-center px-1.5">Type</TableHead>
                                <TableHead className="px-1.5 max-w-[180px]">Name</TableHead>
                                <TableHead className="w-[140px] px-1.5">Uploaded</TableHead>
                                <TableHead className="w-[65px] px-1.5">Size</TableHead>
                                <TableHead className="w-[75px] px-1.5">Total</TableHead>
                                <TableHead className="w-[80px] px-1.5">Status</TableHead>
                                <TableHead className="w-[35px] px-1.5 text-right"></TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {receipts.map((receipt: Doc<"receipts">) => (
                                <TableRow 
                                    key={receipt._id}
                                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800"
                                    onClick={() => router.push(`/receipts/${receipt._id}`)}
                                >
                                    <TableCell className="text-center py-3 px-1.5 align-top">
                                        <FileText className="h-5 w-5 text-red-500 dark:text-red-400 mx-auto" />
                                    </TableCell>

                                    <TableCell className="font-medium text-gray-900 dark:text-gray-100 py-3 px-1.5 max-w-[180px] align-top [&]:whitespace-normal">
                                        <div className="break-words text-sm leading-snug line-clamp-2 overflow-hidden text-ellipsis">
                                            {receipt.fileDisplayName || receipt.fileName}
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-gray-600 dark:text-gray-400 text-xs py-3 px-1.5 whitespace-nowrap align-top">
                                        {new Date(receipt.uploadedAt).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                            hour12: false
                                        }).replace(',', ', ')}
                                    </TableCell>

                                    <TableCell className="text-gray-600 dark:text-gray-400 text-xs py-3 px-1.5 whitespace-nowrap align-top">
                                        {formatBytes(receipt.size)}
                                    </TableCell>

                                    <TableCell className="font-medium text-gray-900 dark:text-gray-100 text-xs py-3 px-1.5 whitespace-nowrap align-top">
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

                                    <TableCell className="py-3 px-1.5 align-top">
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap
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

                                    <TableCell className="text-right py-3 px-1.5 align-top">
                                        <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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