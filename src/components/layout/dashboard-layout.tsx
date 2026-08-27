'use client'

import { TopNavbar } from './top-navbar'
import { FuturisticBackground } from '@/components/shared/futuristic-background'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
      {/* Dynamic 3D interactive Background */}
      <FuturisticBackground />

      {/* Main App content wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <TopNavbar />
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}
