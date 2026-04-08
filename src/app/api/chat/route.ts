import { anthropic } from '@ai-sdk/anthropic';
import { streamText, tool as aiTool } from 'ai';
import { z } from 'zod';
import { safeSpaceAgent } from '@/lib/agent';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // In a real environment, @21st-sdk/agent definitions might be parsed directly.
  // Here we adapt the agent config to the standard Vercel AI SDK format.
  
  const result = await streamText({
    model: anthropic(safeSpaceAgent.model as string || 'claude-3-5-sonnet-20240620'),
    system: typeof safeSpaceAgent.systemPrompt === 'string' 
        ? safeSpaceAgent.systemPrompt 
        : safeSpaceAgent.systemPrompt?.preset || "You are a helpful assistant.",
    messages,
    tools: {
      triggerBreathingExercise: aiTool({
        description: safeSpaceAgent.tools.triggerBreathingExercise.description,
        parameters: safeSpaceAgent.tools.triggerBreathingExercise.inputSchema,
        // @ts-ignore
        execute: async (args: any) => {
          // Returning this tells the UI to render the breathing exercise
          return {
            triggered: true,
            ui: 'BREATHING_WIDGET',
            message: args.message
          };
        },
      }),
      suggestService: aiTool({
        description: safeSpaceAgent.tools.suggestService.description,
        parameters: safeSpaceAgent.tools.suggestService.inputSchema,
        // @ts-ignore
        execute: async (args: any) => {
          return {
            ui: 'SERVICE_CARD',
            service: args.serviceName,
            reason: args.reason
          };
        },
      }),
      triggerEmergencyProtocol: aiTool({
        description: safeSpaceAgent.tools.triggerEmergencyProtocol.description,
        parameters: safeSpaceAgent.tools.triggerEmergencyProtocol.inputSchema,
        // @ts-ignore
        execute: async (args: any) => {
          return {
            ui: 'EMERGENCY_MODAL',
            reason: args.reason
          };
        },
      }),
    },
  });

  // @ts-ignore
  return typeof result.toDataStreamResponse === 'function' ? result.toDataStreamResponse() : result.toTextStreamResponse();
}
