"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function UserSignIn() {
  const router = useRouter()
  const [email, setEmail] = useState("aman@swms.com")
  const [password, setPassword] = useState("password")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (email === "aman@swms.com" && password === "password") {
      setTimeout(() => {
        localStorage.setItem("userEmail", email)
        router.push("/user/dashboard")
      }, 500)
    } else {
      setError("Invalid email or password")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-slate-900 dark:via-blue-900 dark:to-slate-900 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <div className="flex items-center gap-4">
            <img
              src="/swms.png"
              alt="SWMS Logo"
              className="h-12 w-auto"
            />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              SWMS
            </h1>
          </div>
        </div>

        <div className="glass-light rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-center mb-2">User Login</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">Access your water management dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="aman@swms.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p className="font-semibold">Demo Credentials:</p>
            <p>aman@swms.com / password</p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          <Link href="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}