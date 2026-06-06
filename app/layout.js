import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import ParticlesBG from "@/components/ParticlesBG";
import { SubjectsProvider } from "@/components/SubjectsProvider";

export const metadata = {
  title: "BrainForge — Forge Your Future, One Concept at a Time",
  description:
    "A premium study management platform with interactive courses, coding challenges, progress tracking, and personal wellbeing tools.",
  keywords: "study, learning, DSA, React, coding, progress tracking",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AuthProvider>
          <SubjectsProvider>
            <div className="app-background" />
            <ParticlesBG />
            {children}
          </SubjectsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
