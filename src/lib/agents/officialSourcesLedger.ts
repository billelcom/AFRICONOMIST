// src/lib/agents/officialSourcesLedger.ts
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * سجل المصادر والمؤسسات الرسمية الإفريقية المعتمدة (African Official Sources Grounding Ledger)
 * يوفر بيانات دقيقة للبنوك المركزية، البورصات الوطنية، والمؤسسات التمويلية القارية
 * لتدريب وتوجيه وكيل التنقيب والجمع (Scout Agent) ومنع أي هلوسة في الأرقام الاقتصادية.
 */

export interface OfficialSourceEntry {
  id: string;
  countryCode: string;
  countryNameAr: string;
  countryNameEn: string;
  institutionType: 'central_bank' | 'stock_exchange' | 'ministry_finance' | 'continental_body' | 'sector_regulator';
  institutionNameAr: string;
  institutionNameEn: string;
  url: string;
  feedPortal: string;
  currencySymbol?: string;
  credibilityScore: number; // 90 - 100
  keyIndicatorsProvided: string[];
}

// -----------------------------------------------------------------------------
// 1. المؤسسات المالية والتنموية القارية والإقليمية المشتركة (Pan-African Institutions)
// -----------------------------------------------------------------------------
export const CONTINENTAL_OFFICIAL_SOURCES: OfficialSourceEntry[] = [
  {
    id: 'afdb_org',
    countryCode: 'PAN_AFRICA',
    countryNameAr: 'عموم إفريقيا',
    countryNameEn: 'Pan-Africa',
    institutionType: 'continental_body',
    institutionNameAr: 'البنك الإفريقي للتنمية (AfDB)',
    institutionNameEn: 'African Development Bank Group',
    url: 'https://www.afdb.org',
    feedPortal: 'https://www.afdb.org/en/news-and-events',
    credibilityScore: 99,
    keyIndicatorsProvided: ['African Economic Outlook', 'Sovereign Financing', 'Infrastructure Debt', 'Feed Africa Index']
  },
  {
    id: 'afreximbank_org',
    countryCode: 'PAN_AFRICA',
    countryNameAr: 'عموم إفريقيا',
    countryNameEn: 'Pan-Africa',
    institutionType: 'continental_body',
    institutionNameAr: 'بنك التصدير والاستيراد الإفريقي (Afreximbank)',
    institutionNameEn: 'African Export-Import Bank',
    url: 'https://www.afreximbank.com',
    feedPortal: 'https://www.afreximbank.com/news-media',
    credibilityScore: 99,
    keyIndicatorsProvided: ['Intra-African Trade Data', 'PAPSS Settlement Volume', 'Trade Finance Facilities']
  },
  {
    id: 'afcfta_sec',
    countryCode: 'PAN_AFRICA',
    countryNameAr: 'عموم إفريقيا',
    countryNameEn: 'Pan-Africa',
    institutionType: 'continental_body',
    institutionNameAr: 'أمانة منطقة التجارة الحرة القارية الإفريقية (AfCFTA)',
    institutionNameEn: 'AfCFTA Secretariat',
    url: 'https://au-afcfta.org',
    feedPortal: 'https://au-afcfta.org/press-releases',
    credibilityScore: 99,
    keyIndicatorsProvided: ['Rules of Origin Compliance', 'Tariff Dismantling Schedules', 'Trade Corridor Metrics']
  },
  {
    id: 'uneca_org',
    countryCode: 'PAN_AFRICA',
    countryNameAr: 'عموم إفريقيا',
    countryNameEn: 'Pan-Africa',
    institutionType: 'continental_body',
    institutionNameAr: 'اللجنة الاقتصادية لإفريقيا التابعة للأمم المتحدة (UNECA)',
    institutionNameEn: 'United Nations Economic Commission for Africa',
    url: 'https://www.uneca.org',
    feedPortal: 'https://www.uneca.org/stories',
    credibilityScore: 98,
    keyIndicatorsProvided: ['Macroeconomic Statistics', 'Debt Sustainability Reports', 'Climate Finance Metrics']
  },
  {
    id: 'bceao_regional',
    countryCode: 'WAEMU',
    countryNameAr: 'دول غرب إفريقيا (UEMOA)',
    countryNameEn: 'West African Monetary Union (WAEMU)',
    institutionType: 'central_bank',
    institutionNameAr: 'البنك المركزي لدول غرب إفريقيا (BCEAO)',
    institutionNameEn: 'Central Bank of West African States',
    url: 'https://www.bceao.int',
    feedPortal: 'https://www.bceao.int/fr/actualites',
    currencySymbol: 'XOF',
    credibilityScore: 99,
    keyIndicatorsProvided: ['Direct Lending Rate', 'WAEMU Inflation Index', 'Foreign Reserves Pool']
  },
  {
    id: 'beac_regional',
    countryCode: 'CEMAC',
    countryNameAr: 'دول وسط إفريقيا (CEMAC)',
    countryNameEn: 'Central African Economic & Monetary Community (CEMAC)',
    institutionType: 'central_bank',
    institutionNameAr: 'بنك دول وسط إفريقيا (BEAC)',
    institutionNameEn: 'Bank of Central African States',
    url: 'https://www.beac.int',
    feedPortal: 'https://www.beac.int/communiques-de-presse',
    currencySymbol: 'XAF',
    credibilityScore: 99,
    keyIndicatorsProvided: ['CEMAC Key Policy Rate', 'Petroleum Sovereign Reserves', 'Money Supply Growth']
  },
  {
    id: 'brvm_exchange',
    countryCode: 'WAEMU',
    countryNameAr: 'غرب إفريقيا (أبيدجان)',
    countryNameEn: 'Regional West Africa (BRVM)',
    institutionType: 'stock_exchange',
    institutionNameAr: 'البورصة الإقليمية للقيم المنقولة (BRVM)',
    institutionNameEn: 'Bourse Régionale des Valeurs Mobilières',
    url: 'https://www.brvm.org',
    feedPortal: 'https://www.brvm.org/fr/bulletins-officiels',
    currencySymbol: 'XOF',
    credibilityScore: 98,
    keyIndicatorsProvided: ['BRVM Composite Index', 'Bond Market Capitalization', 'Daily Trading Volume']
  }
];

