"use server";

import { currentUser } from "@clerk/nextjs/server";
import { api } from "@/convex/_generated/api";
import convex from "@/lib/ConvexClient";
import { getFileDownloadUrl } from "./getFileDownloadUrl";
import { inngest } from "@/inngest/client";
import Events from "@/inngest/agents/constants";


export async function uploadPDF(formData: FormData) {
    const user = await currentUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const file = formData.get("file") as File;

        if (!file) {
            return { success: false, error: "No file provided" };
        }

        if (
            !file.type.includes("pdf") &&
            !file.name.toLowerCase().endsWith(".pdf")
        ) {
            return { success: false, error: "Invalid file type - only PDF files are allowed" };
        }

        const uploadUrl = await convex.mutation(api.receipts.gernerateUploadedUrl, {});

        const arrayBuffer = await file.arrayBuffer();
        
        const uploadResponse = await fetch(uploadUrl, {
            method: "POST",
            headers: {
                "Content-Type": file.type,
            },
            body: new Uint8Array(arrayBuffer),
        });

        if (!uploadResponse.ok) {
            return { success: false, error: "Failed to upload PDF" };
        }

        const responseText = await uploadResponse.text();
        let responseData;
        
        try {
            responseData = JSON.parse(responseText);
        } catch {
            // If response is not JSON, it might be just the storageId as a string
            const storageId = responseText.trim();
            if (storageId) {
                responseData = { storageId };
            } else {
                return { success: false, error: "Invalid response from upload URL" };
            }
        }

        const storageId = responseData.storageId || responseData.storageid;

        if (!storageId) {
            console.error("Upload response data:", responseData);
            return { success: false, error: "Failed to get storage ID from upload response" };
        }

        const receiptId = await convex.mutation(api.receipts.storeReceipt, {
            userId: user.id,
            fileId: storageId,
            fileName: file.name,
            size: file.size,
            mimetype: file.type,
        });

        const fileUrl = await getFileDownloadUrl(storageId);

        await inngest.send({
            name: Events.EXTRACT_DATA_AND_SAVE_TO_DATABASE,
            data: {
                url: fileUrl.downloadUrl,
                receiptId,
            }
        })

        return {
            success: true,
            receiptId,
            fileName: file.name,
        }
    } catch (error) {
        console.error(error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to upload PDF",
        }

    }

}