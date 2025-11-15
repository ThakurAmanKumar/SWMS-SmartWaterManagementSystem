import { Button } from "@/components/ui/button";
import Link from "next/link";
import LandingHeader from "@/components/landing-header";

export default function SAPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
      <LandingHeader />

      <div className="container mx-auto px-4 py-12 md:py-20">

        {/* HEADER */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent drop-shadow-md">
            Smart Analytics
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mt-4 leading-relaxed">
            Harness the power of AI and machine learning to analyze water usage patterns, predict
            demand, and optimize resource allocation for sustainable water management.
          </p>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">

          {/* CARD 1 */}
          <div className="bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 
            dark:from-blue-950 dark:via-cyan-950 dark:to-teal-950 
            p-8 rounded-3xl border border-blue-200/60 dark:border-blue-900/60 
            shadow-lg hover:shadow-2xl transition-all duration-300 
            flex flex-col items-center text-center">

            <div className="text-5xl mb-4 drop-shadow-sm">🧠</div>

            <h3 className="font-bold text-2xl text-blue-900 dark:text-cyan-200 mb-4">
              Predictive Analytics
            </h3>

            <p className="text-gray-700 dark:text-gray-400 leading-relaxed mb-6 max-w-xs">
              Forecast future water demand using intelligent machine learning models trained on
              real-world historical data.
            </p>

            <ul className="text-gray-700 dark:text-gray-400 space-y-2 text-left w-full max-w-xs leading-relaxed">
              <li>• Demand forecasting</li>
              <li>• Seasonal pattern analysis</li>
              <li>• Weather correlation models</li>
              <li>• Population growth predictions</li>
            </ul>
          </div>

          {/* CARD 2 */}
          <div className="bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 
            dark:from-blue-950 dark:via-cyan-950 dark:to-teal-950 
            p-8 rounded-3xl border border-blue-200/60 dark:border-blue-900/60 
            shadow-lg hover:shadow-2xl transition-all duration-300 
            flex flex-col items-center text-center">

            <div className="text-5xl mb-4 drop-shadow-sm">📈</div>

            <h3 className="font-bold text-2xl text-blue-900 dark:text-cyan-200 mb-4">
              Usage Optimization
            </h3>

            <p className="text-gray-700 dark:text-gray-400 leading-relaxed mb-6 max-w-xs">
              Identify consumption inefficiencies and implement data-driven strategies to improve
              water distribution performance.
            </p>

            <ul className="text-gray-700 dark:text-gray-400 space-y-2 text-left w-full max-w-xs leading-relaxed">
              <li>• Peak usage analysis</li>
              <li>• Leak detection algorithms</li>
              <li>• Intelligent resource allocation</li>
              <li>• Cost optimization insights</li>
            </ul>
          </div>

          {/* CARD 3 */}
          <div className="bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 
            dark:from-blue-950 dark:via-cyan-950 dark:to-teal-950 
            p-8 rounded-3xl border border-blue-200/60 dark:border-blue-900/60 
            shadow-lg hover:shadow-2xl transition-all duration-300 
            flex flex-col items-center text-center">

            <div className="text-5xl mb-4 drop-shadow-sm">📊</div>

            <h3 className="font-bold text-2xl text-blue-900 dark:text-cyan-200 mb-4">
              Data Visualization
            </h3>

            <p className="text-gray-700 dark:text-gray-400 leading-relaxed mb-6 max-w-xs">
              Visualize complex water system data through dynamic charts, dashboards, and real-time
              performance insights.
            </p>

            <ul className="text-gray-700 dark:text-gray-400 space-y-2 text-left w-full max-w-xs leading-relaxed">
              <li>• Custom report generation</li>
              <li>• Interactive analytics dashboards</li>
              <li>• Geographic and pipeline mapping</li>
              <li>• Trend and anomaly detection</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
