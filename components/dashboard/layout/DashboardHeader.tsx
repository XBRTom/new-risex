'use client'

import React from 'react'

interface DashboardHeaderProps {
  title?: string
  subtitle?: string
}

export default function DashboardHeader({ title = "Dashboard", subtitle }: DashboardHeaderProps) {

  return (
    <div className="sticky top-0 z-40 bg-black border-b border-gray-800">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Title Section */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Right Section - can be used for user menu, notifications, etc. */}
        <div className="flex-1 flex justify-end">
          {/* Placeholder for future header items */}
        </div>
      </div>
    </div>
  )
}
