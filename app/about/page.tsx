import { Button } from "@/components/ui/button";
import Link from "next/link";
import LandingHeader from "@/components/landing-header";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
      <LandingHeader />
      <div className="container mx-auto px-4 py-12 md:py-20">

        {/* HEADER */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent drop-shadow-md">
            About Our Mission
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mt-4 leading-relaxed">
            We're revolutionizing water management through innovative technology, intelligent analytics,
            and sustainable solutions that empower cities, communities, and municipal authorities.
          </p>
        </div>

        {/* 3 CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">

          {/* CARD 1 – Mission */}
          <div className="bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 dark:from-blue-950 dark:via-cyan-950 dark:to-teal-950 p-8 rounded-3xl border border-blue-200/60 dark:border-blue-900/60 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
            <div className="text-5xl mb-4 drop-shadow-sm">🎯</div>
            <h3 className="font-bold text-2xl text-blue-900 dark:text-cyan-200 mb-4">Our Mission</h3>
            <p className="text-gray-700 dark:text-gray-400 leading-relaxed mb-6 max-w-xs">
              Deliver smart water management solutions ensuring reliable water access, eco-friendly usage,
              and long-term sustainability for communities.
            </p>
            <ul className="text-gray-700 dark:text-gray-400 space-y-2 text-left w-full max-w-xs leading-relaxed">
              <li>• Sustainable water management</li>
              <li>• Community-focused empowerment</li>
              <li>• Environmental preservation</li>
              <li>• Continuous technological growth</li>
            </ul>
          </div>

          {/* CARD 2 – Technology */}
          <div className="bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 dark:from-blue-950 dark:via-cyan-950 dark:to-teal-950 p-8 rounded-3xl border border-blue-200/60 dark:border-blue-900/60 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
            <div className="text-5xl mb-4 drop-shadow-sm">🚀</div>
            <h3 className="font-bold text-2xl text-blue-900 dark:text-cyan-200 mb-4">Our Technology</h3>
            <p className="text-gray-700 dark:text-gray-400 leading-relaxed mb-6 max-w-xs">
              Powered by IoT sensors, AI analytics, and cloud architecture, our system delivers automation,
              instant alerts, and real-time water monitoring.
            </p>
            <ul className="text-gray-700 dark:text-gray-400 space-y-2 text-left w-full max-w-xs leading-relaxed">
              <li>• Smart IoT sensor ecosystem</li>
              <li>• AI-powered analytical engine</li>
              <li>• Secure cloud infrastructure</li>
              <li>• Real-time monitoring & automation</li>
            </ul>
          </div>

          {/* CARD 3 – Impact */}
          <div className="bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 dark:from-blue-950 dark:via-cyan-950 dark:to-teal-950 p-8 rounded-3xl border border-blue-200/60 dark:border-blue-900/60 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
            <div className="text-5xl mb-4 drop-shadow-sm">🌍</div>
            <h3 className="font-bold text-2xl text-blue-900 dark:text-cyan-200 mb-4">Our Impact</h3>
            <p className="text-gray-700 dark:text-gray-400 leading-relaxed mb-6 max-w-xs">
              Creating a long-term positive influence by reducing water wastage, lowering costs,
              and enabling efficient resource utilization.
            </p>
            <ul className="text-gray-700 dark:text-gray-400 space-y-2 text-left w-full max-w-xs leading-relaxed">
              <li>• Reduced water wastage</li>
              <li>• Cost-efficient operations</li>
              <li>• Eco-friendly optimization</li>
              <li>• Improved public health</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}