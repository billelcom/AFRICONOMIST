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
      'بدأت مصفاة دانغوتي النيجيرية العملاقة، الواقعة في المنطقة الحرة لشبه جزيرة ليكي شرق لاغوس، مرحلة التدفقات التصديرية المنتظمة للمشتقات النفطية عالية الجودة نحو أسواق دول غرب أفريقيا، في تحول جيواقتصادي وهيكلي يعد الأضخم في جغرافيا الطاقة بالقارة السمراء منذ قرابة نصف قرن. ويأتي هذا الإنجاز الصناعي بعد نجاح المجمع البتروكيماوي في تشغيل وحدات التقطير الجوي بطاقتها التكريرية القياسية البالغة 650 ألف برميل يومياً، ما يضع نيجيريا رسمياً على رأس قائمة منتجي الوقود المكرر في القارة الإفريقية، متجاوزة القدرات التكريرية التراكمية لكبرى المجمعات النفطية الواقعة في حوض البحر الأبيض المتوسط وأوروبا الغربية.',
      'وتكشف البيانات الرسمية الموثقة الصادرة عن وزارة الموارد البترولية النيجيرية عن إبرام حزمة من عقود التوريد الإقليمية طويلة الأجل مع أربع دول محورية في المجموعة الاقتصادية لدول غرب أفريقيا (إيكواس)، شملت غانا، والسنغال، وكوت ديفوار، وتوغو، بهدف تغطية أكثر من 40% من الطلب الاستهلاكي اليومي لتلك الدول من وقود الديزل ووقود الطائرات والبنزين النقي الخالي من الرصاص، ما يرسي ركائز تكامل طاقوي قاري متين ينهي عقوداً طويلة من التبعية المزمنة للمستودعات الأوروبية وموانئ أمستردام وروتردام وأنتويرب، ويمنح دول المنطقة درعاً حمائياً ضد اضطرابات الشحن العالمية.',
      'وفي سياق الجدوى المالية واللوجستية، أظهرت دراسة رصد معمقة أعدها بنك التصدير والاستيراد الأفريقي (Afreximbank) أن نقل مراكز الإمداد والتوزيع من الموانئ الأوروبية إلى خليج غينيا يسهم في تقليص التكاليف اللوجستية المباشرة بنسبة تتراوح بين 18% و24%، تشمل نفقات الشحن البحري، وبوالص التأمين ضد المخاطر، ورسوم التفريغ والرسو بالموانئ. كما قلصت خطوط الملاحة الساحلية الإفريقية المباشرة المدة الزمنية لوصول شحنات المحروقات من 25 يوماً إلى أقل من 48 ساعة فقط، الأمر الذي يتيح لشركات التوزيع الوطنية امتصاص الصدمات السعرية المفاجئة في الأسواق العالمية وتأمين مخزونات استراتيجية تكفي لعدة أشهر متواصلة دون انقطاع.',
      'وعلى الصعيد النقدي والمؤشرات المالية الكلية، شدد محافظ البنك المركزي النيجيري في إحاطة رسمية موجهة لكبار المستثمرين والمصرفيين على أن الاكتفاء الذاتي ووقف نزيف العملة الصعبة الموجه لاستيراد المشتقات وفر ما يتجاوز 12.5 مليار دولار سنوياً من الاحتياطيات النقدية الأجنبية للبلاد. وقد انعكس هذا التدفق المالي الإيجابي بصورة مباشرة على ميزان المدفوعات السيادي، حيث قفزت الاحتياطيات الرسمية من النقد الأجنبي إلى 39.4 مليار دولار بنهاية الربع الثالث، مما منح البنك المركزي هوامش مناورة قوية لتثبيت سعر صرف النايرا والحد من موجات التضخم المستورد التي ألقت بظلالها على أسعار السلع الأساسية.',
      'من الناحية التقنية والتجهيزات الصناعية، تضم منشأة دانغوتي منظومة متطورة ترتبط بشبكة أنابيب بحرية تمتد لأكثر من 1100 كيلومتر تحت سطح مياه المحيط الأطلسي، إلى جانب ست منصات تحميل بحري عائمة قادرة على استقبال ومناولة ناقلات النفط العملاقة من فئة (VLCC) بسلاسة وأمان تامين. هذه المنظومة تضمن استدامة عمليات الشحن والتفريغ حتى في ظل التقلبات المناخية الحادة أو العواصف المدارية، وتوفر تدفقاً يومياً لا يقل عن 80 مليون لتر من المشتقات البترولية لتلبية الاحتياجات التنموية لقطاعات النقل، والتعدين، وتوليد الطاقة الكهربائية في دول الجوار الإفريقي.',
      'ويجمع خبراء الاقتصاد وممثلو اتحاد غرف التجارة الإفريقية على أن مصفاة دانغوتي تشكل الحجر الأساس للنموذج التنموي الذي تسعى اتفاقية منطقة التجارة الحرة القارية الإفريقية (AfCFTA) لترسيخه، حيث تثبت التجربة أن الاستثمار في البنية التحتية التصنيعية السيادية قادر على كسر المعادلة الاستعمارية التاريخية القائمة على تصدير الموارد الخام واستيرادها بأسعار مضاعفة، مما يفتح آفاقاً واسعة لخلق أكثر من مائة ألف فرصة عمل صناعية مباشرة وغير مباشرة في سلاسل القيمة المضافة لقطاع المحروقات في عموم غرب القارة الإفريقية.',
      'وتتجه أنظار المراقبين والمؤسسات التمويلية الدولية خلال المرحلة المقبلة إلى خطط توسيع الخطوط الرابطة ومشاريع خطوط الأنابيب الإقليمية العابرة للحدود لتزويد مالي وبوركينا فاسو والنيجر بالوقود براً، مما يكرس سيادة القارة الطاقوية ويدشن حقبة تاريخية عنوانها التصنيع المحلي، وتكامل سلاسل التوريد، وتحقيق الأمن الطاقوي المشترك بحلول عام 2030.'
    ],
    contentEn: [
      'The Dangote mega refinery in the Lekki Free Trade Zone of Lagos has commenced historic commercial fuel shipments across West African markets, representing the most transformative geoeconomic shift in continental energy dynamics in over half a century. Reaching its rated nameplate refining capacity of 650,000 barrels per day firmly establishes Nigeria as the premier refined petroleum powerhouse in Africa, eclipsing conventional refining complexes across the Mediterranean basin and Western Europe.',
      'Official documentation from Nigerias Ministry of Petroleum Resources confirms extensive multi-year bilateral supply agreements with key ECOWAS counterparts—namely Ghana, Senegal, Côte dIvoire, and Togo. These pacts cover over 40% of their aggregate national fuel demand for premium diesel, jet fuel, and unleaded gasoline, decisively ending decades of structural reliance on European depots in Amsterdam, Rotterdam, and Antwerp while providing insulation against maritime geopolitical shocks.',
      'Analytical assessments published by Afreximbank indicate that re-anchoring regional energy distribution corridors within the Gulf of Guinea cuts direct logistical expenditures by 18% to 24%, including maritime freight tariffs, marine risk insurance underwriting, and port demurrage surcharges. Furthermore, coastal transit durations have been slashed from 25 days down to under 48 hours, empowering domestic distributors to absorb global price volatility and maintain robust strategic petroleum reserves.',
      'Macroeconomic indicators reflect significant monetary stabilization. In a high-level briefing to institutional investors, Central Bank leadership stated that achieving refined petroleum self-sufficiency halted the foreign exchange outflow previously squandered on fuel imports, safeguarding over $12.5 billion annually. Consequently, gross sovereign foreign exchange reserves surged to $39.4 billion by the close of the third quarter, providing monetary authorities with critical leeway to anchor the Nigerian Naira and tame imported inflation.',
      'From an infrastructure and engineering standpoint, the Lekki petrochemical complex is integrated with more than 1,100 kilometers of deepwater subsea pipelines alongside six Single-Point Mooring (SPM) buoys engineered to dock and offload Very Large Crude Carriers (VLCCs) in severe maritime weather conditions. This setup guarantees unbroken daily discharge exceeding 80 million liters of clean fuels, powering industrial transport, mineral extraction, and thermal power plants throughout the region.',
      'Continental economists and African Chambers of Commerce leadership regard this milestone as an operational blueprint for the African Continental Free Trade Area (AfCFTA). The initiative proves that sovereign investments in heavy downstream industrialization can overturn historical resource-extraction paradigms, generating over 100,000 direct and ancillary industrial careers across regional value chains.',
      'Looking ahead, international development finance institutions are actively monitoring pipeline extension initiatives to landlocked ECOWAS partners including Mali, Burkina Faso, and Niger, solidifying West Africas collective energy security and establishing a self-sustaining sovereign industrial corridor by 2030.'
    ],
    graphics: [
      {
        id: 'g-1',
        title: 'تطور الطاقة التكريرية اليومية لمصفاة دانغوتي (برميل/يوم)',
        titleEn: 'Dangote Refinery Daily Throughput Trajectory (BPD)',
        type: 'chart',
        position: 'mid',
        align: 'right',
        caption: 'صعود تدريجي من التشغيل الأولي وصولاً للقدرة القصوى 650 ألف برميل يومياً',
        dataPoints: [
          { label: 'المرحلة 1 (تجريبي)', value: 350, desc: '350k ب/ي' },
          { label: 'المرحلة 2 (توسع)', value: 480, desc: '480k ب/ي' },
          { label: 'المرحلة 3 (إقليمي)', value: 580, desc: '580k ب/ي' },
          { label: 'الطاقة القصوى', value: 650, desc: '650k ب/ي' }
        ],
        details: 'المصدر: النشرة الفنية لشركة دانغوتي للصناعات النفطية ومصادقة هيئة التنظيم النيجيرية NMDPRA'
      },
      {
        id: 'g-2',
        title: 'خريطة تدفقات خطوط الشحن البحري الإقليمية (ممرات ECOWAS)',
        titleEn: 'Maritime Trade Corridors in West Africa',
        type: 'map',
        position: 'mid',
        align: 'left',
        caption: 'محاور التوزيع الساحلي المباشر من خليج غينيا إلى غانا وكوت ديفوار والسنغال وتوغو',
        dataPoints: [
          { label: 'غانا (تيما)', value: 40, desc: '40% من الواردات' },
          { label: 'السنغال (داكار)', value: 25, desc: '25% من الواردات' },
          { label: 'كوت ديفوار (أبيدجان)', value: 20, desc: '20% من الواردات' },
          { label: 'توغو وبنين (لومي)', value: 15, desc: '15% من الواردات' }
        ],
        details: 'تقليص زمن الإبحار من 25 يوماً (من موانئ روتردام الأوروبية) إلى أقل من 48 ساعة عبر الملاحة الساحلية الإفريقية'
      },
      {
        id: 'g-3',
        title: 'مؤشر خفض تكاليف سلاسل الإمداد والشحن البحري الإقليمي (%)',
        titleEn: 'Regional Maritime Supply Chain Cost Reductions (%)',
        type: 'chart',
        position: 'mid',
        align: 'right',
        caption: 'وفر التكاليف اللوجستية ورسوم التأمين وغرامات التأخير مقارنة بالتوريد الأوروبي',
        dataPoints: [
          { label: 'وفر الشحن المباشر', value: 18, desc: 'انخفاض 18%' },
          { label: 'بوالص التأمين البحري', value: 24, desc: 'انخفاض 24%' },
          { label: 'رسوم التفريغ والرسو', value: 35, desc: 'انخفاض 35%' },
          { label: 'تقليص زمن التوريد', value: 92, desc: 'تقليص 92%' }
        ],
        details: 'دراسة استقصائية ميدانية منشورة في النشرة الفصلية لبنك التصدير والاستيراد الإفريقي (Afreximbank)'
      },
      {
        id: 'g-4',
        title: 'التمثيل البياني الختامي الشامل: أثر وفر النقد الأجنبي على الاحتياطيات السيادية (مليار دولار)',
        titleEn: 'Forex Drainage Reversal & Sovereign Reserves Growth ($B)',
        type: 'infographic',
        position: 'end',
        caption: 'مسار تعافي الاحتياطيات النقدية بعد وقف استيراد المحروقات والتحول نحو التصدير الإقليمي',
        dataPoints: [
          { label: '2023 (سابق)', value: 32, desc: '$32.1B استنزاف' },
          { label: '2024 (بدء)', value: 36, desc: '$36.8B تعافي' },
          { label: '2025 (إقليمي)', value: 42, desc: '$42.5B وفر' },
          { label: '2026 (مستهدف)', value: 49, desc: '$49.2B طفرة' }
        ],
        details: 'بيانات موثقة من النشرة الفصلية للبنك المركزي النيجيري وتقارير صندوق النقد الدولي لميزان المدفوعات'
      }
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
        snippet: 'Gross external reserves consolidated above $39.4B post fuel subsidy elimination.'
      },
      {
        id: 'cit-3',
        sourceName: 'Nigerian Midstream and Downstream Petroleum Regulatory Authority (NMDPRA)',
        url: 'https://nmdpra.gov.ng/reports/refinery-capacity',
        publishDate: '2026-09-10',
        verified: true,
        credibilityScore: 97,
        snippet: 'Dangote petrochemical operations certified at 650,000 bpd throughput capacity with offshore subsea connectivity.'
      },
      {
        id: 'cit-4',
        sourceName: 'AfCFTA Secretariat Industrial Integration Review',
        url: 'https://au-afcfta.org/publications/energy-corridors',
        publishDate: '2026-09-18',
        verified: true,
        credibilityScore: 96,
        snippet: 'Regional energy value addition benchmarked to generate over 100,000 skilled manufacturing jobs across West Africa.'
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
    publishedAt: '2026-09-24 16:30',
    createdAt: '2026-09-24 14:15',
    readTimeMinutes: 4,
    featured: true,
    marketImpact: 'positive',
    authorName: 'د. طارق المنصوري',
    authorNameEn: 'Dr. Tarek Al-Mansouri',
    authorRole: 'كبير محرري الطاقة والصناعات الثقيلة',
    authorRoleEn: 'Senior Energy & Heavy Industry Editor',
    readersCount: 3840,
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80'
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
    publishedAt: '2026-09-24 11:20',
    createdAt: '2026-09-24 09:15',
    readTimeMinutes: 3,
    featured: false,
    marketImpact: 'positive',
    authorName: 'سلمى رضوان',
    authorNameEn: 'Salma Radwan',
    authorRole: 'محررة الاستثمار والسياسات البيئية',
    authorRoleEn: 'Investment & Environmental Policy Editor',
    readersCount: 2950,
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=300&q=80'
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
    publishedAt: '2026-09-23 18:45',
    createdAt: '2026-09-23 16:10',
    readTimeMinutes: 3,
    featured: false,
    marketImpact: 'positive',
    authorName: 'ثاندو نكوسي',
    authorNameEn: 'Thando Nkosi',
    authorRole: 'محلل أسواق رأس المال والبورصات',
    authorRoleEn: 'Capital Markets & Exchanges Analyst',
    readersCount: 2180,
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=300&q=80'
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
    publishedAt: '2026-09-23 14:15',
    createdAt: '2026-09-23 11:30',
    readTimeMinutes: 2,
    featured: false,
    marketImpact: 'positive',
    authorName: 'مارتن لوران',
    authorNameEn: 'Martin Laurent',
    authorRole: 'كبير مراسلي شرق ووسط أفريقيا',
    authorRoleEn: 'Chief East & Central Africa Correspondent',
    readersCount: 1640,
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'art-005',
    slug: 'algeria-italy-hydrogen-corridor-southedge',
    title: 'الجزائر تطلق خط أنابيب "ساوث هيدج" لتصدير الهيدروجين الطبيعي والطاقة النظيفة نحو إيطاليا',
    titleEn: 'Algeria Launches "SoutH2" Clean Hydrogen Mega-Corridor to Southern Europe',
    summary: 'استثمارات تفوق 13 مليار دولار لربط حقول حاسي الرمل بشمال إفريقيا وجنوب أوروبا، مع رفع صادرات الغاز الطبيعي المسال بنسبة 18%.',
    summaryEn: 'Over $13 billion invested connecting Hassi R’Mel renewable energy clusters to Bavaria and Northern Italy through advanced pipeline conduits.',
    content: [
      'أبرمت مجمع سوناطراك الجزائري اتفاقيات إطارية مع مشغلي شبكات الغاز في إيطاليا وألمانيا لتنفيذ الممر الجنوبي للهيدروجين النظيف (SoutH2 Corridor).',
      'يهدف المشروع الاستراتيجي إلى نقل 4 ملايين طن من الهيدروجين النظيف سنوياً بحلول عام 2030، مستفيداً من الطاقة الشمسية الضخمة في الصحراء الجزائرية وشبكات النقل القائمة.',
      'وأكد بنك التصدير والاستيراد الأوروبي أن هذا الممر يرسخ مكانة الجزائر كأكبر شريك طاقوي موثوق لأوروبا على الضفة الجنوبية للمتوسط.'
    ],
    contentEn: [
      'Sonatrach executed definitive consortium pacts with Italian and German TSOs for the SoutH2 pipeline network.',
      'The multi-billion corridor will channel 4 million tons of clean hydrogen annually by 2030, leveraging Algerian Sahara solar baseload.',
      'European trade financiers highlight Algeria’s position as the bedrock of trans-Mediterranean energy security.'
    ],
    category: 'Energy',
    countryCode: 'DZ',
    countryName: 'الجزائر',
    countryNameEn: 'Algeria',
    status: 'published',
    generationType: 'automated_periodic',
    journalisticType: 'التحقيق الصحفي',
    sector: 'أسواق الطاقة',
    authorType: 'HYBRID',
    aiModel: 'Gemini 1.5 Pro Financial Synthesizer',
    reviewedBy: 'جمال بلقاسم (محلل شؤون النفط والغاز)',
    reviewNotes: 'تمت مطابقة بيانات تدفقات خطوط الأنابيب عبر البحر الأبيض المتوسط مع وزارة الطاقة.',
    citations: [
      {
        id: 'cit-dz-1',
        sourceName: 'Sonatrach Official Annual Strategy Bulletin',
        url: 'https://sonatrach.com/press/south2-corridor',
        publishDate: '2026-09-14',
        verified: true,
        credibilityScore: 99,
        snippet: 'Definitive engineering and geotechnical routing approved for SoutH2 offshore links.'
      }
    ],
    factCheck: {
      score: 98,
      verifiedClaimsCount: 12,
      totalClaimsCount: 12,
      biasRating: 'Neutral',
      riskScore: 'Low',
      checkedAt: '2026-09-22'
    },
    publishedAt: '2026-09-23 09:30',
    createdAt: '2026-09-23 07:15',
    readTimeMinutes: 4,
    featured: false,
    marketImpact: 'positive',
    authorName: 'جمال بلقاسم',
    authorNameEn: 'Djamel Belkacem',
    authorRole: 'محلل شؤون النفط وشبكات الغاز الإقليمية',
    authorRoleEn: 'Regional Oil & Gas Infrastructure Analyst',
    readersCount: 4210,
    imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'art-006',
    slug: 'morocco-ev-battery-gigafactory-investments',
    title: 'المغرب يستقطب 6 مليارات دولار لإنشاء مجمع عملاق لصناعة بطاريات السيارات الكهربائية',
    titleEn: 'Morocco Clinches $6B in Electric Vehicle Battery Gigafactory Commitments',
    summary: 'تحالفات صناعية صينية وأوروبية تختار القنيطرة وطنجة لتكرير الكوبالت والفوسفات وإنتاج كاثودات بطاريات السيارات الكهربائية لتصديرها للعالم.',
    summaryEn: 'Sino-European manufacturing consortia select Kenitra and Tangier Med for integrated cathode and precursor chemical manufacturing.',
    content: [
      'دخل قطاع صناعة السيارات في المغرب مرحلة جديدة بالإعلان عن مصنعين عملاقين (Gigafactories) لإنتاج خلايا بطاريات الليثيوم والحديد والفوسفات (LFP) بطاقة سنوية تصل إلى 50 غيغاوات/ساعة.',
      'تستند هذه المشروعات إلى وفرة الفوسفات المغربي ومناجم الكوبالت عالية النقاوة، بالإضافة إلى اتفاقيات التجارة الحرة مع الاتحاد الأوروبي والولايات المتحدة.',
      'تتوقع وزارة التجارة والصناعة المغربية خلق أكثر من 25 ألف فرصة عمل صناعية متقدمة ورفع صادرات المملكة بنحو 8 مليارات دولار بحلول 2028.'
    ],
    contentEn: [
      'Morocco’s automotive industrial base announced two Gigafactory campuses delivering 50 GWh of LFP battery cells annually.',
      'Competitive advantages stem from domestic phosphate reserves, zero-carbon grid power, and free-trade access to EU and US markets.',
      'Ministry of Industry forecasts 25,000 advanced industrial jobs and $8B incremental export revenues by 2028.'
    ],
    category: 'Mining',
    countryCode: 'MA',
    countryName: 'المغرب',
    countryNameEn: 'Morocco',
    status: 'published',
    generationType: 'manual_supervisor',
    journalisticType: 'تقرير استقصائي',
    sector: 'الصناعة والتعدين',
    authorType: 'HYBRID',
    aiModel: 'Gemini 1.5 Pro',
    reviewedBy: 'نادية بناني (محررة الصناعة وسلاسل الإمداد)',
    reviewNotes: 'تم التحقق من رخص الاستثمار الصناعي في ميناء طنجة المتوسط.',
    citations: [
      {
        id: 'cit-ma-1',
        sourceName: 'Tanger Med Port Authority Industrial Zone Report',
        url: 'https://tangermed.ma/reports/industrial-park-ev',
        publishDate: '2026-09-16',
        verified: true,
        credibilityScore: 97,
        snippet: 'Land allocation and specialized hazardous cargo piers commissioned for battery exporters.'
      }
    ],
    factCheck: {
      score: 97,
      verifiedClaimsCount: 11,
      totalClaimsCount: 11,
      biasRating: 'Neutral',
      riskScore: 'Low',
      checkedAt: '2026-09-22'
    },
    publishedAt: '2026-09-22 19:10',
    createdAt: '2026-09-22 16:50',
    readTimeMinutes: 3,
    featured: false,
    marketImpact: 'positive',
    authorName: 'نادية بناني',
    authorNameEn: 'Nadia Bennani',
    authorRole: 'محررة سلاسل الإمداد والتعدين',
    authorRoleEn: 'Supply Chain & Mining Industry Editor',
    readersCount: 3410,
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'art-007',
    slug: 'kenya-fintech-cross-border-settlement-system',
    title: 'كينيا ونيجيريا وغانا تطلق منصة دفع لحظية مشتركة بالعملات الوطنية لخفض الاعتماد على الدولار',
    titleEn: 'Kenya, Nigeria & Ghana Roll Out Real-Time Local Currency Cross-Border Clearing',
    summary: 'المنصة الإفريقية المشتركة تقلص زمن التسوية من 4 أيام إلى 10 ثوانٍ وتوفر 5 مليارات دولار سنوياً من رسوم وساطة العملات الصعبة.',
    summaryEn: 'Pan-African settlement system enables instantaneous bilateral trade clearance in KES, NGN, and GHS without intermediate conversion fees.',
    content: [
      'أطلقت البنوك المركزية في كينيا ونيجيريا وغانا بالتعاون مع نظام المدفوعات والتسوية الإفريقي (PAPSS) منظومة المقاصة اللحظية الموحدة لتجارة الشركات الصغيرة والمتوسطة.',
      'تتيح المنظومة للمستورد في نيروبي سداد قيمة شحنات البضائع من لاغوس بالنايرا النيجيرية مباشرة عبر حسابه بالشلن الكيني وفق أسعار الصرف المرجعية المعتمدة.',
      'وسجلت المنظومة في أسبوعها الأول تداولات تجارية فاقت 140 مليون دولار، وسط إقبال واسع من قطاعات الأغذية والمواد الخام المصنعة.'
    ],
    contentEn: [
      'Central banks across Nairobi, Abuja, and Accra deployed unified instant settlement APIs under the PAPSS architecture.',
      'Importers clear intra-African trade directly in domestic currencies using certified central bank reference exchange rates.',
      'First-week throughput exceeded $140M across fast-moving consumer goods and regional agricultural inputs.'
    ],
    category: 'FinTech',
    countryCode: 'KE',
    countryName: 'كينيا',
    countryNameEn: 'Kenya',
    status: 'published',
    generationType: 'automated_periodic',
    journalisticType: 'التقرير الإخباري',
    sector: 'التكنولوجيا المالية',
    authorType: 'AI_AGENT',
    aiModel: 'Gemini 1.5 Pro',
    reviewedBy: 'بيتر كيماني (محرر التكنولوجيا المصرفية)',
    reviewNotes: 'تمت مراجعة بيانات التسوية اللحظية المنشورة بواسطة PAPSS.',
    citations: [
      {
        id: 'cit-ke-1',
        sourceName: 'PAPSS Operational Quarterly Statistics',
        url: 'https://papss.com/stats/cross-border-q3',
        publishDate: '2026-09-17',
        verified: true,
        credibilityScore: 99,
        snippet: 'Zero third-party currency routing achieved for tri-lateral pilot corridor transactions.'
      }
    ],
    factCheck: {
      score: 96,
      verifiedClaimsCount: 10,
      totalClaimsCount: 10,
      biasRating: 'Neutral',
      riskScore: 'Low',
      checkedAt: '2026-09-22'
    },
    publishedAt: '2026-09-22 15:40',
    createdAt: '2026-09-22 13:20',
    readTimeMinutes: 3,
    featured: false,
    marketImpact: 'positive',
    authorName: 'بيتر كيماني',
    authorNameEn: 'Peter Kimani',
    authorRole: 'محلل التكنولوجيا المصرفية والسيولة النقدية',
    authorRoleEn: 'Banking Tech & Digital Payments Analyst',
    readersCount: 2890,
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'art-008',
    slug: 'angola-sovereign-wealth-fund-infrastructure-pivot',
    title: 'صندوق أنغولا السيادي يوجه 3.5 مليار دولار لبناء الممر اللوجستي للسكك الحديدية لغرب أفريقيا',
    titleEn: 'Angola Sovereign Wealth Fund Allocates $3.5B to Lobito Mineral Rail Corridor',
    summary: 'تسريع ربط أحزمة النحاس والكوبالت في زامبيا والكونغو الديمقراطية بميناء لوبيتو الأطلسي يختصر زمن الشحن الدولي إلى أوروبا وأمريكا بمقدار 20 يوماً.',
    summaryEn: 'Strategic capital injection accelerates Lobito rail corridor expansion, halving transit time for critical mineral exports to Atlantic markets.',
    content: [
      'أعلن صندوق الثروة السيادي الأنغولي (FSDEA) عن حزمة تمويلات جديدة مخصصة لتحديث وتوسعة خط سكك حديد بنغيلا الممتد نحو الحدود الشرقية مع جمهورية الكونغو الديمقراطية.',
      'يمثل ممر لوبيتو شريان النقل الأهم للمعادن الاستراتيجية، حيث يحظى بدعم ائتماني من تحالف دولي يشمل بنك التنمية الإفريقي والوكالة الأمريكية لتمويل التنمية الدولية.',
      'تشير التقديرات إلى أن رسوم العبور والخدمات اللوجستية ستولد لأنغولا عوائد تفوق 900 مليون دولار سنوياً بحلول عام 2027.'
    ],
    contentEn: [
      'Angola’s Sovereign Wealth Fund (FSDEA) deployed $3.5B to modernize the Benguela railway trunk line to the DRC copper belt border.',
      'The Lobito Corridor acts as the vital artery for global energy-transition minerals, backed by multi-lateral development credit.',
      'Sovereign transit royalties and terminal handling fees are modeled to deliver $900M in non-oil annual revenues by 2027.'
    ],
    category: 'Mining',
    countryCode: 'AO',
    countryName: 'أنغولا',
    countryNameEn: 'Angola',
    status: 'published',
    generationType: 'manual_supervisor',
    journalisticType: 'التحقيق الصحفي',
    sector: 'البنية التحتية والتعدين',
    authorType: 'HYBRID',
    aiModel: 'Gemini 1.5 Flash',
    reviewedBy: 'جواو فيليبي (مراسل الشؤون اللوجستية في لواندا)',
    reviewNotes: 'تم التأكد من عقود حق الامتياز والتمويل المصرفي المشترك.',
    citations: [
      {
        id: 'cit-ao-1',
        sourceName: 'Angola Ministry of Transport Infrastructure Dispatch',
        url: 'https://mintrans.gov.ao/lobito-corridor-phase-3',
        publishDate: '2026-09-11',
        verified: true,
        credibilityScore: 96,
        snippet: 'Deepwater mineral loading terminal construction reaches 78% completion at Lobito port.'
      }
    ],
    factCheck: {
      score: 95,
      verifiedClaimsCount: 8,
      totalClaimsCount: 8,
      biasRating: 'Neutral',
      riskScore: 'Low',
      checkedAt: '2026-09-21'
    },
    publishedAt: '2026-09-22 12:00',
    createdAt: '2026-09-22 09:30',
    readTimeMinutes: 3,
    featured: false,
    marketImpact: 'positive',
    authorName: 'جواو فيليبي',
    authorNameEn: 'João Filipe',
    authorRole: 'مراسل البنية التحتية والسكك الحديدية',
    authorRoleEn: 'Infrastructure & Rail Logistics Correspondent',
    readersCount: 1980,
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'art-009',
    slug: 'ivory-coast-ghana-cocoa-industrial-processing',
    title: 'كوت ديفوار وغانا ترفعان نسبة التصنيع المحلي للكاكاو إلى 65% مع تطبيق علاوة الدخل المعيشي',
    titleEn: 'Ivory Coast & Ghana Expand Domestic Cocoa Processing to 65% Milestone',
    summary: 'تحول صناعي نوعي يبقي القيمة المضافة داخل غرب إفريقيا بفضل افتتاح 4 مصانع كبرى لإنتاج زبدة وشوكولاتة التصدير في أبيدجان وأكرا.',
    summaryEn: 'West African cocoa cartel solidifies downstream industrial capacity, processing over 1.2M tons locally while defending Living Income Differentials.',
    content: [
      'أظهرت إحصائيات مجلس القهوة والكاكاو الإيفواري وهيئة الكاكاو الغانية قفزة تاريخية في الطاقة التكريرية المحلية لحبوب الكاكاو لتتجاوز 1.2 مليون طن سنوياً.',
      'يأتي هذا الإنجاز مدفوعاً بفرض رسوم تفضيلية للمصانع المحلية وحظر تصدير الحبوب الخام غير المعالجة تدريجياً، ما ضاعف عوائد صادرات البلدين 3 مرات مقارنة ببيع المحصول الخام.',
      'وفرت المبادرة حماية اجتماعية لأكثر من مليوني مزارع إفريقي بفضل استقرار تطبيق علاوة الدخل المعيشي البالغة 400 دولار للطن.'
    ],
    contentEn: [
      'Joint bulletins from Conseil du Café-Cacao and COCOBOD revealed domestic grinding capacity surpassed 1.2M metric tons.',
      'Fiscal incentives and selective raw-bean export tariffs successfully tripled value-retention within host economies.',
      'Over 2 million smallholder farming families benefit from sustainable pricing under the Living Income Differential framework.'
    ],
    category: 'Agribusiness',
    countryCode: 'CI',
    countryName: 'كوت ديفوار',
    countryNameEn: 'Ivory Coast',
    status: 'published',
    generationType: 'automated_periodic',
    journalisticType: 'صحافة البيانات',
    sector: 'الزراعة والصناعات الغذائية',
    authorType: 'HYBRID',
    aiModel: 'Gemini 1.5 Pro',
    reviewedBy: 'ماري تريز ياو (كبير محرري السلع الزراعية)',
    reviewNotes: 'تم تدقيق جداول الطحن الصناعي وأسعار بورصة لندن للسلع مع ICCO.',
    citations: [
      {
        id: 'cit-ci-1',
        sourceName: 'International Cocoa Organization (ICCO) Quarterly Bulletin',
        url: 'https://icco.org/statistics/q3-grindings-africa',
        publishDate: '2026-09-15',
        verified: true,
        credibilityScore: 98,
        snippet: 'Sub-Saharan industrial grinding market share hits historic all-time high.'
      }
    ],
    factCheck: {
      score: 99,
      verifiedClaimsCount: 13,
      totalClaimsCount: 13,
      biasRating: 'Neutral',
      riskScore: 'Low',
      checkedAt: '2026-09-21'
    },
    publishedAt: '2026-09-21 16:15',
    createdAt: '2026-09-21 13:40',
    readTimeMinutes: 3,
    featured: false,
    marketImpact: 'positive',
    authorName: 'ماري تريز ياو',
    authorNameEn: 'Marie-Thérèse Yao',
    authorRole: 'كبير محرري السلع الزراعية وسلاسل القيمة',
    authorRoleEn: 'Chief Agricultural Commodities Editor',
    readersCount: 2470,
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'art-010',
    slug: 'tanzania-lng-project-offshore-gas-development',
    title: 'تنزانيا تضع اللمسات الأخيرة لمشروع الغاز المسال العملاق بقيمة 42 مليار دولار في ليندي',
    titleEn: 'Tanzania Finalizes $42B Lindi Offshore LNG Host Government Agreement',
    summary: 'مشروع هو الأضخم في تاريخ شرق أفريقيا يؤهل دار السلام لتصدير 10 ملايين طن من الغاز الطبيعي المسال سنوياً إلى الأسواق الآسيوية والأوروبية.',
    summaryEn: 'Host Government Agreement between Tanzania and energy majors unlocks deepwater offshore fields in Blocks 1, 2, and 4.',
    content: [
      'استكملت الحكومة التنزانية وممثلو شركات الطاقة العالمية بنود اتفاقية الغاز المسال الإطارية، متضمنة الجدول الزمني للقرار الاستثماري النهائي (FID) بنهاية العام الجاري.',
      'يقوم المشروع على استخراج أكثر من 57 تريليون قدم مكعب من الغاز في المياه العميقة جنوب شرق تنزانيا ونقلها عبر أنابيب بحرية إلى مجمع التسييل في ليندي.',
      'سيسهم المشروع في زيادة الناتج المحلي الإجمالي لتنزانيا بنسبة 7% سنوياً خلال فترة التشييد وتوفير طاقة نظيفة رخيصة لتغذية الشبكة الصناعية المحلية.'
    ],
    contentEn: [
      'Tanzania’s Ministry of Energy and international energy operators finalized terms for the landmark Lindi LNG export project.',
      'Unlocking 57 Tcf of recoverable offshore natural gas reserves, the complex will feed Asian and European baseload demands.',
      'Macroeconomic modeling forecasts an incremental 7% annual GDP contribution across the multi-year engineering and construction phase.'
    ],
    category: 'Energy',
    countryCode: 'TZ',
    countryName: 'تنزانيا',
    countryNameEn: 'Tanzania',
    status: 'published',
    generationType: 'automated_periodic',
    journalisticType: 'التقرير الإخباري',
    sector: 'أسواق الطاقة والغاز',
    authorType: 'AI_AGENT',
    aiModel: 'Gemini 1.5 Pro',
    reviewedBy: 'حسان مسعود (محلل الطاقة في شرق أفريقيا)',
    reviewNotes: 'تمت مطابقة أرقام الاحتياطيات المؤكدة مع نشرات هيئة تنمية البترول التنزانية (TPDC).',
    citations: [
      {
        id: 'cit-tz-1',
        sourceName: 'Tanzania Petroleum Development Corporation (TPDC) Update',
        url: 'https://tpdc.co.tz/lindi-lng-regulatory-filing',
        publishDate: '2026-09-08',
        verified: true,
        credibilityScore: 97,
        snippet: 'Environmental social impact assessment and onshore pipeline easement ratified.'
      }
    ],
    factCheck: {
      score: 96,
      verifiedClaimsCount: 10,
      totalClaimsCount: 10,
      biasRating: 'Neutral',
      riskScore: 'Low',
      checkedAt: '2026-09-20'
    },
    publishedAt: '2026-09-21 11:30',
    createdAt: '2026-09-21 09:10',
    readTimeMinutes: 3,
    featured: false,
    marketImpact: 'positive',
    authorName: 'حسان مسعود',
    authorNameEn: 'Hassan Masoud',
    authorRole: 'محلل الطاقة والتنقيب في حوض شرق إفريقيا',
    authorRoleEn: 'East Africa Upstream Energy Analyst',
    readersCount: 3120,
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'art-011',
    slug: 'ethiopia-commodity-exchange-digital-coffee-reform',
    title: 'بورصة إثيوبيا للسلع تعتمد التداول الرقمي المباشر للبن وترفع حصيلة الصادرات إلى 1.9 مليار دولار',
    titleEn: 'Ethiopia Commodity Exchange Upgrades Digital Coffee Bidding to Hit $1.9B Record',
    summary: 'منصة تداول ذكية تربط أكثر من 500 ألف مزارع قهوة بالمشترين العالميين مباشرة وتختصر سلاسل الوساطة بنسبة 40%.',
    summaryEn: 'Digital traceability and electronic warehousing across Oromia and Sidama propel Ethiopian specialty coffee exports to historic highs.',
    content: [
      'حققت بورصة السلع الإثيوبية (ECX) رقماً قياسياً في صادرات البن العربي المتميز (Specialty Arabica) متجاوزة 1.9 مليار دولار خلال الموسم الزراعي الحالي.',
      'جاء هذا الارتفاع بعد إطلاق نظام التتبع الرقمي القائم على تقنية السجلات الموزعة، والذي يسمح للمستوردين في أوروبا وآسيا بالتحقق من منشأ كل شحنة وجودتها البيئية ومطابقتها لمعايير التجارة العادلة.',
      'ترافق ذلك مع استقرار سعر الصرف المرن للبير الإثيوبي الذي تبناه البنك المركزي مؤخراً، ما حفّز المزارعين على زيادة إنتاجهم والتصدير عبر القنوات الرسمية.'
    ],
    contentEn: [
      'The Ethiopia Commodity Exchange (ECX) posted historic $1.9B revenues driven by digital auction platforms and traceable supply contracts.',
      'Direct farm-to-cup traceability complies with stringent EU deforestation mandates while lifting real farmer margins by 28%.',
      'The recent exchange rate liberalization enacted by the National Bank of Ethiopia incentivized formal banking channel liquidation.'
    ],
    category: 'Agribusiness',
    countryCode: 'ET',
    countryName: 'إثيوبيا',
    countryNameEn: 'Ethiopia',
    status: 'published',
    generationType: 'manual_supervisor',
    journalisticType: 'صحافة البيانات',
    sector: 'الزراعة والتجارة الدولية',
    authorType: 'HYBRID',
    aiModel: 'Gemini 1.5 Flash',
    reviewedBy: 'أماني تاديسي (محررة الاقتصاد الزراعي في أديس أبابا)',
    reviewNotes: 'تم تدقيق إحصاءات الجمارك الإثيوبية وبيانات منظمة القهوة العالمية ICO.',
    citations: [
      {
        id: 'cit-et-1',
        sourceName: 'Ethiopian Coffee and Tea Authority Annual Review',
        url: 'https://ecta.gov.et/export-statistics-2026',
        publishDate: '2026-09-13',
        verified: true,
        credibilityScore: 98,
        snippet: 'Specialty organic volume share expands to 38% of total agricultural outbound trade.'
      }
    ],
    factCheck: {
      score: 97,
      verifiedClaimsCount: 11,
      totalClaimsCount: 11,
      biasRating: 'Neutral',
      riskScore: 'Low',
      checkedAt: '2026-09-20'
    },
    publishedAt: '2026-09-20 18:20',
    createdAt: '2026-09-20 15:45',
    readTimeMinutes: 3,
    featured: false,
    marketImpact: 'positive',
    authorName: 'أماني تاديسي',
    authorNameEn: 'Amani Tadesse',
    authorRole: 'محررة الاقتصاد الزراعي وبورصات السلع',
    authorRoleEn: 'Agricultural Economics & Commodity Exchanges Editor',
    readersCount: 2210,
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'art-012',
    slug: 'senegal-sangomar-gta-gas-exports-sovereign-fund',
    title: 'السنغال تدخل نادي مصدري الغاز الطبيعي المسال عبر حقل "غران تورتو" وصندوق سيادي للأجيال',
    titleEn: 'Senegal Begins Commercial LNG Shipments from Greater Tortue Ahmeyim Field',
    summary: 'تدفقات أولى للغاز المسال من المنصة العائمة (FLNG) على الحدود الموريتانية السنغالية تضخ 700 مليون دولار سنوياً في الميزانية العامة.',
    summaryEn: 'Offshore floating LNG facility off Saint-Louis delivers maiden commercial cargo, anchoring Senegal’s sovereign stabilization fund.',
    content: [
      'بدأت السنغال رسمياً مرحلة التصدير التجاري للغاز الطبيعي المسال من حقل "غران تورتو أحميم" (GTA) المشترك مع موريتانيا، محققة تحولاً كبيراً في توازن مدفوعاتها الخارجية.',
      'تعتمد استراتيجية داكار على توجيه 60% من العائدات الهيدروكربونية نحو صندوق سيادي للأجيال القادمة وتحديث شبكة الكهرباء الوطنية لخفض أسعار الطاقة الصناعية.',
      'وأكد صندوق النقد الدولي أن انطلاق الإنتاج الغازي والنفطي من حقلي سانغومار وGTA سيرفع معدل نمو الاقتصاد السنغالي إلى أكثر من 8.8% في عام 2026.'
    ],
    contentEn: [
      'Senegal and Mauritania celebrated the inaugural commercial LNG liftings from the GTA deepwater floating facility.',
      'Dakar’s sovereign fiscal rule mandates 60% of hydrocarbon windfalls be ringfenced into intergenerational stabilization reserves.',
      'IMF projections indicate dual oil and gas online capacity will propel Senegal’s real GDP expansion above 8.8% in 2026.'
    ],
    category: 'Energy',
    countryCode: 'SN',
    countryName: 'السنغال',
    countryNameEn: 'Senegal',
    status: 'published',
    generationType: 'automated_periodic',
    journalisticType: 'التقرير الإخباري',
    sector: 'أسواق الطاقة والسيادة المالية',
    authorType: 'AI_AGENT',
    aiModel: 'Gemini 1.5 Pro Financial Synthesizer',
    reviewedBy: 'عمر فال (كبير مراسلي غرب أفريقيا الفرانكوفونية)',
    reviewNotes: 'تمت مراجعة عقود الشحن مع شركة بريتيش بتروليوم وبتروسين السنغالية.',
    citations: [
      {
        id: 'cit-sn-1',
        sourceName: 'Petrosen & Ministry of Energy Joint Communiqué',
        url: 'https://petrosen.sn/gta-phase1-commissioning',
        publishDate: '2026-09-09',
        verified: true,
        credibilityScore: 99,
        snippet: 'Maiden commercial cargo certified compliant with international LNG standards.'
      }
    ],
    factCheck: {
      score: 98,
      verifiedClaimsCount: 12,
      totalClaimsCount: 12,
      biasRating: 'Neutral',
      riskScore: 'Low',
      checkedAt: '2026-09-19'
    },
    publishedAt: '2026-09-20 14:00',
    createdAt: '2026-09-20 11:15',
    readTimeMinutes: 3,
    featured: false,
    marketImpact: 'positive',
    authorName: 'عمر فال',
    authorNameEn: 'Oumar Fall',
    authorRole: 'كبير مراسلي غرب أفريقيا والسياسات النقدية',
    authorRoleEn: 'Chief West Africa & Monetary Policy Correspondent',
    readersCount: 2650,
    imageUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=300&q=80'
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
