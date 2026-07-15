import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MARKARA — Logo & Branding Studio",
  description:
    "Studio desain logo dan identitas brand untuk personal, UMKM, startup, dan perusahaan.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
