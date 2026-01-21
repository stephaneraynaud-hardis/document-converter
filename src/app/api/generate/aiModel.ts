import { anthropic } from "@ai-sdk/anthropic";
export default anthropic(process.env.AI_MODEL || "claude-sonnet-4-5");
