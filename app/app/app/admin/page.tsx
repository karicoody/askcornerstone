"use client";
import { useState } from "react";

export default function Admin() {
  const [files, setFiles] = useState<FileList|null>(null);
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!files?.length) return;
    const fd = new FormData();
    Array.from(files).forEach(f => fd.append("files", f, f.name));
    const r = await fetch("/api/upload", { method: "POST", body: fd });
    const j = await r.json();
    setMsg(j.message || JSON.stringify(j));
  }
  return (
    <div style={{maxWidth:760, margin:"24px auto"}}>
      <h2>Upload transcripts & PDFs to your Vector Store</h2>
      <form onSubmit={submit}>
        <input type="file" multiple accept=".pdf,.md,.txt" onChange={e=>setFiles(e.target.files)} />
        <button style={{marginLeft:8}}>Upload</button>
      </form>
      <p style={{marginTop:12, fontFamily:"monospace", whiteSpace:"pre-wrap"}}>{msg}</p>
      <p style={{marginTop:16, fontSize:12, color:"#666"}}>Accepted: .pdf, .md, .txt</p>
    </div>
  );
}
