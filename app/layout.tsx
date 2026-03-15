import type { Metadata } from "next";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { globalMetadata } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = globalMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <AnalyticsProvider>
          <Navbar />
          <div className="pt-16">{children}</div>
          <footer className="border-t border-slate-200 bg-white">
            <div className="container-page py-6 text-sm text-slate-600">
              © {new Date().getFullYear()} AcordaBrasil — Informação pública com clareza.
            </div>
          </footer>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
