"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Trash2, Eye, Plus, Wifi, WifiOff, Activity, MapPin, Clock, Check, X, AlertCircle, Edit } from "lucide-react"

const initialDevices = [
  {
    id: 1,
    name: "Tank Level Sensor",
    type: "Sensor",
    location: "Main Tank",
    status: "online",
    lastPing: "2 mins ago",
    battery: 85,
    signal: "Strong",
    firmware: "v2.1.4",
    ipAddress: "192.168.1.101",
    macAddress: "AA:BB:CC:DD:EE:11",
    installationDate: "2024-01-15",
    readings: [
      { timestamp: "2024-01-20 10:00", value: "75%", unit: "Level" },
      { timestamp: "2024-01-20 09:00", value: "78%", unit: "Level" },
      { timestamp: "2024-01-20 08:00", value: "72%", unit: "Level" },
    ]
  },
  {
    id: 2,
    name: "Flow Meter - Kitchen",
    type: "Meter",
    location: "Kitchen Tap",
    status: "online",
    lastPing: "1 min ago",
    battery: 92,
    signal: "Excellent",
    firmware: "v1.8.2",
    ipAddress: "192.168.1.102",
    macAddress: "AA:BB:CC:DD:EE:22",
    installationDate: "2024-02-01",
    readings: [
      { timestamp: "2024-01-20 10:00", value: "12.5", unit: "L/min" },
      { timestamp: "2024-01-20 09:00", value: "8.3", unit: "L/min" },
      { timestamp: "2024-01-20 08:00", value: "15.2", unit: "L/min" },
    ]
  },
  {
    id: 3,
    name: "Motor Controller",
    type: "Controller",
    location: "Pump House",
    status: "online",
    lastPing: "30 secs ago",
    battery: 78,
    signal: "Good",
    firmware: "v3.0.1",
    ipAddress: "192.168.1.103",
    macAddress: "AA:BB:CC:DD:EE:33",
    installationDate: "2024-01-10",
    readings: [
      { timestamp: "2024-01-20 10:00", value: "Running", unit: "Status" },
      { timestamp: "2024-01-20 09:00", value: "Running", unit: "Status" },
      { timestamp: "2024-01-20 08:00", value: "Stopped", unit: "Status" },
    ]
  },
  {
    id: 4,
    name: "Flow Meter - Bathroom",
    type: "Meter",
    location: "Bathroom",
    status: "offline",
    lastPing: "45 mins ago",
    battery: 45,
    signal: "Weak",
    firmware: "v1.7.9",
    ipAddress: "192.168.1.104",
    macAddress: "AA:BB:CC:DD:EE:44",
    installationDate: "2024-01-25",
    readings: [
      { timestamp: "2024-01-20 09:15", value: "0.0", unit: "L/min" },
      { timestamp: "2024-01-20 08:30", value: "6.8", unit: "L/min" },
      { timestamp: "2024-01-20 07:45", value: "3.2", unit: "L/min" },
    ]
  },
]

