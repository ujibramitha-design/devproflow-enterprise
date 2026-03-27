import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { Suspense } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { DevProSidebar } from "@/components/layout/sidebar"
import { DevProTopbar } from "@/components/layout/topbar"
import { PageTransition } from "@/components/ui/page-transition"
import { FloatingActionButton } from "@/components/ui/floating-action-button"
import { Toaster } from "@/components/ui/sonner"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { FullPageLoading } from "@/components/ui/loading-spinner"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import '@/app/globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins" 
})

export const metadata: Metadata = {
  title: 'DevPro Flow Enterprise - Integrated Control System',
  description: 'Integrated enterprise control system for KPR applications, unit inventory, and cross-platform synchronization.',
  keywords: ['DevPro', 'Flow', 'Enterprise', 'KPR', 'Property', 'Loan', 'Management', 'Dashboard'],
  authors: [{ name: 'DevPro Flow Enterprise Team' }],
  openGraph: {
    title: 'DevPro Flow Enterprise',
    description: 'Integrated enterprise control system',
    type: 'website',
    locale: 'id_ID',
    url: 'https://devproflow.com',
    siteName: 'DevPro Flow Enterprise',
  },
  metadataBase: new URL('https://devproflow.com'),
  alternates: {
    canonical: 'https://devproflow.com',
  },
}

export const viewport: Viewport = {
  themeColor: '#var(--kprflow-primary)',
  userScalable: false,
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="dark" 
          enableSystem={true} 
          disableTransitionOnChange={false}
        >
          <div className="flex h-screen bg-[var(--background)] overflow-hidden selection:bg-[var(--ring)]/30 selection:text-[var(--ring)] transition-colors duration-300">
            <DevProSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <DevProTopbar />
              <main className="flex-1 overflow-y-auto bg-[var(--background)] scroll-smooth custom-scrollbar">
                <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-8 py-8">
                  <ErrorBoundary>
                    <Suspense fallback={<FullPageLoading text="Loading DevPro Flow Enterprise..." />}>
                      <PageTransition>
                        {children}
                      </PageTransition>
                    </Suspense>
                  </ErrorBoundary>
                </div>
              </main>
            </div>
          </div>
          <FloatingActionButton />
          <Toaster />
          <SpeedInsights />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
