import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const gernerateUploadedUrl = mutation({
    args: {},
    handler: async (ctx, args) => {
        return await ctx.storage.generateUploadUrl();
    }
})

export const storeReceipt = mutation({
    args: {
        userId: v.string(),
        fileId: v.id("_storage"),
        fileName: v.string(),
        size: v.number(),
        mimetype: v.string(),
    },
    handler: async (ctx, args) => {
        const receiptId = await ctx.db.insert("receipts", {
            userId: args.userId,
            fileName: args.fileName,
            fileId: args.fileId,
            uploadedAt: Date.now(),
            size: args.size,
            mimetype: args.mimetype,
            status: "pending",

            merchantName: undefined,
            merchantAddress: undefined,
            merchantContact: undefined,
            transactionDate: undefined,
            transactionAmount: undefined,
            currency: undefined,
            receiptSummary: undefined,
            items: [],
        });

        return receiptId;
    }
})

export const getReceipts = query({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.query("receipts").filter((q) => q.eq(q.field("userId"), args.userId)).order("desc").collect();
    }
})

export const getReceiptById = query({
    args: {
        receiptId: v.id("receipts"),
    },
    handler: async (ctx, args) => {
        const receipt = await ctx.db.get(args.receiptId);

        if (receipt) {
            const identity = await ctx.auth.getUserIdentity();

            if (!identity) {
                throw new Error("Unauthorized");
            }
        }

        return receipt;
    }
})

export const getReceiptDownloadUrl = query({
    args: {
        receiptId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.receiptId);
    }
})

export const updateReceiptStatus = mutation({
    args: {
        receiptId: v.id("receipts"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        const receipt = await ctx.db.get(args.receiptId);
        if (!receipt) {
            throw new Error("Receipt not found");
        }

        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Not Authenticated");
        }

        if (receipt.userId !== identity.subject) {
            throw new Error("Unauthorized");
        }

        await ctx.db.patch(args.receiptId, { status: args.status });

        return true;
    }
})

export const deleteReceipt = mutation({
    args: {
        receiptId: v.id("receipts"),
    },
    handler: async (ctx, args) => {
        const receipt = await ctx.db.get(args.receiptId);

        if (!receipt) {
            throw new Error("Receipt not found");
        }

        await ctx.storage.delete(receipt.fileId);

        await ctx.db.delete(args.receiptId);

        return true;
    }
})

export const updateReceiptWithExtractedData = mutation({
    args: {
        receiptId: v.id("receipts"),
        extractedData: v.object({
            merchantName: v.optional(v.string()),
            merchantAddress: v.optional(v.string()),
            merchantContact: v.optional(v.string()),
            transactionDate: v.optional(v.string()),
            transactionAmount: v.optional(v.string()),
            currency: v.optional(v.string()),
            receiptSummary: v.optional(v.string()),
            items: v.array(v.object({
                name: v.string(),
                quantity: v.number(),
                unitprice: v.number(),
                totalPrice: v.number(),
            })),
        }),
    },
    handler: async (ctx, args) => {
        const receipt = await ctx.db.get(args.receiptId);

        if (!receipt) {
            throw new Error("Receipt not found");
        }

        await ctx.db.patch(args.receiptId, {
            fileDisplayName: args.extractedData.merchantName,
            merchantName: args.extractedData.merchantName,
            merchantAddress: args.extractedData.merchantAddress,
            merchantContact: args.extractedData.merchantContact,
            transactionDate: args.extractedData.transactionDate,
            transactionAmount: args.extractedData.transactionAmount,
            currency: args.extractedData.currency,
            receiptSummary: args.extractedData.receiptSummary,
            items: args.extractedData.items,
            status: "processed",
        });

        return {
            userId: receipt.userId
        };
    }
})