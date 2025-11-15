"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, RefreshCw, Search, Filter, Activity, AlertTriangle, List } from "lucide-react"
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const EnhancedVizagMap = () => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [zones, setZones] = useState([])
  const [filteredZones, setFilteredZones] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedZone, setSelectedZone] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showWardList, setShowWardList] = useState(false)
  const markersRef = useRef([])

  const mapStyle = 'https://api.maptiler.com/maps/streets-v4/style.json?key=Y7uFMDvADMYDSmaLuVba'
  const center = [83.2185, 17.6868] // Visakhapatnam coordinates

  // Comprehensive ward data organized by zones like the support section
  const comprehensiveWardData = [
    // NORTH ZONE (Wards 1-10)
    { "zone_name": "NORTH", "ward_name": "Arilova", "ward_no": 1, "latitude": 17.7282, "longitude": 83.3045, "status": "active", "water_quality": 87, "pressure": "Normal", "last_updated": "2 min ago" },
    { "zone_name": "NORTH", "ward_name": "Chinagadili", "ward_no": 2, "latitude": 17.7109, "longitude": 83.2083, "status": "inactive", "water_quality": 92, "pressure": "Low", "last_updated": "5 min ago" },
    { "zone_name": "NORTH", "ward_name": "Vivekananda Nagar", "ward_no": 3, "latitude": 17.7168, "longitude": 83.2885, "status": "active", "water_quality": 78, "pressure": "High", "last_updated": "1 min ago" },
    { "zone_name": "NORTH", "ward_name": "Car Shed Junction", "ward_no": 4, "latitude": 17.7368, "longitude": 83.3385, "status": "inactive", "water_quality": 95, "pressure": "Normal", "last_updated": "8 min ago" },
    { "zone_name": "NORTH", "ward_name": "Venkojipalem", "ward_no": 8, "latitude": 17.6868, "longitude": 83.2185, "status": "active", "water_quality": 83, "pressure": "Normal", "last_updated": "3 min ago" },
    { "zone_name": "NORTH", "ward_name": "Seethammadhara North Extension", "ward_no": 9, "latitude": 17.6958, "longitude": 83.2585, "status": "active", "water_quality": 85, "pressure": "Normal", "last_updated": "4 min ago" },
    { "zone_name": "NORTH", "ward_name": "Port Quaters Kailasapuram", "ward_no": 34, "latitude": 17.7058, "longitude": 83.2685, "status": "active", "water_quality": 88, "pressure": "Normal", "last_updated": "6 min ago" },
    { "zone_name": "NORTH", "ward_name": "Urvasi to Kapprada", "ward_no": 37, "latitude": 17.7158, "longitude": 83.2785, "status": "inactive", "water_quality": 76, "pressure": "Low", "last_updated": "7 min ago" },
    { "zone_name": "NORTH", "ward_name": "Murali Nagar", "ward_no": 38, "latitude": 17.7258, "longitude": 83.2885, "status": "active", "water_quality": 91, "pressure": "High", "last_updated": "2 min ago" },
    { "zone_name": "NORTH", "ward_name": "Madhavadhara Road", "ward_no": 39, "latitude": 17.7358, "longitude": 83.2985, "status": "active", "water_quality": 84, "pressure": "Normal", "last_updated": "5 min ago" },

    // EAST ZONE (Wards 5-29)
    { "zone_name": "EAST", "ward_name": "Madhurawada", "ward_no": 5, "latitude": 17.7458, "longitude": 83.3085, "status": "active", "water_quality": 89, "pressure": "Normal", "last_updated": "3 min ago" },
    { "zone_name": "EAST", "ward_name": "Rushi Konda", "ward_no": 6, "latitude": 17.7558, "longitude": 83.3185, "status": "inactive", "water_quality": 72, "pressure": "Low", "last_updated": "8 min ago" },
    { "zone_name": "EAST", "ward_name": "M V P Colony", "ward_no": 7, "latitude": 17.7658, "longitude": 83.3285, "status": "active", "water_quality": 86, "pressure": "High", "last_updated": "4 min ago" },
    { "zone_name": "EAST", "ward_name": "KRM Colony", "ward_no": 10, "latitude": 17.7758, "longitude": 83.3385, "status": "active", "water_quality": 88, "pressure": "Normal", "last_updated": "6 min ago" },
    { "zone_name": "EAST", "ward_name": "Ramatalkies", "ward_no": 14, "latitude": 17.7858, "longitude": 83.3485, "status": "inactive", "water_quality": 79, "pressure": "Low", "last_updated": "7 min ago" },
    { "zone_name": "EAST", "ward_name": "VIP Road", "ward_no": 16, "latitude": 17.7958, "longitude": 83.3585, "status": "active", "water_quality": 93, "pressure": "High", "last_updated": "2 min ago" },
    { "zone_name": "EAST", "ward_name": "Chinnawaltair", "ward_no": 17, "latitude": 17.8058, "longitude": 83.3685, "status": "active", "water_quality": 85, "pressure": "Normal", "last_updated": "5 min ago" },
    { "zone_name": "EAST", "ward_name": "R.K. Beach", "ward_no": 18, "latitude": 17.8158, "longitude": 83.3785, "status": "inactive", "water_quality": 81, "pressure": "Low", "last_updated": "9 min ago" },
    { "zone_name": "EAST", "ward_name": "Ramnagar", "ward_no": 19, "latitude": 17.8258, "longitude": 83.3885, "status": "active", "water_quality": 87, "pressure": "Normal", "last_updated": "3 min ago" },
    { "zone_name": "EAST", "ward_name": "Prakasa Rao Peta", "ward_no": 20, "latitude": 17.8358, "longitude": 83.3985, "status": "active", "water_quality": 89, "pressure": "High", "last_updated": "4 min ago" },

    // CENTRAL ZONE (Wards 11-46)
    { "zone_name": "CENTRAL", "ward_name": "P and T Colony", "ward_no": 11, "latitude": 17.8458, "longitude": 83.4085, "status": "active", "water_quality": 84, "pressure": "Normal", "last_updated": "6 min ago" },
    { "zone_name": "CENTRAL", "ward_name": "Akkayyapalem", "ward_no": 12, "latitude": 17.8558, "longitude": 83.4185, "status": "inactive", "water_quality": 77, "pressure": "Low", "last_updated": "8 min ago" },
    { "zone_name": "CENTRAL", "ward_name": "Seethampeta Main Road", "ward_no": 13, "latitude": 17.8658, "longitude": 83.4285, "status": "active", "water_quality": 86, "pressure": "Normal", "last_updated": "2 min ago" },
    { "zone_name": "CENTRAL", "ward_name": "APSRTC Complex", "ward_no": 15, "latitude": 17.8758, "longitude": 83.4385, "status": "active", "water_quality": 88, "pressure": "High", "last_updated": "5 min ago" },
    { "zone_name": "CENTRAL", "ward_name": "Allipuram Gandhi Statue", "ward_no": 30, "latitude": 17.8858, "longitude": 83.4485, "status": "inactive", "water_quality": 82, "pressure": "Low", "last_updated": "7 min ago" },
    { "zone_name": "CENTRAL", "ward_name": "Sangam Office Jn", "ward_no": 31, "latitude": 17.8958, "longitude": 83.4585, "status": "active", "water_quality": 85, "pressure": "Normal", "last_updated": "3 min ago" },
    { "zone_name": "CENTRAL", "ward_name": "80feet Road Akkayyapalem", "ward_no": 32, "latitude": 17.9058, "longitude": 83.4685, "status": "active", "water_quality": 87, "pressure": "High", "last_updated": "4 min ago" },
    { "zone_name": "CENTRAL", "ward_name": "Thatichetlapalem", "ward_no": 33, "latitude": 17.9158, "longitude": 83.4785, "status": "inactive", "water_quality": 79, "pressure": "Low", "last_updated": "9 min ago" },
    { "zone_name": "CENTRAL", "ward_name": "Kancharapalem mettu", "ward_no": 35, "latitude": 17.9258, "longitude": 83.4885, "status": "active", "water_quality": 84, "pressure": "Normal", "last_updated": "6 min ago" },
    { "zone_name": "CENTRAL", "ward_name": "Kancharapalem Main Road", "ward_no": 36, "latitude": 17.9358, "longitude": 83.4985, "status": "active", "water_quality": 86, "pressure": "High", "last_updated": "2 min ago" },

    // SOUTH ZONE (Wards 47-63)
    { "zone_name": "SOUTH", "ward_name": "VUDA Colony", "ward_no": 47, "latitude": 17.9458, "longitude": 83.5085, "status": "active", "water_quality": 88, "pressure": "Normal", "last_updated": "5 min ago" },
    { "zone_name": "SOUTH", "ward_name": "Malkapuram", "ward_no": 48, "latitude": 17.9558, "longitude": 83.5185, "status": "inactive", "water_quality": 76, "pressure": "Low", "last_updated": "8 min ago" },
    { "zone_name": "SOUTH", "ward_name": "Malkapuram Main Road", "ward_no": 49, "latitude": 17.9658, "longitude": 83.5285, "status": "active", "water_quality": 85, "pressure": "Normal", "last_updated": "3 min ago" },
    { "zone_name": "SOUTH", "ward_name": "New Gajuwaka B.C. Road", "ward_no": 50, "latitude": 17.9758, "longitude": 83.5385, "status": "active", "water_quality": 87, "pressure": "High", "last_updated": "4 min ago" },
    { "zone_name": "SOUTH", "ward_name": "Pedagantyada Seetha Nagaram", "ward_no": 51, "latitude": 17.9858, "longitude": 83.5485, "status": "inactive", "water_quality": 81, "pressure": "Low", "last_updated": "7 min ago" },
    { "zone_name": "SOUTH", "ward_name": "Nadupuru", "ward_no": 52, "latitude": 17.9958, "longitude": 83.5585, "status": "active", "water_quality": 84, "pressure": "Normal", "last_updated": "6 min ago" },
    { "zone_name": "SOUTH", "ward_name": "Vadlapudi", "ward_no": 53, "latitude": 18.0058, "longitude": 83.5685, "status": "active", "water_quality": 86, "pressure": "High", "last_updated": "2 min ago" },
    { "zone_name": "SOUTH", "ward_name": "Steel Plant", "ward_no": 54, "latitude": 18.0158, "longitude": 83.5785, "status": "inactive", "water_quality": 79, "pressure": "Low", "last_updated": "9 min ago" },
    { "zone_name": "SOUTH", "ward_name": "Appikonda", "ward_no": 55, "latitude": 18.0258, "longitude": 83.5885, "status": "active", "water_quality": 83, "pressure": "Normal", "last_updated": "5 min ago" },
    { "zone_name": "SOUTH", "ward_name": "Kurmannapalem", "ward_no": 58, "latitude": 18.0358, "longitude": 83.5985, "status": "active", "water_quality": 88, "pressure": "High", "last_updated": "3 min ago" },

    // WEST ZONE (Wards 40-73)
    { "zone_name": "WEST", "ward_name": "Marripalem", "ward_no": 40, "latitude": 18.0458, "longitude": 83.6085, "status": "active", "water_quality": 85, "pressure": "Normal", "last_updated": "4 min ago" },
    { "zone_name": "WEST", "ward_name": "Karasa", "ward_no": 42, "latitude": 18.0558, "longitude": 83.6185, "status": "inactive", "water_quality": 78, "pressure": "Low", "last_updated": "8 min ago" },
    { "zone_name": "WEST", "ward_name": "Lankelapalem Aganampudi Main Road", "ward_no": 56, "latitude": 18.0658, "longitude": 83.6285, "status": "active", "water_quality": 87, "pressure": "Normal", "last_updated": "6 min ago" },
    { "zone_name": "WEST", "ward_name": "Duvvada Aganampudi", "ward_no": 57, "latitude": 18.0758, "longitude": 83.6385, "status": "active", "water_quality": 89, "pressure": "High", "last_updated": "2 min ago" },
    { "zone_name": "WEST", "ward_name": "Natayyapalem", "ward_no": 59, "latitude": 18.0858, "longitude": 83.6485, "status": "inactive", "water_quality": 82, "pressure": "Low", "last_updated": "7 min ago" },
    { "zone_name": "WEST", "ward_name": "Sheela Nagar", "ward_no": 65, "latitude": 18.0958, "longitude": 83.6585, "status": "active", "water_quality": 86, "pressure": "Normal", "last_updated": "5 min ago" },
    { "zone_name": "WEST", "ward_name": "Venkatapuram", "ward_no": 66, "latitude": 18.1058, "longitude": 83.6685, "status": "active", "water_quality": 84, "pressure": "High", "last_updated": "3 min ago" },
    { "zone_name": "WEST", "ward_name": "Gopalapatnam", "ward_no": 68, "latitude": 18.1158, "longitude": 83.6785, "status": "inactive", "water_quality": 79, "pressure": "Low", "last_updated": "9 min ago" },
    { "zone_name": "WEST", "ward_name": "Vepagunta", "ward_no": 69, "latitude": 18.1258, "longitude": 83.6885, "status": "active", "water_quality": 88, "pressure": "Normal", "last_updated": "4 min ago" },
    { "zone_name": "WEST", "ward_name": "Chinamushidiwada", "ward_no": 70, "latitude": 18.1358, "longitude": 83.6985, "status": "active", "water_quality": 85, "pressure": "High", "last_updated": "6 min ago" }
  ]

  // Mock data for development - replace with actual API call
  const mockZonesData = comprehensiveWardData

  // Fetch zones data
  const fetchZones = async () => {
    try {
      const response = await fetch('/api/vizag-zones')
      const data = await response.json()
      setZones(data)
      setFilteredZones(data)
    } catch (error) {
      console.error('Error fetching zones:', error)
      // Fallback to mock data
      setZones(mockZonesData)
      setFilteredZones(mockZonesData)
    }
  }

  // Filter zones based on search and status
  useEffect(() => {
    let filtered = zones

    if (searchTerm) {
      filtered = filtered.filter(zone =>
        zone.zone_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        zone.ward_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (zone.ward_no && zone.ward_no.toString().includes(searchTerm))
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(zone => zone.status === statusFilter)
    }

    setFilteredZones(filtered)
  }, [zones, searchTerm, statusFilter])

  // Initialize map
  useEffect(() => {
    if (map.current) return // initialize map only once

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: center,
        zoom: 11,
        attributionControl: false
      })

      map.current.addControl(new maplibregl.NavigationControl(), 'top-right')
      map.current.addControl(new maplibregl.AttributionControl({
        compact: true
      }))

      map.current.on('load', () => {
        setLoading(false)
        updateMarkers()
      })
    } catch (error) {
      console.error('Error initializing map:', error)
      setLoading(false)
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  // Update markers when filtered zones change
  const updateMarkers = () => {
    if (!map.current || !map.current.isStyleLoaded()) return

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Add new markers
    filteredZones.forEach((zone) => {
      const el = document.createElement('div')
      el.className = `w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer transform hover:scale-110 transition-transform ${
        zone.status === 'active' ? 'bg-blue-500' : 'bg-red-500'
      }`

      const marker = new maplibregl.Marker(el)
        .setLngLat([zone.longitude, zone.latitude])
        .addTo(map.current)

      // Create popup
      const popup = new maplibregl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-3 min-w-[200px]">
            <h3 class="font-semibold text-sm mb-2">${zone.zone_name}</h3>
            <p class="text-xs text-gray-600 mb-2">${zone.ward_name}</p>
            <div class="space-y-1 text-xs">
              <div class="flex justify-between">
                <span>Status:</span>
                <span class="font-medium ${zone.status === 'active' ? 'text-green-600' : 'text-red-600'}">${zone.status}</span>
              </div>
              <div class="flex justify-between">
                <span>Water Quality:</span>
                <span class="font-medium">${zone.water_quality || 'N/A'}%</span>
              </div>
              <div class="flex justify-between">
                <span>Pressure:</span>
                <span class="font-medium">${zone.pressure || 'N/A'}</span>
              </div>
              <div class="flex justify-between">
                <span>Last Updated:</span>
                <span class="font-medium">${zone.last_updated || 'N/A'}</span>
              </div>
            </div>
          </div>
        `)

      marker.setPopup(popup)

      // Click handler
      el.addEventListener('click', () => {
        setSelectedZone(zone)
      })

      markersRef.current.push(marker)
    })

    // Fit map to show all markers or zoom to specific location if searching
    if (filteredZones.length > 0) {
      if (searchTerm && filteredZones.length === 1) {
        // Zoom to exact location when searching for a specific ward
        const zone = filteredZones[0]
        map.current.flyTo({
          center: [zone.longitude, zone.latitude],
          zoom: 16,
          duration: 2000
        })
      } else {
        // Fit bounds for multiple zones
        const bounds = new maplibregl.LngLatBounds()
        filteredZones.forEach(zone => {
          bounds.extend([zone.longitude, zone.latitude])
        })
        map.current.fitBounds(bounds, { padding: 50, maxZoom: 14 })
      }
    }
  }

  // Update markers when filtered zones change
  useEffect(() => {
    updateMarkers()
  }, [filteredZones])

  // Remove auto-refresh - only manual refresh now
  // useEffect(() => {
  //   const interval = setInterval(fetchZones, 5000)
  //   return () => clearInterval(interval)
  // }, [])

  const activeCount = zones.filter(z => z.status === 'active').length
  const inactiveCount = zones.filter(z => z.status === 'inactive').length
  const alertsCount = zones.filter(z => z.pressure === 'Low' || z.water_quality < 80).length

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card className="glass-light border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Visakhapatnam Zone Map
            <div className="ml-auto flex items-center gap-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Activity className="w-3 h-3 mr-1" />
                Active: {activeCount}
              </Badge>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Inactive: {inactiveCount}
              </Badge>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Alerts: {alertsCount}
              </Badge>
              <Button
                onClick={fetchZones}
                variant="outline"
                size="sm"
                className="ml-2"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search zones, wards, or ward numbers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("active")}
                className="bg-green-500 hover:bg-green-600"
              >
                Active
              </Button>
              <Button
                variant={statusFilter === "inactive" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("inactive")}
                className="bg-red-500 hover:bg-red-600"
              >
                Inactive
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowWardList(true)}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                <List className="w-4 h-4 mr-1" />
                Ward List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ward List Modal */}
      {showWardList && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden glass-light border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>All Ward Names and Numbers - Visakhapatnam</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowWardList(false)}
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[75vh]">
              {/* NORTH ZONE */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">NORTH ZONE (Wards 1-10)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {comprehensiveWardData.filter(zone => zone.zone_name === 'NORTH').map((zone) => (
                    <div
                      key={`${zone.zone_name}-${zone.ward_no}`}
                      className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(`${zone.ward_name}, ${zone.ward_no}`);
                        setSearchTerm(zone.ward_name);
                        setShowWardList(false);
                        // Find and select the marker on the map
                        const markerZone = zones.find(z =>
                          z.ward_name === zone.ward_name && z.zone_name === zone.zone_name
                        );
                        if (markerZone) {
                          setSelectedZone(markerZone);
                          map.current.flyTo({
                            center: [markerZone.longitude, markerZone.latitude],
                            zoom: 16,
                            duration: 2000
                          });
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-sm text-blue-600 dark:text-blue-400">{zone.ward_name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Ward No: {zone.ward_no}</div>
                          <div className="text-xs text-gray-500 mt-1">{zone.zone_name}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${zone.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className={`text-xs font-medium ${zone.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                            {zone.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* EAST ZONE */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">EAST ZONE (Wards 5-29)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {comprehensiveWardData.filter(zone => zone.zone_name === 'EAST').map((zone) => (
                    <div
                      key={`${zone.zone_name}-${zone.ward_no}`}
                      className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(`${zone.ward_name}, ${zone.ward_no}`);
                        setSearchTerm(zone.ward_name);
                        setShowWardList(false);
                        // Find and select the marker on the map
                        const markerZone = zones.find(z =>
                          z.ward_name === zone.ward_name && z.zone_name === zone.zone_name
                        );
                        if (markerZone) {
                          setSelectedZone(markerZone);
                          map.current.flyTo({
                            center: [markerZone.longitude, markerZone.latitude],
                            zoom: 16,
                            duration: 2000
                          });
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-sm text-green-600 dark:text-green-400">{zone.ward_name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Ward No: {zone.ward_no}</div>
                          <div className="text-xs text-gray-500 mt-1">{zone.zone_name}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${zone.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className={`text-xs font-medium ${zone.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                            {zone.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CENTRAL ZONE */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">CENTRAL ZONE (Wards 11-46)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {comprehensiveWardData.filter(zone => zone.zone_name === 'CENTRAL').map((zone) => (
                    <div
                      key={`${zone.zone_name}-${zone.ward_no}`}
                      className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(`${zone.ward_name}, ${zone.ward_no}`);
                        setSearchTerm(zone.ward_name);
                        setShowWardList(false);
                      }}
                    >
                      <div className="font-semibold text-sm text-purple-600 dark:text-purple-400">{zone.ward_name}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Ward No: {zone.ward_no}</div>
                      <div className="text-xs text-gray-500 mt-1">{zone.zone_name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SOUTH ZONE */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">SOUTH ZONE (Wards 47-63)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {comprehensiveWardData.filter(zone => zone.zone_name === 'SOUTH').map((zone) => (
                    <div
                      key={`${zone.zone_name}-${zone.ward_no}`}
                      className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(`${zone.ward_name}, ${zone.ward_no}`);
                        setSearchTerm(zone.ward_name);
                        setShowWardList(false);
                      }}
                    >
                      <div className="font-semibold text-sm text-orange-600 dark:text-orange-400">{zone.ward_name}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Ward No: {zone.ward_no}</div>
                      <div className="text-xs text-gray-500 mt-1">{zone.zone_name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* WEST ZONE */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-yellow-600 dark:text-yellow-400">WEST ZONE (Wards 40-73)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {comprehensiveWardData.filter(zone => zone.zone_name === 'WEST').map((zone) => (
                    <div
                      key={`${zone.zone_name}-${zone.ward_no}`}
                      className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(`${zone.ward_name}, ${zone.ward_no}`);
                        setSearchTerm(zone.ward_name);
                        setShowWardList(false);
                      }}
                    >
                      <div className="font-semibold text-sm text-yellow-600 dark:text-yellow-400">{zone.ward_name}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Ward No: {zone.ward_no}</div>
                      <div className="text-xs text-gray-500 mt-1">{zone.zone_name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Map Container */}
      <Card className="glass-light border-blue-200 dark:border-blue-800 shadow-lg">
        <CardContent className="p-0">
          <div
            ref={mapContainer}
            className="w-full h-[600px] rounded-lg overflow-hidden"
            style={{ background: '#f0f0f0' }}
          />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-slate-900 bg-opacity-75 rounded-lg">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Loading map...</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Zone Details Panel */}
      {selectedZone && (
        <Card className="glass-light border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Zone Details: {selectedZone.zone_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <Badge className={`mt-1 ${selectedZone.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>
                  {selectedZone.status}
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Water Quality</p>
                <p className="text-lg font-semibold">{selectedZone.water_quality || 'N/A'}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Pressure</p>
                <p className="text-lg font-semibold">{selectedZone.pressure || 'N/A'}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>
                <p className="text-sm font-semibold">{selectedZone.last_updated || 'N/A'}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Ward:</span> {selectedZone.ward_name}
                </div>
                <div>
                  <span className="font-medium">Coordinates:</span> {selectedZone.latitude.toFixed(4)}, {selectedZone.longitude.toFixed(4)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card className="glass-light border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span>Active Zones</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>Inactive Zones</span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              🗺️ Map data provided by MapTiler - Manual refresh only
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default EnhancedVizagMap
