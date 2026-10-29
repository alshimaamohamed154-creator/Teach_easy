'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Maximize2, Minimize2, LogOut, GraduationCap } from 'lucide-react'

interface BoardHeaderProps {
  activityTitle: string
  className: string
  subject: string
  currentStep: number
  totalSteps: number
  exitHref: string
}

export function BoardHeader({
  activityTitle,
  className,
  subject,
  currentStep,
  totalSteps,
  exitHref,
}: BoardHeaderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch {
      // Ignored if browser policy denies
    }
  }

  return (
    <header className="h-20 bg-slate-900 border-b border-slate-800 text-white px-6 flex items-center justify-between select-none shrink-0 shadow-lg">
      {/* Brand & Activity Title */}
      <div className="flex items-center gap-4">
        <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-md flex items-center justify-center">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium">
              {subject} • {className}
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight mt-0.5">
            {activityTitle}
          </h1>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="hidden md:flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-300 ml-2">
          خطوة {currentStep + 1} من {totalSteps}
        </span>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? 'w-8 bg-indigo-500 ring-2 ring-indigo-400'
                  : i < currentStep
                  ? 'w-4 bg-emerald-500'
                  : 'w-3 bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Action Controls (Min 48px touch targets) */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleFullscreen}
          type="button"
          title={isFullscreen ? 'رجوع لحجم عادي' : 'ملء الشاشة'}
          className="touch-target-board h-12 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 text-sm font-semibold transition active:scale-95 cursor-pointer"
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5 text-indigo-400" /> : <Maximize2 className="w-5 h-5 text-indigo-400" />}
          <span className="hidden sm:inline">{isFullscreen ? 'حجم عادي' : 'ملء الشاشة'}</span>
        </button>

        <Link
          href={exitHref}
          className="touch-target-board h-12 px-4 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 flex items-center gap-2 text-sm font-semibold transition active:scale-95"
        >
          <LogOut className="w-5 h-5 text-rose-400" />
          <span className="hidden sm:inline">خلّص الحصة</span>
        </Link>
      </div>
    </header>
  )
}
