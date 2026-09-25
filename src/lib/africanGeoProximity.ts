// src/lib/africanGeoProximity.ts
// خوارزمية تحديد الموقع الجغرافي وترتيب الدول الأفريقية بحسب الدولة الحالية ودول الجوار والأقرب فالأقرب
import { AfricanCountryProfile } from '../types';

export interface CountryGeoCoord {
  lat: number;
  lng: number;
  neighbors: string[]; // رموز الدول المجاورة براً وبحراً
  flag: string;
}

export const AFRICAN_GEO_DATA: Record<string, CountryGeoCoord> = {
  DZ: { lat: 28.0339, lng: 1.6596, neighbors: ['TN', 'LY', 'NE', 'ML', 'MR', 'MA'], flag: '🇩🇿' },
  TN: { lat: 33.8869, lng: 9.5375, neighbors: ['DZ', 'LY'], flag: '🇹🇳' },
  LY: { lat: 26.3351, lng: 17.2283, neighbors: ['TN', 'DZ', 'NE', 'TD', 'SD', 'EG'], flag: '🇱🇾' },
  EG: { lat: 26.8206, lng: 30.8025, neighbors: ['LY', 'SD'], flag: '🇪🇬' },
  SD: { lat: 12.8628, lng: 30.2176, neighbors: ['EG', 'LY', 'TD', 'CF', 'SS', 'ET', 'ER'], flag: '🇸🇩' },
  SS: { lat: 6.8770, lng: 31.3070, neighbors: ['SD', 'CF', 'CD', 'UG', 'KE', 'ET'], flag: '🇸🇸' },
  ET: { lat: 9.1450, lng: 40.4897, neighbors: ['ER', 'DJ', 'SO', 'KE', 'SS', 'SD'], flag: '🇪🇹' },
  ER: { lat: 15.1794, lng: 39.7823, neighbors: ['SD', 'ET', 'DJ'], flag: '🇪🇷' },
  DJ: { lat: 11.8251, lng: 42.5903, neighbors: ['ER', 'ET', 'SO'], flag: '🇩🇯' },
  SO: { lat: 5.1521, lng: 46.1996, neighbors: ['DJ', 'ET', 'KE'], flag: '🇸🇴' },
  KE: { lat: -0.0236, lng: 37.9062, neighbors: ['ET', 'SS', 'UG', 'TZ', 'SO'], flag: '🇰🇪' },
  UG: { lat: 1.3733, lng: 32.2903, neighbors: ['SS', 'CD', 'RW', 'TZ', 'KE'], flag: '🇺🇬' },
  TZ: { lat: -6.3690, lng: 34.8888, neighbors: ['KE', 'UG', 'RW', 'BI', 'CD', 'ZM', 'MW', 'MZ'], flag: '🇹🇿' },
  RW: { lat: -1.9403, lng: 29.8739, neighbors: ['UG', 'CD', 'BI', 'TZ'], flag: '🇷🇼' },
  BI: { lat: -3.3731, lng: 29.9189, neighbors: ['RW', 'CD', 'TZ'], flag: '🇧🇮' },
  CD: { lat: -4.0383, lng: 21.7587, neighbors: ['CG', 'CF', 'SS', 'UG', 'RW', 'BI', 'TZ', 'ZM', 'AO'], flag: '🇨🇩' },
  CG: { lat: -0.2280, lng: 15.8277, neighbors: ['GA', 'CM', 'CF', 'CD', 'AO'], flag: '🇨🇬' },
  GA: { lat: -0.8037, lng: 11.6094, neighbors: ['GQ', 'CM', 'CG'], flag: '🇬🇦' },
  GQ: { lat: 1.6508, lng: 10.2679, neighbors: ['CM', 'GA'], flag: '🇬🇶' },
  CM: { lat: 7.3697, lng: 12.3547, neighbors: ['NG', 'TD', 'CF', 'CG', 'GA', 'GQ'], flag: '🇨🇲' },
  CF: { lat: 6.6111, lng: 20.9394, neighbors: ['TD', 'SD', 'SS', 'CD', 'CG', 'CM'], flag: '🇨🇫' },
  TD: { lat: 15.4542, lng: 18.7322, neighbors: ['LY', 'SD', 'CF', 'CM', 'NG', 'NE'], flag: '🇹🇩' },
  NE: { lat: 17.6078, lng: 8.0817, neighbors: ['DZ', 'LY', 'TD', 'NG', 'BJ', 'BF', 'ML'], flag: '🇳🇪' },
  NG: { lat: 9.0820, lng: 8.6753, neighbors: ['NE', 'TD', 'CM', 'BJ'], flag: '🇳🇬' },
  BJ: { lat: 9.3077, lng: 2.3158, neighbors: ['TG', 'BF', 'NE', 'NG'], flag: '🇧🇯' },
  TG: { lat: 8.6195, lng: 0.8248, neighbors: ['GH', 'BF', 'BJ'], flag: '🇹🇬' },
  GH: { lat: 7.9465, lng: -1.0232, neighbors: ['CI', 'BF', 'TG'], flag: '🇬🇭' },
  CI: { lat: 7.5400, lng: -5.5471, neighbors: ['LR', 'GN', 'ML', 'BF', 'GH'], flag: '🇨🇮' },
  BF: { lat: 12.2383, lng: -1.5616, neighbors: ['ML', 'NE', 'BJ', 'TG', 'GH', 'CI'], flag: '🇧🇫' },
  ML: { lat: 17.5707, lng: -3.9962, neighbors: ['DZ', 'NE', 'BF', 'CI', 'GN', 'SN', 'MR'], flag: '🇲🇱' },
  MR: { lat: 21.0079, lng: -10.9408, neighbors: ['DZ', 'ML', 'SN', 'MA'], flag: '🇲🇷' },
  MA: { lat: 31.7917, lng: -7.0926, neighbors: ['DZ', 'MR'], flag: '🇲🇦' },
  SN: { lat: 14.4974, lng: -14.4524, neighbors: ['MR', 'ML', 'GN', 'GW', 'GM'], flag: '🇸🇳' },
  GM: { lat: 13.4432, lng: -15.3101, neighbors: ['SN'], flag: '🇬🇲' },
  GW: { lat: 11.8037, lng: -15.1804, neighbors: ['SN', 'GN'], flag: '🇬🇼' },
  GN: { lat: 9.9456, lng: -9.6966, neighbors: ['GW', 'SN', 'ML', 'CI', 'LR', 'SL'], flag: '🇬🇳' },
  SL: { lat: 8.4606, lng: -11.7799, neighbors: ['GN', 'LR'], flag: '🇸🇱' },
  LR: { lat: 6.4281, lng: -9.4295, neighbors: ['SL', 'GN', 'CI'], flag: '🇱🇷' },
  AO: { lat: -11.2027, lng: 17.8739, neighbors: ['CG', 'CD', 'ZM', 'NA'], flag: '🇦🇴' },
  NA: { lat: -22.9576, lng: 18.4904, neighbors: ['AO', 'ZM', 'BW', 'ZA'], flag: '🇳🇦' },
  BW: { lat: -22.3285, lng: 24.6849, neighbors: ['NA', 'ZM', 'ZW', 'ZA'], flag: '🇧🇼' },
  ZW: { lat: -19.0154, lng: 29.1549, neighbors: ['ZM', 'MZ', 'ZA', 'BW'], flag: '🇿🇼' },
  ZM: { lat: -13.1339, lng: 27.8493, neighbors: ['CD', 'TZ', 'MW', 'MZ', 'ZW', 'BW', 'NA', 'AO'], flag: '🇿🇲' },
  MW: { lat: -13.2543, lng: 34.3015, neighbors: ['TZ', 'MZ', 'ZM'], flag: '🇲🇼' },
  MZ: { lat: -18.6657, lng: 35.5296, neighbors: ['TZ', 'MW', 'ZM', 'ZW', 'ZA', 'SZ'], flag: '🇲🇿' },
  SZ: { lat: -26.5225, lng: 31.4659, neighbors: ['MZ', 'ZA'], flag: '🇸🇿' },
  LS: { lat: -29.6100, lng: 28.2336, neighbors: ['ZA'], flag: '🇱🇸' },
  ZA: { lat: -30.5595, lng: 22.9375, neighbors: ['NA', 'BW', 'ZW', 'MZ', 'SZ', 'LS'], flag: '🇿🇦' },
  MG: { lat: -18.7669, lng: 46.8691, neighbors: ['MZ', 'KM', 'MU', 'SC'], flag: '🇲🇬' },
  MU: { lat: -20.3484, lng: 57.5522, neighbors: ['MG', 'SC', 'KM'], flag: '🇲🇺' },
  SC: { lat: -4.6796, lng: 55.4920, neighbors: ['KM', 'MG', 'MU', 'KE', 'TZ'], flag: '🇸🇨' },
  KM: { lat: -11.8753, lng: 43.8722, neighbors: ['MZ', 'MG', 'TZ', 'SC'], flag: '🇰🇲' },
  CV: { lat: 16.5388, lng: -23.0418, neighbors: ['SN', 'MR', 'GM', 'GW'], flag: '🇨🇻' },
  ST: { lat: 0.1864, lng: 6.6131, neighbors: ['GA', 'GQ', 'CM', 'NG'], flag: '🇸🇹' }
};

