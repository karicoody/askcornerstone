"use client";
import { useState } from "react";

export default function Home() {
  const [q, setQ] = useState("");
  const [a, setA] = useState<string>("");

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setA("Thinking…");
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: q }],
      }),
    });
    const data = await r.json();
    setA(data.answer ?? "No answer.");
  }

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 720 }}>
      <h1>Ask Cornerstone</h1>

      <form onSubmit={ask} style={{ display: "flex", gap: 8, margin: "16px 0" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask a question…"
          style={{ flex: 1, padding: 10 }}
        />
        <button type="submit">Ask</button>
      </form>

      {a && (
        <div style={{ background: "#f6f6f6", padding: 16, borderRadius: 8 }}>
          <strong>Answer:</strong>
          <div style={{ whiteSpace: "pre-wrap" }}>{a}</div>
        </div>
      )}
    </main>
  );
}
