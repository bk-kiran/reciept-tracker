import {createAgent, createTool} from "@inngest/agent-kit";
import { anthropic, openai } from "inngest";
import { z } from "zod";

const parsePdfTool = createTool({
    name: "parsePdf",
    description: "Parses a PDF file and extracts key information such as vendor names, dates, amounts, and line items.",
    parameters: z.object({
        pdfUrl: z.string()
    }),
    handler: async ({pdfUrl}, {step}) => {
        try {
            return await step?.ai.infer("parse-pdf", {
                model: anthropic({
                    model: "claude-3-5-sonnet-20241022",
                    defaultParameters: {
                        max_tokens: 3094,
                    }
                }),
                body:{
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "document",
                                    source: {
                                        type: "url",
                                        url: pdfUrl,
                                    }
                                },
    
                                {
                                    type: "text",
                                    text: `Extract the data from the receipt and return it in a structured output as follows:
                                    {
                                        "merchant": {
                                            "name": "Store Name",
                                            "address": "Store Address",
                                            "contact": "+123456789",
                                        },
    
                                        "transaction": {
                                            "date": "YYYY-MM-DD",
                                            "receiptnumber": "ABC123456",
                                            "payment_method": "Credit Card",
                                        },
    
                                        "items": [
                                            {
                                                "name": "Item 1",
                                                "quantity": 2,
                                                "unit_price": 10.00,
                                                "total_price": 20.00,
                                            },
                                            {
                                                "name": "Item 2",
                                                "quantity": 1,
                                                "unit_price": 15.00,
                                                "total_price": 15.00,
                                            }
                                        ],
    
                                        "totals": {
                                            "subtotal": 20.00,
                                            "taxes": 2.00,
                                            "total": 22.00,
                                            "currency": "USD",
                                        }
                                    }
    
                                    The data should be extracted from the receipt and returned in the same language as the receipt.
                                    If the receipt is not in English, please translate it to English before extracting the data.
                                    `
                                }
                            ]
                        }
                    ],
                }
            })
        } catch (error) {
            console.error(error);
            return {
                error: "Failed to parse PDF",
            }
        }
    }
})

export const receiptScanningAgent = createAgent({
    name: "Receipt Scanning Agent",
    description: "Processes a receipt image and PDFS to extract key information such as vendor names, dates, amounts, and line items.",
    system: `You are an AI-powered receipt scanning assistant. Your primary role is to accurately extract and structure relevant information from scanned receipts. Your task includes recognizing and parsing details such as:
    1. Merchant Information: Store name, address, contact details
    2. Transaction Details: Date, time, receipt number, payment method
    3. Itemized Purchases: Product names, quantities, individual prices, discounts
    4. Total Amount: Subtotal, taxes, total paid, and any applied discounts
    5. Ensure high accuracy by detecting OCR errors and correcting misread text when possible.
    6. Normalize dates, currency values, and formatting for consistency
    7. If any key details are missing or unclear, return a structured response indicating incomplete data.
    8. Handle multiple formats, languages and varying receipt layouts efficiently.
    9. Maintain a structured JSON output for easy integration with databases or expense tracking systems.
    `,
    model: openai({
        model: "gpt-4o-mini",
        defaultParameters: {
            max_completion_tokens: 3094,
        }
    }) as any,
    tools: [parsePdfTool]
})