// خريطة النطاقات الزمنية الأفريقية لمطابقة دولة المستخدم بدقة فائقة
export const TIMEZONE_TO_COUNTRY_MAP: Record<string, string> = {
  'Africa/Algiers': 'DZ',
  'Africa/Cairo': 'EG',
  'Africa/Tunis': 'TN',
  'Africa/Tripoli': 'LY',
  'Africa/Casablanca': 'MA',
  'Africa/El_Aaiun': 'MA',
  'Africa/Nouakchott': 'MR',
  'Africa/Bamako': 'ML',
  'Africa/Niamey': 'NE',
  'Africa/Ndjamena': 'TD',
  'Africa/Khartoum': 'SD',
  'Africa/Juba': 'SS',
  'Africa/Addis_Ababa': 'ET',
  'Africa/Asmara': 'ER',
  'Africa/Djibouti': 'DJ',
  'Africa/Mogadishu': 'SO',
  'Africa/Nairobi': 'KE',
  'Africa/Kampala': 'UG',
  'Africa/Dar_es_Salaam': 'TZ',
  'Africa/Kigali': 'RW',
  'Africa/Bujumbura': 'BI',
  'Africa/Kinshasa': 'CD',
  'Africa/Lubumbashi': 'CD',
  'Africa/Brazzaville': 'CG',
  'Africa/Bangui': 'CF',
  'Africa/Yaounde': 'CM',
  'Africa/Libreville': 'GA',
  'Africa/Malabo': 'GQ',
  'Africa/Lagos': 'NG',
  'Africa/Porto-Novo': 'BJ',
  'Africa/Lome': 'TG',
  'Africa/Accra': 'GH',
  'Africa/Abidjan': 'CI',
  'Africa/Ouagadougou': 'BF',
  'Africa/Monrovia': 'LR',
  'Africa/Freetown': 'SL',
  'Africa/Conakry': 'GN',
  'Africa/Bissau': 'GW',
  'Africa/Banjul': 'GM',
  'Africa/Dakar': 'SN',
  'Africa/Luanda': 'AO',
  'Africa/Windhoek': 'NA',
  'Africa/Gaborone': 'BW',
  'Africa/Harare': 'ZW',
  'Africa/Lusaka': 'ZM',
  'Africa/Blantyre': 'MW',
  'Africa/Lilongwe': 'MW',
  'Africa/Maputo': 'MZ',
  'Africa/Mbabane': 'SZ',
  'Africa/Maseru': 'LS',
  'Africa/Johannesburg': 'ZA',
  'Indian/Antananarivo': 'MG',
  'Indian/Mauritius': 'MU',
  'Indian/Mahe': 'SC',
  'Indian/Comoro': 'KM',
  'Atlantic/Cape_Verde': 'CV',
  'Africa/Sao_Tome': 'ST'
};

