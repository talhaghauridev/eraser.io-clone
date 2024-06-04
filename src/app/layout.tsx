import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import ConvexClientProvider from "@/lib/ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";

const fontSans = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eraser.io Clone",
  description:
    "An advanced tool for collaborative drawing and note-taking, inspired by Eraser.io. Create, edit, and share your sketches with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(fontSans.className)}>
        <ConvexClientProvider>
          {children}
          <Toaster />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
