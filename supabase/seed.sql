-- Teach Easy (تيتش إيزي) - Fictional Demonstration Seed Data
-- Egyptian Secondary School Realistic Scenario (Grades 10 & 11)

-- Note: Seed data requires an existing auth.users profile.
-- Run this in Supabase SQL editor or migration after teacher registration.

DO $$
DECLARE
  v_teacher_id UUID;
  v_class_id UUID;
  v_class2_id UUID;
  v_student_ids UUID[] := ARRAY[]::UUID[];
  v_sid UUID;
  v_names TEXT[] := ARRAY[
    'أحمد محمود الشناوي', 'عمر حسام خليل', 'يوسف كريم عبد الرحمن', 'زياد طارق مروان',
    'سيف الدين إبراهيم', 'مصطفى عادل توفيق', 'علي خالد عبد الله', 'حمزة نادر إسماعيل',
    'محمد شريف رضوان', 'ياسين سامح العزازي', 'مريم عصام المنشاوي', 'سارة هشام بدوي',
    'نور الدين أشرف', 'ندى وائل حجازي', 'حبيبة أحمد فوزي', 'شهد مصطفى كامل',
    'آية طارق عبد الفتاح', 'ملك حازم عبد العزيز', 'جنى وليد الدسوقي', 'فريدة هاني زهران',
    'بلال سمير الألفي', 'كريم هيثم البنا', 'أدهم ممدوح غانم', 'مروان سامي بركات',
    'يمنى حسام الباز', 'رنا مجدي الشافعي', 'سلمى إيهاب رضوان', 'ليلى معتز الجوهري',
    'عبد الرحمن ماجد جودة', 'خالد حسني البحيري'
  ];
  i INT;
BEGIN
  -- Pick the first profile or fallback
  SELECT id INTO v_teacher_id FROM public.profiles LIMIT 1;

  IF v_teacher_id IS NOT NULL THEN
    -- 1. Create Class 1 (Grade 11 STEM / Biology)
    INSERT INTO public.classes (id, teacher_id, name, subject, grade_level, academic_year)
    VALUES (gen_random_uuid(), v_teacher_id, 'الصف الثاني الثانوي - علمي 1', 'الأحياء (Biology)', '11', '2026/2027')
    RETURNING id INTO v_class_id;

    -- 2. Create Class 2 (Grade 10 General Sciences)
    INSERT INTO public.classes (id, teacher_id, name, subject, grade_level, academic_year)
    VALUES (gen_random_uuid(), v_teacher_id, 'الصف الأول الثانوي - شعبة أ', 'العلوم المتكاملة', '10', '2026/2027')
    RETURNING id INTO v_class2_id;

    -- 3. Insert Students and enroll into Class 1
    FOR i IN 1..array_length(v_names, 1) LOOP
      INSERT INTO public.students (id, teacher_id, full_name, student_code, notes)
      VALUES (
        gen_random_uuid(),
        v_teacher_id,
        v_names[i],
        'STU-2026-' || lpad(i::text, 3, '0'),
        CASE WHEN i % 5 = 0 THEN 'مشارك نشط في المناقشات' ELSE NULL END
      )
      RETURNING id INTO v_sid;

      v_student_ids := array_append(v_student_ids, v_sid);

      -- Enroll into class 1
      INSERT INTO public.class_enrollments (class_id, student_id)
      VALUES (v_class_id, v_sid);

      -- Enroll first 15 into class 2 as well for testing multi-enrollment
      IF i <= 15 THEN
        INSERT INTO public.class_enrollments (class_id, student_id)
        VALUES (v_class2_id, v_sid);
      END IF;
    END LOOP;

    -- 4. Insert sample historic competency observations for 10 students
    FOR i IN 1..10 LOOP
      INSERT INTO public.student_competency_observations (teacher_id, student_id, competency_id, level, evidence_note)
      VALUES 
        (v_teacher_id, v_student_ids[i], 'active_listening', (i % 4) + 1, 'استمع باهتمام لوجهة نظر زميله وقام بتلخيصها بدقة'),
        (v_teacher_id, v_student_ids[i], 'clear_explanation', ((i + 1) % 4) + 1, 'شرح المفهوم بأسلوب منطقي مدعماً بأمثلة واقعية');
    END LOOP;

    RAISE NOTICE 'Demo seed data created successfully for teacher: %', v_teacher_id;
  ELSE
    RAISE NOTICE 'No profile found. Please register an account first, then run seed.';
  END IF;
END $$;
