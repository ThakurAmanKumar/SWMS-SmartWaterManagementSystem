// app/user/settings/page.tsx
"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, X, Printer } from "lucide-react"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

interface Toast {
  id: string
  type: "success" | "error" | "info"
  title: string
  message: string
}

export default function SettingsPage() {
  // ----- Profile -----
  const initialFormData = {
    userId: "AKT25V",
    fullName: "Aman",
    email: "amanthakur@swms.com",
    phone: "+91 9876543210",
    address: "Ramnagar, Visakhapatnam, Andhra Pradesh",
    wardName: "Ramnagar",
    wardNo: "36",
  }

  const [formData, setFormData] = useState(initialFormData)

  // Load profile data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem("userProfile")
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile)
          setFormData({ ...initialFormData, ...parsedProfile })
        } catch (error) {
          console.error("Error parsing saved profile:", error)
          localStorage.removeItem("userProfile")
        }
      }
    }
  }, [])

  // ----- Toasts -----
  const [toasts, setToasts] = useState<Toast[]>([])

  // ----- Dashboard state -----
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  )
  const [waterUsage, setWaterUsage] = useState<any[]>([])
  const [tankLevel, setTankLevel] = useState<number>(72)
  const [devicesSummary, setDevicesSummary] = useState<any[]>([])
  const [complaintStats, setComplaintStats] = useState({ resolved: 0, pending: 0 })
  const [complaints, setComplaints] = useState<any[]>([])
  const [waterQuality, setWaterQuality] = useState({
    ph: 7.2,
    turbidity: 1.2,
    chlorine: 0.3,
  })
  const [weatherData, setWeatherData] = useState({
    temp: 28,
    description: "Sunny",
    icon: "☀️",
    humidity: 65,
    windSpeed: 12,
    pressure: 1013,
    hourlyTemps: [] as number[],
    feelsLike: 30,
    uvIndex: 6,
    sunrise: "6:00 AM",
    sunset: "6:00 PM",
    precipitation: 0,
    daily: [] as any[],
  })
  const [alerts, setAlerts] = useState<any[]>([])
  const [waterSupply, setWaterSupply] = useState({
    supplyCapacity: 231.6,
    totalUsage: 0.01,
    avgCoverage: 92.7,
    activeZones: 5,
  })

  // Client-side time states to avoid hydration mismatch
  const [lastUpdatedTime, setLastUpdatedTime] = useState('')
  const [weatherLastTime, setWeatherLastTime] = useState('')
  const [supplyUpdatedDate, setSupplyUpdatedDate] = useState('')

  // Set client-side times after mount to avoid hydration mismatch
  useEffect(() => {
    setLastUpdatedTime(new Date().toLocaleTimeString())
    setWeatherLastTime(new Date().toLocaleTimeString())
    setSupplyUpdatedDate(new Date().toLocaleDateString())

    // Update times periodically
    const interval = setInterval(() => {
      setLastUpdatedTime(new Date().toLocaleTimeString())
      setWeatherLastTime(new Date().toLocaleTimeString())
      setSupplyUpdatedDate(new Date().toLocaleDateString())
    }, 1000) // Update every second

    return () => clearInterval(interval)
  }, [])

  // ----- Utility: toasts -----
  const showToast = (type: Toast["type"], title: string, message: string) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, type, title, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  const removeToast = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id))

  // ----- Weather helpers -----
  const getWeatherIcon = (code: number): string => {
    const icons: Record<number, string> = {
      0: "☀️",
      1: "🌤️",
      2: "⛅",
      3: "☁️",
      45: "🌫️",
      48: "🌫️",
      51: "🌦️",
      53: "🌦️",
      55: "🌦️",
      61: "🌧️",
      63: "🌧️",
      65: "🌧️",
      66: "🌨️",
      67: "🌨️",
      71: "❄️",
      73: "❄️",
      75: "❄️",
      77: "❄️",
      80: "🌧️",
      81: "🌧️",
      82: "🌧️",
      85: "❄️",
      86: "❄️",
      95: "⛈️",
      96: "⛈️",
      99: "⛈️",
    }
    return icons[code] || "☀️"
  }

  const getWeatherDescription = (code: number): string => {
    const descriptions: Record<number, string> = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      66: "Light freezing rain",
      67: "Heavy freezing rain",
      71: "Slight snow fall",
      73: "Moderate snow fall",
      75: "Heavy snow fall",
      77: "Snow grains",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    }
    return descriptions[code] || "Unknown"
  }

  // -------------------------
  // Effects & Simulators
  // -------------------------

  // Weather fetch (open-meteo) — Vizag coords (17.6868, 83.2185)
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=17.6868&longitude=83.2185&current=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation,weathercode,windspeed_10m,pressure_msl,uv_index&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset,uv_index_max,precipitation_sum&timezone=auto`
        )
        const data = await response.json()
        const current = data.current
        if (!current) return
        const icon = getWeatherIcon(current.weathercode)
        const desc = getWeatherDescription(current.weathercode)
        const hourlyTemps = data.hourly?.temperature_2m?.slice(0, 24) || []
        const daily = data.daily ? data.daily.time.slice(0, 7).map((date: string, i: number) => ({
          date,
          maxTemp: Math.round(data.daily.temperature_2m_max[i]),
          minTemp: Math.round(data.daily.temperature_2m_min[i]),
          icon: getWeatherIcon(data.daily.weathercode[i]),
          uvIndex: data.daily.uv_index_max[i],
          precipitation: data.daily.precipitation_sum[i],
        })) : []
        setWeatherData({
          temp: Math.round(current.temperature_2m),
          description: desc,
          icon,
          humidity: current.relativehumidity_2m ?? 65,
          windSpeed: Math.round(current.windspeed_10m ?? 12),
          pressure: Math.round(current.pressure_msl ?? 1013),
          hourlyTemps,
          feelsLike: Math.round(current.apparent_temperature ?? current.temperature_2m),
          uvIndex: Math.round(current.uv_index ?? 6),
          sunrise: data.daily?.sunrise?.[0]?.split('T')[1]?.slice(0, 5) ?? "6:00",
          sunset: data.daily?.sunset?.[0]?.split('T')[1]?.slice(0, 5) ?? "18:00",
          precipitation: current.precipitation ?? 0,
          daily,
        })
      } catch (err) {
        console.error("Error fetching weather:", err)
      }
    }
    fetchWeather()
    const interval = setInterval(fetchWeather, 60000)
    return () => clearInterval(interval)
  }, [])

  // Water usage test data + streaming simulator
  useEffect(() => {
    const points = timeframe === "daily" ? 24 : timeframe === "weekly" ? 7 : 30
    const base = Array.from({ length: points }).map((_, i) => ({
      name: timeframe === "daily" ? `${i}:00` : `Day ${i + 1}`,
      usage: Math.round(Math.random() * 40 + 60),
    }))
    setWaterUsage(base)

    const interval = setInterval(() => {
      setWaterUsage((prev) => {
        const next = [...prev]
        next.push({
          name: timeframe === "daily" ? `${new Date().getHours()}:00` : `T${Date.now() % 1000}`,
          usage: Math.round(Math.random() * 40 + 60),
        })
        if (next.length > points) next.shift()
        return next
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [timeframe])

  // Fetch devices from localStorage (real-time sync with /user/devices)
  useEffect(() => {
    const fetchDevices = () => {
      try {
        const savedDevices = localStorage.getItem("userDevices")
        if (savedDevices) {
          const devices = JSON.parse(savedDevices)
          setDevicesSummary(devices)
        } else {
          setDevicesSummary([])
        }
      } catch (error) {
        console.error('Error fetching devices from localStorage:', error)
        setDevicesSummary([])
      }
    }

    fetchDevices()
    const interval = setInterval(fetchDevices, 3000) // Poll every 3 seconds for real-time updates
    return () => clearInterval(interval)
  }, [])

  // Local storage polling for complaints/alerts
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const sc = localStorage.getItem("complaints")
        if (sc) {
          const parsed = JSON.parse(sc)
          setComplaints(parsed)
          const resolved = parsed.filter((c: any) => c.resolved || c.status === "resolved").length
          const pending = parsed.length - resolved
          setComplaintStats({ resolved, pending })
        }
        const sa = localStorage.getItem("alerts")
        if (sa) setAlerts(JSON.parse(sa))
      } catch (err) {
        // ignore parse errors
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // -------------------------
  // Actions: Save, Export, Print
  // -------------------------
  const handleSaveChanges = () => {
    localStorage.setItem("userProfile", JSON.stringify(formData))
    showToast("success", "Profile Updated", "Your profile has been updated successfully!")
  }

  const exportReport = async () => {
    try {
      const report = {
        generatedAt: new Date().toISOString(),
        site: "SWMS",
        contact: "swms.helpdesk@gmail.com",
        profileInformation: formData,
        timeframe,
        waterUsage,
        tankLevel,
        devices: devicesSummary,
        complaintStats,
        complaints,
        waterQuality,
        weatherData,
        waterSupply,
        alerts,
      }
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "swms_report.json"
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      showToast("success", "Exported", "Report exported successfully")
    } catch (err) {
      showToast("error", "Export failed", "Unable to create export")
    }
  }

const printReport = async () => {
  try {
    // ROW GENERATORS
    const usageRows = waterUsage
      .slice(-10)
      .map(
        (entry: any) => `
          <tr>
            <td style="padding:10px;border:1px solid #d1d5db;">${entry.name}</td>
            <td style="padding:10px;border:1px solid #d1d5db;">${entry.usage} L</td>
          </tr>`
      )
      .join("");

    const deviceRows = devicesSummary
      .map(
        (d: any) => `
          <tr>
            <td style="padding:10px;border:1px solid #d1d5db;">${d.name}</td>
            <td style="padding:10px;border:1px solid #d1d5db;">${d.status}</td>
            <td style="padding:10px;border:1px solid #d1d5db;">${d.lastPing || "-"}</td>
          </tr>`
      )
      .join("");

    const complaintRows = complaints
      .slice(0, 10)
      .map(
        (c: any) => `
          <tr>
            <td style="padding:10px;border:1px solid #d1d5db;">${c.complaintType || "Complaint"}</td>
            <td style="padding:10px;border:1px solid #d1d5db;">${c.status}</td>
            <td style="padding:10px;border:1px solid #d1d5db;">${new Date(
              c.submittedAt || Date.now()
            ).toLocaleDateString()}</td>
          </tr>`
      )
      .join("");

    const alertsRows = (alerts || [])
      .slice(0, 10)
      .map(
        (a: any) => `
          <tr>
            <td style="padding:10px;border:1px solid #d1d5db;">${a.title ?? a.message ?? "Alert"}</td>
            <td style="padding:10px;border:1px solid #d1d5db;">${a.severity ?? "-"}</td>
            <td style="padding:10px;border:1px solid #d1d5db;">${a.status ?? "-"}</td>
            <td style="padding:10px;border:1px solid #d1d5db;">${new Date(
              a.createdAt || a.timestamp || Date.now()
            ).toLocaleDateString()}</td>
          </tr>`
      )
      .join("");

    const weatherRows = weatherData.hourlyTemps
      .slice(0, 12)
      .map(
        (t: number, i: number) => `
          <tr>
            <td style="padding:10px;border:1px solid #d1d5db;">${i * 2}h</td>
            <td style="padding:10px;border:1px solid #d1d5db;">${Math.round(t)}°C</td>
          </tr>`
      )
      .join("");

    //----------------------------------------------------------
    // FULL HTML PRINT TEMPLATE
    //----------------------------------------------------------
    const printableBody = `
      <html>
      <head>
        <title>SWMS Report</title>
        <style>
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>

      <body style="font-family:Arial,Helvetica,sans-serif;padding:20px;color:#111;max-width:900px;margin:0 auto;">

        <!-- HEADER -->
        <table style="width:100%; margin-bottom:20px; border-collapse:collapse;">
          <tr>
            <td style="text-align:left;">
              <img src="${window.location.origin}/swms.png" style="height:120px;" />
            </td>
            <td style="text-align:right; font-size:15px; color:#374151;">
              <div style="font-weight:600; font-size:18px;">Smart Water Management System (SWMS)</div>
              <div style="margin-top:6px; color:#6b7280;">
                KRM Colony, Seethammadara<br/>
                Visakhapatnam, Andhra Pradesh – 530013
              </div>
              <div style="margin-top:10px; color:#2563eb; font-weight:600;">swms.helpdesk@gmail.com</div>
            </td>
          </tr>
        </table>

        <h1 style="text-align:center;color:#2563eb;margin:30px 0;font-size:28px;">
          Smart Water Management System — Real-time Analytics Report
        </h1>

        <p><strong>Report Generated:</strong> ${new Date().toLocaleString()}</p>

        <!-- PROFILE INFORMATION -->
        <h2 style="font-size:20px;margin-top:30px;">Profile Information</h2>

        <table style="width:100%; border-collapse:collapse; margin-bottom:25px; font-size:15px; border:1px solid #d1d5db;">
          <thead>
            <tr style="background:#f3f4f6;">
              <th style="text-align:left; padding:10px; border:1px solid #d1d5db;">Field</th>
              <th style="text-align:left; padding:10px; border:1px solid #d1d5db;">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="padding:10px; border:1px solid #d1d5db;">User ID</td><td style="padding:10px; border:1px solid #d1d5db;">${formData.userId}</td></tr>
            <tr><td style="padding:10px; border:1px solid #d1d5db;">Name</td><td style="padding:10px; border:1px solid #d1d5db;">${formData.fullName}</td></tr>
            <tr><td style="padding:10px; border:1px solid #d1d5db;">Email</td><td style="padding:10px; border:1px solid #d1d5db;">${formData.email}</td></tr>
            <tr><td style="padding:10px; border:1px solid #d1d5db;">Phone</td><td style="padding:10px; border:1px solid #d1d5db;">${formData.phone}</td></tr>
            <tr><td style="padding:10px; border:1px solid #d1d5db;">Address</td><td style="padding:10px; border:1px solid #d1d5db;">${formData.address}</td></tr>
            <tr><td style="padding:10px; border:1px solid #d1d5db;">Ward</td><td style="padding:10px; border:1px solid #d1d5db;">${formData.wardName} (${formData.wardNo})</td></tr>
            <tr><td style="padding:10px; border:1px solid #d1d5db;">City</td><td style="padding:10px; border:1px solid #d1d5db;">Visakhapatnam, Andhra Pradesh</td></tr>
          </tbody>
        </table>

        <!-- WATER USAGE -->
        <h2 style="font-size:20px;margin-top:35px;">💧 Water Usage Trends</h2>

        <table style="width:100%; border-collapse:collapse; margin-bottom:25px; font-size:15px; border:1px solid #d1d5db;">
          <thead>
            <tr style="background:#f3f4f6;">
              <th style="padding:10px; border:1px solid #d1d5db; text-align:left;">Metric</th>
              <th style="padding:10px; border:1px solid #d1d5db; text-align:left;">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding:10px; border:1px solid #d1d5db;">Current Usage</td>
              <td style="padding:10px; border:1px solid #d1d5db;">
                ${waterUsage[waterUsage.length - 1]?.usage || 0} L
              </td>
            </tr>

            <tr>
              <td style="padding:10px; border:1px solid #d1d5db;">Average Usage</td>
              <td style="padding:10px; border:1px solid #d1d5db;">
                ${Math.round(waterUsage.reduce((sum, item) => sum + item.usage, 0) / waterUsage.length)} L
              </td>
            </tr>

            <tr>
              <td style="padding:10px; border:1px solid #d1d5db;">Peak Usage</td>
              <td style="padding:10px; border:1px solid #d1d5db;">
                ${Math.max(...waterUsage.map(u => u.usage))} L
              </td>
            </tr>

            <tr>
              <td style="padding:10px; border:1px solid #d1d5db;">Morning Peak</td>
              <td style="padding:10px; border:1px solid #d1d5db;">85 L/h</td>
            </tr>

            <tr>
              <td style="padding:10px; border:1px solid #d1d5db;">Evening Peak</td>
              <td style="padding:10px; border:1px solid #d1d5db;">92 L/h</td>
            </tr>

            <tr>
              <td style="padding:10px; border:1px solid #d1d5db;">Efficiency</td>
              <td style="padding:10px; border:1px solid #d1d5db;">87%</td>
            </tr>

            <tr>
              <td style="padding:10px; border:1px solid #d1d5db;">Savings This Week</td>
              <td style="padding:10px; border:1px solid #d1d5db;">23 L/day</td>
            </tr>
          </tbody>
        </table>

        <!-- HOURLY USAGE -->
        <h2 style="font-size:20px; margin-top:35px;">⏱️ Hourly Usage</h2>

        <table style="width:100%; border-collapse:collapse; margin-bottom:25px; font-size:15px; border:1px solid #d1d5db;">
          <thead>
            <tr style="background:#f3f4f6;">
              <th style="text-align:left; padding:10px; border:1px solid #d1d5db;">Time</th>
              <th style="text-align:left; padding:10px; border:1px solid #d1d5db;">Usage (L)</th>
            </tr>
          </thead>
          <tbody>
            ${usageRows}
          </tbody>
        </table>

        <!-- DEVICE PERFORMANCE -->
        <h2 style="font-size:20px; margin-top:35px;">⚙️ Device Performance</h2>

        <table style="width:100%; border-collapse:collapse; margin-bottom:25px; font-size:15px; border:1px solid #d1d5db;">
          <thead>
            <tr style="background:#f3f4f6;">
              <th style="text-align:left; padding:10px; border:1px solid #d1d5db;">Device</th>
              <th style="text-align:left; padding:10px; border:1px solid #d1d5db;">Status</th>
              <th style="text-align:left; padding:10px; border:1px solid #d1d5db;">Last Ping</th>
            </tr>
          </thead>
          <tbody>
            ${deviceRows}
          </tbody>
        </table>


        <!-- COMPLAINT ANALYTICS -->
        <h2 style="font-size:20px; margin-top:35px;">📞 Complaint Analytics</h2>

        <table style="width:100%; border-collapse:collapse; margin-bottom:25px; font-size:15px; border:1px solid #d1d5db;">
          <thead>
            <tr style="background:#f3f4f6;">
              <th style="text-align:left; padding:10px; border:1px solid #d1d5db;">Type</th>
              <th style="text-align:left; padding:10px; border:1px solid #d1d5db;">Status</th>
              <th style="text-align:left; padding:10px; border:1px solid #d1d5db;">Date</th>
            </tr>
          </thead>
          <tbody>
            ${complaintRows}
          </tbody>
        </table>

        <!-- ALERTS -->
        <h2 style="font-size:20px; margin-top:35px;">🚨 Alerts & Notifications</h2>

        <table style="width:100%; border-collapse:collapse; margin-bottom:25px; font-size:15px; border:1px solid #d1d5db;">
          <thead>
            <tr style="background:#f3f4f6;">
              <th style="text-align:left; padding:10px; border:1px solid #d1d5db;">Title</th>
              <th style="text-align:left; padding:10px; border:1px solid #d1d5db;">Severity</th>
              <th style="text-align:left; padding:10px; border:1px solid #d1d5db;">Status</th>
              <th style="text-align:left; padding:10px; border:1px solid #d1d5db;">Date</th>
            </tr>
          </thead>
          <tbody>
            ${alertsRows}
          </tbody>
        </table>

        <!-- OFFICIAL SIGNATURE -->
        <div style="margin-top:40px; text-align:right;">
          <img src="${window.location.origin}/StampSignature.jpg" style="width:260px;" />
        <!-- Text left under signature -->
        <div style="text-align:left; margin-top:8px; font-size:14px; color:#374151; font-weight:600;">
          SWMS – System Generated Report
        </div>
      </div>

      </body>
      </html>
    `;

    //----------------------------------------------------------
    // PRINT IN SAME PAGE USING IFRAME (SAFE)
    //----------------------------------------------------------
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";

    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      showToast("error", "Print failed", "Unable to access iframe document");
      return;
    }
    doc.open();
    doc.write(printableBody);
    doc.close();

    iframe.onload = () => {
      if (!iframe.contentWindow) return;
      iframe.contentWindow.focus();
      iframe.contentWindow.print();

      setTimeout(() => {
        document.body.removeChild(iframe);
        showToast("success", "Printed", "Report sent to printer");
      }, 800);
    };
  } catch (err) {
    console.error("Print error:", err);
    showToast("error", "Print failed", "Unable to print report");
  }
};



  // Map tankLevel to tailwind width class (so Tailwind picks these utility classes up)
  const tankWidthClass = useMemo(() => {
    const step = Math.round(tankLevel / 5) * 5
    const map: any = {
      0: "w-[0%]",
      5: "w-[5%]",
      10: "w-[10%]",
      15: "w-[15%]",
      20: "w-[20%]",
      25: "w-[25%]",
      30: "w-[30%]",
      35: "w-[35%]",
      40: "w-[40%]",
      45: "w-[45%]",
      50: "w-[50%]",
      55: "w-[55%]",
      60: "w-[60%]",
      65: "w-[65%]",
      70: "w-[70%]",
      75: "w-[75%]",
      80: "w-[80%]",
      85: "w-[85%]",
      90: "w-[90%]",
      95: "w-[95%]",
      100: "w-[100%]",
    }
    return map[Math.max(0, Math.min(100, step))] || "w-[0%]"
  }, [tankLevel])

  // -------------------------
  // JSX return (UI) — full page with all 8 cards same style/size
  // -------------------------
  return (
    <div className="flex">
      <main className="flex-1 p-4 md:p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your profile and preferences</p>
        </div>

        {/* Reports Section */}
        <Card className="glass-light border-blue-200 dark:border-blue-800">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">📊 SWMS Analytics Dashboard</CardTitle>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={printReport}
                  className="cursor-pointer bg-linear-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print Report
                </Button>
                <Button
                  onClick={exportReport}
                  className="cursor-pointer bg-linear-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200"
                >
                  Export JSON
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-base text-gray-600 dark:text-gray-400">
              Access Real-Time Insights for Complaints, Devices, Tank Levels, Water Quality, and Water Usage With Quick Export and Print Report Options.
            </p>

            {/* Feature cards grid — OPTION A: All cards same size/structure */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {/* 1) Water Usage Trends (existing large card) */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border min-h-[450px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold">💧 Water Usage Trends</h4>
                    <p className="text-xs text-gray-500">Live line chart (Daily / Weekly / Monthly)</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTimeframe("daily")}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                        timeframe === "daily"
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      Daily
                    </button>
                    <button
                      onClick={() => setTimeframe("weekly")}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                        timeframe === "weekly"
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      Weekly
                    </button>
                    <button
                      onClick={() => setTimeframe("monthly")}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                        timeframe === "monthly"
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>

                <div className="h-32 mb-4">
                  {waterUsage.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={waterUsage}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#ffffff",
                            border: "none",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                          }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="usage" stroke="#0ea5e9" strokeWidth={3} dot={{ fill: "#0ea5e9", strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: "#0ea5e9" }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                        <span className="text-sm">Loading chart data...</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 text-center">
                    <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">Current</div>
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {waterUsage.length > 0 ? waterUsage[waterUsage.length - 1]?.usage || 0 : 0}L
                    </div>
                  </div>
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 text-center">
                    <div className="text-xs text-green-700 dark:text-green-300 font-medium">Average</div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {waterUsage.length > 0 ? Math.round(waterUsage.reduce((sum, item) => sum + item.usage, 0) / waterUsage.length) : 0}L
                    </div>
                  </div>
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 text-center">
                    <div className="text-xs text-purple-700 dark:text-purple-300 font-medium">Peak</div>
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {waterUsage.length > 0 ? Math.max(...waterUsage.map((item) => item.usage)) : 0}L
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-indigo-900 dark:text-indigo-100">Morning Peak</span>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">85 <span className="text-xs">L/h</span></div>
                    <div className="text-xs text-indigo-700 dark:text-indigo-300">6AM - 9AM</div>
                  </div>
                  <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-teal-900 dark:text-teal-100">Evening Peak</span>
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-lg font-bold text-teal-600 dark:text-teal-400">92 <span className="text-xs">L/h</span></div>
                    <div className="text-xs text-teal-700 dark:text-teal-300">6PM - 9PM</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-emerald-900 dark:text-emerald-100">Efficiency</span>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">87%</div>
                    <div className="text-xs text-emerald-700 dark:text-emerald-300">vs target</div>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-amber-900 dark:text-amber-100">Savings</span>
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-lg font-bold text-amber-600 dark:text-amber-400">23 <span className="text-xs">L/day</span></div>
                    <div className="text-xs text-amber-700 dark:text-amber-300">this week</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className={`p-2 rounded-lg border transition-all duration-300 ${
                    (waterUsage.length > 0 ? waterUsage[waterUsage.length - 1]?.usage || 0 : 0) < 50
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      : "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
                  }`}>
                    <div className="text-sm font-bold text-green-600 dark:text-green-400 mb-1">✅</div>
                    <div className="text-xs font-medium text-green-700 dark:text-green-300">Low Usage</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{'<'} 50L/h</div>
                  </div>

                  <div className={`p-2 rounded-lg border transition-all duration-300 ${
                    (waterUsage.length > 0 ? waterUsage[waterUsage.length - 1]?.usage || 0 : 0) >= 50 && (waterUsage.length > 0 ? waterUsage[waterUsage.length - 1]?.usage || 0 : 0) <= 80
                      ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                      : "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
                  }`}>
                    <div className="text-sm font-bold text-yellow-600 dark:text-yellow-400 mb-1">📊</div>
                    <div className="text-xs font-medium text-yellow-700 dark:text-yellow-300">Normal</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">50-80L/h</div>
                  </div>

                  <div className={`p-2 rounded-lg border transition-all duration-300 ${
                    (waterUsage.length > 0 ? waterUsage[waterUsage.length - 1]?.usage || 0 : 0) > 80
                      ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                      : "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
                  }`}>
                    <div className="text-sm font-bold text-red-600 dark:text-red-400 mb-1">⚠️</div>
                    <div className="text-xs font-medium text-red-700 dark:text-red-300">High Usage</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{'>'} 80L/h</div>
                  </div>
                </div>

                <div className="p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
                  <div className="flex items-center justify-center gap-2 text-xs text-cyan-600 dark:text-cyan-400">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                    <span>Real-time data updates every 5 seconds</span>
                  </div>
                </div>
              </div>

              {/* 2) Tank Level Report (same size) */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border min-h-[450px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">🏗️ Tank Level Report</h4>
                  <div className="text-xs text-gray-500">Live level + details</div>
                </div>

                <div className="flex-1">
                  <div className="mb-4">
                    <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full bg-blue-500 transition-all duration-500 ${tankWidthClass}`} style={{ maxWidth: "100%" }} />
                    </div>
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                      Tank is currently <b>{tankLevel}%</b> full
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-sky-50 dark:bg-sky-900/20 rounded-lg border border-sky-200 dark:border-sky-800">
                      <div className="text-xs text-sky-700 dark:text-sky-300">Volume</div>
                      <div className="text-lg font-bold">{(tankLevel * 2.5).toFixed(1)} L</div>
                      <div className="text-xs text-gray-500">Estimated</div>
                    </div>
                    <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg border border-rose-200 dark:border-rose-800">
                      <div className="text-xs text-rose-700 dark:text-rose-300">Available Space</div>
                      <div className="text-lg font-bold">{((100 - tankLevel) * 2.5).toFixed(1)} L</div>
                      <div className="text-xs text-gray-500">Remaining</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800 text-center">
                      <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Capacity</div>
                      <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">250 L</div>
                    </div>
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 text-center">
                      <div className="text-xs text-amber-700 dark:text-amber-300 font-medium">Refills Today</div>
                      <div className="text-sm font-bold text-amber-600 dark:text-amber-400">3</div>
                    </div>
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 text-center">
                      <div className="text-xs text-purple-700 dark:text-purple-300 font-medium">Efficiency</div>
                      <div className="text-sm font-bold text-purple-600 dark:text-purple-400">94%</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Recent Activity</div>
                    <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-300 max-h-[120px] overflow-y-auto pr-2">
                      <li className="flex justify-between">
                        <span>Refilled 12% at 10:23 AM</span>
                        <span className="text-green-600">+12%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Usage spike at 8:45 AM</span>
                        <span className="text-red-600">-8%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Valve maintenance done</span>
                        <span className="text-blue-600">2d ago</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Low level alert cleared</span>
                        <span className="text-green-600">1h ago</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Scheduled inspection</span>
                        <span className="text-gray-500">Tomorrow</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Tank Health Status</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                        <div className="text-xs text-green-700 dark:text-green-300">Structural Integrity</div>
                        <div className="text-sm font-bold text-green-600">Excellent</div>
                      </div>
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                        <div className="text-xs text-blue-700 dark:text-blue-300">Valve Performance</div>
                        <div className="text-sm font-bold text-blue-600">Good</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Last updated: <span className="font-medium">{lastUpdatedTime}</span></span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Live monitoring
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3) Weather Forecast (same size) */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border min-h-[450px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">🌤️ Weather Forecast</h4>
                  <div className="text-xs text-gray-500">Current & forecasts</div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-6xl">{weatherData.icon}</div>
                    <div>
                      <div className="text-2xl font-bold">{weatherData.temp}°C Visakhapatnam</div>
                      <div className="text-sm text-gray-500">{weatherData.description}</div>
                      <div className="text-xs text-gray-400 mt-1">Feels like: {weatherData.feelsLike}°C · Humidity: {weatherData.humidity}%</div>
                      <div className="text-xs text-gray-400">Wind: {weatherData.windSpeed} km/h · Pressure: {weatherData.pressure} hPa</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-4 text-center text-xs">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                      <div className="text-xs text-blue-700 dark:text-blue-300">UV Index</div>
                      <div className="text-sm font-bold text-blue-600 dark:text-blue-400">{weatherData.uvIndex}</div>
                    </div>
                    <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                      <div className="text-xs text-yellow-700 dark:text-yellow-300">Precipitation</div>
                      <div className="text-sm font-bold text-yellow-600 dark:text-yellow-400">{weatherData.precipitation} mm</div>
                    </div>
                    <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-200 dark:border-orange-800">
                      <div className="text-xs text-orange-700 dark:text-orange-300">Sunrise</div>
                      <div className="text-sm font-bold text-orange-600 dark:text-orange-400">{weatherData.sunrise}</div>
                    </div>
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800">
                      <div className="text-xs text-purple-700 dark:text-purple-300">Sunset</div>
                      <div className="text-sm font-bold text-purple-600 dark:text-purple-400">{weatherData.sunset}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Next 24 hours</div>
                    <div className="grid grid-cols-8 gap-1 text-center text-xs">
                      {(weatherData.hourlyTemps.length ? weatherData.hourlyTemps.slice(0, 24) : Array.from({ length: 24 }, (_, i) => weatherData.temp)).map((t, i) => (
                        <div key={i} className="p-1 bg-gray-50 dark:bg-gray-900/30 rounded">
                          <div className="text-xs">{i}h</div>
                          <div className="text-sm font-bold">{Math.round(t)}°</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">7-Day Forecast</div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {weatherData.daily.slice(0, 7).map((day: any, i: number) => (
                        <div key={i} className="p-1 bg-gray-50 dark:bg-gray-900/30 rounded">
                          <div className="text-xs">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                          <div className="text-lg">{day.icon}</div>
                          <div className="text-xs font-bold">{day.maxTemp}°</div>
                          <div className="text-xs text-gray-500">{day.minTemp}°</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Additional Details</div>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                        <div className="text-xs text-green-700 dark:text-green-300">Wind Direction</div>
                        <div className="text-sm font-bold text-green-600 dark:text-green-400">NE</div>
                      </div>
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-200 dark:border-indigo-800">
                        <div className="text-xs text-indigo-700 dark:text-indigo-300">Visibility</div>
                        <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">10 km</div>
                      </div>
                      <div className="p-2 bg-pink-50 dark:bg-pink-900/20 rounded border border-pink-200 dark:border-pink-800">
                        <div className="text-xs text-pink-700 dark:text-pink-300">Cloud Cover</div>
                        <div className="text-sm font-bold text-pink-600 dark:text-pink-400">25%</div>
                      </div>
                      <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded border border-teal-200 dark:border-teal-800">
                        <div className="text-xs text-teal-700 dark:text-teal-300">Dew Point</div>
                        <div className="text-sm font-bold text-teal-600 dark:text-teal-400">22°C</div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Weather Tips</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 p-2 rounded">
                      {weatherData.temp > 30
                        ? "It's quite warm today! Stay hydrated, wear light clothing, and avoid prolonged sun exposure."
                        : weatherData.temp < 20
                        ? "Cool weather ahead. Consider layering up and enjoy the pleasant conditions."
                        : "Moderate temperatures today. Perfect for outdoor activities and daily routines."}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="text-xs text-gray-500">Source: Open-Meteo · Last: {weatherLastTime}</div>
                  </div>
                </div>
              </div>

              {/* 4) Device Performance (same size) */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border min-h-[450px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">⚙️ Device Performance</h4>
                  <div className="text-xs text-gray-500">Last status & ping</div>
                </div>

                <div className="flex-1">
                  {devicesSummary.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-500">No devices found</div>
                  ) : (
                    <ul className="space-y-3 overflow-auto max-h-[340px] pr-2">
                      {devicesSummary.map((device: any, i: number) => (
                        <li key={i} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-900/20">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-semibold">{device.name}</div>
                              <div className="text-xs text-gray-500">{device.location ?? "Unknown location"}</div>
                            </div>
                            <div className="text-right">
                              <div className={`text-sm font-semibold ${device.status?.toLowerCase() === "online" ? "text-green-600" : device.status?.toLowerCase() === "offline" ? "text-red-600" : "text-gray-600"}`}>
                                {device.status ?? "unknown"}
                              </div>
                              <div className="text-xs text-gray-400">{device.lastPing ?? "-"}</div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* 5) Alerts & Notifications (same size) */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border min-h-[450px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">🚨 Alerts & Notifications</h4>
                  <div className="text-xs text-gray-500">Active alerts</div>
                </div>
                <div className="flex-1">
                  {alerts.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-500">No alerts available</div>
                  ) : (
                    <ul className="space-y-3 overflow-auto max-h-[340px] pr-2">
                      {alerts.slice(0, 10).map((alert, index) => (
                        <li key={index} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-900/20">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-semibold">{alert.title ?? "Alert"}</div>
                              <div className="text-xs text-gray-500">{alert.message}</div>
                            </div>
                            <div className="text-right">
                              <div className={`text-sm font-semibold ${alert.severity === "high" ? "text-red-600" : alert.severity === "medium" ? "text-amber-600" : "text-blue-600"}`}>
                                {alert.severity ?? "info"}
                              </div>
                              <div className="text-xs text-gray-400">{new Date(alert.createdAt || alert.timestamp || Date.now()).toLocaleString()}</div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="mt-4">
                </div>
              </div>

              {/* 6) Water Supply Overview (same size) */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border min-h-[450px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">💧 Water Supply Overview</h4>
                  <div className="text-xs text-gray-500">Coverage & capacity</div>
                </div>

                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg border">
                      <div className="text-xs text-gray-500">Supply Capacity</div>
                      <div className="text-lg font-bold">{waterSupply.supplyCapacity} ML</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg border">
                      <div className="text-xs text-gray-500">Total Usage</div>
                      <div className="text-lg font-bold">{waterSupply.totalUsage} ML</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Active zones</div>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-bold">{waterSupply.activeZones}</div>
                      <div>
                        <div className="text-sm">Avg Coverage</div>
                        <div className="text-lg font-semibold">{waterSupply.avgCoverage}%</div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs text-gray-500">Distribution efficiency</div>
                    <div className="w-full h-3 bg-gray-200 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${waterSupply.avgCoverage}%` }} />
                    </div>
                  </div>

                  <div className="mt-auto text-xs text-gray-500">Updated: {supplyUpdatedDate}</div>
                </div>
              </div>

              {/* 7) Water Quality Report (same size) */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border min-h-[450px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">🧪 Water Quality Report</h4>
                  <div className="text-xs text-gray-500">pH / turbidity / chlorine</div>
                </div>

                <div className="flex-1">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg border text-center">
                      <div className="text-xs text-gray-500">pH</div>
                      <div className="text-2xl font-bold">{waterQuality.ph}</div>
                      <div className="text-xs text-gray-400">Neutral: 7</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg border text-center">
                      <div className="text-xs text-gray-500">Turbidity</div>
                      <div className="text-2xl font-bold">{waterQuality.turbidity} NTU</div>
                      <div className="text-xs text-gray-400">Lower is better</div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg border text-center">
                      <div className="text-xs text-gray-500">Chlorine</div>
                      <div className="text-2xl font-bold">{waterQuality.chlorine} mg/L</div>
                      <div className="text-xs text-gray-400">Safe range</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Recent Tests</div>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300 max-h-[220px] overflow-auto pr-2">
                      <li className="p-2 bg-gray-50 dark:bg-gray-900/20 rounded border">10-Nov-2025 — pH 7.2 · Turbidity 1.1 NTU · Chlorine 0.3 mg/L</li>
                      <li className="p-2 bg-gray-50 dark:bg-gray-900/20 rounded border">03-Nov-2025 — pH 7.0 · Turbidity 1.4 NTU · Chlorine 0.25 mg/L</li>
                    </ul>
                  </div>

                  <div className="mt-auto">
                  </div>
                </div>
              </div>

              {/* 8) Complaint Analytics (same size) */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border min-h-[450px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">📞 Complaint Analytics</h4>
                  <div className="text-xs text-gray-500">Overview</div>
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border text-center">
                      <div className="text-xs text-green-700">Resolved</div>
                      <div className="text-2xl font-bold text-green-600">{complaintStats.resolved}</div>
                    </div>
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border text-center">
                      <div className="text-xs text-amber-700">Pending</div>
                      <div className="text-2xl font-bold text-amber-600">{complaintStats.pending}</div>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border text-center">
                      <div className="text-xs text-blue-700">Total</div>
                      <div className="text-2xl font-bold text-blue-600">{complaints.length}</div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Recent complaints</div>
                    {complaints.length === 0 ? (
                      <div className="text-gray-500">No complaints recorded</div>
                    ) : (
                      <ul className="space-y-2 max-h-[240px] overflow-auto pr-2">
                        {complaints.slice(0, 8).map((c: any, idx: number) => (
                          <li key={idx} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-900/20">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="font-medium">{c.complaintType ?? "Complaint"}</div>
                                <div className="text-xs text-gray-500">{c.description ?? "-"}</div>
                              </div>
                              <div className="text-right">
                                <div className={`text-xs font-semibold ${c.status === "resolved" ? "text-green-600" : "text-amber-600"}`}>{c.status ?? "pending"}</div>
                                <div className="text-xs text-gray-400">{new Date(c.submittedAt || Date.now()).toLocaleDateString()}</div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="mt-auto">
                  </div>
                </div>
              </div>

            </div>


          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className="glass-light border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-2xl">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>User ID</Label>
                <Input value={formData.userId} disabled className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Ward Name</Label>
                <Input value={formData.wardName} onChange={(e) => setFormData({ ...formData, wardName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Ward No.</Label>
                <Input value={formData.wardNo} onChange={(e) => setFormData({ ...formData, wardNo: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="space-y-2">
                <Label>City/Municipality</Label>
                <Input value="Greater Visakhapatnam Municipal Corporation" disabled />
              </div>
              <div className="space-y-2">
                <Label>District</Label>
                <Input value="Visakhapatnam" disabled />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input value="Andhra Pradesh" disabled />
              </div>
            </div>

            <Button onClick={handleSaveChanges} className="bg-linear-to-r from-cyan-500 to-blue-600 mt-6 cursor-pointer">Save Changes</Button>
          </CardContent>
        </Card>
      </main>

      {/* Toast Notifications */}
      <div className="fixed top-6 right-6 flex flex-col gap-3 pointer-events-none z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-sm animate-in slide-in-from-right-5 fade-in-0 duration-200 ${
              toast.type === "success"
                ? "bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-800"
                : toast.type === "error"
                ? "bg-linear-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 border-red-200 dark:border-red-800"
                : "bg-linear-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-blue-200 dark:border-blue-800"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === "success" && (
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              {toast.type === "error" && (
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                  <X className="w-3 h-3 text-white" />
                </div>
              )}
              {toast.type === "info" && (
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <Printer className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className={`font-semibold text-sm ${
                toast.type === "success" ? "text-green-900 dark:text-green-200" : toast.type === "error" ? "text-red-900 dark:text-red-200" : "text-blue-900 dark:text-blue-200"
              }`}>
                {toast.title}
              </h3>
              <p className={`text-xs mt-0.5 ${
                toast.type === "success" ? "text-green-800 dark:text-green-300" : toast.type === "error" ? "text-red-800 dark:text-red-300" : "text-blue-800 dark:text-blue-300"
              }`}>
                {toast.message}
              </p>
            </div>

            <button onClick={() => removeToast(toast.id)} title="Close notification" className={`shrink-0 ml-2 h-5 w-5 inline-flex items-center justify-center rounded hover:opacity-70 transition-opacity ${
              toast.type === "success" ? "text-green-600 dark:text-green-400" : toast.type === "error" ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400"
            }`}>
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
