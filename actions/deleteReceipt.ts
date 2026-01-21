"use server"

import { api } from "@/convex/_generated/api"
import convex from "@/lib/ConvexClient"
import { Id } from "@/convex/_generated/dataModel"

export async function deleteReceipt(receiptId: Id<"receipts">) {
    try {
        await convex.mutation(api.receipts.deleteReceipt, {
            receiptId: receiptId as Id<"receipts">,
        })

        return {success: true}
    } catch (error) {
        console.error(error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete receipt",
        }
    }
}
