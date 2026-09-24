import { Article, AfricanCountryProfile, MarketTickerItem } from '../types';
import { ALL_54_AFRICAN_COUNTRIES } from './africanCountries';

export const MARKET_TICKERS: MarketTickerItem[] = [
  { symbol: 'USD/EGP', name: 'US Dollar / Egyptian Pound', nameAr: 'دولار / جنيه مصري', price: '48.45', change: '-0.15%', isPositive: true, type: 'currency' },
  { symbol: 'USD/NGN', name: 'US Dollar / Nigerian Naira', nameAr: 'دولار / نايرا نيجيرية', price: '1,535.00', change: '+0.42%', isPositive: false, type: 'currency' },
  { symbol: 'USD/ZAR', name: 'US Dollar / South African Rand', nameAr: 'دولار / راند جنوب أفريقي', price: '17.82', change: '-0.30%', isPositive: true, type: 'currency' },
  { symbol: 'USD/KES', name: 'US Dollar / Kenyan Shilling', nameAr: 'دولار / شلن كيني', price: '129.20', change: '+0.10%', isPositive: false, type: 'currency' },
  { symbol: 'USD/MAD', name: 'US Dollar / Moroccan Dirham', nameAr: 'دولار / درهم مغربي', price: '9.88', change: '-0.05%', isPositive: true, type: 'currency' },
  { symbol: 'BRENT', name: 'Brent Crude Oil', nameAr: 'نفط خام برنت', price: '$78.40', change: '+1.85%', isPositive: true, type: 'commodity' },
  { symbol: 'GOLD', name: 'Gold (Oz)', nameAr: 'الذهب (أونصة)', price: '$2,642.50', change: '+0.65%', isPositive: true, type: 'commodity' },
  { symbol: 'COCOA', name: 'Cocoa (ICCO Ivory Coast)', nameAr: 'الكاكاو الأفريقي', price: '$7,250/t', change: '+2.10%', isPositive: true, type: 'commodity' },
  { symbol: 'EGX30', name: 'Cairo Stock Exchange 30', nameAr: 'مؤشر البورصة المصرية EGX30', price: '30,420.15', change: '+1.12%', isPositive: true, type: 'index' },
  { symbol: 'JSE40', name: 'Johannesburg Top 40', nameAr: 'بورصة جوهانسبرغ JSE', price: '75,190.80', change: '-0.25%', isPositive: false, type: 'index' },
  { symbol: 'NGX-ASI', name: 'Nigerian Exchange ASI', nameAr: 'مؤشر البورصة النيجيرية', price: '97,412.30', change: '+0.88%', isPositive: true, type: 'index' },
];

