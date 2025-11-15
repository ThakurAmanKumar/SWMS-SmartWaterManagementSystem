"use client"

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const VizagZoneMap = () => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [zones, setZones] = useState([])
  const [loading, setLoading] = useState(true)

  const mapStyle = 'https://api.maptiler.com/maps/streets-v4/style.json?key=Y7uFMDvADMYDSmaLuVba'
  const center = [83.2185, 17.6868] // Visakhapatnam coordinates

  // Fetch zone data
  const fetchZones = async () => {
    try {
      const response = await fetch('/api/vizag-zones')
      const data = await response.json()
      setZones(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching zones:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (map.current) return // initialize map only once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: center,
      zoom: 10
    })

    map.current.on('load', () => {
      fetchZones()
    })

    // Set up interval for real-time updates
    const interval = setInterval(fetchZones, 5000)

    return () => {
      clearInterval(interval)
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  // Update markers when zones data changes
  useEffect(() => {
    if (!map.current || !zones.length) return

    // Remove existing markers
    const existingMarkers = document.querySelectorAll('.map-marker')
    existingMarkers.forEach(marker => marker.remove())

    // Add new markers
    zones.forEach((zone) => {
      const el = document.createElement('div')
      el.className = 'map-marker'
      el.style.width = '20px'
      el.style.height = '20px'
      el.style.borderRadius = '50%'
      el.style.backgroundColor = zone.status === 'active' ? '#3b82f6' : '#ef4444'
      el.style.border = '2px solid white'
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)'
      el.style.cursor = 'pointer'

      const marker = new maplibregl.Marker(el)
        .setLngLat([zone.longitude, zone.latitude])
        .addTo(map.current)

      // Create popup
      const popup = new maplibregl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-semibold text-sm">${zone.zone_name}</h3>
            <p class="text-xs text-gray-600">${zone.ward_name}</p>
            <p class="text-xs text-gray-500">Lat: ${zone.latitude.toFixed(4)}, Lng: ${zone.longitude.toFixed(4)}</p>
            <span class="inline-block px-2 py-1 text-xs rounded-full ${zone.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}">
              ${zone.status}
            </span>
          </div>
        `)

      marker.setPopup(popup)
    })

    // Auto-fit map to include all markers
    if (zones.length > 0) {
      const bounds = new maplibregl.LngLatBounds()

      zones.forEach((zone) => {
        bounds.extend([zone.longitude, zone.latitude])
      })

      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      })
    }
  }, [zones])

  return (
    <div className="w-full h-[500px] rounded-lg shadow-lg overflow-hidden bg-gray-100">
      {loading && (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  )
}

export default VizagZoneMap
