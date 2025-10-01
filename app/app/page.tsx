export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Ask Cornerstone</h1>
      <p>Welcome! Type your question below to search across podcasts & resources.</p>
      
      <div style={{ marginTop: "2rem" }}>
        <textarea
          placeholder="Ask me anything..."
          style={{ width: "100%", height: "120px", padding: "10px", fontSize: "1rem" }}
        />
        <button
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            fontSize: "1rem",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Ask
        </button>
      </div>
    </main>
  );
}
