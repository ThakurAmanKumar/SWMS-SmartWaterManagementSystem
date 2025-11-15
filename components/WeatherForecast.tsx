"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Cloud, Sun, CloudRain, CloudSnow, Zap, Eye, Thermometer, Wind, Gauge } from "lucide-react"

interface WeatherData {
  temp: number
  description: string
  icon: string
  humidity: number
  windSpeed: number
  pressure: number
  hourlyTemps: number[]
  visibility: number
  feelsLike: number
  dailyTemps: { max: number, min: number, code: number }[]
}



export default function WeatherForecast() {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temp: 28,
    description: 'Sunny',
    icon: '☀️',
    humidity: 65,
    windSpeed: 12,
    pressure: 1013,
    hourlyTemps: [],
    visibility: 10,
    feelsLike: 30,
    dailyTemps: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const getWeatherIcon = (code: number): string => {
    const icons: Record<number, string> = {
      0: '☀️', // Clear sky
      1: '🌤️', // Mainly clear
      2: '⛅', // Partly cloudy
      3: '☁️', // Overcast
      45: '🌫️', // Fog
      48: '🌫️', // Depositing rime fog
      51: '🌦️', // Light drizzle
      53: '🌦️', // Moderate drizzle
      55: '🌦️', // Dense drizzle
      61: '🌧️', // Slight rain
      63: '🌧️', // Moderate rain
      65: '🌧️', // Heavy rain
      66: '🌨️', // Light freezing rain
      67: '🌨️', // Heavy freezing rain
      71: '❄️', // Slight snow fall
      73: '❄️', // Moderate snow fall
      75: '❄️', // Heavy snow fall
      77: '❄️', // Snow grains
      80: '🌧️', // Slight rain showers
      81: '🌧️', // Moderate rain showers
      82: '🌧️', // Violent rain showers
      85: '❄️', // Slight snow showers
      86: '❄️', // Heavy snow showers
      95: '⛈️', // Thunderstorm
      96: '⛈️', // Thunderstorm with slight hail
      99: '⛈️', // Thunderstorm with heavy hail
    }
    return icons[code] || '☀️'
  }

  const getWeatherDescription = (code: number): string => {
    const descriptions: Record<number, string> = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    }
    return descriptions[code] || 'Unknown'
  }

  const fetchWeather = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=17.6868&longitude=83.2185&current_weather=true&current=relative_humidity_2m,windspeed_10m,pressure_msl,apparent_temperature,visibility&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`)
      const data = await response.json()
      const current = data.current_weather
      const icon = getWeatherIcon(current.weathercode)
      const desc = getWeatherDescription(current.weathercode)
      const hourlyTemps = data.hourly?.temperature_2m?.slice(0, 24) || [] // Next 24 hours
      const dailyTemps = data.daily?.temperature_2m_max ? data.daily.temperature_2m_max.slice(0, 7).map((max: number, index: number) => ({
        max: Math.round(max),
        min: Math.round(data.daily.temperature_2m_min[index]),
        code: data.daily.weathercode[index]
      })) : []
      setWeatherData({
        temp: Math.round(current.temperature),
        description: desc,
        icon,
        humidity: data.current?.relative_humidity_2m || 65,
        windSpeed: Math.round(data.current?.windspeed_10m || 12),
        pressure: Math.round(data.current?.pressure_msl || 1013),
        hourlyTemps,
        visibility: Math.round((data.current?.visibility || 10000) / 1000), // Convert to km
        feelsLike: Math.round(data.current?.apparent_temperature || current.temperature + 2),
        dailyTemps
      })
    } catch (err) {
      console.error('Error fetching weather:', err)
      setError('Failed to load weather data')
    } finally {
      setLoading(false)
    }
  }



  const refreshCurrentWeather = async () => {
    try {
      setRefreshing(true)
      setError(null)

      // Simulate loading for 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000))

      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=17.6868&longitude=83.2185&current_weather=true&current=apparent_temperature&timezone=auto`)
      const data = await response.json()
      const current = data.current_weather
      const icon = getWeatherIcon(current.weathercode)
      const desc = getWeatherDescription(current.weathercode)
      const newTemp = Math.round(current.temperature)
      const newFeelsLike = Math.round(data.current?.apparent_temperature || current.temperature + 2)

      // Simulate loading details for another 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000))

      setWeatherData(prev => ({
        ...prev,
        temp: newTemp,
        description: desc,
        icon,
        feelsLike: newFeelsLike
      }))
    } catch (err) {
      console.error('Error refreshing current weather:', err)
      setError('Failed to refresh weather data')
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchWeather()
    const interval = setInterval(fetchWeather, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card className="glass-light border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Weather Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center space-y-2">
                  <Skeleton className="h-4 w-16 mx-auto" />
                  <Skeleton className="h-6 w-12 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="glass-light border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Cloud className="w-5 h-5" />
            Weather Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={fetchWeather}
              className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-light border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Weather Forecast
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live
            </div>
            <button
              onClick={refreshCurrentWeather}
              disabled={refreshing}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
              title="Refresh current weather"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Weather */}
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="text-6xl mb-2 animate-bounce">{weatherData.icon}</div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {weatherData.temp}°C
              </div>
              <div className="text-lg font-bold text-black dark:text-white">
                Visakhapatnam
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                {weatherData.description}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Feels like {weatherData.feelsLike}°C
              </div>
            </div>
          </div>

          {/* Weather Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Thermometer className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-900 dark:text-blue-100">Humidity</span>
              </div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {weatherData.humidity}%
              </div>
            </div>

            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Wind className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-900 dark:text-green-100">Wind</span>
              </div>
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {weatherData.windSpeed} km/h
              </div>
            </div>

            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Gauge className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-900 dark:text-purple-100">Pressure</span>
              </div>
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {weatherData.pressure} hPa
              </div>
            </div>

            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Eye className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-medium text-orange-900 dark:text-orange-100">Visibility</span>
              </div>
              <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                {weatherData.visibility} km
              </div>
            </div>
          </div>

          {/* Hourly Forecast */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Next 12 Hours</h4>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {weatherData.hourlyTemps.slice(0, 12).map((temp, index) => (
                <div key={index} className="flex-shrink-0 text-center p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg border min-w-[60px]">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(Date.now() + index * 60 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
                    {Math.round(temp)}°
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">7-Day Forecast</h4>
            <div className="grid grid-cols-7 gap-2">
              {weatherData.dailyTemps.map((day, index) => (
                <div key={index} className="text-center p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg border">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {new Date(Date.now() + index * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-2xl mb-1">{getWeatherIcon(day.code)}</div>
                  <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {day.max}°
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {day.min}°
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Forecast Summary */}
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
              Live weather data
            </div>
          </div>
        </div>
      </CardContent>


    </Card>
  )
}
