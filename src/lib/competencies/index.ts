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
    titleAr: 'الاستماع الكويس',
    titleEn: 'Active Listening',
    description: 'يسمع كلام زميله باهتمام من غير ما يقاطعه، ويقدر يلخص رأيه صح.',
    iconName: 'Ear',
    levels: {
      1: {
        level: 1,
        title: 'لسه بيتعلم',
        description: 'محتاج تفكيره أكتر من مرة إنه ما يقاطعش زميله.',
        observableBehavior: 'يقاطع زميله وهو بيتكلم، أو مشغول بحاجة تانية عن النقاش.',
      },
      2: {
        level: 2,
        title: 'بدأ يتحسن',
        description: 'بيسمع أغلب الكلام بس مركّز في رده هو أكتر.',
        observableBehavior: 'بيستنى زميله يخلص، بس نادراً يبني على كلامه.',
      },
      3: {
        level: 3,
        title: 'كويس',
        description: 'يسمع باهتمام ويلخص كلام زميله قبل ما يقول رأيه.',
        observableBehavior: 'يعيد كلام زميله بطريقته عشان يتأكد إنه فاهمه صح.',
      },
      4: {
        level: 4,
        title: 'ممتاز',
        description: 'بيسأل أسئلة تساعد زميله يوضّح فكرته أكتر.',
        observableBehavior: 'يربط بين آراء مختلفة في الفريق ويلاقي النقط المشتركة بينهم.',
      },
    },
  },
  {
    id: 'clear_explanation',
    titleAr: 'الشرح وتعليم زمايله',
    titleEn: 'Clear Explanation & Peer Teaching',
    description: 'يقدر يبسّط فكرة معقدة لزمايله ويستخدم أمثلة تساعدهم يفهموا.',
    iconName: 'Sparkles',
    levels: {
      1: {
        level: 1,
        title: 'لسه بيتعلم',
        description: 'بيقول الإجابة بس من غير ما يشرح إزاي وصل ليها.',
        observableBehavior: 'يقول الإجابة على طول ولو سألته "إزاي؟" ما يعرف يوضّح.',
      },
      2: {
        level: 2,
        title: 'بدأ يتحسن',
        description: 'بيشرح بس بسرعة أو بطريقة صعبة على زمايله.',
        observableBehavior: 'يكرر نفس الكلام لو طلبوا توضيح من غير ما يبسّطه.',
      },
      3: {
        level: 3,
        title: 'كويس',
        description: 'يشرح المنطق ورا الحل بأمثلة بسيطة.',
        observableBehavior: 'يسأل زمايله "فاهمين؟" ويتأكد قبل ما يكمل.',
      },
      4: {
        level: 4,
        title: 'ممتاز',
        description: 'يلاحظ سوء الفهم عند زمايله ويشرح بطرق مختلفة تناسبهم.',
        observableBehavior: 'يستخدم أمثلة من الحياة ويدرّب زمايله على حل مسائل شبيهة بنفسهم.',
      },
    },
  },
  {
    id: 'constructive_disagreement',
    titleAr: 'الاختلاف بطريقة محترمة',
    titleEn: 'Constructive Disagreement',
    description: 'يعترض على الفكرة مش على الشخص، وبيقدّم دليل مع احترام رأي زميله.',
    iconName: 'Scale',
    levels: {
      1: {
        level: 1,
        title: 'لسه بيتعلم',
        description: 'يتعامل مع أي اختلاف رأي كخناقة، أو يسكت وما يشاركش.',
        observableBehavior: 'يزعل لو حد اختلف معاه، أو يتمسك برأيه من غير سبب.',
      },
      2: {
        level: 2,
        title: 'بدأ يتحسن',
        description: 'بيقول رأيه بأدب بس بيلاقي صعوبة يدعمه بدليل.',
        observableBehavior: 'يقول "ده مش صحيح" من غير ما يقول ليه.',
      },
      3: {
        level: 3,
        title: 'كويس',
        description: 'ينتقد الفكرة بأسلوب محترم ومعاه دليل واضح.',
        observableBehavior: 'يقول حاجة زي: "متفق معاك في كذا، بس الدليل يقول كذا".',
      },
      4: {
        level: 4,
        title: 'ممتاز',
        description: 'يوصّل الفريق لرأي مشترك ويقدّر اختلاف الرأي.',
        observableBehavior: 'يجمع بين الآراء المختلفة ويخرج بحل جديد يرضي الكل.',
      },
    },
  },
  {
    id: 'inclusive_participation',
    titleAr: 'مشاركة الكل',
    titleEn: 'Inclusive Participation',
    description: 'يشجع زمايله الأقل مشاركة وما يسيبش حد واحد يستحوذ على الكلام.',
    iconName: 'Users',
    levels: {
      1: {
        level: 1,
        title: 'لسه بيتعلم',
        description: 'بيتكلم هو بس طول الوقت، أو بالعكس ساكت تمامًا.',
        observableBehavior: 'يتكلم أغلب الوقت من غير ما يسيب فرصة لغيره، أو جالس ساكت.',
      },
      2: {
        level: 2,
        title: 'بدأ يتحسن',
        description: 'يشارك لو سألوه بس، وما يشجعش الهادئين يتكلموا.',
        observableBehavior: 'يعمل دوره بس وما يهتمش بمشاركة باقي الفريق.',
      },
      3: {
        level: 3,
        title: 'كويس',
        description: 'يشارك بانتظام ويسأل الهادئين عايزين يقولوا إيه.',
        observableBehavior: 'يقول مثلاً: "يا أحمد، رأيك إيه في النقطة دي؟".',
      },
      4: {
        level: 4,
        title: 'ممتاز',
        description: 'يوزع فرصة الكلام بالعدل ويشجع أي مساهمة حتى الصغيرة.',
        observableBehavior: 'يلاحظ لو حد منسحب من النقاش ويرجّعه بلطف.',
      },
    },
  },
  {
    id: 'shared_responsibility',
    titleAr: 'الالتزام بدوره',
    titleEn: 'Shared Responsibility & Reliability',
    description: 'بيلتزم بدوره في الفريق وبيسلّم شغله في الوقت وبجودة كويسة.',
    iconName: 'CheckCircle2',
    levels: {
      1: {
        level: 1,
        title: 'لسه بيتعلم',
        description: 'بيتجاهل مهمته أو يسيبها لباقي الفريق.',
        observableBehavior: 'بيتأخر في اللي عليه ويعطّل باقي الفريق.',
      },
      2: {
        level: 2,
        title: 'بدأ يتحسن',
        description: 'بيعمل جزء من دوره بس محتاج تذكير من زمايله.',
        observableBehavior: 'بيخلص المطلوب بحد أدنى جودة وما يساعدش في المراجعة.',
      },
      3: {
        level: 3,
        title: 'كويس',
        description: 'بياخد دوره بجدية وبيسلّمه في الوقت بجودة كويسة.',
        observableBehavior: 'بعد ما يخلص مهمته، بيساعد زمايله في مهمتهم.',
      },
      4: {
        level: 4,
        title: 'ممتاز',
        description: 'بيحس إن نجاح الفريق كله مسؤوليته هو.',
        observableBehavior: 'بيراقب تقدم الفريق وبيسد أي حاجة ناقصة بنفسه.',
      },
    },
  },
  {
    id: 'problem_solving',
    titleAr: 'حل المشاكل مع بعض',
    titleEn: 'Collaborative Problem Solving',
    description: 'بيفكك المشكلة المعقدة مع فريقه، وبيجرّب أكتر من حل مش بس أول حل يجيله.',
    iconName: 'Brain',
    levels: {
      1: {
        level: 1,
        title: 'لسه بيتعلم',
        description: 'بياخد أول حل يجيله من غير ما يفكر فيه كويس.',
        observableBehavior: 'بيستعجل يخلص المهمة بسطحية من غير تفكير عميق.',
      },
      2: {
        level: 2,
        title: 'بدأ يتحسن',
        description: 'بيحلل المشكلة بس بيعتمد على الحلول المعتادة بس.',
        observableBehavior: 'بيتردد يجرّب حل جديد لو الأول ما نجحش.',
      },
      3: {
        level: 3,
        title: 'كويس',
        description: 'بيقسّم المشكلة لخطوات واضحة ويقترح أكتر من حل.',
        observableBehavior: 'بيناقش مع فريقه سبب الغلط ويفكروا تاني مع بعض.',
      },
      4: {
        level: 4,
        title: 'ممتاز',
        description: 'بيوجّه الفريق لخطة حل كاملة ويربط معلومات من أماكن مختلفة.',
        observableBehavior: 'بيجيب حلول مبتكرة وطرق تحقق جديدة تفيد الفريق كله.',
      },
    },
  },
  {
    id: 'constructive_feedback',
    titleAr: 'إعطاء واستقبال الملاحظات',
    titleEn: 'Constructive Feedback',
    description: 'بيقول ملاحظة واضحة وقابلة للتنفيذ، وبيستقبل ملاحظات زمايله بروح طيبة.',
    iconName: 'MessageSquareText',
    levels: {
      1: {
        level: 1,
        title: 'لسه بيتعلم',
        description: 'بيرفض ملاحظات زمايله أو ينتقد بطريقة جارحة.',
        observableBehavior: 'بيتجاهل اقتراحات التحسين أو ينتقد زمايله بأسلوب محبط.',
      },
      2: {
        level: 2,
        title: 'بدأ يتحسن',
        description: 'بيقبل الملاحظة بس ملاحظاته هو عامة وسطحية.',
        observableBehavior: 'بيقول "تمام" أو "لأ" من غير ما يحدد إيه المطلوب يتغيّر.',
      },
      3: {
        level: 3,
        title: 'كويس',
        description: 'بيقدم ملاحظة محددة على المعيار المطلوب وبيطبّق ملاحظات زمايله فورًا.',
        observableBehavior: 'بيقول نقطة القوة الأول، وبعدين يوضّح إزاي يتحسّن الجزء الضعيف.',
      },
      4: {
        level: 4,
        title: 'ممتاز',
        description: 'بيطلب الملاحظات بنفسه وبيساعد زمايله يحسّنوا شغلهم.',
        observableBehavior: 'بيشكر اللي ينتقده بصراحة، وبيساعد باقي الفريق يراجعوا شغلهم.',
      },
    },
  },
  {
    id: 'reflection',
    titleAr: 'التأمل والتطوير',
    titleEn: 'Self-Reflection & Improvement',
    description: 'بيقيّم تجربة العمل مع فريقه بصراحة، وبيحدد إيه اللي ممكن يتحسن المرة الجاية.',
    iconName: 'Compass',
    levels: {
      1: {
        level: 1,
        title: 'لسه بيتعلم',
        description: 'بيشوف النشاط إنه وقت خلص وخلاص، ما يهمه النتيجة.',
        observableBehavior: 'ما بيشاركش في جزء التأمل الختامي، أو يرد بإجابة سطحية.',
      },
      2: {
        level: 2,
        title: 'بدأ يتحسن',
        description: 'بيفتكر اللي حصل بس بيلاقي صعوبة يحدد دوره هو في النتيجة.',
        observableBehavior: 'بيركز على النتيجة بس من غير ما يفكر إزاي يحسّن طريقة شغله.',
      },
      3: {
        level: 3,
        title: 'كويس',
        description: 'بيحدد بدقة إيه اللي نجح فيه الفريق وإيه اللي ممكن يتحسن.',
        observableBehavior: 'بيقول خطوة عملية واحدة على الأقل هيلتزم بيها المرة الجاية.',
      },
      4: {
        level: 4,
        title: 'ممتاز',
        description: 'واعي بإزاي سلوكه يأثر على طاقة وتماسك الفريق كله.',
        observableBehavior: 'بيقترح تعديلات ذكية على طريقة الشغل تفيد الفصل كله مستقبلًا.',
      },
    },
  },
]

export const COMPETENCY_MAP = new Map(COMPETENCIES.map((c) => [c.id, c]))
