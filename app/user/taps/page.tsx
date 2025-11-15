"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { ToggleButton } from "@/components/toggle-button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Activity, AlertCircle, Droplet, Zap, Trash2, Check, X, Edit } from "lucide-react"

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"]

interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  title: string
  message: string
}

export default function TapsPage() {
  const [tapsData, setTapsData] = useState([
    { id: 1, name: "Kitchen", flowRate: 8.5, leak: false, status: "on", location: "Ground Floor", type: "faucet", capacity: "standard", timer: null, lastOnTime: Date.now(), alertedForLongRun: false },
    { id: 2, name: "Bathroom", flowRate: 12.3, leak: false, status: "on", location: "First Floor", type: "shower", capacity: "high", timer: null, lastOnTime: Date.now(), alertedForLongRun: false },
    { id: 3, name: "Garden", flowRate: 15.2, leak: true, status: "off", location: "Backyard", type: "garden", capacity: "high", timer: null, lastOnTime: null, alertedForLongRun: false },
    { id: 4, name: "Outdoor", flowRate: 6.1, leak: false, status: "off", location: "Front Yard", type: "faucet", capacity: "low", timer: null, lastOnTime: null, alertedForLongRun: false },
  ])

  const [newTapData, setNewTapData] = useState<{
    name: string
    location: string
    type: string
    capacity: string
    timer: number | null
  }>({
    name: "",
    location: "",
    type: "faucet",
    capacity: "standard",
    timer: null
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [currentTime, setCurrentTime] = useState(Date.now())
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [editTapId, setEditTapId] = useState<number | null>(null)

  const showToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, type, title, message }])
    
    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 5000)
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // Load taps from localStorage on component mount
  useEffect(() => {
    const savedTaps = localStorage.getItem("userTaps")
    if (savedTaps) {
      try {
        const parsedTaps = JSON.parse(savedTaps)
        // Ensure all taps have the new fields
        const updatedTaps = parsedTaps.map((tap: any) => ({
          ...tap,
          timer: tap.timer || null,
          lastOnTime: tap.lastOnTime || null,
          alertedForLongRun: tap.alertedForLongRun || false
        }))
        setTapsData(updatedTaps)
      } catch (error) {
        console.error("Error parsing saved taps data:", error)
      }
    }
  }, [])

  const handleAddTap = () => {
    if (newTapData.name.trim()) {
      const newTap = {
        id: Date.now(),
        name: newTapData.name.trim(),
        location: newTapData.location,
        type: newTapData.type,
        capacity: newTapData.capacity,
        flowRate: newTapData.capacity === "high" ? 15 : newTapData.capacity === "low" ? 5 : 10,
        leak: false,
        status: "off",
        timer: newTapData.timer,
        lastOnTime: null,
        alertedForLongRun: false
      }
      const updatedTaps = [...tapsData, newTap]
      setTapsData(updatedTaps)
      localStorage.setItem("userTaps", JSON.stringify(updatedTaps))
      setNewTapData({
        name: "",
        location: "",
        type: "faucet",
        capacity: "standard",
        timer: null
      })
      setIsDialogOpen(false)
      showToast("success", "Tap Added", `${newTap.name} has been added successfully!`)
    }
  }

  // Handle toggle and timer logic
  const handleToggleTap = (tapId: number) => {
    const updatedTaps = tapsData.map(tap => {
      if (tap.id === tapId) {
        const newStatus = tap.status === "on" ? "off" : "on"
        const now = Date.now()
        return {
          ...tap,
          status: newStatus,
          lastOnTime: newStatus === "on" ? now : tap.lastOnTime
        }
      }
      return tap
    })
    setTapsData(updatedTaps)
    localStorage.setItem("userTaps", JSON.stringify(updatedTaps))
  }

  // Update current time every second for real-time countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000) // Update every second

    return () => clearInterval(interval)
  }, [])

  // Auto-close taps when timer expires
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const updatedTaps = tapsData.map(tap => {
        if (tap.status === "on" && tap.timer && tap.lastOnTime) {
          const elapsedMinutes = (now - tap.lastOnTime) / (1000 * 60)
          if (elapsedMinutes >= tap.timer) {
            return {
              ...tap,
              status: "off",
              lastOnTime: null
            }
          }
        }
        return tap
      }).filter(tap => tap !== undefined) as typeof tapsData

      if (updatedTaps.some(tap => tap.status === "off" && tapsData.find(t => t.id === tap.id)?.status === "on")) {
        setTapsData(updatedTaps)
        localStorage.setItem("userTaps", JSON.stringify(updatedTaps))
        showToast("info", "Timer Expired", "Tap automatically turned off due to timer expiration")
      }
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [tapsData])

  // Alert for long-running taps without timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const updatedTaps = tapsData.map(tap => {
        if (tap.status === "on" && !tap.timer && tap.lastOnTime && !tap.alertedForLongRun) {
          const elapsedMinutes = (now - tap.lastOnTime) / (1000 * 60)
          if (elapsedMinutes >= 20) {
            // Add alert to alerts page
            const existingAlerts = JSON.parse(localStorage.getItem("alerts") || "[]")
            const newAlert = {
              id: Date.now() + Math.random(),
              type: "Warning",
              title: "Tap Running Too Long",
              message: `${tap.name} has been running for over 20 minutes without a timer. Consider setting a timer or turning it off to save water.`,
              time: "Just now",
              severity: "warning",
              status: "unread",
              timestamp: now,
            }
            const updatedAlerts = [newAlert, ...existingAlerts]
            localStorage.setItem("alerts", JSON.stringify(updatedAlerts))

            return {
              ...tap,
              alertedForLongRun: true
            }
          }
        }
        return tap
      }).filter(tap => tap !== undefined) as typeof tapsData

      if (updatedTaps.some(tap => tap.alertedForLongRun && !tapsData.find(t => t.id === tap.id)?.alertedForLongRun)) {
        setTapsData(updatedTaps)
        localStorage.setItem("userTaps", JSON.stringify(updatedTaps))
      }
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [tapsData])

  const handleDeleteTap = () => {
    if (deleteConfirm !== null) {
      const tapToDelete = tapsData.find(tap => tap.id === deleteConfirm)
      const updatedTaps = tapsData.filter(tap => tap.id !== deleteConfirm)
      setTapsData(updatedTaps)
      localStorage.setItem("userTaps", JSON.stringify(updatedTaps))
      showToast("success", "Tap Deleted", `${tapToDelete?.name} has been deleted successfully!`)
      setDeleteConfirm(null)
    }
  }

  const handleEditTap = (tapId: number) => {
    const tap = tapsData.find(t => t.id === tapId)
    if (tap) {
      setNewTapData({
        name: tap.name,
        location: tap.location,
        type: tap.type,
        capacity: tap.capacity,
        timer: tap.timer
      })
      setEditTapId(tapId)
      setIsDialogOpen(true)
    }
  }

  const handleSaveEdit = () => {
    if (editTapId !== null && newTapData.name.trim()) {
      const updatedTaps = tapsData.map(tap => {
        if (tap.id === editTapId) {
          return {
            ...tap,
            name: newTapData.name.trim(),
            location: newTapData.location,
            type: newTapData.type,
            capacity: newTapData.capacity,
            timer: newTapData.timer
          }
        }
        return tap
      })
      setTapsData(updatedTaps)
      localStorage.setItem("userTaps", JSON.stringify(updatedTaps))
      setNewTapData({
        name: "",
        location: "",
        type: "faucet",
        capacity: "standard",
        timer: null
      })
      setEditTapId(null)
      setIsDialogOpen(false)
      showToast("success", "Tap Updated", `Tap has been updated successfully!`)
    }
  }

  const usageByTap = tapsData.map(tap => ({
    name: tap.name,
    value: Math.floor(Math.random() * 300) + 50 // Random usage for demo
  }))
  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Taps Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor and control water taps</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
              Add New Tap
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editTapId ? "Edit Tap" : "Add New Tap"}</DialogTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {editTapId ? "Edit tap settings and timer" : "Add a new water tap to monitor water usage and flow rates."}
              </p>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tapName">Tap Name *</Label>
                  <Input
                    id="tapName"
                    value={newTapData.name}
                    onChange={(e) => setNewTapData({...newTapData, name: e.target.value})}
                    placeholder="e.g., Kitchen Sink"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tapLocation">Location</Label>
                  <Input
                    id="tapLocation"
                    value={newTapData.location}
                    onChange={(e) => setNewTapData({...newTapData, location: e.target.value})}
                    placeholder="e.g., Ground Floor"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tapType">Tap Type</Label>
                  <select
                    id="tapType"
                    title="Select tap type"
                    value={newTapData.type}
                    onChange={(e) => setNewTapData({...newTapData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="faucet">Faucet</option>
                    <option value="shower">Shower</option>
                    <option value="toilet">Toilet</option>
                    <option value="garden">Garden Hose</option>
                    <option value="washing">Washing Machine</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="tapCapacity">Flow Capacity</Label>
                  <select
                    id="tapCapacity"
                    title="Select flow capacity"
                    value={newTapData.capacity}
                    onChange={(e) => setNewTapData({...newTapData, capacity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low Flow (5 L/min)</option>
                    <option value="standard">Standard (10 L/min)</option>
                    <option value="high">High Flow (15 L/min)</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="tapTimer">Timer (minutes) - Optional</Label>
                <Input
                  id="tapTimer"
                  type="number"
                  min="1"
                  value={newTapData.timer || ""}
                  onChange={(e) => setNewTapData(prev => ({...prev, timer: e.target.value ? parseInt(e.target.value) : null}))}
                  placeholder="Leave empty for no timer"
                  className="w-full"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> Flow rates will be automatically set based on capacity selection.
                  You can monitor real-time usage and detect leaks once the tap is added.
                  Timers help save water by automatically turning off taps after the specified time.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => {
                  setIsDialogOpen(false)
                  setEditTapId(null)
                  setNewTapData({
                    name: "",
                    location: "",
                    type: "faucet",
                    capacity: "standard",
                    timer: null
                  })
                }}>
                  Cancel
                </Button>
                <Button
                  onClick={editTapId ? handleSaveEdit : handleAddTap}
                  className="bg-linear-to-r from-cyan-500 to-blue-600"
                  disabled={!newTapData.name.trim()}
                >
                  {editTapId ? "Save Changes" : "Add Tap"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tap Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tapsData.map((tap) => (
          <Card key={tap.id} className="glass-light border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
            {/* Status Indicator */}
            <div className={`absolute top-0 left-0 w-full h-1 ${tap.status === "on" ? "bg-linear-to-r from-green-400 to-green-600" : "bg-linear-to-r from-gray-400 to-gray-600"}`} />

            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${tap.status === "on" ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                  <div>
                    <CardTitle className="text-lg">{tap.name}</CardTitle>
                    {tap.location && <p className="text-xs text-gray-500 dark:text-gray-400">{tap.location}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ToggleButton defaultChecked={tap.status === "on"} onCheckedChange={() => handleToggleTap(tap.id)} />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditTap(tap.id)}
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-1 h-8 w-8"
                    title="Edit tap settings"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteConfirm(tap.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 h-8 w-8"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {tap.leak && (
                <div className="flex items-center gap-2 mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-xs text-red-600 dark:text-red-400 font-medium">Leak Detected</span>
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Flow Rate with Visual Indicator */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Flow Rate</span>
                  <span className="font-bold text-lg">{tap.flowRate} L/min</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    {/* Dynamic width calculated from flow rate - inline style necessary */}
                    {/* @style-allow-inline-for-dynamic-width */}
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${tap.status === "on" ? "bg-linear-to-r from-blue-400 to-cyan-500" : "bg-gray-400"}`}
                      suppressHydrationWarning
                      style={{ width: `${tap.flowRate > 0 ? Math.min((tap.flowRate / 20) * 100, 100) : 0}%` }}
                    />
                </div>
              </div>

              {/* Timer Display */}
              {tap.timer && (
                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800 dark:text-orange-300">Timer Set</span>
                    </div>
                    <span className="text-sm font-bold text-orange-600">
                      {tap.status === "on" && tap.lastOnTime ?
                        (() => {
                          const remainingMs = Math.max(0, tap.timer * 60 * 1000 - (currentTime - tap.lastOnTime))
                          const minutes = Math.floor(remainingMs / (1000 * 60))
                          const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000)
                          return `${minutes}:${seconds.toString().padStart(2, '0')}`
                        })() :
                        `${tap.timer} min`
                      }
                    </span>
                  </div>
                </div>
              )}

              {/* Status and Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    tap.status === "on"
                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${tap.status === "on" ? "bg-green-500" : "bg-gray-400"}`} />
                    {tap.status === "on" ? "Active" : "Inactive"}
                  </div>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium capitalize">
                    {tap.type || "Faucet"}
                  </span>
                </div>
              </div>

              {/* Real-time Usage Indicator */}
              <div className="flex items-center justify-between p-3 bg-linear-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-600" />
                  <span className="text-sm font-medium">Real-time Usage</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-cyan-600">
                    {tap.status === "on" ? `${(Math.random() * 2 + 0.5).toFixed(1)} L/min` : "0.0 L/min"}
                  </div>
                  <div className="text-xs text-gray-500">Current flow</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Usage Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-light border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle>Usage by Tap</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={usageByTap}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}L`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: "8px",
                    color: "#000",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}
                  labelStyle={{ color: "#333", fontWeight: "bold" }}
                  itemStyle={{ color: "#555" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-light border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle>Flow Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tapsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,150,200,0.1)" />
                <XAxis dataKey="name" stroke="rgba(100,100,100,0.5)" />
                <YAxis stroke="rgba(100,100,100,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: "8px",
                    color: "#000",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}
                  labelStyle={{ color: "#333", fontWeight: "bold" }}
                  itemStyle={{ color: "#555" }}
                />
                <Bar dataKey="flowRate" fill="rgb(34, 197, 255)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirm !== null} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Delete Tap?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Are you sure you want to delete this tap? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <AlertDialogCancel onClick={() => setDeleteConfirm(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTap}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toast Notifications */}
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
                  <AlertCircle className="w-3 h-3 text-white" />
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
            <button
              onClick={() => removeToast(toast.id)}
              title="Close notification"
              className={`shrink-0 ml-2 h-5 w-5 inline-flex items-center justify-center rounded hover:opacity-70 transition-opacity ${
                toast.type === 'success'
                  ? 'text-green-600 dark:text-green-400'
                  : toast.type === 'error'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-blue-600 dark:text-blue-400'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}