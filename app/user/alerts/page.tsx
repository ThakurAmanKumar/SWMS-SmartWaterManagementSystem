"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Info, CheckCircle, Trash2, Check, Wrench, RefreshCw, X } from "lucide-react"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"

const initialAlerts = [
  {
    id: 1,
    type: "Warning",
    title: "High Water Usage",
    message: "Usage 40% above normal",
    time: "2 mins ago",
    severity: "warning",
    status: "unread",
    timestamp: Date.now() - 120000, // 2 minutes ago
  },
  {
    id: 2,
    type: "Info",
    title: "Tank Refilled",
    message: "Main tank refilled successfully",
    time: "1 hour ago",
    severity: "info",
    status: "read",
    timestamp: Date.now() - 3600000, // 1 hour ago
  },
  {
    id: 3,
    type: "Critical",
    title: "Leak Detected",
    message: "Possible leak at kitchen tap",
    time: "3 hours ago",
    severity: "critical",
    status: "unread",
    timestamp: Date.now() - 10800000, // 3 hours ago
  },
  {
    id: 4,
    type: "Resolved",
    title: "Device Reconnected",
    message: "Bathroom sensor is online",
    time: "5 hours ago",
    severity: "resolved",
    status: "read",
    timestamp: Date.now() - 18000000, // 5 hours ago
  },
]

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(initialAlerts)
  const [currentTime, setCurrentTime] = useState(Date.now())

  // Load alerts from localStorage on component mount
  useEffect(() => {
    const savedAlerts = localStorage.getItem("alerts")
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts))
    }
  }, [])

  // Save alerts to localStorage whenever alerts state changes
  useEffect(() => {
    localStorage.setItem("alerts", JSON.stringify(alerts))
  }, [alerts])

  // Update time every minute for relative time display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  // Toast notifications (top-right)
  interface Toast { id: string; type: 'success' | 'error' | 'info'; title: string; message: string }
  const [toasts, setToasts] = useState<Toast[]>([])
  const showToast = (type: Toast['type'], title: string, message: string, duration = 4000) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, type, title, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }
  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id))
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const handleConfirmDelete = () => {
    if (deleteConfirm === null) return
    const toDeleteId = deleteConfirm
    const toDelete = alerts.find((a: any) => a.id === toDeleteId)
    setAlerts((prev: any[]) => prev.filter((a: any) => a.id !== toDeleteId))
    setDeleteConfirm(null)
    showToast('success', 'Deleted', `${toDelete?.title || 'Alert'} deleted successfully!`, 4000)
  }

  // Simulate new alerts every 10 seconds for real-time effect
  useEffect(() => {
    const interval = setInterval(() => {
      const newAlertTypes = [
        { type: "Warning", title: "High Water Usage", message: "Usage 35% above normal in Ward 5", severity: "warning" },
        { type: "Info", title: "Tank Level Updated", message: "North tank now at 85% capacity", severity: "info" },
        { type: "Critical", title: "Pressure Anomaly", message: "Abnormal pressure detected in Zone A", severity: "critical" },
        { type: "Info", title: "Device Connected", message: "New meter connected successfully", severity: "info" },
        { type: "Warning", title: "Low Pressure", message: "Pressure dropping in residential area", severity: "warning" },
        { type: "Info", title: "Maintenance Scheduled", message: "Weekly maintenance completed", severity: "info" },
        { type: "Critical", title: "Leak Alert", message: "Possible leak detected near junction", severity: "critical" },
        { type: "Warning", title: "High Temperature", message: "Pump temperature rising above threshold", severity: "warning" },
        { type: "Info", title: "Backup Complete", message: "System data backup completed successfully", severity: "info" },
        { type: "Warning", title: "Supply Fluctuation", message: "Water supply fluctuating in Zone B", severity: "warning" },
      ]

      // Randomly decide if we add a new alert (80% chance)
      if (Math.random() > 0.2) {
        const randomAlert = newAlertTypes[Math.floor(Math.random() * newAlertTypes.length)]
        const newAlert = {
          id: Date.now() + Math.random(),
          ...randomAlert,
          time: "Just now",
          status: "unread",
          timestamp: Date.now(),
        }

        setAlerts((prev: any[]) => [newAlert, ...prev].slice(0, 50)) // Keep only last 50 alerts
      }
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const markAsRead = (id: number) => {
    setAlerts(alerts.map((alert: any) =>
      alert.id === id ? { ...alert, status: "read" } : alert
    ))
  }

  const markAsFixed = (id: number) => {
    setAlerts((prev: any[]) => prev.map((alert: any) =>
      alert.id === id ? { ...alert, severity: "resolved", type: "Resolved", status: "read" } : alert
    ))
    // show toast for resolved action (4s)
    showToast('success', 'Resolved', 'Successfully Resolved', 4000)
  }

  // deletion is confirmed via dialog (see UI)

  const getRelativeTime = (timestamp: number) => {
    const diff = currentTime - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes} mins ago`
    if (hours < 24) return `${hours} hours ago`
    return `${days} days ago`
  }
  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Alerts & Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400">System warnings and updates</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-700 dark:text-green-300">Live Updates</span>
        </div>
      </div>

        {/* Toast notifications (top-right) */}
        <div className="fixed top-6 right-6 flex flex-col gap-3 pointer-events-none z-50">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-sm animate-in slide-in-from-right-5 fade-in-0 duration-200 ${
                toast.type === 'success'
                  ? 'bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-800'
                  : toast.type === 'error'
                  ? 'bg-linear-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 border-red-200 dark:border-red-800'
                  : 'bg-linear-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-blue-200 dark:border-blue-800'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {toast.type === 'success' && (
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                {toast.type === 'error' && (
                  <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                    <X className="w-3 h-3 text-white" />
                  </div>
                )}
                {toast.type === 'info' && (
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                    <Info className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold text-sm ${
                  toast.type === 'success'
                    ? 'text-green-900 dark:text-green-200'
                    : toast.type === 'error'
                    ? 'text-red-900 dark:text-red-200'
                    : 'text-blue-900 dark:text-blue-200'
                }`}>
                  {toast.title}
                </h3>
                <p className={`text-xs mt-0.5 ${
                  toast.type === 'success'
                    ? 'text-green-800 dark:text-green-300'
                    : toast.type === 'error'
                    ? 'text-red-800 dark:text-red-300'
                    : 'text-blue-800 dark:text-blue-300'
                }`}>
                  {toast.message}
                </p>
              </div>
              <button onClick={() => removeToast(toast.id)} title="Close notification" className={`shrink-0 ml-2 h-5 w-5 inline-flex items-center justify-center rounded hover:opacity-70 transition-opacity ${
                toast.type === 'success' ? 'text-green-600 dark:text-green-400' : toast.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
              }`}>
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Delete confirmation dialog */}
        <AlertDialog open={deleteConfirm !== null} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Delete Alert?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base">Are you sure you want to delete this alert? This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-end gap-3 pt-4">
              <AlertDialogCancel onClick={() => setDeleteConfirm(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>

      {/* Alert Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-linear-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase">Critical</p>
          <p className="text-2xl font-bold text-red-600">{alerts.filter((a: any) => a.severity === "critical").length}</p>
        </div>
        <div className="bg-linear-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 uppercase">Warnings</p>
          <p className="text-2xl font-bold text-yellow-600">{alerts.filter((a: any) => a.severity === "warning").length}</p>
        </div>
        <div className="bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">Info</p>
          <p className="text-2xl font-bold text-blue-600">{alerts.filter((a: any) => a.severity === "info").length}</p>
        </div>
        <div className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase">Resolved</p>
          <p className="text-2xl font-bold text-green-600">{alerts.filter((a: any) => a.severity === "resolved").length}</p>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((alert: any) => (
          <Card
            key={alert.id}
            className={`glass-light border-l-4 transition-all duration-300 ${
              alert.severity === "critical"
                ? "border-l-red-500"
                : alert.severity === "warning"
                  ? "border-l-yellow-500"
                  : alert.severity === "resolved"
                    ? "border-l-green-500"
                    : "border-l-blue-500"
            } ${alert.status === "unread" ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}
          >
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="relative">
                  {alert.severity === "critical" && (
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  )}
                  {alert.severity === "warning" && (
                    <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  )}
                  {alert.severity === "info" && <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />}
                  {alert.severity === "resolved" && (
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  )}
                  {alert.status === "unread" && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold ${alert.status === "unread" ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                      {alert.title}
                    </h3>
                    <Badge variant={alert.severity === "critical" ? "destructive" : "secondary"}>{alert.type}</Badge>
                    {alert.status === "unread" && (
                      <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{getRelativeTime(alert.timestamp)}</p>
                </div>

                <div className="flex gap-1">
                  {alert.status === "unread" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markAsRead(alert.id)}
                      className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  {alert.severity !== "resolved" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markAsFixed(alert.id)}
                      className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900"
                      title="Mark as fixed"
                    >
                      <Wrench className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeleteConfirm(alert.id)}
                    className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                    title="Delete alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
