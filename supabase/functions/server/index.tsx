import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-ef705bb0/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all feedbacks
app.get("/make-server-ef705bb0/feedbacks", async (c) => {
  try {
    const feedbacks = await kv.getByPrefix("feedback:");
    return c.json({ feedbacks: feedbacks || [] });
  } catch (error) {
    console.log(`Error fetching feedbacks: ${error}`);
    return c.json({ error: "Failed to fetch feedbacks", details: String(error) }, 500);
  }
});

// Create new feedback
app.post("/make-server-ef705bb0/feedbacks", async (c) => {
  try {
    const body = await c.req.json();
    const { text, name, isSecret } = body;
    
    if (!text) {
      return c.json({ error: "Text is required" }, 400);
    }

    const feedbackId = `feedback:${Date.now()}:${Math.random().toString(36).substring(7)}`;
    const feedback = {
      id: feedbackId,
      text,
      name: name || undefined,
      isSecret: isSecret || false,
      timestamp: new Date().toISOString(),
    };

    await kv.set(feedbackId, feedback);
    return c.json({ feedback });
  } catch (error) {
    console.log(`Error creating feedback: ${error}`);
    return c.json({ error: "Failed to create feedback", details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);