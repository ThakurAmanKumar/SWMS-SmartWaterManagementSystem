"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingHero() {
  // -------------------------------------
  // Feature List
  // -------------------------------------
  const features = [
    { title: "Real-time Monitoring", desc: "Track water usage instantly with IoT devices", icon: "📊", href: "/RTM" },
    { title: "Smart Analytics", desc: "Analyze patterns and optimize consumption", icon: "🧠", href: "/SA" },
    { title: "Government Data", desc: "Access official water supply information", icon: "🏛️", href: "/GD" },
    { title: "Energy Efficiency", desc: "Monitor power consumption of water systems", icon: "⚡", href: "/EE" },
    { title: "About", desc: "Learn more about our mission and technology", icon: "ℹ️", href: "/about" },
  ];

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center relative overflow-hidden px-4">
      
      {/* ------------------------------------- */}
      {/* Background Waves & Droplets */}
      {/* ------------------------------------- */}
      <div className="absolute inset-0 -z-10">
        <svg className="w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "rgba(34,197,255,0.1)" }} />
              <stop offset="50%" style={{ stopColor: "rgba(6,182,212,0.1)" }} />
              <stop offset="100%" style={{ stopColor: "rgba(59,130,246,0.1)" }} />
            </linearGradient>

            <radialGradient id="waterDrop" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style={{ stopColor: "rgba(34,197,255,0.3)" }} />
              <stop offset="100%" style={{ stopColor: "rgba(6,182,212,0.1)" }} />
            </radialGradient>
          </defs>

          {/* Animated Waves */}
          <path
            d="M0,300 Q300,250 600,300 T1200,300 L1200,600 L0,600 Z"
            fill="url(#waveGradient)"
            className="animate-wave"
          />
          <path
            d="M0,350 Q300,300 600,350 T1200,350 L1200,600 L0,600 Z"
            fill="url(#waveGradient)"
            opacity="0.5"
            style={{ animationDelay: "1s" }}
            className="animate-wave"
          />

          {/* Floating droplets */}
          {[
            { cx: 200, cy: 150, r: 8, delay: "0s" },
            { cx: 800, cy: 100, r: 6, delay: "1s" },
            { cx: 1000, cy: 200, r: 10, delay: "2s" },
            { cx: 400, cy: 80, r: 5, delay: "0.5s" },
            { cx: 600, cy: 180, r: 7, delay: "1.5s" },
          ].map((drop, i) => (
            <circle
              key={i}
              cx={drop.cx}
              cy={drop.cy}
              r={drop.r}
              fill="url(#waterDrop)"
              className="animate-water-drop"
              style={{ animationDelay: drop.delay }}
            />
          ))}
        </svg>
      </div>

      {/* ------------------------------------- */}
      {/* Main Content */}
      {/* ------------------------------------- */}
      <div className="text-center max-w-3xl z-10">
        
        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
          <span className="bg-linear-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
            Manage Every Drop Smartly
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 text-pretty">
          A real-time smart water management and analytics platform powered by official government data.
        </p>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/signin">
            <Button
              size="lg"
              className="bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8"
            >
              Sign In to Dashboard
            </Button>
          </Link>
        </div>

        {/* ------------------------------------- */}
        {/* Feature Cards */}
        {/* ------------------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-16">
          {features.map((feature, i) => (
            <Link
              key={i}
              href={feature.href}
              className="group bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 
              dark:from-blue-950 dark:via-cyan-950 dark:to-teal-950 p-7 rounded-3xl 
              border border-blue-200/60 dark:border-blue-900/60 shadow-md hover:shadow-xl 
              transition-all duration-300 cursor-pointer flex flex-col items-center 
              justify-center min-h-[180px]"
            >
              <div className="text-4xl mb-3 drop-shadow-sm group-hover:scale-110 transition-transform duration-200">
                {feature.icon}
              </div>

              <h3 className="font-bold text-lg md:text-xl text-blue-800 dark:text-cyan-200 
              mb-2 group-hover:text-cyan-600 dark:group-hover:text-teal-300 transition-colors duration-200">
                {feature.title}
              </h3>

              <p className="text-sm text-gray-700 dark:text-gray-400 text-center leading-relaxed max-w-[180px]">
                {feature.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
