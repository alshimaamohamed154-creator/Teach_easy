import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import {
  GraduationCap,
  ArrowLeft,
  Users2,
  BookOpen,
  MonitorPlay,
  ClipboardCheck,
  TrendingUp,
  CheckCircle2,
  Star,
  Layers,
  Timer,
  PenLine,
} from 'lucide-react'

export const instant = false

export default async function HomePage() {
  let user = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // unauthenticated — show public landing
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 text-white p-2 rounded-xl">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">تيتش إيزي</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-indigo-600 transition">المميزات</a>
            <a href="#activities" className="hover:text-indigo-600 transition">الأنشطة</a>
            <a href="#workflow" className="hover:text-indigo-600 transition">آلية العمل</a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/teacher/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition shadow"
              >
                <span>مساحة عملي</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition shadow"
                >
                  ابدأ مجاناً
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950 pt-20 pb-28">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-sm font-bold mb-8">
            <Star className="w-4 h-4 fill-indigo-500 text-indigo-500" />
            مصمَّمة خصيصاً للمرحلة الثانوية المصرية
          </span>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
            حوّل فصلك إلى
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-l from-violet-600 to-indigo-600">
              تجربة تعلّم تفاعلية
            </span>
          </h1>

          <p className="mt-8 text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
            منصة تعليمية للمعلمين تُنظّم مجموعات الطلاب، وتُطلق أنشطة تعاونية مدروسة،
            وتعرضها على الشاشة التفاعلية مباشرةً أمام الفصل كله.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex justify-center items-center gap-3 px-10 py-4 rounded-2xl bg-indigo-600 text-white font-black text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-500/30 active:scale-95"
            >
              <PlayIcon />
              ابدأ التدريس الآن
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 font-bold text-base text-slate-700 dark:text-slate-200 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              اعرف أكتر
            </a>
          </div>

          {/* Social proof */}
          <div className="mt-14 flex flex-wrap justify-center gap-8 text-sm text-slate-500 dark:text-slate-400 font-semibold">
            {[
              { n: '٨', label: 'أنشطة تعاونية جاهزة' },
              { n: '٨', label: 'كفاءات سلوكية مرصودة' },
              { n: '١٠٠٪', label: 'مشاركة جماعية على الشاشة' },
            ].map(({ n, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-black text-slate-900 dark:text-white">{n}</p>
                <p>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <SectionHeader
            badge="لماذا تيتش إيزي؟"
            title="كل ما يحتاجه المعلم في مكان واحد"
            subtitle="لا تعقيد، لا أدوات مبعثرة. فقط إعداد سريع وفصل مشارك بالكامل."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Activities ── */}
      <section id="activities" className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <SectionHeader
            badge="مكتبة الأنشطة"
            title="٨ أنشطة تعاونية مدروسة علمياً"
            subtitle="كل نشاط مُصمَّم وفق أسلوب تعليمي محدد، مع خطوات واضحة وأدوار موزعة لكل مجموعة."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
            {ACTIVITIES.map((a) => (
              <ActivityCard key={a.name} {...a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Workflow ── */}
      <section id="workflow" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <SectionHeader
            badge="آلية العمل"
            title="من الإعداد إلى الشاشة في دقيقتين"
            subtitle="دورة كاملة تبدأ قبل الحصة وتنتهي بتقرير ملاحظات جاهز."
          />
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <StepCard key={s.label} step={i + 1} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 to-violet-700">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-6">
            ابدأ أول حصة تفاعلية اليوم
          </h2>
          <p className="text-xl text-indigo-100 mb-10 leading-relaxed">
            سجّل دخولك وأنشئ أول فصلك خلال دقيقة واحدة.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-3 px-12 py-5 rounded-2xl bg-white text-indigo-700 font-black text-lg hover:bg-indigo-50 transition shadow-xl shadow-indigo-900/30 active:scale-95"
          >
            <GraduationCap className="w-6 h-6" />
            ابدأ الآن — مجاناً
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-300">تيتش إيزي</span>
            <span>— منصة التعلم التعاوني</span>
          </div>
          <p>© 2026 Teach Easy. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  )
}

/* ─────────────────────────── helpers ─────────────────────────── */

function PlayIcon() {
  return (
    <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function SectionHeader({
  badge,
  title,
  subtitle,
}: {
  badge: string
  title: string
  subtitle: string
}) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-sm font-bold mb-4">
        {badge}
      </span>
      <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
        {title}
      </h2>
      <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 leading-relaxed">{subtitle}</p>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
  color,
}: {
  icon: React.ElementType
  title: string
  desc: string
  color: string
}) {
  return (
    <div className="p-7 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition group">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
    </div>
  )
}

function ActivityCard({ name, style, emoji }: { name: string; style: string; emoji: string }) {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition flex flex-col gap-3">
      <span className="text-3xl">{emoji}</span>
      <div>
        <p className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{name}</p>
        <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 font-semibold">{style}</p>
      </div>
    </div>
  )
}

function StepCard({
  step,
  icon: Icon,
  label,
  desc,
}: {
  step: number
  icon: React.ElementType
  label: string
  desc: string
}) {
  return (
    <div className="flex flex-col items-center text-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Icon className="w-7 h-7" />
        </div>
        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-violet-600 text-white text-xs font-black flex items-center justify-center shadow">
          {step}
        </span>
      </div>
      <div>
        <p className="font-black text-slate-900 dark:text-white text-base">{label}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

/* ─────────────────────────── data ─────────────────────────── */

const FEATURES = [
  {
    icon: Users2,
    title: 'تجميع المجموعات التلقائي',
    desc: 'يوزع الطلاب في مجموعات متوازنة بشكل ذكي مع تعيين الأدوار لكل عضو، بضغطة زر واحدة.',
    color: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600',
  },
  {
    icon: MonitorPlay,
    title: 'وضع الشاشة التفاعلية',
    desc: 'واجهة مخصصة للعرض على السبورة الذكية: خطوات النشاط، المجموعات، والمؤقت في مكان واحد.',
    color: 'bg-violet-100 dark:bg-violet-950 text-violet-600',
  },
  {
    icon: BookOpen,
    title: '٨ أنشطة تعاونية جاهزة',
    desc: 'من Think-Pair-Share إلى Jigsaw والجدل البنّاء، كل نشاط مُعدّ بخطوات ووقت وأدوار.',
    color: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600',
  },
  {
    icon: ClipboardCheck,
    title: 'تقييم بعد الجلسة',
    desc: 'سجّل ملاحظاتك على أداء كل طالب بعد الحصة مباشرةً، مرتبطة بكفاءات سلوكية محددة.',
    color: 'bg-amber-100 dark:bg-amber-950 text-amber-600',
  },
  {
    icon: TrendingUp,
    title: 'متابعة التطور عبر الجلسات',
    desc: 'لوحة تحكم تُظهر نمو كفاءات كل طالب عبر الجلسات المتكررة وتساعدك في التخطيط.',
    color: 'bg-rose-100 dark:bg-rose-950 text-rose-600',
  },
  {
    icon: CheckCircle2,
    title: 'بدون تعقيد تقني',
    desc: 'الطلاب لا يحتاجون حسابات أو هواتف. المعلم يُدير كل شيء، والفصل يتفاعل على الشاشة.',
    color: 'bg-sky-100 dark:bg-sky-950 text-sky-600',
  },
]

const ACTIVITIES = [
  { name: 'فكّر، زاوج، شارك', style: 'Think-Pair-Share', emoji: '💬' },
  { name: 'أسلوب المنشار', style: 'Jigsaw', emoji: '🧩' },
  { name: 'تعليم الأقران', style: 'Peer Instruction', emoji: '🙋' },
  { name: 'دراسة الحالة', style: 'Case-Based Learning', emoji: '📋' },
  { name: 'الجدل البنّاء', style: 'Structured Controversy', emoji: '⚖️' },
  { name: 'التصنيف والترتيب', style: 'Classification & Sequencing', emoji: '🗂️' },
  { name: 'استوديو التغذية الراجعة', style: 'Peer Feedback Studio', emoji: '🔍' },
  { name: 'تحدي التصميم', style: 'Design Challenge', emoji: '🚀' },
]

const STEPS = [
  {
    icon: Users2,
    label: 'اختر الفصل والطلاب',
    desc: 'سجّل فصلك وأضف الطلاب مرة واحدة فقط.',
  },
  {
    icon: Layers,
    label: 'اختر النشاط',
    desc: 'اختر من ٨ أنشطة جاهزة تناسب موضوعك.',
  },
  {
    icon: Timer,
    label: 'أطلق الشاشة التفاعلية',
    desc: 'المجموعات تظهر على السبورة مع أدوار وخطوات ومؤقت.',
  },
  {
    icon: PenLine,
    label: 'سجّل الملاحظات',
    desc: 'قيّم أداء الطلاب بعد الحصة وتابع تطورهم.',
  },
]
