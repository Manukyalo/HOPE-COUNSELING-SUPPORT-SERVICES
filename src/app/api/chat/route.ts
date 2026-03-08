import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "dummy_key_for_build");

const SYSTEM_INSTRUCTION = `You are Amaya, a warm, professional, and deeply empathetic personal assistant for "Hope Counseling Support Services". Your goal is to provide a safe, non-judgmental space for users to express themselves.
- Converse naturally, like a compassionate human listener. Avoid sounding robotic or overly formal.
- Validate the user's feelings and show genuine care.
- Do not provide medical diagnoses, prescribe medication, or act as a replacement for professional therapy.
- If a user expresses thoughts of self-harm or is in immediate danger, gently but firmly encourage them to contact emergency services or a crisis hotline immediately.
- Keep your responses concise and conversational.
- You can help guide them to resources: Location (Thika), Contact (0701279231), Services (Stress/Anxiety, Relationship, Youth, Academic, Peer Support).
- Session length is 45 minutes. Booking can be done via the site's booking section.`;

export async function POST(req: NextRequest) {
    try {
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
            console.error("API Error: GEMINI_API_KEY is missing or using placeholder.");
            return NextResponse.json(
                { error: "Configuration Error", details: "Gemini API key is not configured in environment variables." },
                { status: 500 }
            );
        }

        const { message, history } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: SYSTEM_INSTRUCTION,
        });

        const chat = model.startChat({
            history: history || [],
            generationConfig: {
                temperature: 0.7,
            },
        });

        const result = await chat.sendMessageStream(message);

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.stream) {
                        const chunkText = chunk.text();
                        if (chunkText) {
                            controller.enqueue(encoder.encode(chunkText));
                        }
                    }
                    controller.close();
                } catch (e) {
                    controller.error(e);
                }
            },
        });

        return new Response(stream, {
            headers: { "Content-Type": "text/plain; charset=utf-8" },
        });

    } catch (error: any) {
        console.error("API Chat Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}