// احتساب المسافة الجغرافية (Haversine formula) بالكيلومتر بين نقطتين
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // نصف قطر الأرض بالكيلومتر
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * تحديد دولة المستخدم الحالية بناءً على النطاق الزمني للمتصفح، لغة النظام، أو التفضيل المحفوظ
 */
export function detectUserAfricanCountry(): string | null {
  if (typeof window === 'undefined') return 'DZ'; // الافتراضي للخادم (مطابق للجزائر)

  try {
    // 1. فحص التفضيل اليدوي المحفوظ
    const saved = localStorage.getItem('africonomist_detected_country');
    if (saved && (saved === 'INTERNATIONAL' || AFRICAN_GEO_DATA[saved])) {
      return saved === 'INTERNATIONAL' ? null : saved;
    }

    // 2. فحص النطاق الزمني الدقيق (Intl.DateTimeFormat)
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timeZone && TIMEZONE_TO_COUNTRY_MAP[timeZone]) {
      return TIMEZONE_TO_COUNTRY_MAP[timeZone];
    }

    // 3. فحص لغة المتصفح الثانوية مثل ar-DZ أو fr-DZ أو ar-EG
    const languages = navigator.languages || [navigator.language];
    for (const lang of languages) {
      if (!lang) continue;
      const parts = lang.split('-');
      if (parts.length >= 2) {
        const potentialCode = parts[1].toUpperCase();
        if (AFRICAN_GEO_DATA[potentialCode]) {
          return potentialCode;
        }
      }
    }

    // إذا كان النطاق الزمني خارج أفريقيا (أوروبا، أمريكا، الخليج، إلخ)
    return null;
  } catch (e) {
    console.warn('Geolocation detection fallback:', e);
    return 'DZ';
  }
}

