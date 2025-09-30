"use client";
import { useState } from "react";

export default function Page() {
  const [q, setQ] = useState("");
  const [log, setLog] = useState<{ who: "you" | "bot"; text: string; sources?: { title: string; page?: number }[] }[]>([]);

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    const yourQ = q.trim();
    setLog((l) => [...l, { who: "you", text: yourQ }]);
    setQ("");
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: yourQ }),
    });
    const j = await r.json();
    setLog((l) => [...l, { who: "bot", text: j.answer || "—", sources: j.sources || [] }]);
  }

  return (
    <div style={{ maxWidth: 760, margin: "24px auto" }}>
      <div style={{ background: "#7A9E9F", color: "#fff", padding: "14px 18px", borderRadius: 12, fontWeight: 600 }}>
        Cornerstone Integrative Healing — Member Chat
      </div>
      <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12, maxHeight: 420, overflow: "auto", background: "#fafafa", marginTop: 10 }}>
        {log.map((m, i) => (
          <div key={i} style={{ margin: "8px 0" }}>
            <b>{m.who === "you" ? "You" : "CIH Bot"}:</b>{" "}
            <span dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, "<br>") }} />
            {m.sources?.length ? (
              <div style={{ fontSize: 12, background: "#E4D9CE", padding: 8, borderRadius: 8, marginTop: 6 }}>
                <b>Sources:</b>
                <ul style={{ margin: "4px 0 0 16px" }}>
                  {m.sources.slice(0, 6).map((s, idx) => (
                    <li key={idx}>
                      {s.title}
                      {s.page ? ` (p.${s.page})` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <form onSubmit={ask} style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask about minerals, nervous system, bloodwork, etc."
          style={{ flex: 1, padding: "10px 12px", border: "1px solid #ccc", borderRadius: 10 }}
        />
        <button style={{ background: "#7A9E9F", color: "#fff", border: 0, borderRadius: 10, padding: "10px 14px", cursor: "pointer" }}>Ask</button>
      </form>
      <p style={{ marginTop: 16, fontSize: 12, color: "#666" }}>Educational only; not medical advice.</p>
      <p>
        <a href="/admin" style={{ fontSize: 14 }}>
          Admin: upload files
        </a>
      </p>
    </div>
  );
}
