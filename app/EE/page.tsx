import { Button } from "@/components/ui/button";
import Link from "next/link";
import LandingHeader from "@/components/landing-header";

export default function EEPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
      <LandingHeader />

      <div className="container mx-auto px-4 py-12 md:py-20">

        {/* HEADER */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent drop-shadow-md">
            Energy Efficiency
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mt-4 leading-relaxed">
            Monitor and optimize energy consumption across water systems to reduce operational costs,
            improve sustainability, and enhance overall service efficiency.
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

            <div className="text-5xl mb-4 drop-shadow-sm">⚡</div>

            <h3 className="font-bold text-2xl text-blue-900 dark:text-cyan-200 mb-4">
              Power Consumption Tracking
            </h3>

            <p className="text-gray-700 dark:text-gray-400 leading-relaxed mb-6 max-w-xs">
              Real-time visibility into energy usage across pumps, treatment facilities,
              and distribution pipelines.
            </p>

            <ul className="text-gray-700 dark:text-gray-400 space-y-2 text-left w-full max-w-xs leading-relaxed">
              <li>• Pump efficiency monitoring</li>
              <li>• Equipment power usage</li>
              <li>• Peak demand analysis</li>
              <li>• Energy cost tracking</li>
            </ul>
          </div>

          {/* CARD 2 */}
          <div className="bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 
            dark:from-blue-950 dark:via-cyan-950 dark:to-teal-950 
            p-8 rounded-3xl border border-blue-200/60 dark:border-blue-900/60 
            shadow-lg hover:shadow-2xl transition-all duration-300 
            flex flex-col items-center text-center">

            <div className="text-5xl mb-4 drop-shadow-sm">🔋</div>

            <h3 className="font-bold text-2xl text-blue-900 dark:text-cyan-200 mb-4">
              Smart Optimization
            </h3>

            <p className="text-gray-700 dark:text-gray-400 leading-relaxed mb-6 max-w-xs">
              AI-driven recommendations to optimize pump operations and reduce energy consumption
              without compromising performance.
            </p>

            <ul className="text-gray-700 dark:text-gray-400 space-y-2 text-left w-full max-w-xs leading-relaxed">
              <li>• Automated pump scheduling</li>
              <li>• Load balancing</li>
              <li>• Predictive maintenance</li>
              <li>• Efficiency optimization</li>
            </ul>
          </div>

          {/* CARD 3 */}
          <div className="bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 
            dark:from-blue-950 dark:via-cyan-950 dark:to-teal-950 
            p-8 rounded-3xl border border-blue-200/60 dark:border-blue-900/60 
            shadow-lg hover:shadow-2xl transition-all duration-300 
            flex flex-col items-center text-center">

            <div className="text-5xl mb-4 drop-shadow-sm">🌱</div>

            <h3 className="font-bold text-2xl text-blue-900 dark:text-cyan-200 mb-4">
              Sustainability Metrics
            </h3>

            <p className="text-gray-700 dark:text-gray-400 leading-relaxed mb-6 max-w-xs">
              Measure carbon emissions and assess environmental performance to support sustainable
              water management practices.
            </p>

            <ul className="text-gray-700 dark:text-gray-400 space-y-2 text-left w-full max-w-xs leading-relaxed">
              <li>• Carbon footprint tracking</li>
              <li>• Energy efficiency scoring</li>
              <li>• Sustainability reporting</li>
              <li>• Green initiative planning</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
