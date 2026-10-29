export interface CompetencyLevel {
  level: 1 | 2 | 3 | 4
  title: string
  description: string
  observableBehavior: string
}

export interface Competency {
  id: string
  titleAr: string
  titleEn: string
  description: string
  iconName: string
  levels: Record<1 | 2 | 3 | 4, CompetencyLevel>
}

export const COMPETENCIES: Competency[] = [
  {
    id: 'active_listening',
    titleAr: 'الاستماع الفعال',
    titleEn: 'Active Listening',
    description: 'الإنصات باهتمام لأفكار الزملاء دون مقاطعة، وتلخيص وجهات نظرهم بدقة قبل الرد.',
    iconName: 'Ear',
    levels: {
      1: {
        level: 1,
        title: 'مبتدئ',
        description: 'يحتاج إلى تذكير مستمر بعدم مقاطعة زملائه.',
        observableBehavior: 'يقاطع زملاءه أثناء حديثهم أو ينشغل عن متابعة نقاش المجموعة.',
      },
      2: {
        level: 2,
        title: 'نامٍ',
        description: 'ينصت لمعظم الحديث ولكنه يركز على صياغة رده الخاص.',
        observableBehavior: 'ينتظر حتى ينتهي زميله لكنه نادراً ما يشير إلى ما قيل أو يبني عليه.',
      },
      3: {
        level: 3,
        title: 'متمكن',
        description: 'يستمع باهتمام ويلخص ما قاله زملاؤه قبل طرح وجهة نظره.',
        observableBehavior: 'يعيد صياغة أفكار زملائه للتأكد من فهمها بدقة ويشير لنقاطهم بالاسم.',
      },
      4: {
        level: 4,
        title: 'متقدم',
        description: 'يطرح أسئلة استيضاحية عميقة تساعد زملاءه على توضيح وتطوير أفكارهم.',
        observableBehavior: 'يربط بين آراء مختلفة داخل الفريق ويستخرج النقاط المشتركة بمهارة.',
      },
    },
  },
  {
    id: 'clear_explanation',
    titleAr: 'الشرح وتعليم الأقران',
    titleEn: 'Clear Explanation & Peer Teaching',
    description: 'تبسيط المفاهيم المعقدة لزملاء الفريق واستخدام أمثلة توضيحية لتعميق فهم الجميع.',
    iconName: 'Sparkles',
    levels: {
      1: {
        level: 1,
        title: 'مبتدئ',
        description: 'يكتفي بإعطاء الإجابة النهائية دون شرح الخطوات أو الأسباب.',
        observableBehavior: 'يقول الإجابة مباشرة ولا يوضح كيف وصل إليها حتى لو سئل.',
      },
      2: {
        level: 2,
        title: 'نامٍ',
        description: 'يشرح الخطوات بنبرة سريعة أو أسلوب نظري يصعب على بعض الزملاء متابعته.',
        observableBehavior: 'يكرر نفس العبارات عند طلب التوضيح دون محاولة تبسيطها.',
      },
      3: {
        level: 3,
        title: 'متمكن',
        description: 'يشرح المنطق وراء الحل مستعيناً بأمثلة أو رسوم توضيحية مبسطة.',
        observableBehavior: 'يتأكد من فهم زملائه بسؤالهم ويتوقف للتأكد من مواكبتهم للخطوات.',
      },
      4: {
        level: 4,
        title: 'متقدم',
        description: 'يكتشف سوء الفهم لدى زملائه ويعيد صياغة المفهوم بطرق متعددة تناسب الجميع.',
        observableBehavior: 'يستخدم التشبيهات والأمثلة الحياتية ويدرب زملاءه على حل مسائل مشابهة بأنفسهم.',
      },
    },
  },
  {
    id: 'constructive_disagreement',
    titleAr: 'الاختلاف البنّاء والتفاوض الفكري',
    titleEn: 'Constructive Disagreement',
    description: 'معارضة الأفكار وليس الأشخاص، وتقديم أدلة علمية مقنعة مع احترام وجهات النظر المغايرة.',
    iconName: 'Scale',
    levels: {
      1: {
        level: 1,
        title: 'مبتدئ',
        description: 'يتعامل مع الاختلاف في الرأي كخلاف شخصي أو ينسحب من النقاش.',
        observableBehavior: 'يغضب عند معارضة فكرته أو يصر على رأيه دون تقديم مبررات منطقية.',
      },
      2: {
        level: 2,
        title: 'نامٍ',
        description: 'يعبر عن عدم موافقته بأدب لكنه يواجه صعوبة في دعم رأيه بالبراهين.',
        observableBehavior: 'يعترض بجمل عامة (مثل: هذا غير صحيح) دون ذكر الدليل المقابل.',
      },
      3: {
        level: 3,
        title: 'متمكن',
        description: 'يوجه النقد للأفكار فقط مستخدماً عبارات بناءة وأدلة علمية واضحة.',
        observableBehavior: 'يستخدم صيغ مثل: "أتفق معك في جزء كذا، لكن الدليل يشير إلى كذا".',
      },
      4: {
        level: 4,
        title: 'متقدم',
        description: 'يقود الفريق للوصول إلى أرضية مشتركة ويقدر قيمة وجهات النظر المتعارضة.',
        observableBehavior: 'يعيد دمج الأفكار المتعارضة للوصول إلى حل مبتكر ومركب يرضي الجميع بالدليل.',
      },
    },
  },
  {
    id: 'inclusive_participation',
    titleAr: 'المشاركة الشاملة وتشجيع الفريق',
    titleEn: 'Inclusive Participation',
    description: 'تشجيع الزملاء الأقل مشاركة وضمان عدم هيمنة فرد واحد على النقاش والقرارات.',
    iconName: 'Users',
    levels: {
      1: {
        level: 1,
        title: 'مبتدئ',
        description: 'يهيمن تماماً على النقاش أو ينعزل تماماً ويترك العمل لغيره.',
        observableBehavior: 'يتحدث معظم الوقت دون إعطاء فرصة لغيره أو يجلس صامتاً دون انتباه.',
      },
      2: {
        level: 2,
        title: 'نامٍ',
        description: 'يشارك عندما يُسأل فقط ولا يبادر بدعوة زملائه الهادئين للمشاركة.',
        observableBehavior: 'يقوم بدوره الفردي فقط ولا يكترث بمدى انخراط بقية أفراد الفريق.',
      },
      3: {
        level: 3,
        title: 'متمكن',
        description: 'يشارك بانتظام ويوجه أسئلة مباشرة للزملاء الهادئين للاستماع لآرائهم.',
        observableBehavior: 'يقول مثلاً: "يا أحمد ما رأيك في هذه النقطة؟ نود سماع فكرتك".',
      },
      4: {
        level: 4,
        title: 'متقدم',
        description: 'يوزع فرص الحديث بعدالة ويدعم ثقة زملائه ويشيد بالمساهمات البسيطة.',
        observableBehavior: 'يلاحظ انسحاب أي زميل ويعيد دمجه بلطف ويشجعه أمام المجموعة.',
      },
    },
  },
  {
    id: 'shared_responsibility',
    titleAr: 'المسؤولية المشتركة والموثوقية',
    titleEn: 'Shared Responsibility & Reliability',
    description: 'الالتزام الكامل بالدور الموكل للفرد وتسليم مخرجات عالية الجودة في الوقت المحدد.',
    iconName: 'CheckCircle2',
    levels: {
      1: {
        level: 1,
        title: 'مبتدئ',
        description: 'يتجاهل مهمته أو يلقي بالمسؤولية على عاتق باقي الزملاء.',
        observableBehavior: 'يتأخر في أداء المطلوب منه ويعطل إنجاز المجموعة.',
      },
      2: {
        level: 2,
        title: 'نامٍ',
        description: 'يؤدي جزءاً من دوره لكنه يحتاج لمتابعة من زملائه لإنهائه بالكامل.',
        observableBehavior: 'ينجز المطلوب بحد أدنى من الجودة ولا يبادر بالمساعدة في مراجعة النتائج.',
      },
      3: {
        level: 3,
        title: 'متمكن',
        description: 'يتحمل مسؤولية دوره بالكامل ويسلم مخرجه في الوقت المحدد بجودة عالية.',
        observableBehavior: 'يبادر بمساعدة زملائه فور انتهائه من مهمته لضمان نجاح الفريق ككل.',
      },
      4: {
        level: 4,
        title: 'متقدم',
        description: 'يتبنى نجاح المجموعة كهدف شخصي ويساعد في إدارة الأولويات وتخطي العقبات.',
        observableBehavior: 'يراقب تقدم الفريق بحكمة ويتدخل لسد أي ثغرة بروح تعاونية عالية.',
      },
    },
  },
  {
    id: 'problem_solving',
    titleAr: 'حل المشكلات التشاركي',
    titleEn: 'Collaborative Problem Solving',
    description: 'تفكيك المسائل المعقدة بالتعاون واستكشاف فرضيات متعددة بدلاً من الحلول السطحية.',
    iconName: 'Brain',
    levels: {
      1: {
        level: 1,
        title: 'مبتدئ',
        description: 'يتسرع في تبني أول حل يظهر دون التفكير في صلاحيته أو دقته.',
        observableBehavior: 'يتجاهل تعقيدات المسألة ويضغط لإنهاء المهمة بسرعة وبشكل سطحي.',
      },
      2: {
        level: 2,
        title: 'نامٍ',
        description: 'يحلل المشكلة لكنه يعتمد بشكل رئيسي على الحلول التقليدية المألوفة.',
        observableBehavior: 'يتردد في اختبار بدائل جديدة عندما يتعثر الحل الأول.',
      },
      3: {
        level: 3,
        title: 'متمكن',
        description: 'يقسم المسألة لخطوات منطقية ويقترح بدائل متعددة مع فحص ميزات كل بديل.',
        observableBehavior: 'يناقش أسباب الخطأ مع فريقه ويعيدون التفكير في الفرضيات معاً.',
      },
      4: {
        level: 4,
        title: 'متقدم',
        description: 'يوجه الفريق لبناء استراتيجية حل متكاملة ويربط بين معلومات من مجالات متنوعة.',
        observableBehavior: 'يولد حلولاً إبداعية ويبتكر طرق تحقق غير مسبوقة تثري مخرجات الفريق.',
      },
    },
  },
  {
    id: 'constructive_feedback',
    titleAr: 'تقديم واستقبال التغذية الراجعة',
    titleEn: 'Constructive Feedback',
    description: 'توجيه ملاحظات دقيقة وقابلة للتطبيق للزملاء وتقبل الملاحظات بروح رياضية لتحسين العمل.',
    iconName: 'MessageSquareText',
    levels: {
      1: {
        level: 1,
        title: 'مبتدئ',
        description: 'يرفض ملاحظات زملائه ويتخذ موقفاً دفاعياً، أو يقدم نقداً جارحاً.',
        observableBehavior: 'يتجاهل مقترحات التحسين أو ينتقد زملاءه بأسلوب محبط وغير مفيد.',
      },
      2: {
        level: 2,
        title: 'نامٍ',
        description: 'يتقبل الملاحظات دون اعتراض لكنه يقدم تغذية راجعة عامة وسطحية.',
        observableBehavior: 'يقول "جيد" أو "غير جيد" دون تحديد ما يجب تعديله أو لماذا.',
      },
      3: {
        level: 3,
        title: 'متمكن',
        description: 'يقدم ملاحظات محددة تركز على معايير المهمة ويطبق ملاحظات زملائه فوراً.',
        observableBehavior: 'يحدد نقطة القوة أولاً ثم يوضح بدقة كيفية تحسين النقطة الضعيفة.',
      },
      4: {
        level: 4,
        title: 'متقدم',
        description: 'يطلب الملاحظات بنشاط من فريقه ويوظف معايير التقييم لمساعدة زملائه على التميز.',
        observableBehavior: 'يشكر من يقدم له نقداً بناءً ويساعد باقي أعضاء الفريق في تدقيق مخرجاتهم.',
      },
    },
  },
  {
    id: 'reflection',
    titleAr: 'التأمل الذاتي والتطوير',
    titleEn: 'Self-Reflection & Improvement',
    description: 'تقييم تجربة العمل الجماعي بموضوعية وتحديد نقاط التعلم لتطوير الأداء في الجلسات القادمة.',
    iconName: 'Compass',
    levels: {
      1: {
        level: 1,
        title: 'مبتدئ',
        description: 'ينظر للنشاط على أنه مجرد وقت انتهى ولا يكترث بما تحقق.',
        observableBehavior: 'لا يشارك في فقرة التأمل الختامية أو يقدم إجابات شكلية للتخلص من السؤال.',
      },
      2: {
        level: 2,
        title: 'نامٍ',
        description: 'يتذكر ما تم إنجازه لكنه يجد صعوبة في تقييم مدى مساهمته الشخصية.',
        observableBehavior: 'يركز على النتيجة النهائية فقط دون التفكير في كيفية تحسين أسلوب العمل.',
      },
      3: {
        level: 3,
        title: 'متمكن',
        description: 'يحدد بدقة ما نجح فيه الفريق وما كان يمكن تنفيذه بشكل أفضل.',
        observableBehavior: 'يذكر خطوة عملية واحدة على الأقل سيلتزم بها في النشاط الجماعي القادم.',
      },
      4: {
        level: 4,
        title: 'متقدم',
        description: 'يظهر وعياً ذاتياً عميقاً بكيفية تأثير سلوكه على طاقة وتماسك الفريق.',
        observableBehavior: 'يقترح تعديلات ذكية على آليات العمل الجماعي تلهم الصف بأكمله للمستقبل.',
      },
    },
  },
]

export const COMPETENCY_MAP = new Map(COMPETENCIES.map((c) => [c.id, c]))
