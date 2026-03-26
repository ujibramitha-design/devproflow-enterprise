import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardTopbar } from "@/components/dashboard/topbar"
import { Toaster } from "@/components/ui/sonner"
import './globals.css'

const _jakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: 'DEVPro FLOW - Enterprise 2026',
  description: 'Sistem Manajemen Enterprise Terintegrasi untuk Properti dan KPR.',
}

export const viewport: Viewport = {
  themeColor: '#f5f3ef',
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${_jakartaSans.variable} ${_geistMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange={false}>
          <div className="flex h-screen bg-background overflow-hidden">
            <DashboardSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <DashboardTopbar />
              <main className="flex-1 overflow-y-auto bg-secondary/10 scroll-smooth custom-scrollbar">
                <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-8 py-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
