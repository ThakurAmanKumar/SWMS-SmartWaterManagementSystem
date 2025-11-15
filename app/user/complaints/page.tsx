"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import ComplaintForm from "@/components/ComplaintForm"

export default function ComplaintsPage() {
  const router = useRouter()

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Complaints & Support</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Submit and track water-related complaints
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl">
        <ComplaintForm />
      </div>
    </div>
  )
}
