export interface CurrencyItem {
  code: string;
  nameAr: string;
  nameEn: string;
  symbol: string;
  flag: string;
  country: string;
  category: 'african' | 'global';
  rateToUsd: number;
  change24h: number;
}

export const CURRENCY_LIST: CurrencyItem[] = [
  // African Currencies
  { code: 'DZD', nameAr: 'دينار جزائري', nameEn: 'Algerian Dinar', symbol: 'د.ج', flag: '🇩🇿', country: 'الجزائر', category: 'african', rateToUsd: 133.45, change24h: -0.12 },
  { code: 'EGP', nameAr: 'جنيه مصري', nameEn: 'Egyptian Pound', symbol: 'ج.م', flag: '🇪🇬', country: 'مصر', category: 'african', rateToUsd: 48.45, change24h: -0.15 },
  { code: 'NGN', nameAr: 'نايرا نيجيرية', nameEn: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬', country: 'نيجيريا', category: 'african', rateToUsd: 1535.00, change24h: 0.42 },
  { code: 'ZAR', nameAr: 'راند جنوب أفريقي', nameEn: 'South African Rand', symbol: 'R', flag: '🇿🇦', country: 'جنوب أفريقيا', category: 'african', rateToUsd: 17.82, change24h: -0.30 },
  { code: 'MAD', nameAr: 'درهم مغربي', nameEn: 'Moroccan Dirham', symbol: 'د.م.', flag: '🇲🇦', country: 'المغرب', category: 'african', rateToUsd: 9.88, change24h: -0.05 },
  { code: 'KES', nameAr: 'شلن كيني', nameEn: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪', country: 'كينيا', category: 'african', rateToUsd: 129.20, change24h: 0.10 },
  { code: 'GHS', nameAr: 'سيدي غاني', nameEn: 'Ghanaian Cedi', symbol: 'GH₵', flag: '🇬🇭', country: 'غانا', category: 'african', rateToUsd: 15.90, change24h: -0.22 },
  { code: 'TZS', nameAr: 'شلن تنزاني', nameEn: 'Tanzanian Shilling', symbol: 'TSh', flag: '🇹🇿', country: 'تنزانيا', category: 'african', rateToUsd: 2680.00, change24h: 0.08 },
  { code: 'ETB', nameAr: 'بير إثيوبي', nameEn: 'Ethiopian Birr', symbol: 'Br', flag: '🇪🇹', country: 'إثيوبيا', category: 'african', rateToUsd: 118.50, change24h: -0.65 },
  { code: 'AOA', nameAr: 'كوانزا أنغولي', nameEn: 'Angolan Kwanza', symbol: 'Kz', flag: '🇦🇴', country: 'أنغولا', category: 'african', rateToUsd: 915.00, change24h: 0.18 },
  { code: 'RWF', nameAr: 'فرنك رواندي', nameEn: 'Rwandan Franc', symbol: 'FRw', flag: '🇷🇼', country: 'رواندا', category: 'african', rateToUsd: 1365.00, change24h: 0.05 },
  { code: 'UGX', nameAr: 'شلن أوغندي', nameEn: 'Ugandan Shilling', symbol: 'USh', flag: '🇺🇬', country: 'أوغندا', category: 'african', rateToUsd: 3720.00, change24h: -0.14 },
  { code: 'XOF', nameAr: 'فرنك غرب أفريقيا CFA', nameEn: 'West African CFA Franc', symbol: 'CFA', flag: '🇸🇳', country: 'السنغال / ساحل العاج', category: 'african', rateToUsd: 605.50, change24h: -0.08 },
  { code: 'XAF', nameAr: 'فرنك وسط أفريقيا CFA', nameEn: 'Central African CFA Franc', symbol: 'FCFA', flag: '🇨🇲', country: 'الكاميرون / الغابون', category: 'african', rateToUsd: 605.50, change24h: -0.08 },
  { code: 'TND', nameAr: 'دينار تونسي', nameEn: 'Tunisian Dinar', symbol: 'د.ت', flag: '🇹🇳', country: 'تونس', category: 'african', rateToUsd: 3.08, change24h: 0.03 },
  { code: 'LYD', nameAr: 'دينار ليبي', nameEn: 'Libyan Dinar', symbol: 'د.ل', flag: '🇱🇾', country: 'ليبيا', category: 'african', rateToUsd: 4.80, change24h: -0.02 },
  { code: 'MRU', nameAr: 'أوقية موريتانية', nameEn: 'Mauritanian Ouguiya', symbol: 'UM', flag: '🇲🇷', country: 'موريتانيا', category: 'african', rateToUsd: 39.70, change24h: 0.04 },
  { code: 'SDG', nameAr: 'جنيه سوداني', nameEn: 'Sudanese Pound', symbol: 'ج.س', flag: '🇸🇩', country: 'السودان', category: 'african', rateToUsd: 600.00, change24h: 0.85 },
  { code: 'ZMW', nameAr: 'كواشا زامبي', nameEn: 'Zambian Kwacha', symbol: 'ZK', flag: '🇿🇲', country: 'زامبيا', category: 'african', rateToUsd: 26.40, change24h: -0.28 },
  { code: 'MZN', nameAr: 'متكال موزمبيقي', nameEn: 'Mozambican Metical', symbol: 'MT', flag: '🇲🇿', country: 'موزمبيق', category: 'african', rateToUsd: 63.80, change24h: 0.07 },
  { code: 'BWP', nameAr: 'بولا بوتسواني', nameEn: 'Botswana Pula', symbol: 'P', flag: '🇧🇼', country: 'بوتسوانا', category: 'african', rateToUsd: 13.50, change24h: -0.11 },
  { code: 'NAD', nameAr: 'دولار ناميبي', nameEn: 'Namibian Dollar', symbol: 'N$', flag: '🇳🇦', country: 'ناميبيا', category: 'african', rateToUsd: 17.82, change24h: -0.30 },
  { code: 'MUR', nameAr: 'روبية موريشيوسية', nameEn: 'Mauritian Rupee', symbol: '₨', flag: '🇲🇺', country: 'موريشيوس', category: 'african', rateToUsd: 46.20, change24h: 0.12 },
  { code: 'CDF', nameAr: 'فرنك كونغولي', nameEn: 'Congolese Franc', symbol: 'FC', flag: '🇨🇩', country: 'جمهورية الكونغو', category: 'african', rateToUsd: 2850.00, change24h: 0.35 },
  { code: 'MGA', nameAr: 'أرياري مدغشقري', nameEn: 'Malagasy Ariary', symbol: 'Ar', flag: '🇲🇬', country: 'مدغشقر', category: 'african', rateToUsd: 4580.00, change24h: 0.19 },
  { code: 'GMD', nameAr: 'دالاسي غامبي', nameEn: 'Gambian Dalasi', symbol: 'D', flag: '🇬🇲', country: 'غامبيا', category: 'african', rateToUsd: 70.50, change24h: 0.10 },
  { code: 'GNF', nameAr: 'فرنك غيني', nameEn: 'Guinean Franc', symbol: 'FG', flag: '🇬🇳', country: 'غينيا', category: 'african', rateToUsd: 8650.00, change24h: -0.05 },
  { code: 'ZWL', nameAr: 'عملة زيمبابوي الذهبية ZiG', nameEn: 'Zimbabwe Gold ZiG', symbol: 'ZiG', flag: '🇿🇼', country: 'زيمبابوي', category: 'african', rateToUsd: 13.90, change24h: -0.45 },

  // Global Currencies
  { code: 'USD', nameAr: 'دولار أمريكي', nameEn: 'US Dollar', symbol: '$', flag: '🇺🇸', country: 'الولايات المتحدة', category: 'global', rateToUsd: 1.00, change24h: 0.00 },
  { code: 'EUR', nameAr: 'يورو أوروبي', nameEn: 'Euro', symbol: '€', flag: '🇪🇺', country: 'الاتحاد الأوروبي', category: 'global', rateToUsd: 0.924, change24h: 0.15 },
  { code: 'GBP', nameAr: 'جنيه إسترليني', nameEn: 'British Pound', symbol: '£', flag: '🇬🇧', country: 'المملكة المتحدة', category: 'global', rateToUsd: 0.778, change24h: 0.08 },
  { code: 'CNY', nameAr: 'يوان صيني', nameEn: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', country: 'الصين', category: 'global', rateToUsd: 7.125, change24h: -0.06 },
  { code: 'JPY', nameAr: 'ين ياباني', nameEn: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', country: 'اليابان', category: 'global', rateToUsd: 148.50, change24h: -0.45 },
  { code: 'SAR', nameAr: 'ريال سعودي', nameEn: 'Saudi Riyal', symbol: 'ر.س', flag: '🇸🇦', country: 'السعودية', category: 'global', rateToUsd: 3.751, change24h: 0.01 },
  { code: 'AED', nameAr: 'درهم إماراتي', nameEn: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪', country: 'الإمارات', category: 'global', rateToUsd: 3.673, change24h: 0.00 },
  { code: 'QAR', nameAr: 'ريال قطري', nameEn: 'Qatari Riyal', symbol: 'ر.ق', flag: '🇶🇦', country: 'قطر', category: 'global', rateToUsd: 3.641, change24h: 0.00 },
  { code: 'KWD', nameAr: 'دينار كويتي', nameEn: 'Kuwaiti Dinar', symbol: 'د.ك', flag: '🇰🇼', country: 'الكويت', category: 'global', rateToUsd: 0.307, change24h: -0.02 },
  { code: 'CHF', nameAr: 'فرنك سويسري', nameEn: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', country: 'سويسرا', category: 'global', rateToUsd: 0.862, change24h: -0.12 },
  { code: 'CAD', nameAr: 'دولار كندي', nameEn: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦', country: 'كندا', category: 'global', rateToUsd: 1.362, change24h: 0.10 },
  { code: 'TRY', nameAr: 'ليرة تركية', nameEn: 'Turkish Lira', symbol: '₺', flag: '🇹🇷', country: 'تركيا', category: 'global', rateToUsd: 34.15, change24h: 0.35 }
];

export const CURRENCY_MAP: Record<string, CurrencyItem> = CURRENCY_LIST.reduce((acc, c) => {
  acc[c.code] = c;
  return acc;
}, {} as Record<string, CurrencyItem>);

export function convertCurrencies(fromCode: string, toCode: string, amount: number) {
  const from = CURRENCY_MAP[fromCode.toUpperCase()] || CURRENCY_MAP['USD'];
  const to = CURRENCY_MAP[toCode.toUpperCase()] || CURRENCY_MAP['DZD'];

  const rate = to.rateToUsd / from.rateToUsd;
  const inverseRate = from.rateToUsd / to.rateToUsd;
  const result = amount * rate;

  return {
    from,
    to,
    amount,
    rate,
    inverseRate,
    result
  };
}

export async function fetchLiveConversion(from: string, to: string, amount: number) {
  try {
    const res = await fetch(`/api/forex?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&amount=${amount}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Live forex fetch fallback to local:', err);
  }

  // Fallback to local high-precision calculation
  const calc = convertCurrencies(from, to, amount);
  return {
    success: true,
    from: calc.from,
    to: calc.to,
    amount,
    convertedAmount: Number(calc.result.toFixed(4)),
    rate: Number(calc.rate.toFixed(6)),
    inverseRate: Number(calc.inverseRate.toFixed(6)),
    pair: `${from}/${to}`,
    timestamp: new Date().toISOString()
  };
}
