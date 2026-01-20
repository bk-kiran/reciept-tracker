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
        <div className="w-full max-w-full">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Your Receipts</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {receipts.length} {receipts.length === 1 ? 'receipt' : 'receipts'} total
                </p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="w-full">
                    <Table className="table-fixed w-full">
                        <colgroup>
                            <col className="w-[6%]" />
                            <col className="w-[32%]" />
                            <col className="w-[20%]" />
                            <col className="w-[12%]" />
                            <col className="w-[14%]" />
                            <col className="w-[13%]" />
                            <col className="w-[3%]" />
                        </colgroup>
                        <TableHeader>
                            <TableRow className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                                <TableHead className="px-2 py-2 text-[11px] font-semibold text-center">Type</TableHead>
                                <TableHead className="px-2 py-2 text-[11px] font-semibold">Name</TableHead>
                                <TableHead className="px-2 py-2 text-[11px] font-semibold text-right">Uploaded</TableHead>
                                <TableHead className="px-2 py-2 text-[11px] font-semibold text-right">Size</TableHead>
                                <TableHead className="px-2 py-2 text-[11px] font-semibold text-right">Total</TableHead>
                                <TableHead className="px-2 py-2 text-[11px] font-semibold text-center">Status</TableHead>
                                <TableHead className="px-1 py-2"></TableHead>
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
                                        <TableCell className="px-2 py-2.5 text-center">
                                            <FileText className="h-3.5 w-3.5 text-red-500 dark:text-red-400 mx-auto" />
                                        </TableCell>

                                        <TableCell className="px-2 py-2.5">
                                            <div 
                                                className="font-medium text-gray-900 dark:text-gray-100 text-[13px] truncate overflow-hidden"
                                                title={fileName}
                                            >
                                                {fileName}
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-2 py-2.5 text-right">
                                            <span className="text-gray-600 dark:text-gray-400 text-[11px] whitespace-nowrap">
                                                {formatCompactDate(receipt.uploadedAt)}
                                            </span>
                                        </TableCell>

                                        <TableCell className="px-2 py-2.5 text-right">
                                            <span className="text-gray-600 dark:text-gray-400 text-[11px] whitespace-nowrap">
                                                {formatBytes(receipt.size)}
                                            </span>
                                        </TableCell>

                                        <TableCell className="px-2 py-2.5 text-right">
                                            <span className="font-medium text-gray-900 dark:text-gray-100 text-[11px] whitespace-nowrap">
                                                {receipt.transactionAmount ? (
                                                    <>
                                                        {receipt.transactionAmount}
                                                    </>
                                                ) : (
                                                    <span className="text-gray-400 dark:text-gray-500">-</span>
                                                )}
                                            </span>
                                        </TableCell>

                                        <TableCell className="px-2 py-2.5 text-center">
                                            <div className="flex justify-center">
                                                <div
                                                    className={`h-2 w-2 rounded-full
                                                    ${
                                                        receipt.status === "pending" 
                                                            ? "bg-yellow-500 dark:bg-yellow-400" :
                                                        receipt.status === "processed" 
                                                            ? "bg-green-500 dark:bg-green-400" :
                                                            "bg-red-500 dark:bg-red-400" 
                                                    }`}
                                                    title={receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
                                                />
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-1 py-2.5">
                                            <ChevronRight className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
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