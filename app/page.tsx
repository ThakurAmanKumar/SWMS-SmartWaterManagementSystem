"use client"

import LandingHeader from "@/components/landing-header"
import LandingHero from "@/components/landing-hero"
import LandingFooter from "@/components/landing-footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-slate-900 dark:via-blue-900 dark:to-slate-900">
      <LandingHeader />
      <LandingHero />
      <LandingFooter />
    </div>
  )
}
