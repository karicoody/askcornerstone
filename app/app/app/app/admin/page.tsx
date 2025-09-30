"use client";
import { useState } from "react";

export default function AdminPage() {
  const [msg, setMsg] = useState("");

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const j = await res.json();
    setMsg(j.message || "Done.");
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Upload documents to Ask Cornerstone</h2>
      <form onSubmit={handleUpload}>
        <input type="file" name="files" multiple />
        <button type="submit">Upload</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
