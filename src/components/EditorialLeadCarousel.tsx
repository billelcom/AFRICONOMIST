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
  // 1. الافتتاحية الكبرى لرئيس التحرير (Editorial Column with Columnist Portrait)
  {
    id: 'edit-lead-001',
    slug: 'editorial-african-monetary-sovereignty',
    title: 'افتتاحية العدد: معركة السيادة النقدية الإفريقية.. لماذا حان الوقت لإنهاء هيمنة العملات الوسيطة في تجارة الـ 54 دولة؟',
    titleEn: 'Editorial: The African Monetary Sovereignty Frontier.. Terminating Intermediary Currencies in Continental Trade',
    summary: 'في هذه الافتتاحية الاستراتيجية، نضع الإصبع على المعضلة الهيكلية الكبرى التي تستنزف اقتصادات القارة: يدفع المنتجون والمصرفيون الأفارقة أكثر من 5 مليارات دولار سنوياً كرسوم وساطة وتحويل لمصارف خارجية لتسوية صفقات بين دول متجاورة. إن التفعيل الكامل لمنظومة PAPSS وربط البورصات الوطنية ليس ترفاً مالياً، بل شرط وجودي لتحقيق التكامل الصناعي وحماية العملات المحلية من الصدمات التضخمية الخارجية.',
    summaryEn: 'In this strategic editorial, we address the foremost structural drain on African capital: over $5 billion paid annually in third-party FX routing fees. Full PAPSS activation and regional exchange integration are non-negotiable keystones of continental economic sovereignty.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    isColumn: true,
    columnistName: 'د. طارق المنصوري',
    columnistNameEn: 'Dr. Tarek Al-Mansouri',
    columnistRole: 'رئيس التحرير التنفيذي وكبير الاقتصاديين',
    columnistRoleEn: 'Executive Editor-in-Chief & Chief Economist',
    columnistAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    date: '2026-09-25',
    time: '08:30',
    genre: 'افتتاحية رئيس التحرير',
    genreEn: 'Editor-in-Chief Column',
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
  // 2. تقرير المحروقات وغرب أفريقيا (مع فيديو تحليلي)
  {
    id: 'edit-lead-002',
    slug: 'dangote-mega-refinery-pan-african-revolution',
    title: 'مصفاة دانغوتي تعيد رسم خارطة تجارة المحروقات في غرب أفريقيا بتدفقات قياسية نحو 6 دول إقليمية',
    titleEn: 'Dangote Mega Refinery Reshapes West Africa Fuel Trade with Record Distribution Flows',
    summary: 'مع بلوغ الطاقة التكريرية 650 ألف برميل يومياً، تبدأ نيجيريا رسمياً تصدير المشتقات إلى غانا والسنغال وكوت ديفوار وتوغو وبنين، موفرة أكثر من 12 مليار دولار سنوياً من فاتورة الاستيراد الخارجية وعاكسة عقوداً من التبعية النفطية لمصافي روتردام وسويسرا.',
    summaryEn: 'With 650,000 bpd capacity online, the Lagos refinery initiates pipeline and tanker flows across ECOWAS, reversing decades of refined fuel dependency.',
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
    viewsCount: 34120,
    factScore: 97,
    readTimeMinutes: 4,
    content: [
      'بدأت مصفاة دانغوتي مرحلة التوزيع الإقليمي للديزل والبنزين عالي النقاوة عبر موانئ غرب إفريقيا.',
      'توفر المنظومة اللوجستية الجديدة ما يصل إلى 15% من نفقات الشحن والتأمين البحري مقارنة بالتوريد الأوروبي التقليدي.',
      'صرح محافظ البنك المركزي النيجيري بأن كبح استيراد الوقود يمثل نقطة التحول الكبرى لتعافي احتياطيات النقد الأجنبي.'
    ]
  },
  // 3. تقرير الهيدروجين والممر المصري
  {
    id: 'edit-lead-003',
    slug: 'egypt-sczone-green-hydrogen-refueling-nexus',
    title: 'مصر تستقطب 18 مليار دولار في مشاريع الهيدروجين الأخضر بمحور قناة السويس لتزويد الأساطيل العالمية',
    titleEn: 'Egypt Secures $18B in Green Hydrogen Commitments at Suez Canal Economic Zone',
    summary: 'توقيع اتفاقيات ملزمة مع تحالفات أوروبية وآسيوية لتزويد الأساطيل البحرية المارة عبر قناة السويس بالوقود الأخضر النظيف وتصدير الأمونيا الخضراء إلى الاتحاد الأوروبي بحلول عام 2028، مدعومة بمجمعات شمسية ورياح في خليج السويس وأسوان تتجاوز قدرتها 10 غيغاوات.',
    summaryEn: 'Binding framework agreements position SCZone as the primary zero-emission maritime refueling nexus on global sea trade routes.',
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
  // 4. عمود مالي متخصص: أسواق المال والبورصات (Columnist Card)
  {
    id: 'edit-lead-004',
    slug: 'column-jse-nairobi-integrated-capital-markets',
    title: 'عمود رأي: بورصة جوهانسبرغ ونيروبي والقاهرة.. لماذا نحتاج إلى سوق أسهم إفريقية موحدة بتريليون دولار؟',
    titleEn: 'Column: JSE, Nairobi and EGX.. Why Africa Needs a Unified $1T Pan-African Equity Market',
    summary: 'إن التجزئة القائمة في أسواق المال الإفريقية تحرم شركات التكنولوجيا والشركات الصناعية الواعدة من سيولة عميقة. إن الإدراج المزدوج وتوحيد منصات المقاصة الرقمية بين كبرى بورصات القارة كفيل بخلق قوة مالية تضاهي أسواق المال الناشئة في آسيا وتوفر تمويلاً حقيقياً للمشاريع الإفريقية.',
    summaryEn: 'Fragmentation across African capital markets restricts growth-stage ventures. Harmonizing listing frameworks and clearing pipes will unlock institutional dry powder.',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    isColumn: true,
    columnistName: 'ثاندو نكوسي',
    columnistNameEn: 'Thando Nkosi',
    columnistRole: 'كبير خبراء أسواق الأسهم ورأس المال - جوهانسبرغ',
    columnistRoleEn: 'Chief Capital Markets Strategist - JSE',
    columnistAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    date: '2026-09-24',
    time: '14:20',
    genre: 'عمود رأي اقتصادي',
    genreEn: 'Markets Opinion Column',
    sector: 'الأسواق المالية وبورصات الأوراق',
    sectorEn: 'Capital Markets & Exchanges',
    countryName: 'جنوب أفريقيا',
    countryNameEn: 'South Africa',
    countryCode: 'ZA',
    viewsCount: 19630,
    factScore: 98,
    readTimeMinutes: 3,
    content: [
      'سجلت بورصة جوهانسبرغ طلباً غير مسبوق من شركات الدفع الرقمي الإفريقية الراغبة في جمع التمويل.',
      'تتيح النافذة المزدوجة بالراند والدولار مرونة تشغيلية واستثمارية لم تشهدها القارة من قبل.',
      'الربط التداولي مع كينيا ونيجيريا سيبني أعمق بركة سيولة قارية للشركات الناشئة.'
    ]
  },
  // 5. تحقيق ممر لوبيتو وسكك حديد بنغيلا
  {
    id: 'edit-lead-005',
    slug: 'lobito-critical-minerals-rail-corridor',
    title: 'ممر لوبيتو وسكك حديد بنغيلا: كيف يخطف الأطلسي معادن بطاريات الكونغو وزامبيا من موانئ الشرق؟',
    titleEn: 'The Lobito Corridor: How the Atlantic is Securing DRC and Zambia Battery Minerals',
    summary: 'تحالف استثماري دولي يقوده صندوق أنغولا السيادي وبنك التنمية الإفريقي يضخ 3.5 مليار دولار لتحديث وتوسعة خط سكك حديد بنغيلا، ما يختصر مدة نقل النحاس والكوبالت الاستراتيجي نحو الأسواق الأطلسية بنحو 20 يوماً ويغير قواعد اللعبة الجيوسياسية للطاقة النظيفة.',
    summaryEn: 'International development finance accelerates Lobito rail corridor, shaving 20 days off battery metal transits to Atlantic manufacturing hubs.',
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
  // 6. ممر الغاز الجزائري الأوروبي
  {
    id: 'edit-lead-006',
    slug: 'algeria-south2-hydrogen-energy-bridge',
    title: 'الجزائر تطلق ممر "ساوث هيدج" لتصدير الهيدروجين النظيف واستقرار أمن الطاقة في جنوب أوروبا',
    titleEn: 'Algeria Launches "SoutH2" Clean Hydrogen Mega-Corridor to Southern Europe',
    summary: 'تحالف سوناطراك مع مشغلي شبكات الغاز الإيطالية والألمانية يضع أسس ممر ينقل 4 ملايين طن من الهيدروجين الأخضر سنوياً بحلول 2030، موظفاً الطاقة الشمسية الهائلة في الصحراء الجزائرية لتأمين إمدادات المجمعات الصناعية في بافاريا وشمال إيطاليا.',
    summaryEn: 'Sonatrach and European TSOs finalize SoutH2 pipeline pacts delivering 4M tons of Saharan green hydrogen to Central European industry.',
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
  // 7. تحالف الكاكاو الإيفواري الغاني
  {
    id: 'edit-lead-007',
    slug: 'ivory-coast-ghana-cocoa-industrial-cartel',
    title: 'كوت ديفوار وغانا: ثورة التصنيع المحلي للكاكاو تنهي قرناً كاملاً من تصدير الحبوب الخام',
    titleEn: 'Ivory Coast & Ghana: Domestic Processing Revolution Overturns Raw Bean Export Models',
    summary: 'مع رفع نسبة التصنيع المحلي لحبوب الكاكاو إلى 65% وتدشين 4 مصانع كبرى لزبدة الشوكولاتة في أبيدجان وتيما، تحتفظ دول غرب إفريقيا بمليارات الدولارات داخل اقتصاداتها وتدافع بصلابة عن علاوة الدخل المعيشي لملايين المزارعين الأفارقة.',
    summaryEn: 'West Africa solidifies downstream grinding capacity, processing 65% locally while anchoring sustainable farmer floor prices.',
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
  // 8. ابتكار كيجالي المالي وصناديق التكنولوجيا
  {
    id: 'edit-lead-008',
    slug: 'kigali-international-financial-centre-venture-debt',
    title: 'مركز كيجالي المالي الدولي (KIFC) يطلق صندوق ديون مخاطرة بـ 250 مليون دولار للشركات الناشئة',
    titleEn: 'Kigali International Financial Centre Unveils $250M Pan-African Venture Debt Facility',
    summary: 'مبادرة استثمارية مشتركة بالشراكة مع مؤسسة التمويل الدولية IFC توفر رأس مال تنموي سريع للشركات التكنولوجية دون التنازل عن حصص المؤسسين الأفارقة، معززة مكانة كيجالي كمركز مالي قاري شفاف ومنافس للمراكز العالمية.',
    summaryEn: 'KIFC launches Africa’s premier non-dilutive growth debt facility, bridging critical late-stage financing gaps across 14 nations.',
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
    <div className="space-y-4">
      {/* Top Header of Editorial Desk: Headline + Controls */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
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

      {/* Horizontal Carousel Track (يتم سحبه أفقياً كسلايدات) */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pb-2"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {EDITORIAL_LEAD_STORIES.map((story, idx) => {
          const flag = getCountryFlag(story.countryCode);
          return (
            <div
              key={story.id}
              onClick={() => handleStoryClick(story)}
              className="w-full min-w-full sm:min-w-[540px] md:min-w-[620px] lg:min-w-[680px] snap-center rounded-2xl overflow-hidden border border-slate-800/90 hover:border-amber-500/50 bg-gradient-to-b from-[#0f172a] via-[#0b1120] to-[#070b14] transition-all shadow-xl group cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* 1. صورة أو فيديو في الأعلى يأخذ كامل عرض البطاقة */}
                <div className="w-full h-56 sm:h-72 relative overflow-hidden bg-slate-950">
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
                      <span>{isAr ? 'افتتاحية العدد | عمود رأي' : 'Lead Editorial Column'}</span>
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

                {/* 3. تحت الصورة أو الفيديو: العنوان ثم الملخص الأطول */}
                <div className="p-5 sm:p-7 space-y-3.5">
                  {/* إن كانت افتتاحية أو عمود: تظهر صورة صاحب الافتتاحية مع اسمه ولقبه */}
                  {story.isColumn && story.columnistAvatar && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/80 border border-amber-500/30">
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-amber-500 shadow-md">
                        <img
                          src={story.columnistAvatar}
                          alt={story.columnistName || 'Columnist'}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-amber-400">
                            {isAr ? 'كاتب العمود والافتتاحية:' : 'Columnist:'}
                          </span>
                          <span className="text-xs font-bold text-white">
                            {isAr ? story.columnistName : story.columnistNameEn}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-serif">
                          {isAr ? story.columnistRole : story.columnistRoleEn}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* العنوان */}
                  <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                    {isAr ? story.title : story.titleEn}
                  </h3>

                  {/* الملخص الأطول نوعاً ما */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {isAr ? story.summary : story.summaryEn}
                  </p>
                </div>
              </div>

              {/* 4. أسفل البطاقة: كاتب المقال والمشاهدات ومؤشر الدقة */}
              <div className="px-5 sm:px-7 py-4 border-t border-slate-800/80 bg-slate-950/50 flex flex-wrap items-center justify-between gap-3 text-xs">
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

      {/* Slide Indicators Pills (1 to 8) */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
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
