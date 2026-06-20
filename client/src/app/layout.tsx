import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "PrepAI - Ace Your Next Interview with AI",
  description: "Master your presence, refine your answers, and land your dream job with real-time feedback from our intelligent coaching platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* We use head to import icons and fonts if needed, though they are already imported in globals.css */}
      </head>
      <body className="min-h-full flex flex-col bg-surface text-on-surface antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
