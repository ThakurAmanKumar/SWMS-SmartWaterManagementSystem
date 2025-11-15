"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import waterData from "@/data/water-supply-government.json"

const COLORS = ["#22c55e", "#ef4444", "#f59e0b"]

export default function WaterSupplyPage() {
  const [searchZone, setSearchZone] = useState("")
  const [selectedRange, setSelectedRange] = useState<string>("all")

  const getFilteredData = (data: any[]) => {
    let filtered = data.filter((item) =>
      item.zone.toLowerCase().includes(searchZone.toLowerCase())
    )

    if (selectedRange !== "all") {
      switch (selectedRange) {
        case "70-90":
          filtered = filtered.filter((item) => {
            const cov = Number.parseInt(item.coverage)
            return cov >= 70 && cov <= 90
          })
          break
        case "91-95":
          filtered = filtered.filter((item) => {
            const cov = Number.parseInt(item.coverage)
            return cov >= 91 && cov <= 95
          })
          break
        case "96-99":
          filtered = filtered.filter((item) => {
            const cov = Number.parseInt(item.coverage)
            return cov >= 96 && cov <= 99
          })
          break
        case "100":
          filtered = filtered.filter((item) => Number.parseInt(item.coverage) === 100)
          break
      }
    }

    return filtered
  }

  const filteredData = useMemo(() => getFilteredData(waterData), [searchZone, selectedRange])

  const zoneData = useMemo(() => {
    const grouped = waterData.reduce((acc: any, item) => {
      const zone = item.zone
      const existing = acc.find((z: any) => z.name === zone)
      if (existing) {
        existing.capacity += item.capacity
        existing.usage += item.consumption
        existing.count++
      } else {
        acc.push({
          name: zone,
          capacity: item.capacity,
          usage: item.consumption,
          count: 1,
        })
      }
      return acc
    }, [])
    return grouped
  }, [])

  const summary = {
    totalSupply: waterData.reduce((sum, item) => sum + item.capacity, 0),
    totalUsage: waterData.reduce((sum, item) => sum + item.consumption, 0),
    avgCoverage: (waterData.reduce((sum, item) => sum + Number.parseInt(item.coverage), 0) / waterData.length).toFixed(
      1,
    ),
    activeZones: new Set(waterData.map((item) => item.zone)).size,
  }

  const getCoverageColor = (coverage: string) => {
    const num = Number.parseInt(coverage)
    if (num >= 90) return "bg-green-500"
    if (num >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Public Water Supply Points</h1>
        <p className="text-gray-600 dark:text-gray-400">Official Government Water Supply Data - Visakhapatnam</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-light">
          <CardContent className="pt-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Supply Capacity</p>
            <p className="text-2xl font-bold">{(summary.totalSupply / 1000000).toFixed(1)}M L/day</p>
          </CardContent>
        </Card>
        <Card className="glass-light">
          <CardContent className="pt-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total Usage</p>
            <p className="text-2xl font-bold">{(summary.totalUsage / 1000000).toFixed(2)}M L/day</p>
          </CardContent>
        </Card>
        <Card className="glass-light">
          <CardContent className="pt-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Avg Coverage %</p>
            <p className="text-2xl font-bold">{summary.avgCoverage}%</p>
          </CardContent>
        </Card>
        <Card className="glass-light">
          <CardContent className="pt-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Active Zones</p>
            <p className="text-2xl font-bold">{summary.activeZones}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-light border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle>Capacity vs Usage by Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={zoneData.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,150,200,0.1)" />
                <XAxis dataKey="name" stroke="rgba(100,100,100,0.5)" />
                <YAxis stroke="rgba(100,100,100,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15,23,42,0.8)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Bar dataKey="capacity" fill="rgb(34, 197, 255)" name="Capacity" />
                <Bar dataKey="usage" fill="rgb(239, 68, 68)" name="Usage" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-light border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle>Coverage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    {
                      name: "Good (≥90%)",
                      value: waterData.filter((d) => Number.parseInt(d.coverage) >= 90).length,
                    },
                    {
                      name: "Poor (<70%)",
                      value: waterData.filter((d) => Number.parseInt(d.coverage) < 70).length,
                    },
                    {
                      name: "Fair (70-89%)",
                      value: waterData.filter((d) => {
                        const cov = Number.parseInt(d.coverage)
                        return cov >= 70 && cov < 90
                      }).length,
                    },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
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
      </div>

      {/* Filters & Table */}
      <Card className="glass-light border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle>Water Supply Points</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Search by Zone..."
              value={searchZone}
              onChange={(e) => setSearchZone(e.target.value)}
              className="border-blue-200 dark:border-blue-800"
            />
            <div className="space-y-2">
              <label className="text-sm text-gray-600 dark:text-gray-400 block">
                Coverage Range:
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedRange === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRange("all")}
                >
                  All
                </Button>
                <Button
                  variant={selectedRange === "70-90" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRange("70-90")}
                >
                  70-90%
                </Button>
                <Button
                  variant={selectedRange === "91-95" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRange("91-95")}
                >
                  91-95%
                </Button>
                <Button
                  variant={selectedRange === "96-99" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRange("96-99")}
                >
                  96-99%
                </Button>
                <Button
                  variant={selectedRange === "100" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRange("100")}
                >
                  100%
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white dark:bg-gray-900">
                <tr className="border-b border-blue-200 dark:border-blue-800">
                  <th className="text-left p-2">City</th>
                  <th className="text-left p-2">Zone</th>
                  <th className="text-left p-2">Ward Name</th>
                  <th className="text-right p-2">Ward No.</th>
                  <th className="text-right p-2">Capacity (L/day)</th>
                  <th className="text-right p-2">Coverage %</th>
                </tr>
              </thead>
              <tbody>
                {(selectedRange === "all" ? filteredData : filteredData.slice(0, 10)).map((item, idx) => (
                  <tr key={idx} className="border-b border-blue-100 dark:border-blue-900">
                    <td className="p-2">{item.city}</td>
                    <td className="p-2">{item.zone}</td>
                    <td className="p-2">{item.wardName}</td>
                    <td className="text-right p-2">{item.wardNo}</td>
                    <td className="text-right p-2">{(item.capacity / 1000).toFixed(0)}k</td>
                    <td className="text-right p-2">
                      <Badge className={getCoverageColor(item.coverage)}>{item.coverage}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Source:{" "}
            <a
              href="https://www.data.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Government of India - Open Data Portal
            </a>{" "}
            | License:{" "}
            <a
              href="https://www.data.gov.in/sites/default/files/Gazette_Notification_OGDL.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              GODL-India
            </a>
          </p>

        </CardContent>
      </Card>
    </div>
  )
}