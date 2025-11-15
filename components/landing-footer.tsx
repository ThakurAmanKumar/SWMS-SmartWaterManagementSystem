"use client"

export default function LandingFooter() {
  return (
    <footer className="border-t border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-100 dark:from-slate-900 dark:via-blue-900 dark:to-teal-900 backdrop-blur">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col items-center gap-8 text-center">
          <div className="mb-2">
            <p className="text-base font-semibold text-blue-700 dark:text-cyan-300">
              © 2025 Smart Water Management System
              <span className="mx-2 text-gray-400">|</span>
              Designed by{' '}
              <a
                href="https://www.amankumarthakur.com.np/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-600 dark:text-teal-300 hover:text-blue-800 dark:hover:text-blue-400 underline font-bold"
              >
                A.T
              </a>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Revolutionizing water conservation through <span className="text-cyan-600 dark:text-teal-300 font-medium">smart technology</span>
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-base text-blue-700 dark:text-cyan-300">
              <span className="font-semibold">Contact:</span>{' '}
              <a
                href="mailto:swms.helpdesk@gmail.com"
                className="text-cyan-600 dark:text-teal-300 hover:text-blue-800 dark:hover:text-blue-400 underline font-medium"
              >
                swms.helpdesk@gmail.com
              </a>
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-400">
              KRM Colony, Seethammadara, Visakhapatnam, Andhra Pradesh - 530013
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}