// -----------------------------------------------------------------------------
// 2. سجل البنوك المركزية والبورصات الوطنية لبلدان القارة (National Sovereign Portals)
// -----------------------------------------------------------------------------
export const NATIONAL_OFFICIAL_SOURCES: OfficialSourceEntry[] = [
  // مصر
  {
    id: 'cbe_eg',
    countryCode: 'EG',
    countryNameAr: 'مصر',
    countryNameEn: 'Egypt',
    institutionType: 'central_bank',
    institutionNameAr: 'البنك المركزي المصري (CBE)',
    institutionNameEn: 'Central Bank of Egypt',
    url: 'https://www.cbe.org.eg',
    feedPortal: 'https://www.cbe.org.eg/en/news',
    currencySymbol: 'EGP',
    credibilityScore: 99,
    keyIndicatorsProvided: ['Overnight Deposit Rate', 'Net International Reserves', 'Core Inflation %', 'T-Bill Yields']
  },
  {
    id: 'egx_exchange',
    countryCode: 'EG',
    countryNameAr: 'مصر',
    countryNameEn: 'Egypt',
    institutionType: 'stock_exchange',
    institutionNameAr: 'البورصة المصرية (EGX)',
    institutionNameEn: 'The Egyptian Exchange',
    url: 'https://www.egx.com.eg',
    feedPortal: 'https://www.egx.com.eg/en/News.aspx',
    currencySymbol: 'EGP',
    credibilityScore: 98,
    keyIndicatorsProvided: ['EGX30 Index', 'Market Cap EGP', 'Foreign Ownership Flow']
  },

  // جنوب إفريقيا
  {
    id: 'sarb_za',
    countryCode: 'ZA',
    countryNameAr: 'جنوب أفريقيا',
    countryNameEn: 'South Africa',
    institutionType: 'central_bank',
    institutionNameAr: 'بنك الاحتياطي الجنوب إفريقي (SARB)',
    institutionNameEn: 'South African Reserve Bank',
    url: 'https://www.resbank.co.za',
    feedPortal: 'https://www.resbank.co.za/en/home/publications/statements',
    currencySymbol: 'ZAR',
    credibilityScore: 99,
    keyIndicatorsProvided: ['Repo Rate %', 'Headline CPI %', 'Gold & Foreign FX Reserves', 'Quarterly Bulletin']
  },
  {
    id: 'jse_exchange',
    countryCode: 'ZA',
    countryNameAr: 'جنوب أفريقيا',
    countryNameEn: 'South Africa',
    institutionType: 'stock_exchange',
    institutionNameAr: 'بورصة جوهانسبرغ (JSE)',
    institutionNameEn: 'Johannesburg Stock Exchange',
    url: 'https://www.jse.co.za',
    feedPortal: 'https://www.jse.co.za/news',
    currencySymbol: 'ZAR',
    credibilityScore: 99,
    keyIndicatorsProvided: ['JSE All Share Index', 'Resource 10 Index', 'Sovereign Bond Yield Curves']
  },

  // نيجيريا
  {
    id: 'cbn_ng',
    countryCode: 'NG',
    countryNameAr: 'نيجيريا',
    countryNameEn: 'Nigeria',
    institutionType: 'central_bank',
    institutionNameAr: 'البنك المركزي النيجيري (CBN)',
    institutionNameEn: 'Central Bank of Nigeria',
    url: 'https://www.cbn.gov.ng',
    feedPortal: 'https://www.cbn.gov.ng/Documents/pressreleases.asp',
    currencySymbol: 'NGN',
    credibilityScore: 99,
    keyIndicatorsProvided: ['Monetary Policy Rate (MPR)', 'Official NAFEM FX Rate', 'Cash Reserve Ratio (CRR)']
  },
  {
    id: 'ngx_exchange',
    countryCode: 'NG',
    countryNameAr: 'نيجيريا',
    countryNameEn: 'Nigeria',
    institutionType: 'stock_exchange',
    institutionNameAr: 'البورصة النيجيرية (NGX)',
    institutionNameEn: 'Nigerian Exchange Group',
    url: 'https://ngxgroup.com',
    feedPortal: 'https://ngxgroup.com/news',
    currencySymbol: 'NGN',
    credibilityScore: 98,
    keyIndicatorsProvided: ['NGX All-Share Index (ASI)', 'Equities Turnover', 'Domestic vs Foreign Participation']
  },

  // المغرب
  {
    id: 'bkam_ma',
    countryCode: 'MA',
    countryNameAr: 'المغرب',
    countryNameEn: 'Morocco',
    institutionType: 'central_bank',
    institutionNameAr: 'بنك المغرب (Bank Al-Maghrib)',
    institutionNameEn: 'Bank Al-Maghrib',
    url: 'https://www.bkam.ma',
    feedPortal: 'https://www.bkam.ma/Actualites',
    currencySymbol: 'MAD',
    credibilityScore: 99,
    keyIndicatorsProvided: ['Taux Directeur', 'Official Reserve Assets', 'Monetary Policy Report']
  },
  {
    id: 'casablanca_exchange',
    countryCode: 'MA',
    countryNameAr: 'المغرب',
    countryNameEn: 'Morocco',
    institutionType: 'stock_exchange',
    institutionNameAr: 'بورصة الدار البيضاء (Casablanca SE)',
    institutionNameEn: 'Casablanca Stock Exchange',
    url: 'https://www.casablanca-bourse.com',
    feedPortal: 'https://www.casablanca-bourse.com/actualites',
    currencySymbol: 'MAD',
    credibilityScore: 98,
    keyIndicatorsProvided: ['MASI Index', 'Market Cap MAD', 'Sectoral Sub-indices']
  },

  // الجزائر
  {
    id: 'bank_algeria',
    countryCode: 'DZ',
    countryNameAr: 'الجزائر',
    countryNameEn: 'Algeria',
    institutionType: 'central_bank',
    institutionNameAr: 'بنك الجزائر (Bank of Algeria)',
    institutionNameEn: 'Bank of Algeria',
    url: 'https://www.bank-of-algeria.dz',
    feedPortal: 'https://www.bank-of-algeria.dz/publications-et-statistiques',
    currencySymbol: 'DZD',
    credibilityScore: 99,
    keyIndicatorsProvided: ['Taux Directeur', 'Foreign Exchange Reserves', 'Hydrocarbon Export Balance']
  },

  // كينيا
  {
    id: 'cbk_ke',
    countryCode: 'KE',
    countryNameAr: 'كينيا',
    countryNameEn: 'Kenya',
    institutionType: 'central_bank',
    institutionNameAr: 'البنك المركزي الكيني (CBK)',
    institutionNameEn: 'Central Bank of Kenya',
    url: 'https://www.centralbank.go.ke',
    feedPortal: 'https://www.centralbank.go.ke/press-releases',
    currencySymbol: 'KES',
    credibilityScore: 99,
    keyIndicatorsProvided: ['Central Bank Rate (CBR)', 'Usable FX Reserves (Months of Import)', 'Weekly Bulletin']
  },
  {
    id: 'nse_kenya',
    countryCode: 'KE',
    countryNameAr: 'كينيا',
    countryNameEn: 'Kenya',
    institutionType: 'stock_exchange',
    institutionNameAr: 'بورصة نيروبي للأوراق المالية (NSE)',
    institutionNameEn: 'Nairobi Securities Exchange',
    url: 'https://www.nse.co.ke',
    feedPortal: 'https://www.nse.co.ke/media-center',
    currencySymbol: 'KES',
    credibilityScore: 98,
    keyIndicatorsProvided: ['NSE 20 Share Index', 'NASI', 'Foreign Investor Net Trading']
  },

  // غانا
  {
    id: 'bog_gh',
    countryCode: 'GH',
    countryNameAr: 'غانا',
    countryNameEn: 'Ghana',
    institutionType: 'central_bank',
    institutionNameAr: 'بنك غانا المركزي (Bank of Ghana)',
    institutionNameEn: 'Bank of Ghana',
    url: 'https://www.bog.gov.gh',
    feedPortal: 'https://www.bog.gov.gh/news',
    currencySymbol: 'GHS',
    credibilityScore: 99,
    keyIndicatorsProvided: ['Monetary Policy Rate', 'Gold Purchase Programme', 'Gross International Reserves']
  },

  // أنغولا
  {
    id: 'bna_ao',
    countryCode: 'AO',
    countryNameAr: 'أنغولا',
    countryNameEn: 'Angola',
    institutionType: 'central_bank',
    institutionNameAr: 'بنك أنغولا الوطني (BNA)',
    institutionNameEn: 'National Bank of Angola',
    url: 'https://www.bna.ao',
    feedPortal: 'https://www.bna.ao/comunicados',
    currencySymbol: 'AOA',
    credibilityScore: 99,
    keyIndicatorsProvided: ['Taxa BNA', 'Net International Reserves', 'Oil Sovereign Revenue Account']
  },

  // إثيوبيا
  {
    id: 'nbe_et',
    countryCode: 'ET',
    countryNameAr: 'إثيوبيا',
    countryNameEn: 'Ethiopia',
    institutionType: 'central_bank',
    institutionNameAr: 'البنك الوطني الإثيوبي (NBE)',
    institutionNameEn: 'National Bank of Ethiopia',
    url: 'https://nbe.gov.et',
    feedPortal: 'https://nbe.gov.et/media',
    currencySymbol: 'ETB',
    credibilityScore: 98,
    keyIndicatorsProvided: ['Policy Interest Rate', 'FX Market Reform Tenders', 'Coffee Export Receipts']
  },

  // تونس
  {
    id: 'bct_tn',
    countryCode: 'TN',
    countryNameAr: 'تونس',
    countryNameEn: 'Tunisia',
    institutionType: 'central_bank',
    institutionNameAr: 'البنك المركزي التونسي (BCT)',
    institutionNameEn: 'Central Bank of Tunisia',
    url: 'https://www.bct.gov.tn',
    feedPortal: 'https://www.bct.gov.tn/bct/siteprod/actualites.jsp',
    currencySymbol: 'TND',
    credibilityScore: 99,
    keyIndicatorsProvided: ['Taux Directeur BCT', 'Avoirs Nets en Devises (Jours)', 'TMM Rate']
  },

  // رواندا
  {
    id: 'bnr_rw',
    countryCode: 'RW',
    countryNameAr: 'رواندا',
    countryNameEn: 'Rwanda',
    institutionType: 'central_bank',
    institutionNameAr: 'البنك الوطني الرواندي (BNR)',
    institutionNameEn: 'National Bank of Rwanda',
    url: 'https://www.bnr.rw',
    feedPortal: 'https://www.bnr.rw/news-media',
    currencySymbol: 'RWF',
    credibilityScore: 99,
    keyIndicatorsProvided: ['Central Bank Rate (CBR)', 'Financial Sector Stability Index', 'Kigali Financial Centre Flow']
  }
];

