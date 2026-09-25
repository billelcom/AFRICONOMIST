/* eslint-disable @next/next/no-img-element */
import React, { useRef, useState, useEffect } from 'react';
import { Article } from '../types';
import { 
  Clock, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Eye, 
  Sparkles, 
  ArrowUpRight, 
  Award,
  Feather,
  Flame,
  Volume2
} from 'lucide-react';
import { getCountryFlag } from '../lib/africanGeoProximity';

export interface EditorialStory {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  imageUrl: string;
  hasVideo?: boolean;
  isColumn?: boolean; // هل هي افتتاحية أو عمود رأي
  columnistName?: string;
  columnistNameEn?: string;
  columnistRole?: string;
  columnistRoleEn?: string;
  columnistAvatar?: string;
  date: string;
  time: string;
  genre: string;
  genreEn: string;
  sector: string;
  sectorEn: string;
  countryName: string;
  countryNameEn: string;
  countryCode: string;
  viewsCount: number;
  factScore: number;
  readTimeMinutes: number;
  content: string[];
}

export const EDITORIAL_LEAD_STORIES: EditorialStory[] = [
  // 1. تقرير المحروقات وغرب أفريقيا (مع فيديو تحليلي)
  {
    id: 'edit-lead-001',
    slug: 'dangote-mega-refinery-pan-african-revolution',
    title: 'مصفاة دانغوتي تعيد رسم خارطة تجارة المحروقات في غرب أفريقيا بتدفقات قياسية نحو 6 دول إقليمية',
    titleEn: 'Dangote Mega Refinery Reshapes West Africa Fuel Trade with Record Regional Distribution',
    summary: 'تجسد مصفاة دانغوتي النيجيرية تحولاً هيكلياً استراتيجياً لأسواق الطاقة في غرب أفريقيا؛ إذ توفر طاقتها التكريرية البالغة 650 ألف برميل يومياً نحو 12 مليار دولار سنوياً من فاتورة الاستيراد الخارجية، مع بدء تصدير المشتقات إلى ست دول إقليمية، ما يعزز استقرار العملة الوطنية ويحقق الاكتفاء الذاتي والتكامل الصناعي لدول القارة.',
    summaryEn: 'The Dangote Mega Refinery represents a strategic structural transformation for West African energy markets; its 650,000 bpd capacity saves $12 billion annually in foreign import bills while initiating exports to six regional nations, bolstering sovereign currency stability and achieving comprehensive industrial self-sufficiency for the African continent.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    hasVideo: true,
    date: '2026-09-25',
    time: '09:15',
    genre: 'تحقيق استقصائي مرئي',
    genreEn: 'Visual Investigative Report',
    sector: 'أسواق الطاقة والتكرير',
    sectorEn: 'Energy & Downstream Markets',
    countryName: 'نيجيريا',
    countryNameEn: 'Nigeria',
    countryCode: 'NG',
    columnistName: 'فريق التحقيقات الاستقصائية المشتركة',
    columnistNameEn: 'Joint Investigative Desk',
    columnistRole: 'هيئة التحقيقات الاستقصائية لغرب أفريقيا',
    columnistRoleEn: 'West Africa Investigative Reporting Desk',
    viewsCount: 34120,
    factScore: 97,
    readTimeMinutes: 4,
    content: [
      'بدأت مصفاة دانغوتي مرحلة التوزيع الإقليمي للديزل والبنزين عالي النقاوة عبر موانئ غرب إفريقيا.',
      'توفر المنظومة اللوجستية الجديدة ما يصل إلى 15% من نفقات الشحن والتأمين البحري مقارنة بالتوريد الأوروبي التقليدي.',
      'صرح محافظ البنك المركزي النيجيري بأن كبح استيراد الوقود يمثل نقطة التحول الكبرى لتعافي احتياطيات النقد الأجنبي.'
    ]
  },
  // 2. تقرير الهيدروجين والممر المصري
  {
    id: 'edit-lead-002',
    slug: 'egypt-sczone-green-hydrogen-refueling-nexus',
    title: 'مصر تستقطب 18 مليار دولار في مشاريع الهيدروجين الأخضر بمحور قناة السويس لتزويد الأساطيل العالمية',
    titleEn: 'Egypt Secures $18B Green Hydrogen Nexus at Suez Canal Economic Zone for Maritime Fleets',
    summary: 'تجسد مشاريع الهيدروجين الأخضر بمحور قناة السويس تحولاً طاقوياً استراتيجياً واعداً للاقتصاد القاري؛ إذ تستقطب الاتفاقيات الملزمة 18 مليار دولار لتزويد الأساطيل الدولية بالوقود النظيف وتصدير الأمونيا الخضراء للأسواق الأوروبية بحلول 2028، بالاعتماد على محطات شمسية وريحية بقدرة 10 غيغاوات، ما يرسخ مكانة أفريقيا كمركز رائد للطاقة المتجددة والصناعات المستدامة.',
    summaryEn: 'Suez Canal Economic Zone green hydrogen projects represent a promising strategic energy transition for the continental economy; binding agreements secure $18 billion to supply global maritime fleets with clean fuel and export green ammonia to European markets by 2028, establishing Africa as a foremost hub for renewable energy industries.',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    date: '2026-09-24',
    time: '17:40',
    genre: 'تحليل استراتيجي معمق',
    genreEn: 'Strategic In-Depth Analysis',
    sector: 'الاقتصاد الأخضر والطاقة النظيفة',
    sectorEn: 'Green Economy & Clean Energy',
    countryName: 'مصر',
    countryNameEn: 'Egypt',
    countryCode: 'EG',
    columnistName: 'سلمى رضوان',
    columnistNameEn: 'Salma Radwan',
    columnistRole: 'محررة الاستثمار والشؤون البيئية',
    viewsCount: 22890,
    factScore: 96,
    readTimeMinutes: 4,
    content: [
      'وقعت الهيئة الاقتصادية لقناة السويس حزمة استثمارية ضخمة بمشاركة كبرى اتحادات الطاقة الدولية.',
      'تمنح الميزة الجغرافية مصر أدنى تكلفة لإنتاج الهيدروجين الأخضر عالمياً بمعدل 2.4 دولار للكيلوغرام.',
      'تتضمن المشروعات عقود شراء طويلة الأجل تضمن تدفقات دولارية مستقرة للموازنة المصرية.'
    ]
  },
  // 3. تحقيق ممر لوبيتو وسكك حديد بنغيلا
  {
    id: 'edit-lead-003',
    slug: 'lobito-critical-minerals-rail-corridor',
    title: 'ممر لوبيتو وسكك حديد بنغيلا: كيف يخطف الأطلسي معادن بطاريات الكونغو وزامبيا من موانئ الشرق؟',
    titleEn: 'The Lobito Corridor: How the Atlantic Secures DRC & Zambia Battery Minerals',
    summary: 'يجسد ممر لوبيتو وسكك حديد بنغيلا في أنغولا تحولاً لوجستياً استراتيجياً لنقل الثروات التعدينية الأفريقية؛ إذ يضخ التحالف الدولي 3.5 مليار دولار لتحديث الخط الحديدي، ما يختصر زمن نقل النحاس والكوبالت إلى المحيط الأطلسي بنحو 20 يوماً، مع تقليص تكاليف الشحن وتأمين سلاسل الإمداد للبطاريات وحماية القيمة المضافة للتعدين القاري.',
    summaryEn: 'The Lobito Corridor and Benguela Railway represent a strategic logistics transformation for African mineral wealth; international consortia inject $3.5 billion to modernize the rail line, reducing transit time for copper and cobalt to the Atlantic by 20 days while securing battery supply chains and continental value addition.',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    hasVideo: true,
    date: '2026-09-24',
    time: '11:00',
    genre: 'تحقيق لوجستي وجيوسياسي',
    genreEn: 'Geopolitical Logistics Report',
    sector: 'التعدين وسلاسل الإمداد العالمية',
    sectorEn: 'Mining & Global Supply Chains',
    countryName: 'أنغولا',
    countryNameEn: 'Angola',
    countryCode: 'AO',
    columnistName: 'جواو فيليبي',
    columnistNameEn: 'João Filipe',
    columnistRole: 'مراسل البنية التحتية والسكك الحديدية',
    viewsCount: 17840,
    factScore: 97,
    readTimeMinutes: 4,
    content: [
      'يمثل ممر لوبيتو الشريان الاستراتيجي الأبرز لنقل معادن التحول الطاقوي العالمي.',
      'تتوقع أنغولا عوائد رسوم عبور وتفريغ تفوق 900 مليون دولار سنوياً.',
      'يمنح المشروع البديل الأسرع والأكثر أماناً لمناجم النحاس في وسط القارة.'
    ]
  },
  // 4. الشريحة الرابعة: افتتاحية اليوم (Today's Editorial with Dr. Tarek Al-Mansouri)
  {
    id: 'edit-lead-004',
    slug: 'editorial-african-monetary-sovereignty',
    title: 'افتتاحية اليوم: معركة السيادة النقدية الإفريقية.. لماذا حان الوقت لإنهاء هيمنة العملات الوسيطة في تجارة الـ 54 دولة؟',
    titleEn: 'Today\'s Editorial: African Monetary Sovereignty.. Ending Intermediary Currency Dominance in Continental Trade',
    summary: 'تجسد معركة السيادة النقدية الأفريقية القضية المركزية لمستقبل التنمية المستدامة في القارة؛ إذ يدفع المصنعون والمصرفيون نحو 5 مليارات دولار سنوياً كرسوم وساطة خارجية لتسوية التجارة البينية، ما يفرض تسريع تفعيل منصة المقاصة القارية والتعامل بالعملات الوطنية وتثبيت الاحتياطيات بالمعادن والذهب، لإنهاء التبعية المالية الخارجية وبناء استقلال نقدي أفريقي متين.',
    summaryEn: 'African monetary sovereignty represents the central imperative for sustainable continental development; domestic producers and bankers pay $5 billion annually in foreign intermediation fees for intra-African trade settlements, necessitating the rapid rollout of PAPSS, local currency clearing, and gold reserves to build resilient African financial independence.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    isColumn: true,
    columnistName: 'د. طارق المنصوري',
    columnistNameEn: 'Dr. Tarek Al-Mansouri',
    columnistRole: 'رئيس التحرير التنفيذي وكبير الاقتصاديين',
    columnistRoleEn: 'Executive Editor-in-Chief & Chief Economist',
    columnistAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    date: '2026-09-25',
    time: '08:30',
    genre: 'افتتاحية اليوم',
    genreEn: 'Today\'s Editorial',
    sector: 'السيادة النقدية والاقتصاد الكلي',
    sectorEn: 'Monetary Sovereignty & Macroeconomics',
    countryName: 'عموم أفريقيا',
    countryNameEn: 'Pan-Africa',
    countryCode: 'PAN',
    viewsCount: 28450,
    factScore: 99,
    readTimeMinutes: 5,
    content: [
      'على مدى عقود طويلة، ظلت التجارة الإفريقية البينية أسيرة منظومة تسوية نقدية تعود لحقبة ما بعد الاستعمار.',
      'تظهر حسابات بنك التصدير والاستيراد الإفريقي أن تسوية تجارة المنسوجات والأغذية بين أبيدجان وأكرا، أو بين الجزائر وداكار، تمر عبر بنوك مراسلة في باريس أو نيويورك، ما يفرض تكاليف شحن وتحويل مضاعفة تؤدي إلى تآكل هوامش أرباح المصنعين الأفارقة.',
      'إن الحل موجود اليوم بين أيدينا: اعتماد نظام المدفوعات الإفريقي الموحد بالعملات المحلية، ورفع الاحتياطيات السيادية بالذهب والمعادن الإفريقية لحماية استقلالية القرار الاقتصادي.'
    ]
  },
  // 5. ممر الغاز الجزائري الأوروبي
  {
    id: 'edit-lead-005',
    slug: 'algeria-south2-hydrogen-energy-bridge',
    title: 'الجزائر تطلق ممر "ساوث هيدج" لتصدير الهيدروجين النظيف واستقرار أمن الطاقة في جنوب أوروبا',
    titleEn: 'Algeria Launches "SoutH2" Clean Hydrogen Mega-Corridor to Southern Europe',
    summary: 'يجسد ممر ساوث هيدج الجزائري تحولاً استراتيجياً لأسواق الطاقة الإقليمية والربط القاري؛ إذ يتيح التحالف مع شبكات الغاز الإيطالية والألمانية تصدير 4 ملايين طن من الهيدروجين الأخضر سنوياً بحلول 2030، موظفاً القدرات الشمسية الهائلة بالصحراء، لضمان استقرار إمدادات أوروبا الصناعية وتحقيق عوائد نقدية مستدامة تعزز التنمية الاقتصادية الشاملة للجمهورية الجزائرية.',
    summaryEn: 'Algeria\'s SoutH2 corridor represents a strategic milestone for regional energy integration and continental connectivity; partnerships with Italian and German pipeline networks enable exporting 4 million tons of green hydrogen annually by 2030, leveraging Saharan solar capacities to stabilize European industrial supplies and secure sustainable sovereign revenues.',
    imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
    date: '2026-09-23',
    time: '16:45',
    genre: 'التحقيق الصحفي الاستراتيجي',
    genreEn: 'Strategic Investigative Report',
    sector: 'أسواق الطاقة والغاز الطبيعي',
    sectorEn: 'Energy & Natural Gas Markets',
    countryName: 'الجزائر',
    countryNameEn: 'Algeria',
    countryCode: 'DZ',
    columnistName: 'جمال بلقاسم',
    columnistNameEn: 'Djamel Belkacem',
    columnistRole: 'محلل شؤون النفط وشبكات الغاز الإقليمية',
    viewsCount: 23150,
    factScore: 98,
    readTimeMinutes: 4,
    content: [
      'تعتمد الجزائر على بنيتها التحتية الهائلة القائمة لتقليل تكلفة الاستثمار في أنابيب الهيدروجين.',
      'أكد الاتحاد الأوروبي أن الجزائر تمثل الركيزة الأكثر استقراراً وموثوقية في تزويد جنوب المتوسط بالطاقة.',
      'يتزامن المشروع مع توسيع إنتاج الغاز الطبيعي المسال لتعزيز الصادرات الفورية.'
    ]
  },
  // 6. تحالف الكاكاو الإيفواري الغاني
  {
    id: 'edit-lead-006',
    slug: 'ivory-coast-ghana-cocoa-industrial-cartel',
    title: 'كوت ديفوار وغانا: ثورة التصنيع المحلي للكاكاو تنهي قرناً كاملاً من تصدير الحبوب الخام',
    titleEn: 'Ivory Coast & Ghana: Domestic Processing Revolution Overturns Raw Bean Export Models',
    summary: 'يجسد تحالف كوت ديفوار وغانا لإنتاج الكاكاو تحولاً صناعياً استراتيجياً لإنهاء قرن من تصدير المحاصيل الخام؛ إذ ترتفع نسبة الطحن المحلي إلى 65% وتدشين مجمعات كبرى لزبدة الشوكولاتة، ما يوفر مليارات الدولارات سنوياً للاقتصاد الإقليمي، ويضمن حماية علاوة الدخل المعيشي للمزارعين وتثبيت أسعار عادلة تضمن العدالة الاجتماعية والتنمية الريفية المنشودة.',
    summaryEn: 'The Ivory Coast and Ghana cocoa alliance represents a strategic industrial shift terminating a century of raw bean exports; domestic processing rises to 65% with major chocolate liquor facilities, retaining billions within regional economies while defending farmer living income differentials and anchoring fair, sustainable rural prosperity.',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    date: '2026-09-23',
    time: '13:10',
    genre: 'صحافة البيانات والسلع',
    genreEn: 'Commodities Data Journalism',
    sector: 'الزراعة والصناعات التحويلية',
    sectorEn: 'Agribusiness & Processing',
    countryName: 'كوت ديفوار',
    countryNameEn: 'Ivory Coast',
    countryCode: 'CI',
    columnistName: 'ماري تريز ياو',
    columnistNameEn: 'Marie-Thérèse Yao',
    columnistRole: 'كبير محرري السلع الزراعية وسلاسل القيمة',
    viewsCount: 16720,
    factScore: 99,
    readTimeMinutes: 3,
    content: [
      'تضاعفت عوائد تصدير الشوكولاتة المصنعة محلياً 3 مرات مقارنة ببيع المحصول الخام غير المعالج.',
      'وفر تطبيق علاوة الدخل المعيشي (400 دولار للطن) حماية مالية لملايين العائلات الريفية.',
      'تستعد كوت ديفوار وغانا لإطلاق بورصة سلع رقمية مشتركة لتحديد أسعار العقود الآجلة.'
    ]
  },
  // 7. ابتكار كيجالي المالي وصناديق التكنولوجيا
  {
    id: 'edit-lead-007',
    slug: 'kigali-international-financial-centre-venture-debt',
    title: 'مركز كيجالي المالي الدولي (KIFC) يطلق صندوق ديون مخاطرة بـ 250 مليون دولار للشركات الناشئة',
    titleEn: 'Kigali International Financial Centre Unveils $250M Pan-African Venture Debt Facility',
    summary: 'يجسد إطلاق صندوق ديون المخاطرة بمركز كيجالي المالي الدولي تحولاً استثمارياً استراتيجياً لبيئة ريادة الأعمال التكنولوجية الأفريقية؛ إذ يوفر الصندوق 250 مليون دولار كتمويلات نمو غير مخففة لحصص المؤسسين بالشراكة مع مؤسسة التمويل الدولية، ما يسد فجوات السيولة لشركات الابتكار في 14 دولة، ويرسخ رواندا كمنصة مالية رائدة ومحور تنافسي.',
    summaryEn: 'The launch of Kigali International Financial Centre\'s venture debt facility represents a strategic investment leap for African tech entrepreneurship; providing $250 million in non-dilutive founder growth capital with the IFC, the fund bridges late-stage liquidity gaps across 14 nations, establishing Rwanda as a competitive continental hub.',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    date: '2026-09-22',
    time: '11:30',
    genre: 'التقرير الإخباري المالي',
    genreEn: 'Financial News Report',
    sector: 'التكنولوجيا المالية والتمويل الجريء',
    sectorEn: 'FinTech & Venture Capital',
    countryName: 'رواندا',
    countryNameEn: 'Rwanda',
    countryCode: 'RW',
    columnistName: 'مارتن لوران',
    columnistNameEn: 'Martin Laurent',
    columnistRole: 'كبير مراسلي شرق ووسط أفريقيا',
    viewsCount: 18450,
    factScore: 98,
    readTimeMinutes: 3,
    content: [
      'يستهدف الصندوق الشركات التكنولوجية سريعة النمو في مجالات الخدمات اللوجستية والزراعة الرقمية.',
      'تعتمد كيجالي على بيئة قضائية مستقلة متوافقة مع القانون العام ومزايا ضريبية تنافسية.',
      'يواصل المركز المالي لرواندا تقدمه السريع في مؤشر المراكز المالية العالمية GFCI.'
    ]
  },
  // 8. الشريحة الثامنة: مقال رأي (رأي خبير - Dr. Thando Nkosi)
  {
    id: 'edit-lead-008',
    slug: 'column-jse-nairobi-integrated-capital-markets',
    title: 'رأي خبير: تكامل بورصات جوهانسبرغ ونيروبي والقاهرة.. بناء سوق أسهم إفريقية موحدة بتريليون دولار',
    titleEn: 'Expert Opinion: Integrating JSE, Nairobi & EGX.. Building a Unified $1T Pan-African Equity Market',
    summary: 'يجسد تكامل البورصات الأفريقية الكبرى ضرورة استراتيجية ملحة لإنهاء تشتت رؤوس الأموال وضعف السيولة بالأسواق؛ إذ يوفر الربط التداولي المشترك بين أسواق جوهانسبرغ ونيروبي والقاهرة سوقاً مالية موحدة تفوق قيمتها تريليون دولار، ما يتيح تمويلاً عميقاً للشركات الناشئة والمشاريع الصناعية، ويجذب الاستثمارات المؤسسية العالمية لدعم السيادة المالية والنمو القاري المستدام.',
    summaryEn: 'Integrating major African stock exchanges represents an urgent strategic necessity to terminate capital fragmentation and illiquidity; unified cross-trading among Johannesburg, Nairobi, and Cairo creates a single $1 trillion capital market, unlocking deep financing for startups and major industrial projects to advance continental financial sovereignty and sustainable growth.',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    isColumn: true,
    columnistName: 'د. ثاندو نكوسي',
    columnistNameEn: 'Dr. Thando Nkosi',
    columnistRole: 'كبير خبراء استراتيجيات أسواق المال ورأس المال القاري - جوهانسبرغ',
    columnistRoleEn: 'Chief Capital Markets Strategist & Continental Financial Fellow - JSE',
    columnistAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    date: '2026-09-24',
    time: '14:20',
    genre: 'رأي خبير',
    genreEn: 'Expert Opinion',
    sector: 'الأسواق المالية وبورصات الأوراق',
    sectorEn: 'Capital Markets & Exchanges',
    countryName: 'جنوب أفريقيا',
    countryNameEn: 'South Africa',
    countryCode: 'ZA',
    viewsCount: 19630,
    factScore: 98,
    readTimeMinutes: 4,
    content: [
      'سجلت بورصة جوهانسبرغ طلباً غير مسبوق من شركات الدفع الرقمي الإفريقية الراغبة في جمع التمويل.',
      'تتيح النافذة المزدوجة بالراند والدولار مرونة تشغيلية واستثمارية لم تشهدها القارة من قبل.',
      'الربط التداولي مع كينيا ونيجيريا سيبني أعمق بركة سيولة قارية للشركات الناشئة.'
    ]
  }
];

