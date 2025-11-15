import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const dbPath = path.join(process.cwd(), 'data', 'db.json')
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))

    // For demo purposes, return all devices. In production, filter by authenticated user
    const devices = dbData.devices.map((device: any) => ({
      id: device.id,
      name: device.deviceName,
      status: device.status,
      location: device.location,
      lastPing: device.lastPing,
      batteryLevel: device.batteryLevel,
      deviceType: device.deviceType,
    }))

    return NextResponse.json(devices)
  } catch (error) {
    console.error('Error fetching devices:', error)
    return NextResponse.json({ error: 'Failed to fetch devices' }, { status: 500 })
  }
}
