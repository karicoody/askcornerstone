import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  const secret = req.headers.get("x-ingest-secret");
  if (secret !== process.env.INGEST_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await client.beta.vectorStores.fileBatches.create(
      process.env.OPENAI_VECTOR_STORE_ID!,
      { files: [{ source: "google_drive" }] }
    );

    return NextResponse.json({ ok: true, status: "completed", response });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ingest failed" }, { status: 500 });
  }
}
