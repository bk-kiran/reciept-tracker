"use client"

import { Id } from "@/convex/_generated/dataModel"
import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, FileText, Lightbulb, Sparkles } from "lucide-react"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { getFileDownloadUrl } from "@/actions/getFileDownloadUrl"
import { deleteReceipt } from "@/actions/deleteReceipt"



const Receipt = () => {
    const params = useParams<{id: string}>()
    const [receiptId, setReceiptId] = useState<string | null>(null)
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const [isLoadingDownload, setIsLoadingDownload] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const receipt = useQuery(
        api.receipts.getReceiptById,
        receiptId ? {receiptId: receiptId as Id<"receipts">} : "skip",
    )

    const fileId = receipt?.fileId
    const downloadUrl = useQuery(
        api.receipts.getReceiptDownloadUrl,
        fileId ? {receiptId: fileId} : "skip",
    ) 

    const handleDownload = async () => {
        if (!receipt || !receipt._id) return

        try {
            setIsLoadingDownload(true)

            const result = await getFileDownloadUrl(receipt.fileId)

            if (!result.success) {
                throw new Error(result.error || "Failed to get download URL")
            }

            const link = document.createElement("a")
            if (result.downloadUrl) {
                link.href = result.downloadUrl
                link.download = receipt.fileName || "receipt.pdf"
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            } else {
                throw new Error("Download URL not available")
            }

        } catch (error) {
            console.error("Failed to download receipt", error)
            toast.error(error instanceof Error ? error.message : "Failed to download receipt")
        } finally {
            setIsLoadingDownload(false)
        }
    }

    const handleDeleteReceipt = async () => {
        if (!receiptId) return

        if (!showDeleteConfirm) {
            setShowDeleteConfirm(true)
            toast.error("Click Delete again to confirm", {
                action: {
                    label: "Cancel",
                    onClick: () => setShowDeleteConfirm(false)
                },
                duration: 5000,
            })
            return
        }

        try {
            setIsDeleting(true)
            const result = await deleteReceipt(receiptId as Id<"receipts">)
            toast.success("Receipt deleted successfully")
            router.push("/receipts")
        } catch (error) {
            toast.error("Failed to delete receipt")
            console.error(error)
        } finally {
            setIsDeleting(false)
            setShowDeleteConfirm(false)
        }
    }

    useEffect(() => {
        try {
            const id = params.id as Id<"receipts">
            setReceiptId(id)

        } catch (error) {
            console.error("Invalid receipt ID", error)
            router.push("/")
        }
    }, [params.id, router])

    if (receipt === undefined) {
        return (
            <div className="container mx-auto py-10 px-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 dark:border-blue-400 mx-auto mb-4"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading receipt...</p>
            </div>
        )
    }

    if (receipt === null) {
        return (
            <div className="container mx-auto py-10 px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="text-2xl font-bold mb-4">Receipt Not Found</h1>
                    <p className="mb-6">
                        The receipt you&apos;re looking for doesn&apos;t exist or has been removed.
                    </p>
                    <Link href="/receipts" className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Return Home
                    </Link>
                </div>
            </div>
        )
    }

    const hasExtractedData = !! (
        receipt.merchantName||
        receipt.merchantAddress ||
        receipt.transactionDate ||
        receipt.transactionAmount
    )

    const uploadDate = receipt.uploadedAt 
    ? new Date(receipt.uploadedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    })
    : 'N/A'

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <nav className="mb-6">
                    <Link href="/receipts" className="text-blue-500 hover:underline flex items-center">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back to Receipts
                    </Link>
                </nav>

                <div className="bg-white shadow-md rounded-lg overflow-hidden md-6">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6 gap-4">
                            <h1 className="text-2xl font-bold text-gray-900 truncate flex-1 min-w-0">
                                {receipt.fileDisplayName || receipt.fileName}
                            </h1>
                            <div className="flex items-center flex-shrink-0">
                                {receipt.status === "pending" ? (
                                    <div className="mr-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-800"></div>
                                    </div>
                                ) : null}
                                <span className={`px-3 py-1 rounded-full text-sm ${receipt.status === "pending" ? "bg-yellow-100 text-yellow-800"
                                    : receipt.status === "processed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}>
                                    {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        File Information
                                    </h3>
                                    <div className="mt-2 bg-gray-50 p-4 rounded-lg">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500">Uploaded</p>
                                                <p className="font-medium">{uploadDate}</p>
                                            </div>

                                            <div>
                                                <p className="text-gray-500">Size</p>
                                                <p className="font-medium">{formatFileSize(receipt.size)}</p>
                                            </div>

                                            <div>
                                                <p className="text-gray-500">Type</p>
                                                <p className="font-medium">{receipt.mimetype}</p>
                                            </div>

                                            <div>
                                                <p className="text-gray-500">ID</p>
                                                <p className="font-medium truncate">title{receipt._id}
                                                    {receipt._id.slice(0,10)}...
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        
                        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg mt-6">
                            <div className="text-center">
                                <FileText className="h-16 w-16 text-blue-500 mx-auto"/>
                                <p className="mt-4 text-sm text-gray-500">PDF Preview</p>
                                {downloadUrl && (
                                    <a
                                    href={downloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        View PDF
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Extracted Data */}
                        {hasExtractedData && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    Receipt Details
                                </h3>
                                
                                {/*Merchant Details*/}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-gray-700 mb-3">Merchant Information</h4>
                                        <div className="space-y-2">
                                            {receipt.merchantName && (
                                                <div>
                                                    <p className="text-sm text-gray-500">Name</p>
                                                    <p className="font-medium">{receipt.merchantName}</p>
                                                </div>
                                            )}
                                            {receipt.merchantAddress && (
                                                <div>
                                                    <p className="text-sm text-gray-500">Address</p>
                                                    <p className="font-medium">{receipt.merchantAddress}</p>
                                                </div>
                                            )}
                                            {receipt.merchantContact && (
                                                <div>
                                                    <p className="text-sm text-gray-500">Contact</p>
                                                    <p className="font-medium">{receipt.merchantContact}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/*Transaction Details*/}

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-gray-700 mb-3">Transaction Details</h4>
                                        <div className="space-y-2">
                                            {receipt.transactionDate && (
                                                <div>
                                                    <p className="text-sm text-gray-500">Date</p>
                                                    <p className="font-medium">{receipt.transactionDate}</p>
                                                </div>
                                            )}
                                            {receipt.transactionAmount && (
                                                <div>
                                                    <p className="text-sm text-gray-500">Amount</p>
                                                    <p className="font-medium">{receipt.transactionAmount}{" " + receipt.currency || ""}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/*Receipt Summary*/}
                                {receipt.receiptSummary && (
                                    <div className="mt-6 bg-gradient-to-r from blue-50 to indigo-50 p-6 rounded-lg border border-blue-100 shadow-sm">
                                        <div className="flex items-center mb-4">
                                            <h4 className="font-semibold text-blue-700">AI Summary</h4>
                                            <div className="ml-2 flex">
                                                <Sparkles className="h-3.5 w-3.5 text-yellow-500"/>
                                                <Sparkles className="h-3 w-3 text-yellow-400 -ml-1"/>
                                            </div>
                                        </div>

                                        <div className="bg-white bg-opacity-60 rounded-lg p-4 border border-blue-100">
                                            <p className="text-sm whitespace-pre-line leading-relaxed text-gray-700">
                                                {receipt.receiptSummary}
                                            </p>
                                        </div>

                                        <div className="mt-3 text-x3 text-blue-600 italic flex items-center">
                                            <Lightbulb className="h-3 w-3 mr-1"/>
                                            <span>
                                                This summary was generated by AI based on the receipt data.
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/*Items List*/}
                        {receipt.items && receipt.items.length > 0 && (
                            <div className="mt-6">
                                <h4 className="font-medium text-gray-700 mb03">
                                    Items ({receipt.items.length})
                                </h4>

                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Quantity</TableHead>
                                                <TableHead>Unit Price</TableHead>
                                                <TableHead>Total Price</TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {receipt.items.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">{item.name}</TableCell>
                                                    <TableCell>{item.quantity}</TableCell>
                                                    <TableCell>{formatCurrency(item.unitprice, receipt.currency)}</TableCell>
                                                    <TableCell>{formatCurrency(item.totalPrice, receipt.currency)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>

                                        <TableFooter>
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-right">Total</TableCell>
                                                <TableCell className="font-medium">{formatCurrency(receipt.items.reduce(
                                                    (total, item) => total + item.totalPrice, 0), receipt.currency)}
                                                </TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </div>
                            </div>
                        )}

                        {/*Actions*/}
                        <div className="mt-8 border-t pt-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-4">Actions</h3>
                            <div className="flex flex-wrap gap-3">
                                <Button className={`px-4 py-2 bg-white-borderborder-gray-300 rounded text-sm text-gray-700
                                    ${isLoadingDownload
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-gray-50"
                                    }`}
                                    onClick={handleDownload}
                                    disabled={isLoadingDownload || !fileId}
                                    >
                                        {isLoadingDownload ? "Downloading...": "Download PDF"}
                                </Button>

                                <Button className={`px-4 py-2 rounded text-sm ${
                                    isDeleting
                                    ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed" :
                                    "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                                }`}
                                onClick={handleDeleteReceipt}
                                disabled={isDeleting}
                                >
                                    {isDeleting ? "Deleting...": "Delete Receipt"}
                                </Button>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Receipt;

function formatFileSize(size: number) {
    if (size === 0) return "0 Bytes"
    const k = 1024
    const units = ["Bytes", "KB", "MB", "GB", "TB"]
    const index = Math.floor(Math.log(size) / Math.log(1024))
    return parseFloat((size / Math.pow(k, index)).toFixed(2)) + " " + units[index]
}

function formatCurrency(amount: number, currency: string = ""): string {
    return `${amount.toFixed(2)} ${currency ? `${currency}`: ""}`
}

