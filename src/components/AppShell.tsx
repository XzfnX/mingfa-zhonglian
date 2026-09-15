import { Outlet } from 'react-router-dom'
import { PublicHeader } from './PublicHeader'
import { Footer } from './Disclaimer'
import { CitizenHeader } from './CitizenHeader'
import { InstitutionSidebar, InstitutionTopBar } from './InstitutionSidebar'

export function PublicShell({ showFooter = true }: { showFooter?: boolean }) {
  return <div className="flex min-h-screen flex-col bg-cream"><PublicHeader /><main id="main" className="flex-1"><Outlet /></main>{showFooter && <Footer />}</div>
}

export function CitizenShell() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F6F8]">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[99] focus:bg-white focus:px-4 focus:py-2 focus:text-brand">跳到主要内容</a>
      <CitizenHeader />
      <main id="main" className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  )
}

export function InstitutionShell() {
  return (
    <div className="min-h-screen bg-[#F4F6F8] lg:pl-[232px]">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[99] focus:bg-white focus:px-4 focus:py-2 focus:text-brand">跳到主要内容</a>
      <InstitutionSidebar />
      <InstitutionTopBar />
      <main id="main" className="min-w-0 px-4 py-5 sm:px-6 lg:px-8 lg:py-7"><Outlet /></main>
    </div>
  )
}
