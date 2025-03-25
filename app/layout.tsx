import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "@/components/footer"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <title>ADITrack - Suivi des notes ADIMAKER</title>
        <meta name="description" content="Application de suivi des notes pour les étudiants ADIMAKER" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

import "./globals.css"

export const metadata = {
  generator: "v0.dev",
}



import './globals.css'