import { Button } from "@/components/ui/button";
import Link from "next/link";
import LandingHeader from "@/components/landing-header";

export default function GDPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
      <LandingHeader />

      <div className="container mx-auto px-4 py-12 md:py-20">

        {/* HEADER */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent drop-shadow-md">
            Government Data Integration
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mt-4 leading-relaxed">
            Access comprehensive, verified, and real-time water supply information directly from official
            government departments, regulatory bodies, and municipal authorities.
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

            <div className="text-5xl mb-4 drop-shadow-sm">🏛️</div>

            <h3 className="font-bold text-2xl text-blue-900 dark:text-cyan-200 mb-4">
              Official Data Sources
            </h3>

            <p className="text-gray-700 dark:text-gray-400 leading-relaxed mb-6 max-w-xs">
              Integrated data from municipal water boards, environmental agencies, and regulatory
              organizations for complete system transparency.
            </p>

            <ul className="text-gray-700 dark:text-gray-400 space-y-2 text-left w-full max-w-xs leading-relaxed">
              <li>• Municipal water supply datasets</li>
              <li>• Environmental compliance reports</li>
              <li>• National regulatory standards</li>
              <li>• Infrastructure & pipeline mapping</li>
            </ul>
          </div>

          {/* CARD 2 */}
          <div className="bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 
            dark:from-blue-950 dark:via-cyan-950 dark:to-teal-950 
            p-8 rounded-3xl border border-blue-200/60 dark:border-blue-900/60 
            shadow-lg hover:shadow-2xl transition-all duration-300 
            flex flex-col items-center text-center">

            <div className="text-5xl mb-4 drop-shadow-sm">📋</div>

            <h3 className="font-bold text-2xl text-blue-900 dark:text-cyan-200 mb-4">
              Verified Information
            </h3>

            <p className="text-gray-700 dark:text-gray-400 leading-relaxed mb-6 max-w-xs">
              All data is validated and sourced directly from official APIs and government systems,
              ensuring accuracy and reliability at every level.
            </p>

            <ul className="text-gray-700 dark:text-gray-400 space-y-2 text-left w-full max-w-xs leading-relaxed">
              <li>• Data quality assurance</li>
              <li>• Verified & reliable sources</li>
              <li>• Continuous updates</li>
              <li>• Compliance monitoring</li>
            </ul>
          </div>

          {/* CARD 3 */}
          <div className="bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 
            dark:from-blue-950 dark:via-cyan-950 dark:to-teal-950 
            p-8 rounded-3xl border border-blue-200/60 dark:border-blue-900/60 
            shadow-lg hover:shadow-2xl transition-all duration-300 
            flex flex-col items-center text-center">

            <div className="text-5xl mb-4 drop-shadow-sm">🔄</div>

            <h3 className="font-bold text-2xl text-blue-900 dark:text-cyan-200 mb-4">
              Real-time Sync
            </h3>

            <p className="text-gray-700 dark:text-gray-400 leading-relaxed mb-6 max-w-xs">
              Automatically synced with government databases to ensure the most current data is
              always available for monitoring and analysis.
            </p>

            <ul className="text-gray-700 dark:text-gray-400 space-y-2 text-left w-full max-w-xs leading-relaxed">
              <li>• Live API data feeds</li>
              <li>• Automatic periodic updates</li>
              <li>• High-speed integrations</li>
              <li>• Consistent & accurate datasets</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
