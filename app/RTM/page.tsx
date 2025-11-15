import { Button } from "@/components/ui/button";
import Link from "next/link";
import LandingHeader from "@/components/landing-header";

export default function RTMPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
      <LandingHeader />

      <div className="container mx-auto px-4 py-12 md:py-20">

        {/* HEADER */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent drop-shadow-md">
            Real-time Monitoring
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mt-4 leading-relaxed">
            Track water usage instantly with advanced IoT sensors and a smart digital network.
            Get live updates on flow, pressure, quality, and consumption patterns across the entire system.
          </p>
        </div>

        {/* 3-CARD GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">

          {/* CARD 1 */}
          <div className="bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 
            dark:from-blue-950 dark:via-cyan-950 dark:to-teal-950 
            p-8 rounded-3xl border border-blue-200/60 dark:border-blue-900/60 
            shadow-lg hover:shadow-2xl transition-all duration-300 
            flex flex-col items-center text-center">

            <div className="text-5xl mb-4 drop-shadow-sm">📊</div>

            <h3 className="font-bold text-2xl text-blue-900 dark:text-cyan-200 mb-4">
              Live Data Dashboard
            </h3>

            <p className="text-gray-700 dark:text-gray-400 leading-relaxed mb-6 max-w-xs">
              Monitor water levels, flow rates, pressure, and system health in real-time across all zones.
            </p>

            <ul className="text-gray-700 dark:text-gray-400 space-y-2 text-left w-full max-w-xs leading-relaxed">
              <li>• Real-time sensor data updates</li>
              <li>• Interactive geo-zone maps</li>
              <li>• Alert and anomaly notifications</li>
              <li>• Historical trend comparisons</li>
            </ul>
          </div>

          {/* CARD 2 */}
          <div className="bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 
            dark:from-blue-950 dark:via-cyan-950 dark:to-teal-950 
            p-8 rounded-3xl border border-blue-200/60 dark:border-blue-900/60 
            shadow-lg hover:shadow-2xl transition-all duration-300 
            flex flex-col items-center text-center">

            <div className="text-5xl mb-4 drop-shadow-sm">🔧</div>

            <h3 className="font-bold text-2xl text-blue-900 dark:text-cyan-200 mb-4">
              IoT Device Integration
            </h3>

            <p className="text-gray-700 dark:text-gray-400 leading-relaxed mb-6 max-w-xs">
              Seamlessly integrate with advanced sensors, ultrasonic meters, and pressure monitoring devices.
            </p>

            <ul className="text-gray-700 dark:text-gray-400 space-y-2 text-left w-full max-w-xs leading-relaxed">
              <li>• Automated data collection</li>
              <li>• Device health monitoring</li>
              <li>• Remote diagnostics</li>
              <li>• Predictive maintenance insights</li>
            </ul>
          </div>

          {/* CARD 3 */}
          <div className="bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 
            dark:from-blue-950 dark:via-cyan-950 dark:to-teal-950 
            p-8 rounded-3xl border border-blue-200/60 dark:border-blue-900/60 
            shadow-lg hover:shadow-2xl transition-all duration-300 
            flex flex-col items-center text-center">

            <div className="text-5xl mb-4 drop-shadow-sm">⚡</div>

            <h3 className="font-bold text-2xl text-blue-900 dark:text-cyan-200 mb-4">
              Instant Alerts
            </h3>

            <p className="text-gray-700 dark:text-gray-400 leading-relaxed mb-6 max-w-xs">
              Receive immediate alerts for anomalies, unusual consumption patterns, and equipment failures.
            </p>

            <ul className="text-gray-700 dark:text-gray-400 space-y-2 text-left w-full max-w-xs leading-relaxed">
              <li>• SMS & Email notifications</li>
              <li>• Custom threshold settings</li>
              <li>• Escalation rule configuration</li>
              <li>• Push alerts via mobile app</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
