import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CharacterProvider } from "@/context/CharacterContext";
import { GenerationProvider } from "@/context/GenerationContext";
import { ToastProvider } from "@/components/ToastProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Xenofield — AI Creative Studio",
  description: "AI-powered creative platform for image generation, video generation, and workflows",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-bg-primary text-text-primary antialiased">
        <AuthProvider>
          <CharacterProvider>
            <GenerationProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </GenerationProvider>
          </CharacterProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
