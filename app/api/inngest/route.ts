import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { extractAndSaveReceipts } from "@/inngest/agent";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    extractAndSaveReceipts
  ],
});