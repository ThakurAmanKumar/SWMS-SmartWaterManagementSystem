"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleButton } from "@/components/toggle-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Settings, Power, Zap, Droplet, Clock, Gauge, Plus, Eye, Edit, Trash2 } from "lucide-react"
import Image from "next/image"

interface Tank {
  id: string
  name: string
  level: number
  motorMode: 'auto' | 'manual'
  motorStatus: 'running' | 'stopped' | 'error'
  flowRate: number
  lastUpdated: Date
  capacity: number
  isMain: boolean
  connectedTo: string | null
  connectionMethod: 'wired' | 'pipe' | null
}

const tankData = [
  { time: "00:00", level: 45 },
  { time: "04:00", level: 38 },
  { time: "08:00", level: 62 },
  { time: "12:00", level: 70 },
  { time: "16:00", level: 68 },
  { time: "20:00", level: 75 },
]

export default function TankPage() {
  const [tanks, setTanks] = useState<Tank[]>([])
  const [currentTankId, setCurrentTankId] = useState<string>("")
  const [newTankName, setNewTankName] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [editingTankId, setEditingTankId] = useState<string | null>(null)
  const [editingTankName, setEditingTankName] = useState("")
  const [activityHistory, setActivityHistory] = useState<{[key: string]: Array<{event: 'start' | 'stop', timestamp: Date}>}>({})
  const [motorStartTime, setMotorStartTime] = useState<{[key: string]: Date | null}>({})
  const [elapsedTime, setElapsedTime] = useState<{[key: string]: string}>({})
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false)
  const [selectedConnectionMethods, setSelectedConnectionMethods] = useState<{[tankId: string]: 'wired' | 'pipe' | null}>({})
  const [isTCFDialogOpen, setIsTCFDialogOpen] = useState(false)

  // Load tanks and last updated times from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTanks = localStorage.getItem("tanks")
      const savedActivityHistory = localStorage.getItem("activityHistory")

      if (savedTanks) {
        try {
          const parsedTanks = JSON.parse(savedTanks).map((tank: any) => ({
            ...tank,
            lastUpdated: new Date(tank.lastUpdated)
          }))
          setTanks(parsedTanks)
          if (parsedTanks.length > 0) {
            setCurrentTankId(parsedTanks[0].id)
          }
        } catch (error) {
          console.error('Error loading tanks from localStorage:', error)
          localStorage.removeItem("tanks")
          // Set default tank
          const defaultTank: Tank = {
            id: "default",
            name: "Main Tank",
            level: 75,
            motorMode: 'auto',
            motorStatus: 'running',
            flowRate: 12.5,
            lastUpdated: new Date(),
            capacity: 1000,
            isMain: true,
            connectedTo: null,
            connectionMethod: null
          }
          setTanks([defaultTank])
          setCurrentTankId(defaultTank.id)
        }
      } else {
        // Default tank
        const defaultTank: Tank = {
          id: "default",
          name: "Main Tank",
          level: 75,
          motorMode: 'auto',
          motorStatus: 'running',
          flowRate: 12.5,
          lastUpdated: new Date(),
          capacity: 1000,
          isMain: true,
          connectedTo: null,
          connectionMethod: null
        }
        setTanks([defaultTank])
        setCurrentTankId(defaultTank.id)
      }

      if (savedActivityHistory) {
        try {
          const parsedHistory = JSON.parse(savedActivityHistory)
          const historyWithDates = Object.keys(parsedHistory).reduce((acc, key) => {
            acc[key] = parsedHistory[key].map((entry: any) => ({
              event: entry.event,
              timestamp: new Date(entry.timestamp)
            }))
            return acc
          }, {} as {[key: string]: Array<{event: 'start' | 'stop', timestamp: Date}>})
          setActivityHistory(historyWithDates)
        } catch (error) {
          console.error('Error loading activity history from localStorage:', error)
          localStorage.removeItem("activityHistory")
        }
      }
    }
  }, [])

  // Save tanks to localStorage whenever tanks change
  useEffect(() => {
    if (typeof window !== 'undefined' && tanks.length > 0) {
      localStorage.setItem("tanks", JSON.stringify(tanks))
    }
  }, [tanks])



  const currentTank = tanks.find(t => t.id === currentTankId) || tanks[0]

  // Calculate refill time based on current level and flow rate
  const calculateRefillTime = (tank: Tank) => {
    const remainingCapacity = tank.capacity - (tank.capacity * tank.level) / 100
    const hours = remainingCapacity / tank.flowRate
    const h = Math.floor(hours)
    const m = Math.floor((hours - h) * 60)
    return `${h} hours ${m} mins`
  }

  // Update tanks and simulate changes
  useEffect(() => {
    if (!currentTank) return

    const interval = setInterval(() => {
      setTanks(prevTanks => prevTanks.map(tank => {
        if (tank.id === currentTankId) {
          let newLevel = tank.level
          let newFlowRate = tank.flowRate
          let newLastUpdated = tank.lastUpdated

          // Simulate tank level changes when motor is running
          if (tank.motorStatus === 'running' && tank.motorMode === 'auto') {
            const change = Math.random() * 0.5 // Slow increase
            newLevel = Math.min(100, tank.level + change)
            newLastUpdated = new Date()
          }

          // Simulate flow rate fluctuations
          const flowChange = (Math.random() - 0.5) * 2
          newFlowRate = Math.max(0, tank.flowRate + flowChange)

          return {
            ...tank,
            level: newLevel,
            flowRate: newFlowRate,
            lastUpdated: newLastUpdated
          }
        }
        return tank
      }))


    }, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [currentTankId, currentTank?.motorStatus, currentTank?.motorMode, tanks])

  // Update elapsed time for running motors
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => {
        const newElapsed = { ...prev }
        Object.keys(motorStartTime).forEach(tankId => {
          if (motorStartTime[tankId]) {
            const elapsed = Date.now() - motorStartTime[tankId].getTime()
            const hours = Math.floor(elapsed / (1000 * 60 * 60))
            const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((elapsed % (1000 * 60)) / 1000)
            newElapsed[tankId] = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
          }
        })
        return newElapsed
      })
    }, 1000) // Update every second

    return () => clearInterval(interval)
  }, [motorStartTime])

  const handleMotorToggle = () => {
    if (currentTank && currentTank.motorMode === 'manual') {
      const newStatus = currentTank.motorStatus === 'running' ? 'stopped' : 'running'
      setTanks(prevTanks => prevTanks.map(tank =>
        tank.id === currentTankId ? { ...tank, motorStatus: newStatus } : tank
      ))
      // Add activity entry when motor status changes
      addActivityEntry(currentTankId, newStatus === 'running' ? 'start' : 'stop')
    }
  }

  const handleModeChange = (mode: 'auto' | 'manual') => {
    setTanks(prevTanks => prevTanks.map(tank => {
      if (tank.id === currentTankId) {
        const newStatus = mode === 'auto' ? 'running' : tank.motorStatus
        return { ...tank, motorMode: mode, motorStatus: newStatus }
      }
      return tank
    }))
    // Add activity entry when mode changes (especially when auto mode starts motor)
    if (mode === 'auto') {
      addActivityEntry(currentTankId, 'start')
    }
  }

  const addNewTank = () => {
    if (newTankName.trim()) {
      const newTank: Tank = {
        id: Date.now().toString(),
        name: newTankName.trim(),
        level: 50,
        motorMode: 'auto',
        motorStatus: 'running',
        flowRate: 12.5,
        lastUpdated: new Date(),
        capacity: 1000,
        isMain: false,
        connectedTo: null,
        connectionMethod: null
      }
      setTanks(prev => [...prev, newTank])
      setCurrentTankId(newTank.id)
      setNewTankName("")
      setIsAddDialogOpen(false)
    }
  }

  const switchTank = (tankId: string) => {
    setCurrentTankId(tankId)
    setIsViewDialogOpen(false)
  }

  const startEditingTank = (tankId: string, currentName: string) => {
    setEditingTankId(tankId)
    setEditingTankName(currentName)
  }

  const saveTankName = () => {
    if (editingTankId && editingTankName.trim()) {
      setTanks(prevTanks => prevTanks.map(tank =>
        tank.id === editingTankId ? { ...tank, name: editingTankName.trim() } : tank
      ))
      setEditingTankId(null)
      setEditingTankName("")
    }
  }

  const deleteTank = (tankId: string) => {
    setTanks(prevTanks => prevTanks.filter(tank => tank.id !== tankId))
    if (currentTankId === tankId) {
      const remainingTanks = tanks.filter(tank => tank.id !== tankId)
      setCurrentTankId(remainingTanks.length > 0 ? remainingTanks[0].id : "")
    }
  }

  // Add activity entry when motor status changes
  const addActivityEntry = (tankId: string, event: 'start' | 'stop') => {
    setActivityHistory(prev => {
      const updatedHistory = {
        ...prev,
        [tankId]: [...(prev[tankId] || []), { event, timestamp: new Date() }]
      }
      // Save to localStorage immediately, like taps section
      if (typeof window !== 'undefined') {
        localStorage.setItem("activityHistory", JSON.stringify(updatedHistory))
      }
      return updatedHistory
    })

    if (event === 'start') {
      setMotorStartTime(prev => ({
        ...prev,
        [tankId]: new Date()
      }))
    } else if (event === 'stop') {
      setMotorStartTime(prev => ({
        ...prev,
        [tankId]: null
      }))
      setElapsedTime(prev => ({
        ...prev,
        [tankId]: ''
      }))
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tank Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor and control your water tanks</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
                <Plus className="w-4 h-4 mr-2" />
                Add Tank
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Tank</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Enter tank name"
                  value={newTankName}
                  onChange={(e) => setNewTankName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addNewTank()}
                />
                <Button onClick={addNewTank} className="w-full">
                  Add Tank
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Tank Name Dialog */}
      <Dialog open={editingTankId !== null} onOpenChange={() => setEditingTankId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tank Name</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Enter new tank name"
              value={editingTankName}
              onChange={(e) => setEditingTankName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && saveTankName()}
            />
            <div className="flex gap-2">
              <Button onClick={saveTankName} className="flex-1">
                Save
              </Button>
              <Button variant="outline" onClick={() => setEditingTankId(null)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tank Visualization */}
      <Card className={`glass-light ${currentTank?.isMain ? 'border-blue-200 dark:border-blue-800' : 'border-purple-200 dark:border-purple-800'}`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className={`${currentTank?.isMain ? 'text-blue-900 dark:text-blue-100' : 'text-purple-900 dark:text-purple-100'}`}>
              Tank Status - {currentTank?.name}
            </CardTitle>
            {!currentTank?.isMain && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => startEditingTank(currentTank.id, currentTank.name)}
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTank(currentTank.id)}
                  className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
          {tanks.length > 1 && (
            <div className="flex gap-2">
              <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="transition-all duration-200 hover:scale-105 cursor-pointer">
                    <Eye className="w-4 h-4 mr-2" />
                    View Other Tanks
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Select Tank</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2">
                    {tanks.map((tank) => (
                      <div key={tank.id} className="flex items-center gap-2">
                        <Button
                          variant={tank.id === currentTankId ? "default" : "outline"}
                          className="flex-1 justify-start"
                          onClick={() => switchTank(tank.id)}
                        >
                          {tank.name} - {tank.level.toFixed(0)}%
                        </Button>
                        {!tank.isMain && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditingTank(tank.id, tank.name)}
                              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTank(tank.id)}
                              className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={isConnectDialogOpen} onOpenChange={setIsConnectDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 transition-all duration-200 hover:scale-105 cursor-pointer"
                    onClick={() => setSelectedConnectionMethods({})}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-blue-600" />
                      Tank Connection Manager - Real-time Network
                    </DialogTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Establish connections between tanks using different connection methods
                    </p>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* Main Tank Display */}
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100">Main Tank (Hub)</h3>
                        <div className="ml-auto px-3 py-1 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Online</span>
                        </div>
                      </div>
                      {(() => {
                        const mainTank = tanks.find(t => t.isMain)
                        return mainTank ? (
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-blue-600">{mainTank.level.toFixed(0)}%</p>
                              <p className="text-sm text-gray-600">Water Level</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-blue-600">{mainTank.flowRate.toFixed(1)} L/min</p>
                              <p className="text-sm text-gray-600">Flow Rate</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-blue-600">{mainTank.capacity}L</p>
                              <p className="text-sm text-gray-600">Capacity</p>
                            </div>
                          </div>
                        ) : null
                      })() as React.ReactNode}
                    </div>

                    {/* Connection Methods */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Settings className="w-4 h-4 text-purple-500" />
                        Connection Methods
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                          <h5 className="font-medium text-gray-900 dark:text-white mb-2">Connection Methods</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Select connection method for each tank individually below</p>
                        </div>
                      </div>
                    </div>

                    {/* Available Tanks to Connect */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        Available Tanks - Select Connection Method
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tanks.filter(tank => !tank.isMain).map((tank) => (
                          <div key={tank.id} className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${tank.connectedTo ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                                <span className="font-medium text-gray-800 dark:text-white">{tank.name}</span>
                                {tank.connectedTo && (
                                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs rounded-full">
                                    Connected
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                              <div>
                                <p className="text-gray-600 dark:text-gray-400">Level</p>
                                <p className="font-semibold">{tank.level.toFixed(0)}%</p>
                              </div>
                              <div>
                                <p className="text-gray-600 dark:text-gray-400">Status</p>
                                <p className={`font-semibold ${tank.motorStatus === 'running' ? 'text-green-600' : 'text-gray-600'}`}>
                                  {tank.motorStatus === 'running' ? 'Active' : 'Inactive'}
                                </p>
                              </div>
                            </div>

                            {!tank.connectedTo ? (
                              <div className="space-y-2">
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Choose connection method:</p>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedConnectionMethods(prev => ({
                                        ...prev,
                                        [tank.id]: prev[tank.id] === 'wired' ? null : 'wired'
                                      }))
                                    }}
                                    className={`flex-1 text-xs transition-all duration-200 cursor-pointer ${
                                      selectedConnectionMethods[tank.id] === 'wired'
                                        ? 'bg-green-100 hover:bg-green-300 border-green-400 text-green-900 shadow-lg transform scale-105'
                                        : 'bg-gray-50 hover:bg-green-100 border-gray-300 text-gray-600 hover:text-green-700 hover:border-green-400'
                                    }`}
                                  >
                                    <Zap className="w-3 h-3 mr-1" />
                                    Wired
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedConnectionMethods(prev => ({
                                        ...prev,
                                        [tank.id]: prev[tank.id] === 'pipe' ? null : 'pipe'
                                      }))
                                    }}
                                    className={`flex-1 text-xs transition-all duration-200 cursor-pointer ${
                                      selectedConnectionMethods[tank.id] === 'pipe'
                                        ? 'bg-orange-100 hover:bg-orange-300 border-orange-400 text-orange-900 shadow-lg transform scale-105'
                                        : 'bg-gray-50 hover:bg-orange-100 border-gray-300 text-gray-600 hover:text-orange-700 hover:border-orange-400'
                                    }`}
                                  >
                                    <Droplet className="w-3 h-3 mr-1" />
                                    Pipe
                                  </Button>
                                </div>
                                <div className="flex gap-2 mt-2">
                                  <Button
                                    size="sm"
                                    disabled={!selectedConnectionMethods[tank.id]}
                                    onClick={() => {
                                      const method = selectedConnectionMethods[tank.id]
                                      if (method) {
                                        setTanks(prevTanks => prevTanks.map(t =>
                                          t.id === tank.id
                                            ? { ...t, connectedTo: tanks.find(mt => mt.isMain)?.id || null, connectionMethod: method }
                                            : t
                                        ))
                                        setSelectedConnectionMethods(prev => {
                                          const newMethods = { ...prev }
                                          delete newMethods[tank.id]
                                          return newMethods
                                        })
                                      }
                                    }}
                                    className={`flex-1 text-xs cursor-pointer transition-all duration-200 ${
                                      selectedConnectionMethods[tank.id]
                                        ? 'bg-blue-500 hover:bg-blue-700 text-white shadow-lg transform hover:scale-105'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                  >
                                    Connect
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedConnectionMethods(prev => {
                                        const newMethods = { ...prev }
                                        delete newMethods[tank.id]
                                        return newMethods
                                      })
                                    }}
                                    className="flex-1 text-xs cursor-pointer transition-all duration-200 bg-gray-50 hover:bg-red-50 border-gray-300 hover:border-red-300 text-gray-600 hover:text-red-700 hover:shadow-md"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                  <p className="text-xs text-green-700 dark:text-green-300 flex items-center gap-1">
                                    <Zap className="w-3 h-3" />
                                    Successfully Connected to Main Tank
                                  </p>
                                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                    Connection established • Real-time sync active
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    setTanks(prevTanks => prevTanks.map(t =>
                                      t.id === tank.id ? { ...t, connectedTo: null, connectionMethod: null } : t
                                    ))
                                  }}
                                  className="w-full bg-red-500 hover:bg-red-600"
                                >
                                  Disconnect
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Connection Status Summary */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                        <Gauge className="w-4 h-4" />
                        Network Status & Analytics
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{tanks.length}</p>
                          <p className="text-gray-600 dark:text-gray-400">Total Tanks</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-600">
                            {tanks.filter(t => t.connectionMethod === 'pipe').length + Object.values(selectedConnectionMethods).filter(m => m === 'pipe').length}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">Pipe Connections</p>
                          {Object.values(selectedConnectionMethods).filter(m => m === 'pipe').length > 0 && (
                            <p className="text-xs text-orange-500 mt-1">+{Object.values(selectedConnectionMethods).filter(m => m === 'pipe').length} pending</p>
                          )}
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">
                            {tanks.filter(t => t.connectionMethod === 'wired').length + Object.values(selectedConnectionMethods).filter(m => m === 'wired').length}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">Wired Connections</p>
                          {Object.values(selectedConnectionMethods).filter(m => m === 'wired').length > 0 && (
                            <p className="text-xs text-blue-500 mt-1">+{Object.values(selectedConnectionMethods).filter(m => m === 'wired').length} pending</p>
                          )}
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{tanks.filter(t => t.motorStatus === 'running').length}</p>
                          <p className="text-gray-600 dark:text-gray-400">Active Motors</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">
                            {tanks.reduce((sum, tank) => sum + (tank.capacity * tank.level / 100), 0).toFixed(0)}L
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">Total Water</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={isTCFDialogOpen} onOpenChange={setIsTCFDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700 transition-all duration-200 hover:scale-105 cursor-pointer"
                  >
                    TCF
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[650px] max-h-[90vh] overflow-y-auto glass-light border-green-200 dark:border-green-800">
                  <DialogHeader className="pb-4">
                    <DialogTitle className="text-center text-xl font-bold text-green-900 dark:text-green-100">
                      Smart Water Management – SWMS
                    </DialogTitle>
                    <DialogDescription className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Tank Connection Format (TCF)
                    </DialogDescription>
                  </DialogHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-center">
                      <div className="relative w-full max-w-lg p-4 bg-gradient-to-r from-white/60 to-green-50/60 dark:from-white/5 dark:to-green-900/20 rounded-xl border border-green-200 dark:border-green-800 shadow-lg">
                        <Image
                          src="/TankConnectionIMG.png"
                          alt="Tank Connection Format"
                          width={550}
                          height={350}
                          className="w-full h-auto rounded-lg object-contain"
                          priority
                        />
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        onClick={() => setIsTCFDialogOpen(false)}
                        className="w-full max-w-xs bg-green-50 hover:bg-green-100 border-green-200 text-green-700 transition-all duration-200 hover:scale-105"
                      >
                        Close
                      </Button>
                    </div>
                  </CardContent>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center items-end gap-8">
            {/* Enhanced Well/Tank Structure */}
            <div className="relative">
              {/* Well outer walls with enhanced design */}
              <div className={`w-44 h-60 border-8 ${currentTank?.isMain ? 'border-gray-600 dark:border-gray-400 bg-gradient-to-b from-stone-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900' : 'border-purple-600 dark:border-purple-400 bg-gradient-to-b from-violet-200 via-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900'} rounded-t-lg relative shadow-2xl`}>
                {/* Well structure details */}
                <div className="absolute top-2 left-2 right-2 h-3 bg-gradient-to-r from-stone-400 to-stone-500 dark:from-gray-600 dark:to-gray-700 rounded-full opacity-60"></div>
                <div className="absolute top-6 left-2 right-2 h-2 bg-gradient-to-r from-stone-300 to-stone-400 dark:from-gray-500 dark:to-gray-600 rounded-full opacity-40"></div>

                {/* Water inside well with realistic animation */}
                <div className="absolute inset-0 flex flex-col-reverse rounded-t-lg overflow-hidden">
                  <div
                    className={`w-full transition-all duration-1000 ease-in-out shadow-inner ${currentTank?.isMain ? 'bg-gradient-to-t from-cyan-500 via-cyan-400 to-blue-400 dark:from-cyan-600 dark:via-cyan-500 dark:to-blue-500' : 'bg-gradient-to-t from-purple-500 via-violet-400 to-indigo-400 dark:from-purple-600 dark:via-violet-500 dark:to-indigo-500'}`}
                    style={{
                      height: `${currentTank?.level || 0}%`,
                      background: currentTank?.isMain ? `linear-gradient(to top,
                        ${(currentTank?.level || 0) > 80 ? '#06b6d4' : (currentTank?.level || 0) > 60 ? '#0891b2' : (currentTank?.level || 0) > 40 ? '#0e7490' : '#164e63'} 0%,
                        ${(currentTank?.level || 0) > 80 ? '#22d3ee' : (currentTank?.level || 0) > 60 ? '#06b6d4' : (currentTank?.level || 0) > 40 ? '#0891b2' : '#0e7490'} 50%,
                        ${(currentTank?.level || 0) > 80 ? '#67e8f9' : (currentTank?.level || 0) > 60 ? '#22d3ee' : (currentTank?.level || 0) > 40 ? '#06b6d4' : '#0891b2'} 100%)` : `linear-gradient(to top,
                        ${(currentTank?.level || 0) > 80 ? '#8b5cf6' : (currentTank?.level || 0) > 60 ? '#7c3aed' : (currentTank?.level || 0) > 40 ? '#6d28d9' : '#5b21b6'} 0%,
                        ${(currentTank?.level || 0) > 80 ? '#a78bfa' : (currentTank?.level || 0) > 60 ? '#8b5cf6' : (currentTank?.level || 0) > 40 ? '#7c3aed' : '#6d28d9'} 50%,
                        ${(currentTank?.level || 0) > 80 ? '#c4b5fd' : (currentTank?.level || 0) > 60 ? '#a78bfa' : (currentTank?.level || 0) > 40 ? '#8b5cf6' : '#7c3aed'} 100%)`
                    }}
                  >
                    {/* Enhanced water ripple effects */}
                    <div className="absolute top-0 w-full h-1 bg-white/40 blur-sm animate-pulse"></div>
                    <div className="absolute top-1 w-full h-0.5 bg-white/20 blur-sm animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute top-2 w-full h-0.5 bg-white/10 blur-sm animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                </div>

                {/* Level indicator text with enhanced styling */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/20 dark:bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white drop-shadow-lg">{currentTank?.level.toFixed(0) || 0}%</span>
                  </div>
                </div>

                {/* Enhanced well top opening */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-52 h-4 bg-gradient-to-r from-stone-400 via-gray-400 to-stone-500 dark:from-gray-600 dark:via-gray-500 dark:to-gray-700 rounded-full shadow-lg border-2 border-stone-300 dark:border-gray-600"></div>

                {/* Well depth markers */}
                <div className="absolute left-0 top-4 bottom-4 w-1 bg-stone-400 dark:bg-gray-600 rounded-r-full">
                  <div className="absolute top-0 w-2 h-2 bg-stone-500 dark:bg-gray-500 rounded-full -left-0.5"></div>
                  <div className="absolute top-1/4 w-2 h-2 bg-stone-500 dark:bg-gray-500 rounded-full -left-0.5"></div>
                  <div className="absolute top-1/2 w-2 h-2 bg-stone-500 dark:bg-gray-500 rounded-full -left-0.5"></div>
                  <div className="absolute top-3/4 w-2 h-2 bg-stone-500 dark:bg-gray-500 rounded-full -left-0.5"></div>
                  <div className="absolute bottom-0 w-2 h-2 bg-stone-500 dark:bg-gray-500 rounded-full -left-0.5"></div>
                </div>
              </div>

              {/* Enhanced well base */}
              <div className="w-44 h-6 bg-gradient-to-b from-stone-600 via-gray-600 to-stone-700 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 rounded-b-lg shadow-lg border-t-2 border-stone-500 dark:border-gray-600"></div>

              {/* Ground/base area */}
              <div className="w-52 h-3 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 dark:from-amber-900 dark:via-amber-950 dark:to-black rounded-lg shadow-lg -mt-1 mx-auto"></div>
            </div>

            {/* Enhanced Tank Details */}
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border shadow-lg ${currentTank?.isMain ? 'bg-gradient-to-r from-white/60 to-cyan-50/60 dark:from-white/5 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800' : 'bg-gradient-to-r from-white/60 to-purple-50/60 dark:from-white/5 dark:to-purple-900/20 border-purple-200 dark:border-purple-800'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Droplet className={`w-4 h-4 ${currentTank?.isMain ? 'text-cyan-600' : 'text-purple-600'}`} />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Level</p>
                </div>
                <p className={`text-2xl font-bold ${currentTank?.isMain ? 'text-cyan-600 dark:text-cyan-400' : 'text-purple-600 dark:text-purple-400'}`}>
                  {((currentTank?.capacity || 0) * (currentTank?.level || 0) / 100).toFixed(0)} L
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ${currentTank?.isMain ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-gradient-to-r from-purple-500 to-violet-500'}`}
                    style={{ width: `${currentTank?.level || 0}%` }}
                  ></div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border shadow-lg ${currentTank?.isMain ? 'bg-gradient-to-r from-white/60 to-blue-50/60 dark:from-white/5 dark:to-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-gradient-to-r from-white/60 to-indigo-50/60 dark:from-white/5 dark:to-indigo-900/20 border-indigo-200 dark:border-indigo-800'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Gauge className={`w-4 h-4 ${currentTank?.isMain ? 'text-blue-600' : 'text-indigo-600'}`} />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Capacity</p>
                </div>
                <p className={`text-2xl font-bold ${currentTank?.isMain ? 'text-blue-600 dark:text-blue-400' : 'text-indigo-600 dark:text-indigo-400'}`}>{currentTank?.capacity || 0} L</p>
              </div>

              <div className={`p-4 rounded-lg border shadow-lg ${currentTank?.isMain ? 'bg-gradient-to-r from-white/60 to-green-50/60 dark:from-white/5 dark:to-green-900/20 border-green-200 dark:border-green-800' : 'bg-gradient-to-r from-white/60 to-pink-50/60 dark:from-white/5 dark:to-pink-900/20 border-pink-200 dark:border-pink-800'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Zap className={`w-4 h-4 ${currentTank?.isMain ? 'text-green-600' : 'text-pink-600'}`} />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Flow Rate</p>
                </div>
                <p className={`text-2xl font-bold ${currentTank?.isMain ? 'text-green-600 dark:text-green-400' : 'text-pink-600 dark:text-pink-400'}`}>{currentTank?.flowRate.toFixed(1) || 0} L/min</p>
              </div>
            </div>
          </div>

          {/* Enhanced Motor Control */}
          <div className={`p-6 rounded-xl border-2 shadow-xl backdrop-blur-sm ${currentTank?.isMain ? 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/50 dark:from-slate-800 dark:via-blue-900/20 dark:to-cyan-900/30 border-slate-200/60 dark:border-slate-700/60' : 'bg-gradient-to-br from-slate-50 via-purple-50/30 to-violet-50/50 dark:from-slate-800 dark:via-purple-900/20 dark:to-violet-900/30 border-slate-200/60 dark:border-slate-700/60'}`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full shadow-lg ring-2 ring-white/50 ${currentTank?.motorStatus === 'running' ? 'bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse shadow-green-500/50' : currentTank?.motorStatus === 'error' ? 'bg-gradient-to-r from-red-400 to-red-500 shadow-red-500/50' : 'bg-gradient-to-r from-gray-400 to-gray-500 shadow-gray-500/50'}`}></div>
                <div>
                  <div className="font-bold text-xl flex items-center gap-3 text-gray-800 dark:text-white">
                    <div className={`p-2 rounded-lg shadow-lg ${currentTank?.isMain ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-purple-500 to-violet-500'}`}>
                      <Power className="w-6 h-6 text-white" />
                    </div>
                    Motor Control
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Status: <span className={`font-semibold text-lg ${currentTank?.motorStatus === 'running' ? 'text-green-600 dark:text-green-400' : currentTank?.motorStatus === 'error' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      {currentTank?.motorStatus === 'running' ? '🟢 Running' : currentTank?.motorStatus === 'error' ? '🔴 Error' : '⚪ Stopped'}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* Mode Selection */}
                <div className="flex bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl p-1.5 shadow-inner border border-gray-300/50 dark:border-gray-600/50">
                  <Button
                    size="sm"
                    variant={currentTank?.motorMode === 'auto' ? 'default' : 'ghost'}
                    onClick={() => handleModeChange('auto')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                      currentTank?.motorMode === 'auto'
                        ? `${currentTank?.isMain ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-purple-500 to-violet-500'} text-white shadow-lg transform scale-105`
                        : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-600/50'
                    }`}
                  >
                    🤖 Auto
                  </Button>
                  <Button
                    size="sm"
                    variant={currentTank?.motorMode === 'manual' ? 'default' : 'ghost'}
                    onClick={() => handleModeChange('manual')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                      currentTank?.motorMode === 'manual'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-600/50'
                    }`}
                  >
                    👤 Manual
                  </Button>
                </div>

                {/* Power Toggle (only for manual mode) */}
                {currentTank?.motorMode === 'manual' && (
                  <Button
                    onClick={handleMotorToggle}
                    className={`px-6 py-3 font-bold text-white rounded-xl shadow-xl transform transition-all duration-200 hover:scale-105 cursor-pointer ${
                      currentTank?.motorStatus === 'running'
                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/50'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-green-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {currentTank?.motorStatus === 'running' ? '⏹️ Stop' : '▶️ Start'}
                    </div>
                  </Button>
                )}
              </div>
            </div>

            {/* Motor Details with enhanced styling */}
            <div className="grid grid-cols-2 gap-6 mt-6">
              <div className={`p-4 rounded-xl border shadow-lg backdrop-blur-sm ${currentTank?.isMain ? 'bg-gradient-to-r from-white/80 to-blue-50/60 dark:from-white/10 dark:to-blue-900/20 border-blue-200/50 dark:border-blue-800/50' : 'bg-gradient-to-r from-white/80 to-purple-50/60 dark:from-white/10 dark:to-purple-900/20 border-purple-200/50 dark:border-purple-800/50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Settings className={`w-4 h-4 ${currentTank?.isMain ? 'text-blue-600' : 'text-purple-600'}`} />
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Current Mode</p>
                </div>
                <p className="font-bold text-lg capitalize text-gray-800 dark:text-white">{currentTank?.motorMode}</p>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                  currentTank?.motorMode === 'auto' ? `${currentTank?.isMain ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'}` : 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300'
                }`}>
                  {currentTank?.motorMode === 'auto' ? '🤖 Automated' : '👤 Manual Control'}
                </div>
              </div>
              <div className={`p-4 rounded-xl border shadow-lg backdrop-blur-sm ${currentTank?.isMain ? 'bg-gradient-to-r from-white/80 to-green-50/60 dark:from-white/10 dark:to-green-900/20 border-green-200/50 dark:border-green-800/50' : 'bg-gradient-to-r from-white/80 to-pink-50/60 dark:from-white/10 dark:to-pink-900/20 border-pink-200/50 dark:border-pink-800/50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className={`w-4 h-4 ${currentTank?.isMain ? 'text-green-600' : 'text-pink-600'}`} />
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Last Motor Activity</p>
                </div>
                <p className="font-bold text-lg text-gray-800 dark:text-white">
                  {motorStartTime[currentTankId]
                    ? elapsedTime[currentTankId] || '00:00:00'
                    : activityHistory[currentTankId] && activityHistory[currentTankId].length > 0
                    ? activityHistory[currentTankId][activityHistory[currentTankId].length - 1].timestamp.toLocaleTimeString()
                    : 'No activity yet'}
                </p>
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                  🔄 Live Sync
                </div>
              </div>
            </div>

            {/* Real-time Activity Indicator */}
            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200/50 dark:border-indigo-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${currentTank?.motorStatus === 'running' ? 'bg-green-500 animate-ping' : 'bg-gray-400'}`}></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {currentTank?.motorStatus === 'running' ? 'Motor Active & Pumping Water' : 'Motor Inactive'}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Real-time Status
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Refill Info */}
          <div className={`p-4 rounded-lg border shadow-lg ${currentTank?.isMain ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800' : 'bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className={`w-4 h-4 ${currentTank?.isMain ? 'text-blue-600' : 'text-purple-600'}`} />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Refill Time</p>
            </div>
            <p className={`text-lg font-semibold ${currentTank?.isMain ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`}>{currentTank ? calculateRefillTime(currentTank) : 'N/A'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Based on current flow rate of {currentTank?.flowRate.toFixed(1) || 0} L/min
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Last Tank Updated Card */}
      <Card className="glass-light border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="text-green-900 dark:text-green-100">Motor Activity History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Real-time tracking of motor start/stop events and active motor updates
          </div>

          <div className="space-y-4">
            {tanks.map((tank) => {
              const history = activityHistory[tank.id] || []
              const lastEntry = history[history.length - 1]
              return (
                <div key={tank.id} className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className={`w-2 h-2 rounded-full ${tank.id === 'default' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                    <span className="font-medium text-gray-800 dark:text-white">{tank.name}</span>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tank.motorStatus === 'running'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300'
                    }`}>
                      {tank.motorStatus === 'running' ? '🟢 Active' : '⚪ Inactive'}
                    </div>
                  </div>
                  <div className="ml-6 space-y-1">
                    {history.slice(-5).reverse().map((entry, index) => (
                      <div key={index} className="flex items-center justify-between text-xs bg-white/50 dark:bg-gray-900/50 rounded px-2 py-1 border border-gray-200 dark:border-gray-700">
                        <span className={`font-medium ${entry.event === 'start' ? 'text-green-600' : 'text-red-600'}`}>
                          {entry.event === 'start' ? '▶️ Started' : '⏹️ Stopped'}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {entry.timestamp.toLocaleDateString()} {entry.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                    {history.length === 0 && (
                      <div className="text-xs text-gray-400 dark:text-gray-500 italic px-2 py-1">
                        No activity recorded yet
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Motor activity history is saved for each tank and persists across sessions
          </div>
        </CardContent>
      </Card>

      {/* 24-Hour Level Chart */}
      <Card className="glass-light border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle>Tank Level - 24 Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={tankData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,150,200,0.1)" />
              <XAxis dataKey="time" stroke="rgba(100,100,100,0.5)" />
              <YAxis stroke="rgba(100,100,100,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15,23,42,0.8)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Line type="monotone" dataKey="level" stroke="rgb(34, 197, 255)" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