// دمج السجلات في قائمة موحدة للبحث
export const ALL_OFFICIAL_GROUNDING_SOURCES = [
  ...CONTINENTAL_OFFICIAL_SOURCES,
  ...NATIONAL_OFFICIAL_SOURCES
];

/**
 * استخراج المؤسسات الرسمية لدولة معينة
 */
export function getOfficialSourcesForCountry(countryCodeOrName: string): OfficialSourceEntry[] {
  const query = (countryCodeOrName || '').toLowerCase().trim();
  
  const matches = NATIONAL_OFFICIAL_SOURCES.filter(s => 
    s.countryCode.toLowerCase() === query || 
    s.countryNameAr.includes(countryCodeOrName) || 
    s.countryNameEn.toLowerCase().includes(query)
  );

  // إذا كانت دولة ضمن التكتلات الإقليمية نرفق البنك المركزي الإقليمي
  const regionalMatches = CONTINENTAL_OFFICIAL_SOURCES.filter(s => 
    s.countryCode === 'PAN_AFRICA' || s.countryCode.toLowerCase() === query
  );

  return matches.length > 0 ? [...matches, ...regionalMatches.slice(0, 2)] : CONTINENTAL_OFFICIAL_SOURCES.slice(0, 3);
}

/**
 * حل وتعيين المصادر الأساسية الرسمية لتقرير صحفي بناءً على الدولة والقطاع
 */
