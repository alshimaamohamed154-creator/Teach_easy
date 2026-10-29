'use client'

import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'

interface BoardFooterProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
  onFinish: () => void
}

export function BoardFooter({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onFinish,
}: BoardFooterProps) {
  const isFirst = currentStep === 0
  const isLast = currentStep === totalSteps - 1

  return (
    <footer className="h-24 bg-slate-900 border-t border-slate-800 px-6 sm:px-12 flex items-center justify-between shrink-0 shadow-2xl select-none">
      {/* Previous Step (Min 56px touch target) */}
      <button
        type="button"
        disabled={isFirst}
        onClick={onPrevious}
        className="touch-target-board h-14 px-6 rounded-2xl bg-slate-800 hover:bg-slate-750 disabled:opacity-30 border border-slate-700 text-white font-bold text-base flex items-center gap-3 transition active:scale-95 cursor-pointer shadow-md"
      >
        <ArrowRight className="w-5 h-5 text-slate-400" />
        <span>الخطوة اللي قبلها</span>
      </button>

      {/* Progress Pills */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === currentStep
                ? 'w-10 bg-indigo-500'
                : i < currentStep
                ? 'w-3 bg-emerald-500'
                : 'w-3 bg-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Next Step or Complete Activity */}
      {isLast ? (
        <button
          type="button"
          onClick={onFinish}
          className="touch-target-board h-14 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg flex items-center gap-3 transition active:scale-95 cursor-pointer shadow-xl shadow-emerald-900/30"
        >
          <span>خلّصنا، يلا للتقييم</span>
          <CheckCircle2 className="w-6 h-6" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="touch-target-board h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg flex items-center gap-3 transition active:scale-95 cursor-pointer shadow-xl shadow-indigo-900/30"
        >
          <span>الخطوة الجاية</span>
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}
    </footer>
  )
}