interface EditorialLeadCarouselProps {
  onSelectArticle: (article: Article) => void;
  lang: 'ar' | 'en';
}

export const EditorialLeadCarousel: React.FC<EditorialLeadCarouselProps> = ({
  onSelectArticle,
  lang
}) => {
  const isAr = lang === 'ar';
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const scrollToIndex = (idx: number) => {
    if (!scrollRef.current) return;
    const clamped = Math.max(0, Math.min(idx, EDITORIAL_LEAD_STORIES.length - 1));
    const container = scrollRef.current;
    const cardWidth = container.clientWidth;
    container.scrollTo({
      left: clamped * cardWidth * (isAr ? -1 : 1),
      behavior: 'smooth'
    });
    setCurrentIndex(clamped);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cardWidth = container.clientWidth;
    if (cardWidth > 0) {
      const scrollPos = Math.abs(container.scrollLeft);
      const newIndex = Math.round(scrollPos / cardWidth);
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < EDITORIAL_LEAD_STORIES.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  // Convert EditorialStory to Article interface for navigation
  const handleStoryClick = (story: EditorialStory) => {
    const art: Article = {
      id: story.id,
      slug: story.slug,
      title: story.title,
      titleEn: story.titleEn,
      summary: story.summary,
      summaryEn: story.summaryEn,
      content: story.content,
      contentEn: story.content,
      category: 'Macroeconomics',
      countryCode: story.countryCode,
      countryName: story.countryName,
      countryNameEn: story.countryNameEn,
      status: 'published',
      authorType: story.isColumn ? 'HUMAN_JOURNALIST' : 'HYBRID',
      authorName: story.columnistName,
      authorNameEn: story.columnistNameEn,
      authorRole: story.columnistRole,
      readersCount: story.viewsCount,
      imageUrl: story.imageUrl,
      journalisticType: story.genre,
      sector: story.sector,
      citations: [
        {
          id: `cit-${story.id}`,
          sourceName: 'L’Africonomist Editorial Intelligence Bureau',
          url: 'https://africonomist.com/editorial',
          publishDate: story.date,
          verified: true,
          credibilityScore: story.factScore,
          snippet: story.summary
        }
      ],
      factCheck: {
        score: story.factScore,
        verifiedClaimsCount: 12,
        totalClaimsCount: 12,
        biasRating: 'Neutral',
        riskScore: 'Low',
        checkedAt: story.date
      },
      publishedAt: `${story.date} ${story.time}`,
      createdAt: `${story.date} ${story.time}`,
      readTimeMinutes: story.readTimeMinutes,
      featured: true,
      marketImpact: 'positive'
    };
    onSelectArticle(art);
  };

  return (
    <div className="flex flex-col">
      {/* Top Header of Editorial Desk: Headline + Controls */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Feather className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">
                {isAr ? 'الافتتاحيات والتقارير الرئيسية للصحيفة' : 'Editorials & Lead Investigations'}
              </h2>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                8 {isAr ? 'مقالات وسلايدات' : 'Slides'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {isAr ? 'افتتاحيات رؤساء التحرير والتحقيقات الكبرى الخاصة بـ «لافريكونوميست»' : 'Official editorial desk columns & major continental front-page specials'}
            </p>
          </div>
        </div>

        {/* Carousel Slider Controls (Arrows + Counter) */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            <span className="text-amber-400 font-bold">{currentIndex + 1}</span> / {EDITORIAL_LEAD_STORIES.length}
          </span>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => scrollToIndex(currentIndex - 1)}
              disabled={currentIndex === 0}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                currentIndex === 0 
                  ? 'text-slate-600 cursor-not-allowed' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800 active:scale-90'
              }`}
              title={isAr ? 'المقال السابق' : 'Previous story'}
              aria-label="Previous story"
            >
              {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            <button
              onClick={() => scrollToIndex(currentIndex + 1)}
              disabled={currentIndex === EDITORIAL_LEAD_STORIES.length - 1}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                currentIndex === EDITORIAL_LEAD_STORIES.length - 1
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800 active:scale-90'
              }`}
              title={isAr ? 'المقال التالي' : 'Next story'}
              aria-label="Next story"
            >
              {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel Track (سلايدات متناسقة الارتفاع تماماً دون أي تفاوت) */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex items-stretch gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pb-0"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {EDITORIAL_LEAD_STORIES.map((story, idx) => {
          const flag = getCountryFlag(story.countryCode);
          return (
            <div
              key={story.id}
              onClick={() => handleStoryClick(story)}
              className="w-full min-w-full sm:min-w-[540px] md:min-w-[620px] lg:min-w-[680px] snap-center rounded-2xl overflow-hidden border border-slate-800/90 hover:border-amber-500/50 bg-gradient-to-b from-[#0f172a] via-[#0b1120] to-[#070b14] transition-all duration-300 shadow-xl group cursor-pointer flex flex-col justify-between h-full"
            >
              <div className="flex flex-col flex-1">
                {/* 1. صورة أو فيديو في الأعلى يأخذ كامل عرض البطاقة */}
                <div className="w-full h-56 sm:h-72 relative overflow-hidden bg-slate-950 shrink-0">
                  <img
                    src={story.imageUrl}
                    alt={isAr ? story.title : story.titleEn}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                  />

                  {/* شارة الفيديو إن وجد */}
                  {story.hasVideo && (
                    <div className="absolute top-3 right-3 rtl:right-3 ltr:left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-600/90 text-white text-xs font-bold shadow-lg backdrop-blur-md">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isAr ? 'تقرير مرئي مصور' : 'Video Report'}</span>
                    </div>
                  )}

                  {/* شارة الافتتاحية / العمود إن وجد */}
                  {story.isColumn && (
                    <div className="absolute top-3 right-3 rtl:right-3 ltr:left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 text-slate-950 text-xs font-black shadow-lg">
                      <Award className="w-3.5 h-3.5" />
                      <span>{isAr ? (story.genre === 'افتتاحية اليوم' ? 'افتتاحية اليوم' : 'رأي خبير | عمود تحليلي') : story.genreEn}</span>
                    </div>
                  )}

                  {/* 2. فوق الصورة والفيديو في الأسفل: معلومات وصفية (التاريخ والتوقيت والنوع والقطاع) */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0b1120] via-[#0b1120]/80 to-transparent p-4 sm:p-5 pt-12 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                      {/* علم والدولة */}
                      <span className="text-base leading-none">{flag}</span>
                      <span className="text-white font-bold">
                        {isAr ? story.countryName : story.countryNameEn}
                      </span>
                      <span aria-hidden="true" className="text-slate-500">·</span>

                      {/* نوع المقال */}
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                        {isAr ? story.genre : story.genreEn}
                      </span>
                      <span aria-hidden="true" className="text-slate-500">·</span>

                      {/* القطاع */}
                      <span className="text-slate-300 text-[11px]">
                        {isAr ? story.sector : story.sectorEn}
                      </span>
                    </div>

                    {/* تاريخ وتوقيت المقال بدقة */}
                    <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-amber-400 bg-slate-950/70 px-2.5 py-1 rounded-md border border-slate-700/60 backdrop-blur-sm">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{story.date} · {story.time}</span>
                    </div>
                  </div>
                </div>

                {/* 3. تحت الصورة أو الفيديو: الكاتب/المكتب التحريري، العنوان، ثم الملخص الموحد */}
                <div className="p-5 sm:p-6 pb-4 sm:pb-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* إن كانت افتتاحية أو عمود: تظهر صورة صاحب الافتتاحية مع اسمه ولقبه، وفي المقالات الأخرى يظهر مكتب التحرير المتخصص */}
                    {story.isColumn && story.columnistAvatar ? (
                      <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-slate-900/80 border border-amber-500/40">
                        <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-amber-500 shadow-md">
                          <img
                            src={story.columnistAvatar}
                            alt={story.columnistName || 'Columnist'}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black text-amber-400">
                              {story.genre === 'افتتاحية اليوم'
                                ? (isAr ? 'صاحب الافتتاحية:' : 'Editorial Columnist:')
                                : (isAr ? 'الخبير الاقتصادي:' : 'Expert Columnist:')}
                            </span>
                            <span className="text-xs font-bold text-white truncate">
                              {isAr ? story.columnistName : story.columnistNameEn}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-serif truncate">
                            {isAr ? story.columnistRole : story.columnistRoleEn}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
                        <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 bg-slate-800 border border-slate-700/80 flex items-center justify-center text-amber-400 shadow-inner">
                          <Feather className="w-5 h-5 text-amber-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-amber-400/90">
                              {isAr ? 'مكتب التحقيقات الاقتصادية:' : 'Editorial Desk Analysis:'}
                            </span>
                            <span className="text-xs font-bold text-white truncate">
                              {isAr ? story.columnistName : story.columnistNameEn}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-serif truncate">
                            {isAr ? (story.columnistRole || 'هيئة التحرير والتقارير الاستقصائية') : (story.columnistRoleEn || 'Editorial Desk & Field Investigations')}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* العنوان المتناسق */}
                    <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-300 transition-colors leading-snug line-clamp-2 min-h-[3.25rem] sm:min-h-[3.75rem] flex items-center">
                      {isAr ? story.title : story.titleEn}
                    </h3>

                    {/* الملخص الموحد 50 كلمة */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      {isAr ? story.summary : story.summaryEn}
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. أسفل البطاقة: كاتب المقال والمشاهدات ومؤشر الدقة */}
              <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-t border-slate-800/80 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
                {/* كاتب المقال */}
                <div className="flex items-center gap-2 text-slate-300 truncate">
                  <span className="text-[11px] text-slate-400">{isAr ? 'بقلم:' : 'By:'}</span>
                  <span className="font-bold text-slate-200 truncate">
                    {isAr ? story.columnistName : story.columnistNameEn}
                  </span>
                </div>

                {/* المشاهدات مع الأيقونة والعدد + نسبة الدقة */}
                <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
                  {/* المشاهدات */}
                  <div className="flex items-center gap-1.5 text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-bold">{story.viewsCount.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 font-sans">{isAr ? 'مشاهدة' : 'views'}</span>
                  </div>

                  {/* مؤشر الدقة */}
                  <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{story.factScore}%</span>
                  </div>

                  {/* زر القراءة */}
                  <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-sans font-bold">
                    <span>{isAr ? 'قراءة التحليل' : 'Read Full'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide Indicators Pills (1 to 8) مباشرة تحت صندوق كاتب المقال وعدد المشاهدات دون أي فراغ */}
      <div className="flex items-center justify-center gap-1.5 pt-2 pb-0">
        {EDITORIAL_LEAD_STORIES.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              currentIndex === i
                ? 'w-7 bg-amber-500 shadow-sm shadow-amber-500/50'
                : 'w-2 bg-slate-800 hover:bg-slate-700'
            }`}
            aria-label={`Go to slide ${i + 1}`}
            title={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
