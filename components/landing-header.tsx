"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingHeader() {
  return (
    <header className="glass-light sticky top-0 z-50 border-b border-blue-200/50 dark:border-blue-800/50 bg-linear-to-br from-white/80 via-blue-100/60 to-cyan-100/60 dark:from-slate-900/80 dark:via-blue-900/60 dark:to-teal-900/60 backdrop-blur shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Title */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img
            src="/swms.png"
            alt="SWMS Logo"
            className="h-8 w-auto"
          />
          <div>
            <span className="font-bold text-lg bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              SWMS
            </span>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              Smart Water Management System
            </p>
          </div>
        </Link>

        {/* Sign In Button */}
        <Link href="/auth/signin">
          <Button className="bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
            Sign In
          </Button>
        </Link>
      </div>
    </header>
  )
}