import "./globals.css";

export const metadata = {
  title: "Mazao AI",
  description: "Smart produce verification and market access",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
