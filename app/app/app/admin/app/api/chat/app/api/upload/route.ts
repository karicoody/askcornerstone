export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const VECTOR_STORE_NAME = process.env.VECTOR_STORE_NAME || "cih-knowledge";

const SYSTEM_PROMPT = `
You are Cornerstone Integrative Healing’s assistant.
Voice: warm, faith-rooted, hopeful, practical; plain language; concise when possible.
Guardrails: educational only; do not diagnose or prescribe. Encourage working with the CIH team.
When you use retrieved documents, integrate them and include a short "Sources" list.
`;

async function getVectorStoreIdByName(name: string) {
  const stores = await openai.vectorStores.list({ limit: 100 });
  const match = stores.data.find((vs: any) => vs.name === name);
  if (!match) throw new Error(`Vector store '${name}' not found. Upload files first.`);
  return (match as any).id as string;
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    const vectorStoreId = await getVectorStoreIdByName(VECTOR_STORE_NAME);

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      system: SYSTEM_PROMPT,
      input: message,
      // ✅ Put vector store IDs inside the tool definition
      tools: [
        {
          type: "file_search",
          vector_store_ids: [vectorStoreId],
          // optional knobs:
          // max_results: 8, score_threshold: 0.4
        },
      ],
      tool_choice: "auto",
    });

    const answer = (response as any).output_text || "";

    // Try to collect citations if the SDK returned them
    let sources: { title: string; page?: number }[] = [];
    for (const item of ((response as any).output ?? [])) {
      if (item.type === "tool_result" && item.tool_name === "file_search") {
        const cits = item?.content?.citations || [];
        sources = cits.map((c: any) => ({
          title: c?.file?.filename || "Document",
          page: c?.file?.page_number,
        }));
      }
    }

    return NextResponse.json({ answer, sources });
  } catc