export function resolveOfficialPrimarySources(params: {
  countryCode?: string;
  countryName?: string;
  sectorId?: string;
}): {
  primarySource: OfficialSourceEntry;
  secondarySources: OfficialSourceEntry[];
  citationsArray: {
    id: string;
    sourceName: string;
    url: string;
    publishDate: string;
    verified: boolean;
    credibilityScore: number;
    snippet: string;
  }[];
} {
  const countrySources = getOfficialSourcesForCountry(params.countryCode || params.countryName || 'PAN_AFRICA');
  const primary = countrySources[0] || CONTINENTAL_OFFICIAL_SOURCES[0];
  const secondaries = countrySources.slice(1, 4);

  const todayStr = new Date().toISOString().split('T')[0];

  const citationsArray = [
    {
      id: `cit-gov-primary-${Date.now()}`,
      sourceName: primary.institutionNameAr,
      url: primary.url,
      publishDate: todayStr,
      verified: true,
      credibilityScore: primary.credibilityScore,
      snippet: `البيان الرسمي والبيانات الإحصائية لمؤشرات (${primary.keyIndicatorsProvided.slice(0, 2).join(' و ')}) - ${primary.institutionNameEn}`
    },
    ...secondaries.map((sec, idx) => ({
      id: `cit-gov-sec-${idx}-${Date.now()}`,
      sourceName: sec.institutionNameAr,
      url: sec.url,
      publishDate: todayStr,
      verified: true,
      credibilityScore: sec.credibilityScore,
      snippet: `الإفصاحات الدورية وتقارير الاستقرار المالي (${sec.keyIndicatorsProvided[0] || 'Official Market Indicators'})`
    }))
  ];

  return {
    primarySource: primary,
    secondarySources: secondaries,
    citationsArray
  };
}
