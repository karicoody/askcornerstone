export const metadata = { title: "CIH Member Chat" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html><body style={{fontFamily:"system-ui, -apple-system, Segoe UI, Roboto, sans-serif"}}>{children}</body></html>
  );
}
