/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CloudSun, 
  Sun, 
  CloudRain, 
  CloudFog, 
  CloudSnow, 
  CloudLightning, 
  Droplets, 
  Wind, 
  Thermometer, 
  Gauge, 
  LocateFixed, 
  MapPin, 
  ChevronDown,
  Share2,
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  Music2,
  Mail,
  Send,
  Check,
  MessageCircle,
  Timer
} from 'lucide-react';
import { TIMEZONE_TO_COUNTRY_MAP } from '../lib/africanGeoProximity';
import { WeatherCity, WEATHER_CAPITALS } from '../data/africanWeatherCapitals';

export interface ClockWeatherSocialCardProps {
  lang: 'ar' | 'en';
  className?: string;
}

// Portal Launch Baseline: September 25, 2026 (تاريخ انطلاق المنصة لحساب الأيام والسنوات تلقائياً)
const PORTAL_LAUNCH_DATE = new Date('2026-09-25T00:00:00Z');

const getWeatherDetails = (code: number, isArabic: boolean) => {
  if (code === 0) return { label: isArabic ? 'مشمس وصافٍ' : 'Clear & Sunny', icon: Sun, color: 'text-amber-400' };
  if (code <= 3) return { label: isArabic ? 'غائم جزئياً' : 'Partly Cloudy', icon: CloudSun, color: 'text-amber-300' };
  if (code <= 48) return { label: isArabic ? 'ضباب خفيف' : 'Foggy', icon: CloudFog, color: 'text-slate-300' };
  if (code <= 67) return { label: isArabic ? 'أمطار متفرقة' : 'Rain Showers', icon: CloudRain, color: 'text-sky-400' };
  if (code <= 77) return { label: isArabic ? 'ثلوج خفيفة' : 'Light Snow', icon: CloudSnow, color: 'text-blue-200' };
  if (code <= 82) return { label: isArabic ? 'زخات رعدية' : 'Thunder Showers', icon: CloudRain, color: 'text-cyan-400' };
  if (code <= 99) return { label: isArabic ? 'عواصف رعدية' : 'Thunderstorm', icon: CloudLightning, color: 'text-yellow-400' };
  return { label: isArabic ? 'طقس معتدل' : 'Mild Weather', icon: CloudSun, color: 'text-amber-400' };
};

const getDefaultCapital = (): WeatherCity => {
  try {
    const tz = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : '';
    const lowerTz = (tz || '').toLowerCase();
    
    // 1. المطابقة الدقيقة عبر خريطة المناطق الزمنية الإفريقية
    if (tz && TIMEZONE_TO_COUNTRY_MAP[tz]) {
      const code = TIMEZONE_TO_COUNTRY_MAP[tz];
      const match = WEATHER_CAPITALS.find(c => c.countryCode === code);
      if (match) return match;
    }

    // 2. البحث التلقائي عبر اسم العاصمة أو الدولة في معرّف المنطقة الزمنية للمستخدم
    const matched = WEATHER_CAPITALS.find(c => 
      (c.id && lowerTz.includes(c.id)) ||
      (c.nameEn && lowerTz.includes(c.nameEn.toLowerCase().replace(/[^a-z]/g, ''))) ||
      (c.countryEn && lowerTz.includes(c.countryEn.toLowerCase().replace(/[^a-z]/g, '')))
    );
    if (matched) return matched;
  } catch {}
  return WEATHER_CAPITALS.find(c => c.countryCode === 'DZ') || WEATHER_CAPITALS[0];
};