/**
 * ترتيب الدول وفق الخوارزمية المطلوبة بدقة:
 * - إذا كان المستخدم في دولة أفريقية:
 *    1. دولته أولاً (مثلاً: الجزائر)
 *    2. ثم دول الجوار المباشرة (تونس، ليبيا، النيجر، مالي، موريتانيا، المغرب...)
 *    3. ثم باقي الدول الأفريقية مرتبة تصاعدياً حسب المسافة الجغرافية (الأقرب فالأقرب)
 * - إذا كان المستخدم يتصفح من خارج أفريقيا:
 *    - يتم الترتيب حسب تعداد السكان (تعداد النسمة تنازلياً) وفق الشرط المطلوب
 */
export function getProximitySortedCountries(
  allCountries: AfricanCountryProfile[],
  userCountryCode: string | null
): AfricanCountryProfile[] {
  // الحالة 1: المستخدم خارج أفريقيا -> ترتيب حسب تعداد السكان
  if (!userCountryCode || !AFRICAN_GEO_DATA[userCountryCode]) {
    return [...allCountries].sort((a, b) => (b.populationNumber || 0) - (a.populationNumber || 0));
  }

  const baseGeo = AFRICAN_GEO_DATA[userCountryCode];
  const userCountry = allCountries.find(c => c.code === userCountryCode);
  const remainingCountries = allCountries.filter(c => c.code !== userCountryCode);

  // تصنيف دول الجوار المباشر
  const neighborCodes = new Set(baseGeo.neighbors);
  const directNeighbors: AfricanCountryProfile[] = [];
  const otherCountries: AfricanCountryProfile[] = [];

  remainingCountries.forEach(c => {
    if (neighborCodes.has(c.code)) {
      directNeighbors.push(c);
    } else {
      otherCountries.push(c);
    }
  });

  // ترتيب دول الجوار بالأقرب إلى مركز دولة المستخدم
  directNeighbors.sort((a, b) => {
    const geoA = AFRICAN_GEO_DATA[a.code] || { lat: 0, lng: 0 };
    const geoB = AFRICAN_GEO_DATA[b.code] || { lat: 0, lng: 0 };
    const distA = calculateHaversineDistance(baseGeo.lat, baseGeo.lng, geoA.lat, geoA.lng);
    const distB = calculateHaversineDistance(baseGeo.lat, baseGeo.lng, geoB.lat, geoB.lng);
    return distA - distB;
  });

  // ترتيب باقي الدول الأفريقية بحسب المسافة الجغرافية تصاعدياً (الأقرب فالأقرب)
  otherCountries.sort((a, b) => {
    const geoA = AFRICAN_GEO_DATA[a.code] || { lat: 0, lng: 0 };
    const geoB = AFRICAN_GEO_DATA[b.code] || { lat: 0, lng: 0 };
    const distA = calculateHaversineDistance(baseGeo.lat, baseGeo.lng, geoA.lat, geoA.lng);
    const distB = calculateHaversineDistance(baseGeo.lat, baseGeo.lng, geoB.lat, geoB.lng);
    return distA - distB;
  });

  const result: AfricanCountryProfile[] = [];
  if (userCountry) {
    result.push(userCountry);
  }
  result.push(...directNeighbors);
  result.push(...otherCountries);

  return result;
}

/**
 * الحصول على علم الدولة
 */
export function getCountryFlag(countryCode: string): string {
  return AFRICAN_GEO_DATA[countryCode]?.flag || '🌍';
}
