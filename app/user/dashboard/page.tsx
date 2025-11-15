"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropletIcon, Activity, AlertTriangle, TrendingUp, Clock } from "lucide-react"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import WeatherForecast from "@/components/WeatherForecast"
import { Button } from "@/components/ui/button"



export default function UserDashboard() {
  const router = useRouter()
  const [tankLevel, setTankLevel] = useState(75)
  const [motorStatus, setMotorStatus] = useState<'running' | 'stopped' | 'error'>('running')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [liveUsage, setLiveUsage] = useState(542)
  const [flowRate, setFlowRate] = useState(12.5)
  const [isHydrated, setIsHydrated] = useState(false)
  const [usageData, setUsageData] = useState([
    { time: "00:00", usage: 45 },
    { time: "04:00", usage: 25 },
    { time: "08:00", usage: 85 },
    { time: "12:00", usage: 120 },
    { time: "16:00", usage: 95 },
    { time: "20:00", usage: 110 },
    { time: "23:00", usage: 60 },
  ])

  // Load motor settings from localStorage on mount and listen for changes
  useEffect(() => {
    const savedMotorStatus = localStorage.getItem("motorStatus")
    if (savedMotorStatus) {
      setMotorStatus(savedMotorStatus as 'running' | 'stopped' | 'error')
    }

    // Listen for storage changes (when motor status is updated from tank page)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "motorStatus" && e.newValue) {
        setMotorStatus(e.newValue as 'running' | 'stopped' | 'error')
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Also check for changes every second as fallback
    const interval = setInterval(() => {
      const currentMotorStatus = localStorage.getItem("motorStatus")
      if (currentMotorStatus && currentMotorStatus !== motorStatus) {
        setMotorStatus(currentMotorStatus as 'running' | 'stopped' | 'error')
      }
    }, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [motorStatus])

  // Update time and live data every second
  useEffect(() => {
    setIsHydrated(true)
    const interval = setInterval(() => {
      setCurrentTime(new Date())
      // Simulate live usage updates
      setLiveUsage(prev => {
        const change = (Math.random() - 0.5) * 10 // Random change between -5 and +5
        return Math.max(0, prev + change)
      })
      // Simulate flow rate updates
      setFlowRate(prev => {
        const change = (Math.random() - 0.5) * 2 // Random change between -1 and +1
        return Math.max(0, prev + change)
      })
      // Update usage data for real-time chart
      setUsageData(prev => {
        const newData = [...prev]
        const lastIndex = newData.length - 1
        const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 5)
        const newUsage = Math.max(0, newData[lastIndex].usage + (Math.random() - 0.5) * 20)

        newData[lastIndex] = { time: currentTime, usage: Math.round(newUsage) }
        return newData
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-400">Real-time water usage monitoring</p>
      </div>

      {/* Alert Banner */}
      <div className="glass-light border-l-4 border-yellow-400 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-yellow-900 dark:text-yellow-100">Tank 75% Full</p>
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Auto shutoff will activate when tank reaches 90%
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Tank Level", value: "75%", icon: DropletIcon, color: "from-cyan-500 to-blue-600", clickable: true },
          { title: "Flow Rate", value: `${flowRate.toFixed(1)} L/min`, icon: Activity, color: "from-blue-500 to-indigo-600", live: true },
          {
            title: "Motor Status",
            value: motorStatus === 'running' ? 'Running' : motorStatus === 'error' ? 'Error' : 'Stopped',
            icon: TrendingUp,
            color: motorStatus === 'running' ? "from-green-500 to-emerald-600" : motorStatus === 'error' ? "from-red-500 to-red-600" : "from-gray-500 to-gray-600",
            status: motorStatus
          },
          { title: "Today's Usage", value: `${liveUsage.toFixed(0)} L`, icon: DropletIcon, color: "from-purple-500 to-pink-600", live: true },
        ].map((metric, i) => (
          <Card
            key={i}
            className={`glass-light border-blue-200 dark:border-blue-800 relative overflow-hidden ${metric.clickable ? 'cursor-pointer hover:shadow-lg transition-all duration-200' : ''}`}
            onClick={metric.clickable ? () => router.push('/user/tank') : undefined}
          >
            {metric.live && (
              <div className="absolute top-2 right-2 flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-red-500 font-medium">LIVE</span>
              </div>
            )}
            {metric.status && (
              <div className="absolute top-2 right-2 flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${metric.status === 'running' ? 'bg-green-500 animate-pulse' : metric.status === 'error' ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                <span className={`text-xs font-medium ${metric.status === 'running' ? 'text-green-500' : metric.status === 'error' ? 'text-red-500' : 'text-gray-400'}`}>
                  {metric.status === 'running' ? 'ON' : metric.status === 'error' ? 'ERROR' : 'OFF'}
                </span>
              </div>
            )}
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-between">
                {metric.title}
                <metric.icon className="w-5 h-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold bg-linear-to-r ${metric.color} bg-clip-text text-transparent`}>
                {metric.value}
              </p>
              {metric.live && (
                <div className="flex items-center gap-1 mt-2">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {isHydrated ? currentTime.toLocaleTimeString() : 'Loading...'}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Chart */}
        <Card className="glass-light border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Today's Usage Pattern
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-red-500 font-medium">LIVE</span>
              </div>
            </CardTitle>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              Last updated: {isHydrated ? currentTime.toLocaleTimeString() : 'Loading...'}
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={usageData}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(34, 197, 255)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="rgb(34, 197, 255)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,150,200,0.1)" />
                <XAxis dataKey="time" stroke="rgba(100,100,100,0.5)" />
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
                <Area
                  type="monotone"
                  dataKey="usage"
                  stroke="rgb(34, 197, 255)"
                  fillOpacity={1}
                  fill="url(#colorUsage)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tank Level Chart */}
        <Card className="glass-light border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle>Tank Level - 24 Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usageData}>
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
                <Line type="monotone" dataKey="usage" stroke="rgb(99, 102, 241)" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Forecast */}
      <WeatherForecast />
    </div>
  )
}