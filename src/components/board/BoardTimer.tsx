'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Plus, Bell } from 'lucide-react'

interface BoardTimerProps {
  initialSeconds: number
  promptAr: string
  guidelines?: string[]
}

// Clean Web Audio chime synthesizer
function playChime() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3) // A5

    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 1.2)
  } catch {
    // Audio context not allowed or unsupported
  }
}

export function BoardTimer({ initialSeconds, promptAr, guidelines }: BoardTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setSecondsLeft(initialSeconds)
    setIsRunning(false)
  }, [initialSeconds])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!)
            setIsRunning(false)
            playChime()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  const toggleRun = () => setIsRunning(!isRunning)
  const resetTimer = () => {
    setIsRunning(false)
    setSecondsLeft(initialSeconds)
  }
  const addMinute = () => setSecondsLeft((prev) => prev + 60)

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const isLowTime = secondsLeft > 0 && secondsLeft <= 30
  const isExpired = secondsLeft === 0

  return (
    <div className="flex flex-col items-center justify-center p-6 lg:p-10 max-w-4xl mx-auto w-full">
      {/* Central Question/Prompt */}
      <div className="w-full bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 sm:p-8 mb-8 text-center shadow-xl backdrop-blur-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 px-3 py-1 rounded-full">
          مهمة التفكير والنقاش
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-4 leading-relaxed">
          {promptAr}
        </h2>

        {guidelines && guidelines.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {guidelines.map((g, i) => (
              <span
                key={i}
                className="text-sm font-semibold bg-slate-900/60 text-slate-300 border border-slate-700 px-4 py-1.5 rounded-xl"
              >
                ✓ {g}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Large Classroom Timer Display (Min 64px touch controls) */}
      <div
        className={`w-72 h-72 sm:w-80 sm:h-80 rounded-full border-8 flex flex-col items-center justify-center transition-all duration-500 shadow-2xl relative ${
          isExpired
            ? 'border-rose-500 bg-rose-950/40 animate-bounce'
            : isLowTime
            ? 'border-amber-500 bg-amber-950/30 animate-pulse'
            : 'border-indigo-500 bg-slate-900'
        }`}
      >
        <span className="text-6xl sm:text-7xl font-black font-mono tracking-tight text-white select-none">
          {formattedTime}
        </span>
        <span className="text-xs sm:text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">
          {isExpired ? 'انتهى الوقت!' : isRunning ? 'العداد يعمل' : 'متوقف مؤقتاً'}
        </span>
      </div>

      {/* Timer Controls (Large 56-64px buttons for touch whiteboard) */}
      <div className="flex items-center gap-4 mt-8">
        <button
          onClick={toggleRun}
          type="button"
          className={`touch-target-board h-16 px-8 rounded-2xl font-black text-lg flex items-center gap-3 transition-all active:scale-95 shadow-xl cursor-pointer ${
            isRunning
              ? 'bg-amber-600 hover:bg-amber-500 text-white'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          <span>{isRunning ? 'إيقاف مؤقت' : 'ابدأ العداد'}</span>
        </button>

        <button
          onClick={addMinute}
          type="button"
          className="touch-target-board h-16 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-base flex items-center gap-2 transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-5 h-5 text-indigo-400" />
          <span>+1 دقيقة</span>
        </button>

        <button
          onClick={resetTimer}
          type="button"
          className="touch-target-board h-16 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-base flex items-center gap-2 transition active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5 text-slate-400" />
          <span>إعادة ضبط</span>
        </button>

        <button
          onClick={playChime}
          type="button"
          title="تجربة الجرس الصوتي"
          className="touch-target-board h-16 w-16 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center transition active:scale-95 cursor-pointer"
        >
          <Bell className="w-6 h-6 text-amber-400" />
        </button>
      </div>
    </div>
  )
}
