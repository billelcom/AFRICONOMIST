import { AfricanCountryProfile } from '../types';

export type RankingCriteria = 'power' | 'gdp' | 'population' | 'growth';

/**
 * دالة استخراج الرقم من نص النسبة المئوية مثل "+4.2%" أو "26.4%"
 */
export function parsePercentage(valueStr: string): number {
  if (!valueStr) return 0;
  const cleaned = valueStr.replace(/[^0-9.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * حساب مؤشر القوة الاقتصادية المركب (Composite Economic Power Score)
 * يعتمد على:
 * 1. الناتج المحلي الإجمالي (GDP) بالمليار دولار [الوزن: 60%]
 * 2. معدل النمو الاقتصادي السنوي الحقيقي (Growth %) [الوزن: 20%]
 * 3. الثقل السكاني والقدرة الاستهلاكية (Population) [الوزن: 15%]
 * 4. مؤشر استقرار التضخم والفائدة [الوزن: 5%]
 */
export function calculatePowerScore(country: AfricanCountryProfile): number {
  const gdp = country.gdpNumber || 0;
  const growth = parsePercentage(country.gdpGrowth);
  const pop = country.populationNumber || 0;
  const inflation = parsePercentage(country.inflation);

  // تطبيع GDP (بالمقارنة مع أعلى ناتج في القارة ~400B)
  const gdpNormalized = Math.min(100, (gdp / 410) * 100);

  // تطبيع النمو الاقتصادي (بافتراض نمو بين -2% إلى +12%)
  const growthNormalized = Math.max(0, Math.min(100, ((growth + 2) / 14) * 100));

  // تطبيع السكان (بالمقارنة مع أعلى كتلة سكانية ~230M)
  const popNormalized = Math.min(100, (pop / 230) * 100);

  // مؤشر الاستقرار النقدي (كلما قل التضخم المفرط كان أفضل)
  const stability = Math.max(0, Math.min(100, 100 - (inflation * 1.5)));

  // المجموع الموزون لمؤشر القوة من 100 نقطة
  const totalScore = 
    (gdpNormalized * 0.60) + 
    (growthNormalized * 0.20) + 
    (popNormalized * 0.15) + 
    (stability * 0.05);

  return Math.round(totalScore * 10) / 10;
}

/**
 * إعادة الترتيب الديناميكي التلقائي لكافة الدول وفق الإحصائيات والمعطيات المحدثة
 * ويقوم تلقائياً بتحديث حقول: rank, powerScore, rankChange
 */
export function rankCountriesDynamically(
  countries: AfricanCountryProfile[],
  criteria: RankingCriteria = 'gdp',
  baseRankMap?: Record<string, number>
): AfricanCountryProfile[] {
  // 1. حساب مؤشر القوة لكل دولة
  const enriched = countries.map(country => {
    const score = calculatePowerScore(country);
    return {
      ...country,
      powerScore: score,
    };
  });

  // 2. الفرز حسب المعيار المحدد
  const sorted = [...enriched].sort((a, b) => {
    if (criteria === 'power') {
      return (b.powerScore ?? 0) - (a.powerScore ?? 0);
    }
    if (criteria === 'gdp') {
      return b.gdpNumber - a.gdpNumber;
    }
    if (criteria === 'population') {
      return b.populationNumber - a.populationNumber;
    }
    if (criteria === 'growth') {
      const growthA = parsePercentage(a.gdpGrowth);
      const growthB = parsePercentage(b.gdpGrowth);
      return growthB - growthA;
    }
    return b.gdpNumber - a.gdpNumber;
  });

  // 3. إعادة تعيين الترتيب من 1 إلى N مع احتساب تغير الموقع rankChange
  return sorted.map((country, index) => {
    const newRank = index + 1;
    // الترتيب المرجعي (إما من الخريطة المحفوظة أو الترتيب الأصلي للدولة)
    const originalRank = baseRankMap ? (baseRankMap[country.code] || country.rank) : country.rank;
    // إذا كان originalRank = 5 و newRank = 3، فإن rankChange = +2 (صعود مرتبتين)
    const change = originalRank - newRank;

    return {
      ...country,
      rank: newRank,
      rankChange: change,
    };
  });
}

const STORAGE_KEY = 'bloomberg_africa_countries_v2';

/**
 * حفظ البيانات المحدثة في التخزين المحلي للمتصفح
 */
export function saveCountriesToStorage(countries: AfricanCountryProfile[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(countries));
  } catch (e) {
    console.error('Failed to save updated countries data:', e);
  }
}

/**
 * استرجاع البيانات المحدثة المحفوظة إن وجدت
 */
export function loadCountriesFromStorage(fallback: AfricanCountryProfile[]): AfricanCountryProfile[] {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load countries from storage:', e);
  }
  return fallback;
}