export const ClockWeatherSocialCard: React.FC<ClockWeatherSocialCardProps> = ({
  lang,
  className = ''
}) => {
  const isAr = lang === 'ar';
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  // حالة وجه البطاقة التفاعلي: الساعة (افتراضي)، الطقس، التواصل والمشاركة (تستقر في الساعة عند التحديث)
  const [activeCardFace, setActiveCardFace] = useState<'clock' | 'weather' | 'social'>('clock');
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [isNewsletterSubscribed, setIsNewsletterSubscribed] = useState<boolean>(false);
  const [returnCountdown, setReturnCountdown] = useState<number>(120); // 120 ثانية = دقيقتان
  const [selectedCity, setSelectedCity] = useState<WeatherCity>(() => getDefaultCapital());
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [liveWeather, setLiveWeather] = useState<{
    temp: number;
    humidity: number;
    windSpeed: number;
    apparentTemp: number;
    pressure: number;
    weatherCode: number;
    tempMax: number;
    tempMin: number;
    customCityName?: string;
  } | null>(null);

  // العودة التلقائية للساعة بعد دقيقتين (120 ثانية) إذا لم يتفاعل المستخدم
  useEffect(() => {
    if (activeCardFace === 'clock') {
      setReturnCountdown(120);
      return;
    }

    const interval = setInterval(() => {
      setReturnCountdown(prev => {
        if (prev <= 1) {
          setActiveCardFace('clock');
          return 120;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCardFace]);

  // الاشتراك في النشرة البريدية
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setIsNewsletterSubscribed(true);
      setTimeout(() => {
        setIsNewsletterSubscribed(false);
        setNewsletterEmail('');
      }, 4000);
    }
  };

  // جلب بيانات الطقس الحية عبر Open-Meteo API
  const fetchWeatherForCoords = async (lat: number, lon: number, customName?: string) => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      if (data.current) {
        setLiveWeather({
          temp: Math.round(data.current.temperature_2m),
          humidity: Math.round(data.current.relative_humidity_2m),
          apparentTemp: Math.round(data.current.apparent_temperature),
          windSpeed: Math.round(data.current.wind_speed_10m),
          pressure: Math.round(data.current.surface_pressure),
          weatherCode: data.current.weather_code,
          tempMax: data.daily?.temperature_2m_max?.[0] ? Math.round(data.daily.temperature_2m_max[0]) : Math.round(data.current.temperature_2m) + 3,
          tempMin: data.daily?.temperature_2m_min?.[0] ? Math.round(data.daily.temperature_2m_min[0]) : Math.round(data.current.temperature_2m) - 4,
          customCityName: customName
        });
      }
    } catch (e) {
      console.warn('Weather fetch error:', e);
    }
  };

  useEffect(() => {
    if (activeCardFace === 'weather') {
      fetchWeatherForCoords(selectedCity.lat, selectedCity.lon);
    }
  }, [selectedCity, activeCardFace]);

  // تحديد الموقع يدوياً عبر GPS
  const handleDetectGPS = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // محاولة معرفة اسم المدينة أو الدولة عبر Reverse Geocoding المجاني
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=${isAr ? 'ar' : 'en'}`);
            let detectedName = isAr ? 'موقعي الحالي' : 'My Current Location';
            if (geoRes.ok) {
              const geoData = await geoRes.json();
              detectedName = geoData.address?.city || geoData.address?.state || geoData.address?.country || detectedName;
            }
            fetchWeatherForCoords(latitude, longitude, detectedName);
          } catch {
            fetchWeatherForCoords(latitude, longitude, isAr ? 'موقعي عبر GPS' : 'GPS Location');
          } finally {
            setIsLocating(false);
          }
        },
        () => {
          setIsLocating(false);
        },
        { timeout: 10000 }
      );
    }
  };

  // مؤقت تحديث الثواني اللحظي للساعة
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // حساب أيام وسنوات الانطلاق بدقة من 25 سبتمبر 2026
  const getLaunchDiff = () => {
    const diffMs = currentDate.getTime() - PORTAL_LAUNCH_DATE.getTime();
    if (diffMs <= 0) {
      return { years: 0, days: 0 };
    }
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const years = Math.floor(totalDays / 365);
    const days = totalDays % 365;
    return { years, days };
  };

  const { years, days } = getLaunchDiff();

  // تنسيق اليوم والتاريخ والوقت
  const dayName = currentDate.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { weekday: 'long' });
  const dayNum = currentDate.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric' });
  const monthName = currentDate.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'long' });
  const yearNum = currentDate.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { year: 'numeric' });

  // تفكيك الوقت إلى ساعات ودقائق وثواني مع AM/PM
  const hoursRaw = currentDate.getHours();
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  const ampm = hoursRaw >= 12 ? (isAr ? 'م' : 'PM') : (isAr ? 'ص' : 'AM');
  const hours12 = String(hoursRaw % 12 || 12).padStart(2, '0');

  // بيانات الطقس المحسوبة بشكل مباشر مع قيم بديلة فورية تمنع أي فراغ أو تأخر في العرض
  const weatherDetails = getWeatherDetails(liveWeather?.weatherCode ?? selectedCity.weatherCode, isAr);
  const activeTemp = liveWeather?.temp ?? selectedCity.temp;
  const activeHumidity = liveWeather?.humidity ?? selectedCity.humidity;
  const activeWind = liveWeather?.windSpeed ?? selectedCity.windSpeed;
  const activeApparent = liveWeather?.apparentTemp ?? selectedCity.apparentTemp;
  const activePressure = liveWeather?.pressure ?? selectedCity.pressure;
  const activeTempMax = liveWeather?.tempMax ?? selectedCity.tempMax;
  const activeTempMin = liveWeather?.tempMin ?? selectedCity.tempMin;
  const activeCityName = liveWeather?.customCityName || (isAr ? selectedCity.nameAr : selectedCity.nameEn);

  return (
    <div className={`w-full [perspective:1200px] ${className}`}>
      <div 
        className="w-full relative h-[92px] sm:h-[98px] transition-transform duration-600 ease-in-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: activeCardFace !== 'clock' ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* 1. الوجه الأمامي: الساعة الرقمية الكبرى بحجمها الطبيعي الأصلي الرائع */}
        <div 
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
          className={`absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-b from-[#0d1527] via-[#080d19] to-[#050811] border border-slate-800/90 shadow-xl px-3.5 sm:px-5 py-1.5 sm:py-2 backdrop-blur-xl flex flex-col justify-between transition-opacity duration-300 ${
            activeCardFace !== 'clock' ? 'opacity-0 pointer-events-none z-0' : 'opacity-100 pointer-events-auto z-10'
          }`}
        >
          {/* زر التواصل والمشاركة في الجهة المقابلة لزر الطقس */}
          <button
            onClick={() => setActiveCardFace('social')}
            className="absolute top-1.5 left-2 sm:top-2 sm:left-3.5 z-20 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900/90 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700/80 hover:border-amber-500/50 shadow-sm backdrop-blur-md transition-all group cursor-pointer active:scale-95"
            title={isAr ? 'منصات التواصل والمشاركة والنشرة البريدية' : 'Social Platforms & Newsletter'}
            aria-label="Toggle Social & Newsletter"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] sm:text-[11px] font-medium hidden sm:inline">{isAr ? 'تواصل ومشاركة' : 'Connect'}</span>
          </button>

          {/* زر الطقس في الزاوية اليمنى للأعلى */}
          <button
            onClick={() => setActiveCardFace('weather')}
            className="absolute top-1.5 right-2 sm:top-2 sm:right-3.5 z-20 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900/90 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700/80 hover:border-amber-500/50 shadow-sm backdrop-blur-md transition-all group cursor-pointer active:scale-95"
            title={isAr ? 'عرض بيانات الطقس الحية' : 'View Live Weather'}
            aria-label="Toggle Weather"
          >
            <CloudSun className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] sm:text-[11px] font-medium hidden sm:inline">{isAr ? 'الطقس' : 'Weather'}</span>
          </button>

          {/* الصف العلوي: التاريخ الحالي + أيام/سنوات الانطلاق */}
          <div className="w-full flex items-center justify-between text-[10px] sm:text-xs text-slate-400 font-medium px-1 sm:px-2 leading-none">
            <div className="flex items-center gap-1.5 truncate max-w-[65%]">
              <span className="text-slate-300 font-semibold truncate">{dayName}</span>
              <span className="text-slate-500">·</span>
              <span className="text-amber-400/90 font-mono truncate">{dayNum} {monthName} {yearNum}</span>
            </div>

            {/* عداد سنوات وأيام انطلاق الصحيفة */}
            <div className="flex items-center gap-1 font-mono text-[9.5px] sm:text-[11px] text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {isAr ? (
                  years > 0 ? `السنة ${years} · اليوم ${days}` : `اليوم ${days} للمنصة`
                ) : (
                  years > 0 ? `Year ${years} · Day ${days}` : `Day ${days} of Launch`
                )}
              </span>
            </div>
          </div>

          {/* الصف الأوسط: شاشة الساعة الكبرى ذات الوهج الكهرماني الواضح في قلب الصندوق */}
          <div className="w-full flex items-center justify-center my-auto py-0.5">
            <div className="flex items-baseline gap-1 sm:gap-2 leading-none">
              <span 
                className="text-3xl sm:text-5xl md:text-6xl font-mono font-black tracking-tight text-white drop-shadow-[0_0_20px_rgba(245,158,11,0.25)] select-none"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {hours12}:{minutes}
              </span>
              <span 
                className="text-xl sm:text-2xl md:text-3xl font-mono font-bold text-amber-400 animate-pulse drop-shadow-[0_0_12px_rgba(245,158,11,0.5)] select-none"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                :{seconds}
              </span>
              <span className="text-[10px] sm:text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest font-mono ml-1 rtl:ml-0 rtl:mr-1">
                {ampm}
              </span>
            </div>
          </div>

          {/* الصف السفلي: التوقيت المرجعي المالي لأسواق المال الإفريقية والعالمية */}
          <div className="w-full flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400 border-t border-slate-800/80 pt-1 leading-none">
            <div className="flex items-center gap-1 truncate">
              <span className="text-slate-300 font-medium truncate">
                {isAr ? 'توقيت أسواق المال الإفريقية (JSE · EGX · NGX)' : 'Pan-African Financial Time (JSE · EGX · NGX)'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[9px] sm:text-[10px] shrink-0">
              <span className="text-emerald-400 font-semibold">{isAr ? 'تداول حي' : 'Trading Active'}</span>
              <span>·</span>
              <span>GMT+1</span>
            </div>
          </div>
        </div>

        {/* 2. الوجه الخلفي: بطاقة الطقس بنفس الحجم الطبيعي تماماً مع تصغير كافة بيانات الطقس وإظهارها فوراً وبدقة */}
        <div 
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          className={`absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-b from-[#0d1527] via-[#080d19] to-[#050811] border border-amber-500/40 shadow-xl px-3 sm:px-4 py-1.5 backdrop-blur-xl flex flex-col justify-between transition-opacity duration-300 ${
            activeCardFace === 'weather' ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
          }`}
        >
          {/* الشريط العلوي المصغر: محدد الدولة والعاصمة (يأخذ أكثر من 65% من عرض البطاقة) + زر GPS + زر العودة للساعة */}
          <div className="w-full flex items-center justify-between gap-1 leading-none">
            <div className="flex items-center gap-1 w-[67%] shrink-0 min-w-0">
              {/* إطار الدولة مع العاصمة بعرض كامل داخل الـ 67% وتنسيق خط أصغر وأجمل */}
              <div className="relative flex items-center w-full bg-slate-900/90 border border-slate-700/80 rounded px-1.5 py-0.5 text-slate-200 shadow-sm focus-within:border-amber-500 transition-colors">
                <MapPin className="w-2.5 h-2.5 text-amber-400 shrink-0 mr-1 rtl:mr-0 rtl:ml-1" />
                <select
                  value={selectedCity.id}
                  onChange={(e) => {
                    const found = WEATHER_CAPITALS.find(c => c.id === e.target.value);
                    if (found) {
                      setSelectedCity(found);
                      fetchWeatherForCoords(found.lat, found.lon);
                    }
                  }}
                  className="w-full bg-transparent text-slate-100 font-medium text-[8px] sm:text-[9px] focus:outline-none cursor-pointer pr-3.5 rtl:pr-0 rtl:pl-3.5 truncate leading-tight"
                  aria-label="Select African Country and Capital"
                >
                  {WEATHER_CAPITALS.map(city => (
                    <option key={city.id} value={city.id} className="bg-slate-900 text-slate-200 text-[8.5px] py-0.5">
                      {isAr ? `${city.countryAr} - ${city.nameAr}` : `${city.countryEn} - ${city.nameEn}`}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-2 h-2 text-slate-400 pointer-events-none absolute right-1 rtl:right-auto rtl:left-1" />
              </div>

              {/* زر الكشف التلقائي عبر GPS */}
              <button
                onClick={handleDetectGPS}
                disabled={isLocating}
                className="p-1 rounded bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-700/80 transition-colors shadow-sm cursor-pointer shrink-0 disabled:opacity-50"
                title={isAr ? 'تحديد موقعي التلقائي عبر GPS' : 'Detect Location via GPS'}
                aria-label="Detect GPS Location"
              >
                <LocateFixed className={`w-2.5 h-2.5 ${isLocating ? 'animate-spin text-amber-400' : ''}`} />
              </button>
            </div>

            {/* زر الساعة للعودة للساعة */}
            <button
              onClick={() => setActiveCardFace('clock')}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[9px] sm:text-[9.5px] shadow-sm transition-all cursor-pointer active:scale-95 shrink-0"
              title={isAr ? 'العودة إلى الساعة الرقمية' : 'Return to Clock'}
              aria-label="Return to Clock"
            >
              <Clock className="w-2.5 h-2.5 text-slate-950" />
              <span>{isAr ? 'الساعة' : 'Clock'}</span>
            </button>
          </div>

          {/* الجزء الأوسط: درجة الحرارة + أيقونة الطقس + شبكة المؤشرات بأحجام مصغرة وأنيقة جداً */}
          <div className="w-full flex items-center justify-between gap-1.5 my-auto py-0.5">
            {/* درجة الحرارة والحالة */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-inner">
                {React.createElement(weatherDetails.icon, {
                  className: `w-4 h-4 ${weatherDetails.color}`
                })}
              </div>
              <div className="flex items-baseline gap-1 leading-none">
                <span className="text-xl sm:text-2xl font-mono font-black text-white">
                  {activeTemp}°
                </span>
                <span className="text-[9.5px] font-bold text-amber-400">C</span>
                <span className="text-[8.5px] text-slate-400 font-mono hidden sm:inline mr-0.5 rtl:mr-0 rtl:ml-0.5">
                  ▲{activeTempMax}° ▼{activeTempMin}°
                </span>
              </div>
            </div>

            {/* شبكة المؤشرات الأربعة بأيقونات وخطوط مصغرة جداً (الرطوبة، الرياح، الحرارة المحسوسة، الضغط) */}
            <div className="flex items-center gap-1 flex-wrap justify-end text-[8.5px] sm:text-[9.5px] font-mono leading-none">
              {/* الرطوبة */}
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-900/80 border border-slate-800 text-sky-300" title={isAr ? 'الرطوبة النسبية' : 'Humidity'}>
                <Droplets className="w-2.5 h-2.5 text-sky-400 shrink-0" />
                <span className="font-bold">{activeHumidity}%</span>
              </div>

              {/* الرياح */}
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-900/80 border border-slate-800 text-emerald-300" title={isAr ? 'سرعة الرياح' : 'Wind Speed'}>
                <Wind className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                <span className="font-bold">{activeWind} <span className="font-sans text-[7.5px]">{isAr ? 'كم' : 'km'}</span></span>
              </div>

              {/* المحسوسة */}
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-900/80 border border-slate-800 text-amber-300" title={isAr ? 'الحرارة المحسوسة' : 'Feels Like'}>
                <Thermometer className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                <span className="font-bold">{activeApparent}°</span>
              </div>

              {/* الضغط */}
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-900/80 border border-slate-800 text-purple-300 hidden sm:flex" title={isAr ? 'الضغط الجوي' : 'Pressure'}>
                <Gauge className="w-2.5 h-2.5 text-purple-400 shrink-0" />
                <span className="font-bold">{activePressure} <span className="font-sans text-[7.5px]">hPa</span></span>
              </div>
            </div>
          </div>

          {/* الشريط السفلي المصغر: شارة الرصد المباشر + عداد العودة التلقائية للساعة خلال دقيقتين */}
          <div className="w-full flex items-center justify-between pt-1 border-t border-slate-800/70 text-[8.5px] text-slate-400 leading-none">
            <div className="flex items-center gap-1 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-slate-300 font-medium truncate">
                {isAr ? 'محطة الرصد الجوي لعواصم إفريقيا (Open-Meteo)' : 'African Weather Station'}
              </span>
            </div>

            {/* مؤشر العودة التلقائية للساعة بعد دقيقتين */}
            <div className="flex items-center gap-1 text-amber-400/90 font-mono bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/20 shrink-0">
              <Timer className="w-2 h-2 text-amber-400" />
              <span>{isAr ? 'عودة:' : 'Auto:'} {Math.floor(returnCountdown / 60)}:{String(returnCountdown % 60).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* 3. الوجه الثالث: بطاقة التواصل والمشاركة والنشرة البريدية بنفس المقاييس تماماً */}
        <div 
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          className={`absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-b from-[#0d1527] via-[#080d19] to-[#050811] border border-amber-500/40 shadow-xl px-3 sm:px-4 py-1.5 backdrop-blur-xl flex flex-col justify-between transition-opacity duration-300 ${
            activeCardFace === 'social' ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
          }`}
        >
          {/* الصف العلوي: أزرار منصات التواصل الاجتماعي الـ 5 + زر العودة للساعة */}
          <div className="w-full flex items-center justify-between gap-1 leading-none">
            <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap min-w-0">
              <span className="text-[9px] sm:text-[10px] font-bold text-amber-400 shrink-0">
                {isAr ? 'تابعنا وشارك:' : 'Connect:'}
              </span>

              {/* فيسبوك */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-md bg-blue-600/15 hover:bg-blue-600/30 border border-blue-500/40 text-blue-400 text-[8.5px] sm:text-[9.5px] font-medium transition-colors shadow-sm cursor-pointer"
                title={isAr ? 'فيسبوك (Facebook)' : 'Facebook'}
              >
                <Facebook className="w-3 h-3" />
                <span className="hidden xs:inline">{isAr ? 'فيسبوك' : 'Facebook'}</span>
              </a>

              {/* تويتر / إكس */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-md bg-sky-500/15 hover:bg-sky-500/30 border border-sky-400/40 text-sky-400 text-[8.5px] sm:text-[9.5px] font-medium transition-colors shadow-sm cursor-pointer"
                title={isAr ? 'تويتر / إكس (Twitter/X)' : 'Twitter/X'}
              >
                <Twitter className="w-3 h-3" />
                <span className="hidden xs:inline">{isAr ? 'تويتر' : 'Twitter'}</span>
              </a>

              {/* يوتيوب */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-md bg-red-600/15 hover:bg-red-600/30 border border-red-500/40 text-red-400 text-[8.5px] sm:text-[9.5px] font-medium transition-colors shadow-sm cursor-pointer"
                title={isAr ? 'يوتيوب (YouTube)' : 'YouTube'}
              >
                <Youtube className="w-3 h-3" />
                <span className="hidden xs:inline">{isAr ? 'يوتيوب' : 'YouTube'}</span>
              </a>

              {/* انستغرام */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-md bg-pink-600/15 hover:bg-pink-600/30 border border-pink-500/40 text-pink-400 text-[8.5px] sm:text-[9.5px] font-medium transition-colors shadow-sm cursor-pointer"
                title={isAr ? 'انستغرام (Instagram)' : 'Instagram'}
              >
                <Instagram className="w-3 h-3" />
                <span className="hidden xs:inline">{isAr ? 'انستغرام' : 'Instagram'}</span>
              </a>

              {/* تيكتوك */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-md bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-[8.5px] sm:text-[9.5px] font-medium transition-colors shadow-sm cursor-pointer"
                title={isAr ? 'تيكتوك (TikTok)' : 'TikTok'}
              >
                <Music2 className="w-3 h-3" />
                <span className="hidden xs:inline">{isAr ? 'تيكتوك' : 'TikTok'}</span>
              </a>
            </div>

            {/* زر الساعة للعودة للساعة */}
            <button
              onClick={() => setActiveCardFace('clock')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[9px] sm:text-[10px] shadow-sm transition-all cursor-pointer active:scale-95 shrink-0"
              title={isAr ? 'العودة إلى الساعة الرقمية' : 'Return to Clock'}
              aria-label="Return to Clock"
            >
              <Clock className="w-2.5 h-2.5 text-slate-950" />
              <span>{isAr ? 'الساعة' : 'Clock'}</span>
            </button>
          </div>

          {/* الصف الأوسط: المدير العام مسؤول النشر والناشر مع فاصل رفيع في الأعلى وآخر في الأسفل */}
          <div className="w-full py-1 my-0.5 border-t border-b border-slate-800/80 flex items-center justify-between text-[8px] sm:text-[9px] leading-tight text-slate-300 font-medium">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-amber-400/90 font-semibold shrink-0">
                {isAr ? 'المدير العام مسؤول النشر:' : 'Publishing Director:'}
              </span>
              <span className="text-white font-bold shrink-0">
                {isAr ? 'بلال عويش' : 'Billel Aouiche'}
              </span>
              <span className="text-slate-600 mx-0.5">/</span>
              <span className="text-amber-400/90 font-semibold shrink-0">
                {isAr ? 'الناشر:' : 'Publisher:'}
              </span>
              <span className="text-amber-300 font-bold tracking-wide shrink-0">
                GOODATA
              </span>
              <span className="text-slate-600 mx-0.5">/</span>
              <a
                href="https://wa.me/213656180056"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-mono font-bold shrink-0 transition-colors cursor-pointer"
                title={isAr ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
              >
                <MessageCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                <span dir="ltr" className="text-[8px] sm:text-[9px]">+213656180056</span>
              </a>
            </div>
          </div>

          {/* الصف السفلي: حقل الاشتراك في الرسائل البريدية + زر اشتراك + مؤقت العودة التلقائية */}
          <div className="w-full flex items-center justify-between gap-1.5 text-[8.5px] leading-none">
            <form onSubmit={handleNewsletterSubmit} className="flex-1 flex items-center gap-1.5 min-w-0">
              <div className="relative flex-1 h-7 sm:h-[30px] flex items-center bg-slate-900/90 border border-slate-700/80 rounded-md px-2 text-slate-200 shadow-inner focus-within:border-amber-500 transition-colors min-w-0">
                <Mail className="w-3 h-3 text-amber-400 shrink-0 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={isAr ? 'أدخل بريدك للاشتراك في النشرة الاقتصادية اليومية...' : 'Enter your email for the daily economic newsletter...'}
                  className="w-full bg-transparent text-[8.5px] sm:text-[9.5px] text-white placeholder-slate-400 focus:outline-none truncate"
                />
              </div>
              <button
                type="submit"
                className="h-7 sm:h-[30px] px-3 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[9px] sm:text-[9.5px] transition-all cursor-pointer shrink-0 shadow-sm active:scale-95 flex items-center gap-1"
              >
                {isNewsletterSubscribed ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-950" />
                    <span>{isAr ? 'تم الاشتراك!' : 'Subscribed!'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3 text-slate-950" />
                    <span>{isAr ? 'اشتراك' : 'Subscribe'}</span>
                  </>
                )}
              </button>
            </form>

            {/* مؤشر العودة التلقائية للساعة بعد دقيقتين */}
            <div className="h-7 sm:h-[30px] flex items-center gap-1 text-amber-400/90 font-mono bg-amber-500/10 px-1.5 rounded-md border border-amber-500/20 shrink-0 hidden sm:flex text-[8.5px] sm:text-[9px]">
              <Timer className="w-2.5 h-2.5 text-amber-400" />
              <span>{isAr ? 'عودة:' : 'Auto:'} {Math.floor(returnCountdown / 60)}:{String(returnCountdown % 60).padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
