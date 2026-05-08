import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

export const GET = async (req: Request) => {
    try {
        return await handler.GET(req);
    } catch (error) {
        console.error("[AUTH API] GET Error:", error);
        throw error;
    }
};

export const POST = async (req: Request) => {
    try {
        // Clone the request to read body for logging
        const clonedReq = req.clone();
        const url = new URL(req.url);
        console.log("[AUTH API] POST to:", url.pathname);
        
        try {
            const body = await clonedReq.json();
            console.log("[AUTH API] POST body keys:", Object.keys(body));
        } catch {}

        return await handler.POST(req);
    } catch (error) {
        console.error("[AUTH API] POST Error:", error);
        throw error;
    }
};
