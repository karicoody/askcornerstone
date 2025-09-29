import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs"; // allow streaming body
export const maxDuration = 60;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const VECTOR_STORE_NAME = process.env.VECTOR_STORE_NAME || "cih-knowledge";

async function getOrCreateVectorStore(name: string) {
  const stores = await openai.vectorStores.list({ limit: 100 });
  const match = stores.data.find(vs => (vs as any).name === name);
  if (match) return match as any;
  return await openai.vectorStores.create({ name });
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const files = form.getAll("files") as File[];
    if (!files.length) return NextResponse.json({ message: "No files received." }, { status: 400 });

    const store = await getOrCreateVectorStore(VECTOR_STORE_NAME);

    // Convert browser Files to Node streams for upload_and_poll
    const streams = await Promise.all(files.map(async (f) => {
      const buf = Buffer.from(await f.arrayBuffer());
      return { name: f.name, data: buf };
    }));

    // The SDK expects file streams; feed Buffers with file names
    const uploaded = await openai.vectorStores.fileBatches.uploadAndPoll(
      store.id,
      streams.map(s => ({ content: s.data, filename: s.name }))
    );

    return NextResponse.json({ message: `Uploaded. Status: ${uploaded.status}. Added: ${uploaded.file_counts?.completed || 0}` });
  } catch (e:any) {
    return NextResponse.json({ message: e.message || "Upload failed." }, { status: 500 });
  }
}
