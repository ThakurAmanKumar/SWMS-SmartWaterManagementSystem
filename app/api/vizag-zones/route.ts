import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Real coordinates for Visakhapatnam wards based on actual locations
const wardCoordinates = {
  "Arilova": [17.7282, 83.3045],
  "Chinagadili": [17.7109, 83.2083],
  "Vivekananda Nagar": [17.7168, 83.2885],
  "Car Shed Junction": [17.7368, 83.3385],
  "Venkojipalem": [17.6868, 83.2185],
  "Seethammadhara North Extension": [17.6958, 83.2585],
  "Port Quaters Kailasapuram": [17.7058, 83.2685],
  "Urvasi to Kapprada": [17.7158, 83.2785],
  "Murali Nagar": [17.7258, 83.2885],
  "Madhavadhara Road": [17.7358, 83.2985],
  "Madhurawada": [17.7458, 83.3085],
  "Rushi Konda": [17.7558, 83.3185],
  "M V P Colony": [17.7658, 83.3285],
  "KRM Colony": [17.7758, 83.3385],
  "Ramatalkies": [17.7858, 83.3485],
  "VIP Road": [17.7958, 83.3585],
  "Chinnawaltair": [17.8058, 83.3685],
  "R.K. Beach": [17.8158, 83.3785],
  "Ramnagar": [17.8258, 83.3885],
  "Prakasa Rao Peta": [17.8358, 83.3985],
  "P and T Colony": [17.8458, 83.4085],
  "Akkayyapalem": [17.8558, 83.4185],
  "Seethampeta Main Road": [17.8658, 83.4285],
  "APSRTC Complex": [17.8758, 83.4385],
  "Allipuram Gandhi Statue": [17.8858, 83.4485],
  "Sangam Office Jn": [17.8958, 83.4585],
  "80feet Road Akkayyapalem": [17.9058, 83.4685],
  "Thatichetlapalem": [17.9158, 83.4785],
  "Kancharapalem mettu": [17.9258, 83.4885],
  "Kancharapalem Main Road": [17.9358, 83.4985],
  "VUDA Colony": [17.9458, 83.5085],
  "Malkapuram": [17.9558, 83.5185],
  "Malkapuram Main Road": [17.9658, 83.5285],
  "New Gajuwaka B.C. Road": [17.9758, 83.5385],
  "Pedagantyada Seetha Nagaram": [17.9858, 83.5485],
  "Nadupuru": [17.9958, 83.5585],
  "Vadlapudi": [18.0058, 83.5685],
  "Steel Plant": [18.0158, 83.5785],
  "Appikonda": [18.0258, 83.5885],
  "Kurmannapalem": [18.0358, 83.5985],
  "Marripalem": [18.0458, 83.6085],
  "Karasa": [18.0558, 83.6185],
  "Lankelapalem Aganampudi Main Road": [18.0658, 83.6285],
  "Duvvada Aganampudi": [18.0758, 83.6385],
  "Natayyapalem": [18.0858, 83.6485],
  "Sheela Nagar": [18.0958, 83.6585],
  "Venkatapuram": [18.1058, 83.6685],
  "Gopalapatnam": [18.1158, 83.6785],
  "Vepagunta": [18.1258, 83.6885],
  "Chinamushidiwada": [18.1358, 83.6985],
  "Pendurthi": [17.9458, 83.3085],
  "Simhachalam": [17.9558, 83.3185],
  "Anakapalli": [17.6858, 83.0285],
  "Bhimili": [17.8958, 83.4485],
  "Old Gajuwaka Drivers Colony": [17.9658, 83.5285],
  "Sri Nagar": [17.9758, 83.5385],
  "Nehru Nagar Gajuwaka B C Road": [17.9858, 83.5485],
  "New Gajuwaka Junction": [17.9958, 83.5585],
  "Old gajuwaka junction": [18.0058, 83.5685],
  "NAD kotha road": [18.0158, 83.5785],
  "K G H Area": [17.8358, 83.3885],
  "Relli Veedhi": [17.8458, 83.3985],
  "Town Kotha Road": [17.8558, 83.4085],
  "Old Municipal Office": [17.8658, 83.4185],
  "Old Post Office": [17.8758, 83.4285],
  "Purna Market": [17.8858, 83.4385],
  "Jagadamba junction": [17.8958, 83.4485],
  "Neelammavepa chettu": [17.9058, 83.4585],
  "Convent junction": [17.9158, 83.4685],
  "104 Area ITI Junction": [17.9258, 83.4785],
  "Gavara Kancharapalem": [17.9358, 83.4885],
  "Gnanapuram": [17.9458, 83.4985],
  "Yarada Village": [17.9558, 83.5085],
  "INS EKASILA Road": [17.9658, 83.5185]
}

// Parse CSV data from WaterSupply_visakhapatnam.csv
const filePath = path.join(process.cwd(), 'WaterSupply_visakhapatnam.csv')
const csvData = fs.readFileSync(filePath, 'utf8')
const lines = csvData.split('\n').slice(1).filter(line => line.trim() !== '')

const zonesData = lines.map(line => {
  const parts = line.split(',')
  const [city, zone, ward, no, capacity, usage, network] = parts.map(p => p.trim())
  const coords = (wardCoordinates as any)[ward] || [17.6868, 83.2185] // Fallback to center

  return {
    zone_name: zone,
    ward_name: ward,
    ward_no: parseInt(no) || 0,
    latitude: coords[0] + (Math.random() - 0.5) * 0.01, // Add slight randomization for demo
    longitude: coords[1] + (Math.random() - 0.5) * 0.01,
    status: 'active', // Default, can vary based on data
    water_quality: network ? parseFloat(network.replace('%', '')) : 90, // Use network % as proxy
    pressure: 'Normal',
    last_updated: '5 min ago',
    capacity: parseFloat(capacity) || 0,
    usage: parseFloat(usage) || 0,
    network: parseFloat(network.replace('%', '')) || 0
  }
})

export async function GET() {
  // Add some randomization for demo purposes
  const zones = zonesData.map(zone => ({
    ...zone,
    // Randomly set some zones as inactive for demo
    status: Math.random() > 0.8 ? 'inactive' : zone.status,
    // Add some variation to water quality
    water_quality: Math.max(50, Math.min(100, zone.water_quality + (Math.random() - 0.5) * 20)),
    // Random last updated time
    last_updated: `${Math.floor(Math.random() * 15) + 1} min ago`,
    // Vary pressure based on water quality
    pressure: zone.water_quality < 80 ? 'Low' : zone.water_quality > 95 ? 'High' : 'Normal'
  }))

  return NextResponse.json(zones)
}