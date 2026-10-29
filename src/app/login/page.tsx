'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { login, signup } from './actions'
import { GraduationCap, Lock, Mail, User, AlertCircle, CheckCircle2, ArrowLeft, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) => {
    setMessage(null)
    startTransition(async () => {
      if (isSignUp) {
        const res = await signup(formData)
        if (res?.error) setMessage({ text: res.error, type: 'error' })
        else if (res?.success) setMessage({ text: res.success, type: 'success' })
      } else {
        const res = await login(formData)
        if (res?.error) setMessage({ text: res.error, type: 'error' })
      }
    })
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel — brand ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur p-2.5 rounded-xl">
            <GraduationCap className="w-7 h-7" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight">تيتش إيزي</span>
        </div>

        <div>
          <h2 className="text-4xl font-black leading-tight mb-6">
            التعلّم الجماعي
            <br />
            على الشاشة التفاعلية
          </h2>
          <p className="text-indigo-100 text-lg leading-relaxed max-w-sm">
            وفّر وقت التحضير وركّز على الأهم: مشاركة الطلاب وتفكيرهم جوه الفصل.
          </p>

          <ul className="mt-10 space-y-4">
            {[
              'أنشطة جماعية جاهزة تشغّلها على طول',
              'تقسيم المجموعات تلقائيًا وبعدل',
              'عداد وأدوار وخطوات واضحة على الشاشة',
              'تقييم بسيط لكل طالب بعد الحصة',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-indigo-100">
                <CheckCircle2 className="w-5 h-5 text-indigo-300 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-indigo-300 text-sm">© 2026 Teach Easy — التعلم الجماعي ببساطة</p>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="bg-indigo-600 text-white p-2 rounded-xl">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">تيتش إيزي</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl ring-1 ring-slate-900/5 dark:ring-white/10 p-8 sm:p-10">
            <div className="mb-8">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                {isSignUp ? 'اعمل حسابك دلوقتي' : 'أهلاً بيك تاني'}
              </h1>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                {isSignUp
                  ? 'اعمل حسابك المجاني وابدأ أول حصة في دقيقة'
                  : 'سجّل دخولك عشان توصل لمساحتك'}
              </p>
            </div>

            {/* Alert */}
            {message && (
              <div
                role="alert"
                className={`mb-6 p-4 rounded-2xl text-sm flex items-start gap-3 ${
                  message.type === 'error'
                    ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50'
                    : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50'
                }`}
              >
                {message.type === 'error' ? (
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <form action={handleSubmit} className="space-y-5">
              {isSignUp && (
                <FormField label="الاسم بالكامل" icon={<User className="w-5 h-5" />}>
                  <input
                    name="fullName"
                    type="text"
                    required={isSignUp}
                    placeholder="اسمك"
                    className={inputClass}
                  />
                </FormField>
              )}

              <FormField label="الإيميل" icon={<Mail className="w-5 h-5" />}>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="teacher@school.edu.eg"
                  className={inputClass}
                />
              </FormField>

              <FormField
                label="كلمة السر"
                icon={<Lock className="w-5 h-5" />}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 left-0 px-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                    tabIndex={-1}
                    aria-label={showPassword ? 'اخفي كلمة السر' : 'اظهر كلمة السر'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              >
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className={`${inputClass} pl-10`}
                />
              </FormField>

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center items-center gap-2.5 py-3.5 px-4 rounded-xl text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 transition cursor-pointer shadow-lg shadow-indigo-500/20 mt-2"
              >
                {isPending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isSignUp ? 'اعمل الحساب' : 'دخول'}</span>
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle sign-in / sign-up */}
            <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              {isSignUp ? 'عندك حساب فعلاً؟ ' : 'معاك حساب؟ '}
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setMessage(null) }}
                className="font-bold text-indigo-600 hover:text-indigo-500 underline underline-offset-4"
              >
                {isSignUp ? 'سجّل دخولك' : 'اعمل حساب مجاني'}
              </button>
            </div>

            {/* Back to home */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
              <Link
                href="/"
                className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition"
              >
                ← رجوع للصفحة الرئيسية
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const inputClass =
  'block w-full pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition'

function FormField({
  label,
  icon,
  suffix,
  children,
}: {
  label: string
  icon: React.ReactNode
  suffix?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
          {icon}
        </div>
        {children}
        {suffix}
      </div>
    </div>
  )
}
