import type React from "react"
import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const outfit = Outfit({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ProposalAI - AI-Powered Proposal Generator",
  description: "Generate professional proposals with AI",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <div className="bg-grid-pattern min-h-screen">{children}</div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
