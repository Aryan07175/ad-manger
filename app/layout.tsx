import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import QueryProvider from "@/components/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pulse AI – App Analytics & Revenue Intelligence",
  description: "Monitor every app's health, revenue, user engagement, advertising performance, and detect problems before revenue drops.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground min-h-screen flex`}>
        <QueryProvider>
          <Sidebar />
          <main className="flex-1 overflow-auto bg-[#0a0a0b]">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
