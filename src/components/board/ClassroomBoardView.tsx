'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BoardSessionDTO } from '@/lib/dto/board'
import { BoardHeader } from './BoardHeader'
import { BoardStepRenderer } from './BoardStepRenderer'
import { BoardFooter } from './BoardFooter'

interface ClassroomBoardViewProps {
  initialSession: BoardSessionDTO
}

export function ClassroomBoardView({ initialSession }: ClassroomBoardViewProps) {
  const router = useRouter()
  const [stepIndex, setStepIndex] = useState(initialSession.currentStepIndex || 0)

  const steps = initialSession.activity.steps
  const currentBlock = steps[stepIndex]

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1)
    }
  }

  const handleFinish = () => {
    router.push(`/teacher/sessions/${initialSession.id}/assessment`)
  }

  return (
    <div className="fixed inset-0 bg-slate-950 text-white flex flex-col justify-between overflow-hidden select-none">
      {/* 1. Header with Fullscreen & Exit */}
      <BoardHeader
        activityTitle={initialSession.activity.titleAr}
        className={initialSession.className}
        subject={initialSession.subject}
        currentStep={stepIndex}
        totalSteps={steps.length}
        exitHref={`/teacher/sessions/${initialSession.id}/assessment`}
      />

      {/* 2. Main Step Content Area (Landscape 16:9 optimized, large typography) */}
      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 flex items-center justify-center">
        <BoardStepRenderer block={currentBlock} groups={initialSession.groups} />
      </main>

      {/* 3. Footer with 48-64px Touch Controls */}
      <BoardFooter
        currentStep={stepIndex}
        totalSteps={steps.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onFinish={handleFinish}
      />
    </div>
  )
}
