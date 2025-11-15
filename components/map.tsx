"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react"

// Mock data for Visakhapatnam water infrastructure
const waterInfrastructure = [
  {
    id: 1,
    name: "Central Water Treatment Plant",
    type: "treatment_plant",
    zone: "Central",
    ward: "Ward 5",
    lat: 17.6868,
    lng: 83.2185,
    status: "active",
    capacity: "50 MLD",
    lastMaintenance: "2024-01-15",
    sensors: { ph: 7.2, turbidity: 0.8, chlorine: 0.5 }
  },
  {
    id: 2,
    name: "North Zone Pumping Station",
    type: "pumping_station",
    zone: "North",
    ward: "Ward 12",
    lat: 17.7268,
    lng: 83.3185,
    status: "warning",
    capacity: "25 MLD",
    lastMaintenance: "2024-01-10",
    sensors: { ph: 7.8, turbidity: 1.2, chlorine: 0.3 }
  },
  {
    id: 3,
    name: "South Zone Reservoir",
    type: "reservoir",
    zone: "South",
    ward: "Ward 25",
    lat: 17.6468,
    lng: 83.2185,
    status: "critical",
    capacity: "100 ML",
    lastMaintenance: "2023-12-20",
    sensors: { ph: 8.1, turbidity: 2.5, chlorine: 0.1 }
  },
  {
    id: 4,
    name: "Beach Road Distribution Point",
    type: "distribution",
    zone: "Central",
    ward: "Ward 8",
    lat: 17.7168,
    lng: 83.2885,
    status: "active",
    capacity: "15 MLD",
    lastMaintenance: "2024-01-08",
    sensors: { ph: 7.0, turbidity: 0.6, chlorine: 0.6 }
  },
  {
    id: 5,
    name: "Gajuwaka Water Tower",
    type: "water_tower",
    zone: "North",
    ward: "Ward 15",
    lat: 17.7368,
    lng: 83.3385,
    status: "active",
    capacity: "500 KL",
    lastMaintenance: "2024-01-12",
    sensors: { ph: 7.3, turbidity: 0.9, chlorine: 0.4 }
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-green-500"
    case "warning": return "bg-yellow-500"
    case "critical": return "bg-red-500"
    default: return "bg-gray-500"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active": return CheckCircle
    case "warning": return AlertTriangle
    case "critical": return XCircle
    default: return Info
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "treatment_plant": return "🏭"
    case "pumping_station": return "⚙️"
    case "reservoir": return "💧"
    case "distribution": return "🚰"
    case "water_tower": return "🗼"
    default: return "📍"
  }
}

export default function WaterInfrastructureMap() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [filteredLocations, setFilteredLocations] = useState(waterInfrastructure)

  useEffect(() => {
    if (searchTerm) {
      const filtered = waterInfrastructure.filter(location =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.ward.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredLocations(filtered)
    } else {
      setFilteredLocations(waterInfrastructure)
    }
  }, [searchTerm])

  const handleLocationClick = (location: any) => {
    setSelectedLocation(location)
  }

  return (
    <div className="space-y-6">
      {/* Search and Map Header */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search zones, wards, or infrastructure..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-12"
            />
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Active ({waterInfrastructure.filter(l => l.status === 'active').length})
          </Badge>
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
            Warning ({waterInfrastructure.filter(l => l.status === 'warning').length})
          </Badge>
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            Critical ({waterInfrastructure.filter(l => l.status === 'critical').length})
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Placeholder */}
        <div className="lg:col-span-2">
          <Card className="glass-light border-blue-200 dark:border-blue-800 h-[500px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Visakhapatnam Water Infrastructure Map
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full relative">
              {/* Simplified Map Visualization */}
              <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg relative overflow-hidden">
                {/* Zone Labels */}
                <div className="absolute top-4 left-4 text-sm font-semibold text-blue-800 dark:text-blue-200">
                  Central Zone
                </div>
                <div className="absolute top-4 right-4 text-sm font-semibold text-blue-800 dark:text-blue-200">
                  North Zone
                </div>
                <div className="absolute bottom-4 left-4 text-sm font-semibold text-blue-800 dark:text-blue-200">
                  South Zone
                </div>

                {/* Infrastructure Points */}
                {filteredLocations.map((location) => {
                  const StatusIcon = getStatusIcon(location.status)
                  return (
                    <div
                      key={location.id}
                      className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                      style={{
                        left: `${((location.lng - 83.2) / 0.15) * 100}%`,
                        top: `${((17.75 - location.lat) / 0.1) * 100}%`
                      }}
                      onClick={() => handleLocationClick(location)}
                    >
                      <div className="relative">
                        <div className={`w-4 h-4 rounded-full ${getStatusColor(location.status)} border-2 border-white shadow-lg flex items-center justify-center text-xs`}>
                          {getTypeIcon(location.type)}
                        </div>
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                          {location.name}
                        </div>
                      </div>
                    </div>
                  )
                })}

                {/* Legend */}
                <div className="absolute bottom-4 right-4 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg">
                  <div className="text-xs font-semibold mb-2">Legend</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🏭</span>
                      <span className="text-xs">Treatment Plant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">⚙️</span>
                      <span className="text-xs">Pumping Station</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">💧</span>
                      <span className="text-xs">Reservoir</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🚰</span>
                      <span className="text-xs">Distribution</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Location Details */}
        <div className="space-y-4">
          {selectedLocation ? (
            <Card className="glass-light border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getTypeIcon(selectedLocation.type)}
                  {selectedLocation.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Zone:</span>
                    <p>{selectedLocation.zone}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Ward:</span>
                    <p>{selectedLocation.ward}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Capacity:</span>
                    <p>{selectedLocation.capacity}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Status:</span>
                    <Badge className={`${getStatusColor(selectedLocation.status)} text-white`}>
                      {selectedLocation.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-sm">Last Maintenance:</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedLocation.lastMaintenance}</p>
                </div>

                <div>
                  <span className="font-semibold text-sm">Sensor Readings:</span>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <div className="text-xs text-gray-600 dark:text-gray-400">pH</div>
                      <div className="font-semibold">{selectedLocation.sensors.ph}</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <div className="text-xs text-gray-600 dark:text-gray-400">Turbidity</div>
                      <div className="font-semibold">{selectedLocation.sensors.turbidity} NTU</div>
                    </div>
                    <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                      <div className="text-xs text-gray-600 dark:text-gray-400">Chlorine</div>
                      <div className="font-semibold">{selectedLocation.sensors.chlorine} mg/L</div>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600"
                  onClick={() => setSelectedLocation(null)}
                >
                  Close Details
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="glass-light border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6 text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Select a Location</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click on any infrastructure point on the map to view detailed information and real-time sensor data.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card className="glass-light border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-lg">Infrastructure Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Facilities</span>
                <Badge variant="outline">{waterInfrastructure.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Systems</span>
                <Badge className="bg-green-500">{waterInfrastructure.filter(l => l.status === 'active').length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Under Maintenance</span>
                <Badge className="bg-yellow-500">{waterInfrastructure.filter(l => l.status === 'warning').length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Critical Issues</span>
                <Badge className="bg-red-500">{waterInfrastructure.filter(l => l.status === 'critical').length}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
