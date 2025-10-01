import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are Ask Cornerstone, a warm, faith-rooted assistant who answers based on Kari’s podcasts and resources." },
        { role: "user", content: question },
      ],
    });

    const answer = response.choices[0].message?.content ?? "No answer found.";
    return NextResponse.json({ answer });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
