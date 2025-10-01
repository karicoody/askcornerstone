import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Get the file from the request (assuming multipart/form-data)
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Example: convert file to ArrayBuffer (you can later save to DB or storage)
    const bytes = await file.arrayBuffer();
    console.log("File uploaded:", file.name, "size:", bytes.byteLength);

    return NextResponse.json({
      message: "File uploaded successfully!",
      filename: file.name,
      size: bytes.byteLength,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
