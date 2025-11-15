"use client"

import type React from "react"

import UserSidebar from "@/components/user-sidebar"
import MobileNavbar from "@/components/mobile-navbar"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-linear-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-slate-900 dark:via-blue-900 dark:to-slate-900">
      <UserSidebar />
      <MobileNavbar />
      <main className="flex-1 overflow-auto pt-16 md:pt-0 md:ml-64">{children}</main>
    </div>
  )
}