export const AFRICAN_COUNTRIES: AfricanCountryProfile[] = ALL_54_AFRICAN_COUNTRIES;

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-001',
    slug: 'dangote-refinery-pan-african-oil-trade',
    title: 'مصفاة دانغوتي تعيد رسم خارطة تجارة المحروقات في غرب أفريقيا بتدفقات قياسية',
    titleEn: 'Dangote Mega Refinery Reshapes West Africa Fuel Trade with Historic Flows',
    summary: 'مع بلوغ الطاقة التكريرية 650 ألف برميل يومياً، تبدأ نيجيريا تصدير المشتقات إلى غانا والسنغال وكوت ديفوار، موفرة أكثر من 12 مليار دولار سنوياً من فاتورة الاستيراد.',
    summaryEn: 'With refining capacity reaching 650,000 bpd, Nigeria begins major shipments across ECOWAS, reversing decades of import dependency.',
    content: [
      'بدأت مصفاة دانغوتي النيجيرية مرحلة التوزيع الإقليمي للديزل والبنزين عالي النقاوة عبر غرب أفريقيا، في تحول هيكلي هو الأكبر في قطاع الطاقة بالقارة منذ عقود.',
      'تشير بيانات بنك التصدير والاستيراد الأفريقي (Afreximbank) إلى أن تقليص شحن المشتقات المكررة من مصافي روتردام وسنغافورة إلى غرب أفريقيا سيوفر للدول الإفريقية ما يصل إلى 15% في تكاليف الشحن والتأمين، مما يخفف الضغوط التضخمية المباشرة على العملات المحلية.',
      'وفي تصريح لمحافظ البنك المركزي النيجيري، أوضح أن الاكتفاء الذاتي من الوقود يمثل نقطة انعطاف حاسمة لحماية احتياطيات النقد الأجنبي، والتي استعادت عافيتها لتتجاوز 39 مليار دولار في الربع الثالث.'
    ],
    contentEn: [
      'The Dangote Refinery in Lagos has initiated cross-border bulk fuel distribution across West Africa, marking the most significant energy restructuring in decades.',
      'Data from Afreximbank confirms regional logistics optimization will reduce shipping premiums by up to 15%, dampening currency depreciation spirals.',
      'The Central Bank of Nigeria highlighted that domestic refined fuel independence eliminates the largest foreign exchange drain on sovereign reserves.'
    ],
    category: 'Energy',
    countryCode: 'NG',
    countryName: 'نيجيريا',
    countryNameEn: 'Nigeria',
    status: 'published',
    generationType: 'automated_periodic',
    journalisticType: 'التحقيق الصحفي',
    sector: 'أسواق الطاقة',
    authorType: 'HYBRID',
    aiModel: 'Gemini 1.5 Pro (Financial Ingestion & Synthesis)',
    reviewedBy: 'د. طارق المنصوري (كبير محرري الطاقة)',
    reviewNotes: 'تم التحقق من مطابقة أرقام الشحن عبر أرصفة ليكي البحرية مع بيانات هيئة الموانئ النيجيرية وصندوق النقد.',
    citations: [
      {
        id: 'cit-1',
        sourceName: 'Afreximbank Quarterly Trade Outlook',
        url: 'https://afreximbank.com/reports/q3-trade',
        publishDate: '2026-08-15',
        verified: true,
        credibilityScore: 98,
        snippet: 'Cross-border ECOWAS petroleum integration projected to eliminate $12B in external FX drainage.'
      },
      {
        id: 'cit-2',
        sourceName: 'Central Bank of Nigeria Foreign Reserves Bulletin',
        url: 'https://cbn.gov.ng/data/reserves',
        publishDate: '2026-09-02',
        verified: true,
        credibilityScore: 99,
        snippet: 'Gross external reserves consolidated above $39.2B post fuel subsidy elimination.'
      }
    ],
    factCheck: {
      score: 97,
      verifiedClaimsCount: 14,
      totalClaimsCount: 14,
      biasRating: 'Neutral',
      riskScore: 'Low',
      checkedAt: '2026-09-20'
    },
    publishedAt: '2026-09-22 14:30',
    createdAt: '2026-09-22 11:15',
    readTimeMinutes: 4,
    featured: true,
    marketImpact: 'positive'
  },
  {
    id: 'art-002',
    slug: 'egypt-sovereign-green-hydrogen-investments',
    title: 'مصر تستقطب 18 مليار دولار في مشاريع الهيدروجين الأخضر بمحور قناة السويس',
    titleEn: 'Egypt Secures $18B in Green Hydrogen Commitments at Suez Canal Economic Zone',
    summary: 'توقيع اتفاقيات ملزمة مع تحالفات أوروبية وآسيوية لتزويد الأساطيل البحرية بالوقود النظيف وتصدير الأمونيا الخضراء إلى الاتحاد الأوروبي بحلول عام 2028.',
    summaryEn: 'Binding framework agreements with European and Asian consortia position the SCZone as the primary zero-emission maritime refueling nexus.',
    content: [
      'شهدت المنطقة الاقتصادية لقناة السويس (SCZONE) توقيع حزمة جديدة من الاتفاقيات الاستثمارية الملزمة بقيمة إجمالية تجاوزت 18 مليار دولار لتشييد مجمعات لإنتاج الهيدروجين والأمونيا الخضراء.',
      'تعتمد المشاريع على مصادر طاقة رياح وشمسية بقدرات تفوق 10 غيغاوات في خليج السويس وأسوان، مدعومة بحوافز ضريبية خاصة وضمانات سيادية للشراء من المفوضية الأوروبية.',
      'وفقاً لتقرير البنك الإفريقي للتنمية (AfDB)، تتمتع مصر بأعلى ميزة تنافسية من حيث تكلفة إنتاج الكيلوغرام الواحد من الهيدروجين ($2.4/kg) لقربها الاستراتيجي من ممرات الشحن الدولية.'
    ],
    contentEn: [
      'The Suez Canal Economic Zone signed landmark investment agreements totaling over $18 billion to establish green ammonia and hydrogen manufacturing parks.',
      'Backed by 10 GW of solar and wind generation along the Red Sea coast, projects are secured with long-term offtake pacts with European energy consortia.',
      'AfDB economic analysis points to Egypt having one of the lowest levelized costs of green hydrogen production globally ($2.4/kg).'
    ],
    category: 'Energy',
    countryCode: 'EG',
    countryName: 'مصر',
    countryNameEn: 'Egypt',
    status: 'published',
    generationType: 'manual_supervisor',
    journalisticType: 'التقرير الإخباري',
    sector: 'الاقتصاد الأخضر',
    authorType: 'HYBRID',
    aiModel: 'Gemini 1.5 Flash (Real-time Financial Agent)',
    reviewedBy: 'سلمى رضوان (محرر الشؤون الاستثمارية)',
    reviewNotes: 'تمت مراجعة نصوص الاتفاقيات المنشورة بالجريدة الرسمية والتحقق من التراخيص البيئية الصادرة.',
    citations: [
      {
        id: 'cit-3',
        sourceName: 'SCZONE Official Gazette & Press Release',
        url: 'https://sczone.eg/releases/green-hydrogen-deals',
        publishDate: '2026-09-18',
        verified: true,
        credibilityScore: 96,
        snippet: '18 agreements executed under Sovereign Green Incentive Framework Law 67.'
      },
      {
        id: 'cit-4',
        sourceName: 'African Development Bank Clean Energy Tracker',
        url: 'https://afdb.org/knowledge/clean-energy-egypt',
        publishDate: '2026-08-30',
        verified: true,
        credibilityScore: 98,
        snippet: 'Levelized cost benchmark evaluates Red Sea renewables corridor as top tier.'
      }
    ],
    factCheck: {
      score: 96,
      verifiedClaimsCount: 11,
      totalClaimsCount: 12,
      biasRating: 'Neutral',
      riskScore: 'Low',
      checkedAt: '2026-09-21'
    },
    publishedAt: '2026-09-22 09:15',
    createdAt: '2026-09-22 07:45',
    readTimeMinutes: 3,
    featured: false,
    marketImpact: 'positive'
  },
  {
    id: 'art-003',
    slug: 'south-africa-jse-tech-listing-surge',
    title: 'بورصة جوهانسبرغ تشهد طفرة إدراجات جديدة لشركات التكنولوجيا المالية الأفريقية',
    titleEn: 'Johannesburg Stock Exchange Sees Wave of Cross-Border African FinTech IPOs',
    summary: 'قواعد التداول المخففة ومؤشرات العملات الأفريقية المزدوجة تجذب الشركات الناشئة الكبرى في كينيا ونيجيريا للبحث عن سيولة عميقة في جنوب أفريقيا.',
    summaryEn: 'Revamped fast-track listing requirements and dual-currency trading attract scale-ups across Sub-Saharan Africa to the JSE.',
    content: [
      'سجلت بورصة جوهانسبرغ (JSE) أعلى وتيرة طلبات إدراج أجنبية منذ خمس سنوات، بعدما أقرّت الهيئة التنظيمية للأوراق المالية نافذة إدراج مرنة للشركات الرقمية الناشئة ذات التقييمات فوق 250 مليون دولار.',
      'تتيح هذه النافذة للشركات جمع التمويل بالراند الجنوب أفريقي أو بالدولار الأمريكي مع الإعفاء المؤقت من اشتراطات رأس المال المعقدة، ما يمنح المستثمرين المؤسسيين فرصة المشاركة في نمو اقتصاد الدفع الرقمي الإفريقي.',
      'وأشار كبير المحللين في بنك ستاندرد (Standard Bank) إلى أن الربط التداولي المشترك بين بورصة كينيا وبورصة جنوب أفريقيا سيعزز السيولة البينية بشكل غير مسبوق.'
    ],
    contentEn: [
      'The Johannesburg Stock Exchange recorded its strongest foreign tech listing pipeline in half a decade following regulatory overhauls for high-growth tech ventures.',
      'The multi-currency listing window allows capital formation in both ZAR and USD, granting institutional asset managers structured exposure to African digital commerce.',
      'Standard Bank analysts forecast bilateral liquidity linking with Nairobi Securities Exchange will bridge historical fragmentation.'
    ],
    category: 'FinTech',
    countryCode: 'ZA',
    countryName: 'جنوب أفريقيا',
    countryNameEn: 'South Africa',
    status: 'published',
    generationType: 'automated_periodic',
    journalisticType: 'صحافة البيانات',
    sector: 'الأسواق المالية والبورصات',
    authorType: 'AI_AGENT',
    aiModel: 'Gemini 1.5 Pro Financial Synthesizer',
    reviewedBy: 'مراجعة تلقائية معتمدة بشرياً (فريق الأسواق المالية)',
    reviewNotes: 'تم التأكد من أرقام الاكتتابات المنشورة في نشرات إصدار JSE الرسمية.',
    citations: [
      {
        id: 'cit-5',
        sourceName: 'JSE Market Regulatory Statement',
        url: 'https://jse.co.za/announcements/tech-framework',
        publishDate: '2026-09-10',
        verified: true,
        credibilityScore: 99,
        snippet: 'Framework for high-growth scale-up fast-track listings approved by FSCA.'
      }
    ],
    factCheck: {
      score: 95,
      verifiedClaimsCount: 9,
      totalClaimsCount: 10,
      biasRating: 'Neutral',
      riskScore: 'Low',
      checkedAt: '2026-09-20'
    },
    publishedAt: '2026-09-21 17:00',
    createdAt: '2026-09-21 14:10',
    readTimeMinutes: 3,
    featured: false,
    marketImpact: 'positive'
  },
  {
    id: 'art-004',
    slug: 'rwanda-kigali-financial-center-venture-debt',
    title: 'مركز كيجالي المالي الدولي (KIFC) يطلق صندوق ديون مخاطرة بقيمة 250 مليون دولار',
    titleEn: 'Kigali International Financial Centre Unveils $250M Pan-African Venture Debt Facility',
    summary: 'مبادرة استثمارية مشتركة تستهدف تمويل الشركات التكنولوجية سريعة التوسع دون التنازل عن حصص الملكية للمؤسسين الأفارقة.',
    summaryEn: 'Joint catalytic fund targets scaling Pan-African technology startups with non-dilutive growth debt structured under Rwandan common law framework.',
    content: [
      'أعلن مركز كيجالي المالي الدولي (KIFC) بالشراكة مع مؤسسة التمويل الدولية (IFC) ومجموعة من الصناديق السيادية عن تدشين أول صندوق أفريقي متخصص في الديون الجريئة (Venture Debt).',
      'يهدف الصندوق إلى سد فجوة التمويل للمراحل المتقدمة (Series B & C) في مجالات التكنولوجيا الزراعية واللوجستيات والصحة الرقمية في أكثر من 14 دولة أفريقية.',
      'يحظى المركز المالي في كيجالي بتصنيف متقدم في مؤشر المراكز المالية العالمية بفضل بيئته الضريبية الشفافة والتحكيم التجاري المستقل المتوافق مع القانون العام.'
    ],
    contentEn: [
      'KIFC in partnership with IFC and sovereign partners launched Africa’s premier institutional venture debt facility.',
      'The fund bridges critical Series B and C debt financing gaps in agritech, logistics, and digital health across 14 African nations.',
      'Kigali’s agile regulatory framework continues to climb Global Financial Centres Index (GFCI) rankings.'
    ],
    category: 'FinTech',
    countryCode: 'RW',
    countryName: 'رواندا',
    countryNameEn: 'Rwanda',
    status: 'published',
    authorType: 'HYBRID',
    aiModel: 'Gemini 1.5 Pro',
    reviewedBy: 'مارتن لوران (كبير مراسلي شرق ووسط أفريقيا)',
    reviewNotes: 'تم التحقق من هيكل الصندوق ومحكمة كيجالي التجارية المستقلة.',
    citations: [
      {
        id: 'cit-6',
        sourceName: 'Rwanda Finance Limited Announcement',
        url: 'https://rfl.rw/insights/venture-debt-250m',
        publishDate: '2026-09-12',
        verified: true,
        credibilityScore: 97,
        snippet: 'Facility backed by catalytic concessional capital from international DFIs.'
      }
    ],
    factCheck: {
      score: 98,
      verifiedClaimsCount: 8,
      totalClaimsCount: 8,
      biasRating: 'Neutral',
      riskScore: 'Low',
      checkedAt: '2026-09-15'
    },
    publishedAt: '2026-09-20 12:00',
    createdAt: '2026-09-20 09:30',
    readTimeMinutes: 2,
    featured: false,
    marketImpact: 'positive'
  },
  // Articles in review (Editorial Human-in-the-loop queue)
  {
    id: 'art-draft-101',
    slug: 'kenya-geothermal-energy-export-uganda',
    title: 'كينيا تبدأ تصدير 100 ميغاوات من الكهرباء الحرارية الأرضية إلى أوغندا وتنزانيا',
    titleEn: 'Kenya Initiates 100MW Geothermal Power Export to East African Power Pool',
    summary: 'مسودة مولدة آلياً بواسطة وكيل الذكاء الاصطناعي (Agent-Ingest-03) بانتظار مراجعة المدقق البشري لاعتماد بيانات سداد التعرفة.',
    summaryEn: 'AI generated draft tracking East Africa Power Pool synchronization awaiting chief editor signoff.',
    content: [
      'دخل خط الربط الكهربائي الإقليمي بقدرة 400 كيلوفولت حيز التشغيل التجريبي بين محطة أولكاريا الكينية وشبكة الكهرباء الأوغندية.',
      'تظهر بيانات وكيل الذكاء الاصطناعي أن الصفقة ستدر على شركة توليد الكهرباء الكينية (KenGen) عائدات شهرية تقدر بنحو 8.4 مليون دولار، مع تعزيز استقرار الشبكة في دول حوض النيل.',
      'ملاحظة النظام الأمني: تم التحقق من 4 مصادر رسمية مع وجود تعارض طفيف في تاريخ بدء التسعير التجاري بين وزارة الطاقة الكينية ومجلس تنظيم الطاقة الأوغندي.'
    ],
    contentEn: [
      'The 400kV regional transmission link commenced test runs between KenGen Olkaria fields and the Ugandan grid.',
      'Automated economic ingestion estimates monthly FX receipts of $8.4M for Kenya Power.',
      'AI Security Protocol Note: 4 official sources cross-checked; minor date discrepancy flagged on tariff commencement.'
    ],
    category: 'Energy',
    countryCode: 'KE',
    countryName: 'كينيا',
    countryNameEn: 'Kenya',
    status: 'pending_review',
    generationType: 'automated_periodic',
    journalisticType: 'التقرير الإخباري',
    sector: 'أسواق الطاقة',
    authorType: 'AI_AGENT',
    aiModel: 'Gemini 1.5 Flash (Economic Ingestion Agent)',
    citations: [
      {
        id: 'cit-draft-1',
        sourceName: 'East African Community Energy Commission Bulletin',
        url: 'https://eac.int/energy/power-pool-2026',
        publishDate: '2026-09-22',
        verified: true,
        credibilityScore: 94,
        snippet: 'Phase 2 synchronization completed between Olkaria and Tororo substations.'
      },
      {
        id: 'cit-draft-2',
        sourceName: 'KenGen Q2 Operational Disclosures',
        url: 'https://kengen.co.ke/investor-relations/q2',
        publishDate: '2026-09-21',
        verified: true,
        credibilityScore: 95,
        snippet: 'Export offtake tariff agreed at $0.078 per kWh indexed to dollar.'
      }
    ],
    factCheck: {
      score: 92,
      verifiedClaimsCount: 7,
      totalClaimsCount: 8,
      biasRating: 'Neutral',
      riskScore: 'Low',
      checkedAt: '2026-09-23'
    },
    createdAt: '2026-09-23 10:14',
    readTimeMinutes: 3,
    featured: false,
    marketImpact: 'positive'
  },
  {
    id: 'art-draft-102',
    slug: 'morocco-aerospace-exports-billion-record',
    title: 'صادرات صناعة الطيران في المغرب تتجاوز 2.8 مليار دولار مدعومة بمكونات الطائرات الهجينة',
    titleEn: 'Morocco Aerospace Exports Surge Past $2.8B on Hybrid Aircraft Components',
    summary: 'مسودة الذكاء الاصطناعي تنتظر اعتماد رئيس قسم التحرير الصناعي، وتفحص الزيادة في القيمة المضافة المحلية إلى 42%.',
    summaryEn: 'AI generated analysis on Casablanca aerospace manufacturing cluster achieving record domestic integration rates.',
    content: [
      'تجاوزت عائدات صادرات منظومة الطيران المغربية في منطقة النواصر بالدار البيضاء حاجز 2.8 مليار دولار خلال الأشهر التسعة الأولى من العام الجاري، بزيادة سنوية بلغت 19.4%.',
      'يعزى هذا النمو القياسي إلى دخول مصانع إنتاج الأجزاء المركبة للطائرات الجديدة ومجموعات الأسلاك الكهربائية المتقدمة حيز التشغيل الكامل بالشراكة مع بوينغ وإيرباص وداهر.',
      'سجل مؤشر التحقق الآلي للحقائق دقة بنسبة 95% بعد مطابقة أرقام مكتب الصرف المغربي مع إفصاحات وزارة الصناعة والتجارة.'
    ],
    contentEn: [
      'Morocco aerospace hub in Casablanca registered $2.8 billion in exports over 9 months, climbing 19.4% YoY.',
      'Key growth catalysts include advanced composite manufacturing and wiring harness assemblies for next-generation narrow-body airliners.',
      'Autonomous fact check matched Foreign Exchange Bureau (Office des Changes) data against ministry disclosures.'
    ],
    category: 'Markets',
    countryCode: 'MA',
    countryName: 'المغرب',
    countryNameEn: 'Morocco',
    status: 'pending_review',
    generationType: 'manual_supervisor',
    journalisticType: 'التحقيق الصحفي',
    sector: 'الصناعة',
    authorType: 'AI_AGENT',
    aiModel: 'Gemini 1.5 Pro Economic Reporter',
    citations: [
      {
        id: 'cit-draft-3',
        sourceName: 'Office des Changes du Maroc - Note de Conjoncture',
        url: 'https://oc.gov.ma/fr/indicateurs-mensuels',
        publishDate: '2026-09-20',
        verified: true,
        credibilityScore: 98,
        snippet: 'Aerospace exports expanded 19.4% to reach 28.4 billion MAD.'
      }
    ],
    factCheck: {
      score: 95,
      verifiedClaimsCount: 9,
      totalClaimsCount: 9,
      biasRating: 'Neutral',
      riskScore: 'Low',
      checkedAt: '2026-09-23'
    },
    createdAt: '2026-09-23 11:30',
    readTimeMinutes: 3,
    featured: false,
    marketImpact: 'positive'
  }
];