export default function DevicesPage() {
  const [devices, setDevices] = useState(initialDevices)
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editDeviceId, setEditDeviceId] = useState<number | null>(null)
  const [newDevice, setNewDevice] = useState({
    name: "",
    type: "",
    location: "",
    ipAddress: "",
    macAddress: ""
  })

  // Load devices from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDevices = localStorage.getItem("userDevices")
      if (savedDevices) {
        try {
          const parsedDevices = JSON.parse(savedDevices)
          // Ensure all devices have required fields
          const updatedDevices = parsedDevices.map((device: any) => ({
            ...device,
            readings: device.readings || []
          }))
          setDevices(updatedDevices)
        } catch (error) {
          console.error("Error parsing saved devices:", error)
          localStorage.removeItem("userDevices")
          // Save initial devices if parsing fails
          localStorage.setItem("userDevices", JSON.stringify(initialDevices))
        }
      } else {
        // No saved devices, save the initial ones
        localStorage.setItem("userDevices", JSON.stringify(initialDevices))
      }
    }
  }, [])



  // Toast notifications for device actions
  interface Toast { id: string; type: 'success' | 'error' | 'info'; title: string; message: string }
  const [toasts, setToasts] = useState<Toast[]>([])
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const showToast = (type: Toast['type'], title: string, message: string) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, type, title, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000)
  }

  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id))

  // delete will be triggered after confirmation dialog
  const handleDeleteDevice = () => {
    if (deleteConfirm === null) return
    const deviceToDelete = devices.find((d: any) => d.id === deleteConfirm)
    const updated = devices.filter((device: any) => device.id !== deleteConfirm)
    setDevices(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem("userDevices", JSON.stringify(updated))
    }
    setDeleteConfirm(null)
    showToast('success', 'Device deleted', `${deviceToDelete?.name || 'Device'} has been deleted successfully!`)
  }

  const handleStatusChange = (deviceId: number, newStatus: "online" | "offline") => {
    const updatedDevices = devices.map((device: any) => {
      if (device.id === deviceId) {
        const updatedDevice = {
          ...device,
          status: newStatus,
          lastPing: newStatus === "online" ? "Just now" : device.lastPing,
        }
        // If going online, update real-time data
        if (newStatus === "online") {
          updatedDevice.battery = Math.min(100, updatedDevice.battery + 5)
          updatedDevice.signal = ["Excellent", "Strong", "Good"][Math.floor(Math.random() * 3)]

          // Add new reading with current timestamp
          const now = new Date()
          const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

          let newReadingValue = ""
          const newReadingUnit = device.readings[0]?.unit || "Reading"

          if (device.type === "Sensor") {
            newReadingValue = `${Math.floor(Math.random() * 30) + 50}%`
          } else if (device.type === "Meter") {
            newReadingValue = (Math.random() * 20 + 5).toFixed(1)
          } else {
            newReadingValue = "Running"
          }

          const newReading = { timestamp, value: newReadingValue, unit: newReadingUnit }
          updatedDevice.readings = [newReading, ...updatedDevice.readings.slice(0, 4)]
        }
        return updatedDevice
      }
      return device
    })
    setDevices(updatedDevices)
    if (typeof window !== 'undefined') {
      localStorage.setItem("userDevices", JSON.stringify(updatedDevices))
    }
  }

  const updateDeviceData = (deviceId: number) => {
    const updatedDevices = devices.map((device: any) => {
      if (device.id === deviceId && device.status === "online") {
        const updatedDevice = { ...device }

        // Simulate real-time updates
        updatedDevice.battery = Math.max(0, updatedDevice.battery - Math.floor(Math.random() * 3))
        updatedDevice.signal = ["Excellent", "Strong", "Good", "Fair"][Math.floor(Math.random() * 4)]
        updatedDevice.lastPing = "Just now"

        // Add new reading
        const now = new Date()
        const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

        let newReadingValue = ""
        const newReadingUnit = device.readings[0]?.unit || "Reading"

        if (device.type === "Sensor") {
          newReadingValue = `${Math.floor(Math.random() * 30) + 50}%`
        } else if (device.type === "Meter") {
          newReadingValue = (Math.random() * 20 + 5).toFixed(1)
        } else {
          newReadingValue = "Running"
        }

        const newReading = { timestamp, value: newReadingValue, unit: newReadingUnit }
        updatedDevice.readings = [newReading, ...updatedDevice.readings.slice(0, 4)]
        return updatedDevice
      }
      return device
    })
    setDevices(updatedDevices)
    if (typeof window !== 'undefined') {
      localStorage.setItem("userDevices", JSON.stringify(updatedDevices))
    }
  }

  const handleAddDevice = () => {
    if (!newDevice.name || !newDevice.type || !newDevice.location) {
      alert("Please fill in all required fields")
      return
    }

    const device = {
      id: Date.now(),
      name: newDevice.name,
      type: newDevice.type,
      location: newDevice.location,
      status: "offline" as const,
      lastPing: "Never",
      battery: 100,
      signal: "Unknown",
      firmware: "v1.0.0",
      ipAddress: newDevice.ipAddress || `192.168.1.10${devices.length + 1}`,
      macAddress: newDevice.macAddress || `AA:BB:CC:DD:EE:${String(devices.length + 1).padStart(2, '0')}`,
      installationDate: new Date().toISOString().split('T')[0],
      readings: []
    }

    const updatedDevices = [...devices, device]
    setDevices(updatedDevices)
    if (typeof window !== 'undefined') {
      localStorage.setItem("userDevices", JSON.stringify(updatedDevices))
    }
    setNewDevice({ name: "", type: "", location: "", ipAddress: "", macAddress: "" })
    setIsAddDialogOpen(false)
    showToast('success', 'Device Added', `${device.name} has been added successfully!`)
  }

  const resetAddForm = () => {
    setNewDevice({ name: "", type: "", location: "", ipAddress: "", macAddress: "" })
    setIsAddDialogOpen(false)
    setEditDeviceId(null)
  }

  const handleEditDevice = (deviceId: number) => {
    const device = devices.find(d => d.id === deviceId)
    if (device) {
      setNewDevice({
        name: device.name,
        type: device.type,
        location: device.location,
        ipAddress: device.ipAddress,
        macAddress: device.macAddress
      })
      setEditDeviceId(deviceId)
      setIsAddDialogOpen(true)
    }
  }

  const handleSaveEdit = () => {
    if (editDeviceId !== null && newDevice.name && newDevice.type && newDevice.location) {
      const updatedDevices = devices.map(device =>
        device.id === editDeviceId
          ? {
              ...device,
              name: newDevice.name,
              type: newDevice.type,
              location: newDevice.location,
              ipAddress: newDevice.ipAddress || device.ipAddress,
              macAddress: newDevice.macAddress || device.macAddress
            }
          : device
      )
      setDevices(updatedDevices)
      if (typeof window !== 'undefined') {
        localStorage.setItem("userDevices", JSON.stringify(updatedDevices))
      }
      resetAddForm()
      showToast('success', 'Device updated', `${newDevice.name} has been updated successfully!`)
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Connected Devices</h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage your IoT devices</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              {editDeviceId ? "Edit Device" : "Add Device"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xl">
                  {editDeviceId ? <Edit className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                </div>
                {editDeviceId ? "Edit Device" : "Add New Device"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deviceName">Device Name *</Label>
                <Input
                  id="deviceName"
                  placeholder="e.g., Flow Meter - Living Room"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deviceType">Device Type *</Label>
                <Select value={newDevice.type} onValueChange={(value) => setNewDevice({ ...newDevice, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select device type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sensor">📊 Sensor</SelectItem>
                    <SelectItem value="Meter">💧 Meter</SelectItem>
                    <SelectItem value="Controller">⚙️ Controller</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deviceLocation">Location *</Label>
                <Input
                  id="deviceLocation"
                  placeholder="e.g., Kitchen, Bathroom, Pump House"
                  value={newDevice.location}
                  onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ipAddress">IP Address (Optional)</Label>
                <Input
                  id="ipAddress"
                  placeholder="e.g., 192.168.1.105"
                  value={newDevice.ipAddress}
                  onChange={(e) => setNewDevice({ ...newDevice, ipAddress: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="macAddress">MAC Address (Optional)</Label>
                <Input
                  id="macAddress"
                  placeholder="e.g., AA:BB:CC:DD:EE:55"
                  value={newDevice.macAddress}
                  onChange={(e) => setNewDevice({ ...newDevice, macAddress: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={resetAddForm}>
                Cancel
              </Button>
              <Button onClick={editDeviceId ? handleSaveEdit : handleAddDevice} className="bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                {editDeviceId ? <Edit className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                {editDeviceId ? "Save Changes" : "Add Device"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {/* Delete confirmation dialog and toasts */}
      <AlertDialog open={deleteConfirm !== null} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Delete Device?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Are you sure you want to delete this device? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <AlertDialogCancel onClick={() => setDeleteConfirm(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDevice} className="bg-red-600 hover:bg-red-700 text-white">
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
            <button onClick={() => removeToast(toast.id)} title="Close notification" className={`shrink-0 ml-2 h-5 w-5 inline-flex items-center justify-center rounded hover:opacity-70 transition-opacity ${
              toast.type === 'success' ? 'text-green-600 dark:text-green-400' : toast.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
            }`}>
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device: any) => (
          <Card
            key={device.id}
            className="glass-light border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-200 relative group"
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-lg bg-linear-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-2xl shadow-md">
                  {device.type === "Sensor" && "📊"}
                  {device.type === "Meter" && "💧"}
                  {device.type === "Controller" && "⚙️"}
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={`${
                      device.status === "online" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                    } text-white`}
                  >
                    {device.status === "online" ? "● Online" : "● Offline"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditDevice(device.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-1 h-8 w-8"
                    title="Edit device"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteConfirm(device.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 h-8 w-8"
                    title="Delete device"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Device Details */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">{device.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Type: {device.type}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Location: {device.location}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Last seen</span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">{device.lastPing}</span>
                </div>
              </div>

              {/* Action Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full mt-4 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xl">
                        {device.type === "Sensor" && "📊"}
                        {device.type === "Meter" && "💧"}
                        {device.type === "Controller" && "⚙️"}
                      </div>
                      {device.name}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Status Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800 md:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-2 mb-2">
                          {device.status === "online" ? <Wifi className="w-4 h-4 text-green-600" /> : <WifiOff className="w-4 h-4 text-red-600" />}
                          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Status</span>
                        </div>
                        <p className={`font-bold text-lg ${device.status === "online" ? "text-green-600" : "text-red-600"}`}>
                          {device.status === "online" ? "🟢 Online" : "🔴 Offline"}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleStatusChange(device.id, "online")}
                            className={`flex-1 p-2 rounded transition-colors ${
                              device.status === "online"
                                ? "bg-green-600 text-white"
                                : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-300"
                            }`}
                            title="Set Online"
                          >
                            <Wifi className="w-4 h-4 mx-auto" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(device.id, "offline")}
                            className={`flex-1 p-2 rounded transition-colors ${
                              device.status === "offline"
                                ? "bg-red-600 text-white"
                                : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-300"
                            }`}
                            title="Set Offline"
                          >
                            <WifiOff className="w-4 h-4 mx-auto" />
                          </button>
                        </div>
                      </div>

                      <div className="bg-linear-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Battery</span>
                        </div>
                        <p className="font-bold text-lg text-blue-600">{device.battery}%</p>
                      </div>

                      <div className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-4 h-4 text-purple-600" />
                          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Signal</span>
                        </div>
                        <p className="font-bold text-lg text-purple-600">{device.signal}</p>
                      </div>

                      <div className="bg-linear-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-orange-600" />
                          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Last Ping</span>
                        </div>
                        <p className="font-bold text-sm text-orange-600">{device.lastPing}</p>
                      </div>
                    </div>

                    {/* Device Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Device Information</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Type</span>
                            <span className="font-medium text-gray-900 dark:text-white">{device.type}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Location</span>
                            <span className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {device.location}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Firmware</span>
                            <span className="font-medium text-gray-900 dark:text-white">{device.firmware}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Installation Date</span>
                            <span className="font-medium text-gray-900 dark:text-white">{device.installationDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Network Information</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-sm text-gray-600 dark:text-gray-400">IP Address</span>
                            <span className="font-medium text-gray-900 dark:text-white font-mono text-sm">{device.ipAddress}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-sm text-gray-600 dark:text-gray-400">MAC Address</span>
                            <span className="font-medium text-gray-900 dark:text-white font-mono text-sm">{device.macAddress}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Readings */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Recent Readings</h4>
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                        {device.readings.length > 0 ? (
                          <div className="space-y-2">
                            {device.readings.slice(0, 5).map((reading: any, index: number) => (
                              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                                <span className="text-sm text-gray-600 dark:text-gray-400">{reading.timestamp}</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {reading.value} {reading.unit}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No readings available</p>
                        )}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
