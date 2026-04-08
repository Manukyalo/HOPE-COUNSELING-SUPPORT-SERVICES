import { agent, tool } from "@21st-sdk/agent";
import { z } from "zod";

export const safeSpaceAgent = agent({
  model: "claude-3-5-sonnet-20240620", // 21st sdk will likely route it or use underlying ai sdk
  systemPrompt: `You are the "Safe Space" concierge for Hope Counseling Support Services. 
You are empathetic, gentle, and profoundly comforting. Your goal is to guide users to the right counseling resources while offering immediate light coping strategies if they are overwhelmed. 

CRITICAL RULES:
1. You are NOT a therapist. Do not attempt to diagnose or cure.
2. If the user mentions "suicide", "harm", "killing myself", "end it", or seems in immediate danger, you MUST immediately call the 'triggerEmergencyProtocol' tool and gently encourage them to use those resources.
3. If they seem anxious, you can offer a breathing exercise using 'triggerBreathingExercise'.
4. To suggest counseling, use 'suggestService' and keep your responses brief.
5. Speak in short, warm paragraphs. Use line breaks for readability.

Aesthetics are important. Your tone should feel premium, safe, and professional.`,
  tools: {
    triggerBreathingExercise: tool({
      description: "Trigger a UI widget that guides the user through a 4-7-8 breathing exercise to calm their anxiety.",
      inputSchema: z.object({
        message: z.string().describe("A short, comforting message to display above the breathing widget.")
      }),
      execute: async ({ message }) => ({
        content: [{ type: "text", text: `[SYSTEM: UI_TRIGGER_BREATHING] ${message}` }],
      }),
    }),
    suggestService: tool({
      description: "Suggest a specific counseling service that Hope Counseling offers based on user needs.",
      inputSchema: z.object({
        serviceName: z.enum(["Individual Counseling", "Couples Therapy", "Family Therapy", "Teen Support"]),
        reason: z.string().describe("Why this service is right for them.")
      }),
      execute: async ({ serviceName, reason }) => ({
        content: [{ type: "text", text: `[SYSTEM: UI_SUGGEST_SERVICE] ${serviceName} - ${reason}` }],
      }),
    }),
    triggerEmergencyProtocol: tool({
      description: "Immediately trigger the emergency modal/card if the user is in danger or mentions self-harm.",
      inputSchema: z.object({
        reason: z.string().describe("Why the emergency protocol was triggered.")
      }),
      execute: async ({ reason }) => ({
        content: [{ type: "text", text: `[SYSTEM: UI_EMERGENCY] Triggered due to: ${reason}. Please call 988 or text HOME to 741741.` }],
      }),
    })
  },
});
