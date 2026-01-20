import {
    anthropic,
    createNetwork,
    getDefaultRoutingAgent,
} from "@inngest/agent-kit";
import { createServer } from "@inngest/agent-kit/server";
import { inngest } from "./client";
import Events from "./agents/constants";
import { databaseAgent } from "./agents/databaseAgent";
import { receiptScanningAgent } from "./agents/receiptScanningAgent";

const agentNetwork = createNetwork({
    name: "Agent Team",
    agents: [databaseAgent, receiptScanningAgent],
    defaultModel: anthropic({
        model: "claude-sonnet-4-20250514",
        defaultParameters: {
            max_tokens: 1000,
        }
    }),

    defaultRouter: ({network}) => {
        const savedToDatabase = network.state.kv.get("savedToDatabase");

        if (savedToDatabase !== undefined) {
            return undefined;
        }

        return getDefaultRoutingAgent();
    } 

    
})

export const server = createServer({
    agents: [databaseAgent, receiptScanningAgent],
    networks: [agentNetwork],
})

export const extractAndSaveReceipts = inngest.createFunction(
    {id: "Extract Data and Save to Database"},
    {event: Events.EXTRACT_DATA_AND_SAVE_TO_DATABASE},
    async ({event}) => {
        const result = await agentNetwork.run(
            `Extract the data from the receipt: ${event.data.url}. Once the data is extracted, save it to the database using the 
            receiptId: ${event.data.receiptId}. Once the receipt successfully saved to the database you can terminate the agent 
            process.`
        )
        return result.state.kv.get("receipt")

    }

)