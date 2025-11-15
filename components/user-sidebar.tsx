"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Droplet,
  Zap,
  Wind,
  Bell,
  Phone,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react"

const menuItems = [
  { href: "/user/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/user/water-supply", label: "Water Supply", icon: Droplet },
  { href: "/user/tank", label: "Tank", icon: Zap },
  { href: "/user/taps", label: "Taps", icon: Wind },
  { href: "/user/devices", label: "Devices", icon: Zap },
  { href: "/user/alerts", label: "Alerts", icon: Bell },
  { href: "/user/support", label: "Support", icon: Phone },
  { href: "/user/complaints", label: "Complaint", icon: MessageSquare },
  { href: "/user/settings", label: "Settings", icon: Settings },
]

export default function UserSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Call logout API endpoint
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (response.ok) {
        // Redirect to landing page
        router.push("/")
      }
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-linear-to-b from-blue-100 via-cyan-50 to-teal-50 text-gray-800 shadow-lg flex-col overflow-y-auto backdrop-blur-sm bg-opacity-95">
      {/* Header */}
      <div className="p-6 border-b border-blue-100/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg backdrop-blur">
            <img
              src="/swms.png"
              alt="SWMS Logo"
              className="h-6 w-auto"
            />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-800">SWMS</h1>
            <p className="text-xs text-gray-600">Smart Water Management</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-200/50 text-blue-700 font-semibold backdrop-blur-sm"
                      : "text-gray-700 hover:text-gray-800 hover:bg-blue-100/30 backdrop-blur-sm"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-blue-100/50 p-4">
        <button
          onClick={handleLogout}
          suppressHydrationWarning={true}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:text-gray-800 hover:bg-red-100/30 backdrop-blur-sm transition-all duration-200"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}