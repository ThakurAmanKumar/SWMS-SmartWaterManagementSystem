"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, Layers, LogOut } from "lucide-react"
import { useEffect, useState } from "react"

import {
  LayoutDashboard,
  Droplet,
  Zap,
  Wind,
  Bell,
  Phone,
  MessageSquare,
  Settings,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"   // ✅ Toast Import

const menuItems = [
  { href: "/user/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/user/water-supply", label: "Water Supply", icon: Droplet },
  { href: "/user/tank", label: "Tank", icon: Layers },
  { href: "/user/taps", label: "Taps", icon: Wind },
  { href: "/user/devices", label: "Devices", icon: Zap },
  { href: "/user/alerts", label: "Alerts", icon: Bell },
  { href: "/user/support", label: "Support", icon: Phone },
  { href: "/user/complaints", label: "Complaint", icon: MessageSquare },
  { href: "/user/settings", label: "Settings", icon: Settings },

  // 🔥 Logout (popup)
  { action: "logout", label: "Logout", icon: LogOut },
]

export default function MobileNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()               // ✅ Toast hook
  const [isOpen, setIsOpen] = useState(false)
  const [showLogoutPopup, setShowLogoutPopup] = useState(false)

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const getCurrentLabel = () => {
    const found = menuItems.find((item) => item.href === pathname)
    return found?.label || "SWMS"
  }

  return (
    <>
      {/* TOP NAV */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-blue-100/50 shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 select-none">
            <img src="/swms.png" alt="SWMS Logo" className="h-6 w-auto" />
            <h1 className="font-bold text-gray-800 text-sm">{getCurrentLabel()}</h1>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg active:scale-95 transition-colors hover:bg-gray-200/40"
          >
            {isOpen ? <X className="w-6 h-6 text-gray-800" /> : <Menu className="w-6 h-6 text-gray-800" />}
          </button>
        </div>

        {/* DROPDOWN */}
        <nav
          className={`transition-all duration-300 bg-gradient-to-b from-blue-50 via-cyan-50 to-teal-50 border-t border-blue-100/50 shadow-md overflow-hidden ${
            isOpen ? "max-h-[650px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="py-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = item.href && pathname === item.href

              return (
                <li key={item.label}>
                  {/* 🔥 Logout Button */}
                  {item.action === "logout" ? (
                    <button
                      onClick={() => {
                        setIsOpen(false)
                        setTimeout(() => setShowLogoutPopup(true), 200)
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 mx-1 rounded-lg 
                      text-red-600 hover:bg-red-100/40 font-semibold active:scale-[0.97] transition-all"
                    >
                      <Icon className="w-5 h-5 shrink-0 text-red-600" />
                      <span className="text-sm">Logout</span>
                    </button>
                  ) : (
                    <Link
                      href={item.href!}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 mx-1 rounded-lg transition-all active:scale-[0.97] ${
                        isActive
                          ? "bg-blue-200/60 text-blue-800 font-semibold border-l-4 border-blue-600 shadow-sm"
                          : "text-gray-700 hover:bg-blue-100/40"
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* 🔥 LOGOUT CONFIRM POPUP */}
      <Dialog open={showLogoutPopup} onOpenChange={setShowLogoutPopup}>
        <DialogContent className="max-w-sm rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-red-600">Confirm Logout</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to logout from SWMS?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowLogoutPopup(false)}
              className="border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </Button>

            {/* 🔥 FINAL LOGOUT CLICK */}
            <Button
              onClick={() => {
                localStorage.clear()
                sessionStorage.clear()

                toast({
                  title: "Logged out successfully",
                  description: "You have been redirected to home page.",
                  duration: 2500,
                })

                router.push("/")
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
