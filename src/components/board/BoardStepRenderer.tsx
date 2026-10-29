'use client'

import { useState } from 'react'
import { StepBlock } from '@/lib/activities/schema'
import { BoardTimer } from './BoardTimer'
import {
  CheckCircle2,
  HelpCircle,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Users,
  Target,
} from 'lucide-react'

interface BoardStepRendererProps {
  block: StepBlock
  groups?: Array<{
    groupNumber: number
    groupName: string
    members: Array<{ fullName: string; roleTitle?: string }>
  }>
}

export function BoardStepRenderer({ block, groups }: BoardStepRendererProps) {
  // State for Reveal block
  const [isRevealed, setIsRevealed] = useState(false)

  // State for MCQ block
  const [selectedMcqOption, setSelectedMcqOption] = useState<string | null>(null)
  const [showMcqAnswer, setShowMcqAnswer] = useState(false)

  // State for Classification block
  const [classState, setClassState] = useState(() => {
    if (block.type === 'classification') {
      return {
        selectedItemId: null as string | null,
        assignments: {} as Record<string, string>, // itemId -> bucketId
      }
    }
    return null
  })

  // State for Sequencing block
  const [sequenceItems, setSequenceItems] = useState(() => {
    if (block.type === 'sequencing') {
      return [...block.items]
    }
    return []
  })

  // Render by Block Type
  switch (block.type) {
    case 'intro':
      return (
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                  نظرة عامة والهدف التعليمي
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white">{block.titleAr}</h2>
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-bold text-slate-200 mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                سياق التحدي الواقعي:
              </h3>
              <p className="text-lg text-slate-300 leading-relaxed">{block.realWorldContextAr}</p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-4">أهداف النشاط والمخرجات المتوقعة:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {block.objectives.map((obj, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-900/50 text-indigo-100 flex items-start gap-3"
                  >
                    <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-base font-medium leading-normal">{obj}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )

    case 'instructions':
      return (
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-8 text-center">
              {block.titleAr}
            </h2>

            <div className="space-y-4">
              {block.steps.map((st) => (
                <div
                  key={st.order}
                  className="flex items-center gap-5 p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-indigo-500/60 transition"
                >
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-lg">
                    {st.order}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{st.title}</h3>
                    <p className="text-slate-300 text-base mt-1">{st.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {block.teacherTipAr && (
              <div className="mt-8 p-5 rounded-2xl bg-amber-950/30 border border-amber-900/50 text-amber-200 text-base font-medium flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-amber-400 shrink-0" />
                <span>إرشاد المعلم: {block.teacherTipAr}</span>
              </div>
            )}
          </div>
        </div>
      )

    case 'timer':
      return (
        <BoardTimer
          initialSeconds={block.durationSeconds}
          promptAr={block.promptAr}
          guidelines={block.guidelines}
        />
      )

    case 'roles':
      return (
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Users className="w-4 h-4" />
                القيادة الدائرية والمسؤولية المشتركة
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white">{block.titleAr}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {block.roles.map((r, i) => (
                <div
                  key={r.id}
                  className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 font-bold flex items-center justify-center mb-4 text-xl">
                      #{i + 1}
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">{r.titleAr}</h3>
                    <p className="text-sm text-slate-300 mb-4">{r.descriptionAr}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-700/60 text-xs font-semibold text-emerald-400 bg-emerald-950/30 -mx-6 -mb-6 p-4 rounded-b-2xl">
                    المهمة الأساسية: {r.responsibilityAr}
                  </div>
                </div>
              ))}
            </div>

            {groups && groups.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-800">
                <h3 className="text-xl font-bold text-slate-200 mb-6 text-center">
                  قوائم المجموعات وتوزيع الطلاب في الفصل
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groups.map((g) => (
                    <div key={g.groupNumber} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700">
                      <h4 className="font-bold text-indigo-400 mb-2">{g.groupName}</h4>
                      <ul className="text-sm space-y-1 text-slate-300">
                        {g.members.map((m, idx) => (
                          <li key={idx} className="flex justify-between items-center py-1 border-b border-slate-700/40">
                            <span>{m.fullName}</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-indigo-300 font-mono">
                              {m.roleTitle || `عضو ${idx + 1}`}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )

    case 'mcq':
      return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800">
              سؤال تعليم الأقران (ConcepTest)
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-4 mb-8 leading-snug">
              {block.questionAr}
            </h2>

            <div className="space-y-4 mb-8">
              {block.options.map((opt, i) => {
                const isSelected = selectedMcqOption === opt.id
                const isCorrect = opt.isCorrect
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedMcqOption(opt.id)}
                    className={`touch-target-board w-full p-5 rounded-2xl border text-right flex items-center justify-between text-lg font-bold transition-all active:scale-[0.98] cursor-pointer ${
                      showMcqAnswer && isCorrect
                        ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200'
                        : isSelected
                        ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-10 h-10 rounded-xl bg-slate-700 text-white font-mono flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{opt.textAr}</span>
                    </div>
                    {showMcqAnswer && isCorrect && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-slate-800">
              <span className="text-sm font-semibold text-slate-400">
                {selectedMcqOption ? 'تم تسجيل اختيارك' : 'اضغط على الإجابة لتحديدها'}
              </span>
              <button
                type="button"
                onClick={() => setShowMcqAnswer(!showMcqAnswer)}
                className="touch-target-board h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition active:scale-95 cursor-pointer shadow-md"
              >
                {showMcqAnswer ? 'إخفاء الإجابة النموذجية' : 'كشف الإجابة والتفسير'}
              </button>
            </div>
          </div>
        </div>
      )

    case 'reveal':
      return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 text-center">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-6">{block.titleAr}</h2>

            <button
              type="button"
              onClick={() => setIsRevealed(!isRevealed)}
              className="touch-target-board my-6 inline-flex items-center gap-3 px-8 py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xl shadow-xl shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
            >
              {isRevealed ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              <span>{isRevealed ? 'إخفاء الحل والتفسير' : block.teaserAr}</span>
            </button>

            {isRevealed && (
              <div className="mt-8 p-8 rounded-3xl bg-emerald-950/30 border border-emerald-700/60 text-emerald-100 text-xl font-medium leading-relaxed animate-in fade-in zoom-in-95 duration-300">
                <p className="font-bold text-2xl text-emerald-300 mb-4">التحليل والتفسير العلمي:</p>
                <p>{block.revealedContentAr}</p>
                {block.explanationAr && (
                  <p className="mt-4 pt-4 border-t border-emerald-800/40 text-base text-emerald-200/90 font-mono">
                    {block.explanationAr}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )

    case 'classification':
      return (
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800">
                تحدي التصنيف باللمس
              </span>
              <h2 className="text-3xl font-black text-white mt-2">{block.titleAr}</h2>
              <p className="text-slate-300 text-base mt-2">{block.instructionsAr}</p>
            </div>

            {/* Target Buckets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {block.buckets.map((b) => (
                <div
                  key={b.id}
                  onClick={() => {
                    if (classState?.selectedItemId) {
                      setClassState((prev) => ({
                        selectedItemId: null,
                        assignments: { ...prev!.assignments, [prev!.selectedItemId!]: b.id },
                      }))
                    }
                  }}
                  className={`touch-target-board min-h-[180px] p-5 rounded-2xl border-2 flex flex-col justify-between transition-all cursor-pointer ${
                    classState?.selectedItemId
                      ? 'border-dashed border-indigo-400 bg-indigo-950/20 hover:bg-indigo-950/40'
                      : 'border-slate-700 bg-slate-800/50'
                  }`}
                >
                  <h3 className="font-extrabold text-lg text-white border-b border-slate-700 pb-2">
                    {b.titleAr}
                  </h3>
                  <div className="flex-1 py-3 space-y-2">
                    {block.items
                      .filter((it) => classState?.assignments[it.id] === b.id)
                      .map((it) => (
                        <div
                          key={it.id}
                          className="p-2.5 rounded-xl bg-slate-700 text-white text-xs font-semibold shadow"
                        >
                          {it.textAr}
                        </div>
                      ))}
                  </div>
                  <span className="text-xs text-indigo-400 font-semibold text-center">
                    {classState?.selectedItemId ? '👈 اضغط هنا لتسكين البطاقة المحددة' : 'مربع التصنيف'}
                  </span>
                </div>
              ))}
            </div>

            {/* Unassigned Items */}
            <div>
              <h4 className="text-sm font-bold text-slate-300 mb-3">البطاقات المتبقية للتصنيف (اضغط عليها أولاً ثم اختر المربع أعلاه):</h4>
              <div className="flex flex-wrap gap-3">
                {block.items
                  .filter((it) => !classState?.assignments[it.id])
                  .map((it) => {
                    const isSelected = classState?.selectedItemId === it.id
                    return (
                      <button
                        key={it.id}
                        type="button"
                        onClick={() =>
                          setClassState((prev) => ({
                            ...prev!,
                            selectedItemId: isSelected ? null : it.id,
                          }))
                        }
                        className={`touch-target-board h-14 px-5 rounded-xl font-bold text-sm transition-all active:scale-95 cursor-pointer shadow-md ${
                          isSelected
                            ? 'bg-indigo-600 text-white ring-4 ring-indigo-400'
                            : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-750'
                        }`}
                      >
                        {it.textAr}
                      </button>
                    )
                  })}
              </div>
            </div>
          </div>
        </div>
      )

    case 'sequencing':
      return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <h2 className="text-3xl font-black text-white text-center mb-2">{block.titleAr}</h2>
            <p className="text-slate-300 text-center mb-8">{block.instructionsAr}</p>

            <div className="space-y-3">
              {sequenceItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700 text-white font-bold text-base"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm font-black shrink-0">
                      {index + 1}
                    </span>
                    <span>{item.textAr}</span>
                  </div>

                  {/* Tap-to-Move Controls (No Drag Required!) */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => {
                        const newItems = [...sequenceItems]
                        const temp = newItems[index - 1]
                        newItems[index - 1] = newItems[index]
                        newItems[index] = temp
                        setSequenceItems(newItems)
                      }}
                      className="touch-target-board w-12 h-12 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-20 flex items-center justify-center text-white transition active:scale-90 cursor-pointer"
                    >
                      <ArrowUp className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === sequenceItems.length - 1}
                      onClick={() => {
                        const newItems = [...sequenceItems]
                        const temp = newItems[index + 1]
                        newItems[index + 1] = newItems[index]
                        newItems[index] = temp
                        setSequenceItems(newItems)
                      }}
                      className="touch-target-board w-12 h-12 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-20 flex items-center justify-center text-white transition active:scale-90 cursor-pointer"
                    >
                      <ArrowDown className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    case 'group_response':
      return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl">
            <h2 className="text-3xl font-black text-white text-center mb-4">{block.titleAr}</h2>
            <p className="text-xl text-slate-300 text-center mb-8 leading-relaxed">{block.promptAr}</p>

            <div className="space-y-6">
              {block.fieldLabels.map((label, idx) => (
                <div key={idx}>
                  <label className="block text-base font-bold text-indigo-300 mb-2">
                    {idx + 1}. {label}
                  </label>
                  <textarea
                    rows={3}
                    placeholder="سجل خلاصة إجابة الفريق هنا..."
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    case 'reflection':
      return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 text-center">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800">
              جلسة التأمل الذاتي وتطوير الفريق
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-4 mb-8">{block.titleAr}</h2>

            <div className="space-y-6 mb-8 text-right">
              {block.prompts.map((p, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-start gap-4"
                >
                  <span className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-xl text-slate-200 font-semibold leading-relaxed">{p}</p>
                </div>
              ))}
            </div>

            {block.debriefGuideAr && (
              <p className="text-sm font-medium text-slate-400 bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
                💡 توجيه المعلم: {block.debriefGuideAr}
              </p>
            )}
          </div>
        </div>
      )

    case 'check':
      return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 text-center">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">{block.titleAr}</h2>
            <p className="text-2xl text-indigo-300 font-bold mb-8">{block.questionAr}</p>

            <div className="space-y-4 text-right max-w-xl mx-auto">
              {block.criteria.map((c, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-200 font-medium"
                >
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )

    default:
      return null
  }
}
