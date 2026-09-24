import React, { useState } from 'react';
import { AfricanCountryProfile } from '../types';
import { 
  X, 
  RefreshCw, 
  TrendingUp, 
  Sparkles, 
  Sliders, 
  CheckCircle2, 
  RotateCcw,
  Zap,
  Building2,
  Users,
  Coins
} from 'lucide-react';
import { parsePercentage } from '../lib/dynamicEconomicRanking';

interface EconomicDataUpdaterModalProps {
  isOpen: boolean;
  onClose: () => void;
  countries: AfricanCountryProfile[];
  onUpdateCountry: (updatedCountry: AfricanCountryProfile) => void;
  onResetAll: () => void;
  lang: 'ar' | 'en';
}

export const EconomicDataUpdaterModal: React.FC<EconomicDataUpdaterModalProps> = ({
  isOpen,
  onClose,
  countries,
  onUpdateCountry,
  onResetAll,
  lang
}) => {
  if (!isOpen) return null;

  const isAr = lang === 'ar';
  const [selectedCode, setSelectedCode] = useState<string>(countries[0]?.code || 'ZA');

  const currentCountry = countries.find(c => c.code === selectedCode) || countries[0];

  // Form states initialized with current country values
  const [gdpVal, setGdpVal] = useState<number>(currentCountry?.gdpNumber || 100);
  const [growthVal, setGrowthVal] = useState<number>(parsePercentage(currentCountry?.gdpGrowth || '3.5%'));
  const [popVal, setPopVal] = useState<number>(currentCountry?.populationNumber || 50);
  const [inflationVal, setInflationVal] = useState<number>(parsePercentage(currentCountry?.inflation || '5%'));
  const [successToast, setSuccessToast] = useState(false);

  // When changing selected country
  const handleSelectCountry = (code: string) => {
    setSelectedCode(code);
    const target = countries.find(c => c.code === code);
    if (target) {
      setGdpVal(target.gdpNumber);
      setGrowthVal(parsePercentage(target.gdpGrowth));
      setPopVal(target.populationNumber);
      setInflationVal(parsePercentage(target.inflation));
    }
  };

  const handleApplyUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCountry) return;

    const growthFormatted = growthVal >= 0 ? `+${growthVal.toFixed(1)}%` : `${growthVal.toFixed(1)}%`;
    const gdpFormatted = `$${gdpVal.toFixed(1)} Billion`;
    const popFormatted = `${popVal.toFixed(1)} Million`;
    const inflationFormatted = `${inflationVal.toFixed(1)}%`;

    const updated: AfricanCountryProfile = {
      ...currentCountry,
      gdpNumber: Number(gdpVal.toFixed(1)),
      gdp: gdpFormatted,
      populationNumber: Number(popVal.toFixed(1)),
      population: popFormatted,
      gdpGrowth: growthFormatted,
      inflation: inflationFormatted,
      lastUpdated: new Date().toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    onUpdateCountry(updated);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 2500);
  };

  // Ready scenarios for instant testing
  const handleApplyScenario = (gdpMultiplier: number, growthBoost: number, label: string) => {
    const newGdp = Number((currentCountry.gdpNumber * gdpMultiplier).toFixed(1));
    const newGrowth = Number((parsePercentage(currentCountry.gdpGrowth) + growthBoost).toFixed(1));
    setGdpVal(newGdp);
    setGrowthVal(newGrowth);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0b101e] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0f172a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                {isAr ? 'محاكي ومحدث المعطيات الاقتصادية الحية' : 'Live Macroeconomic Data Simulator'}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {isAr ? 'ترتيب فوري' : 'Auto Re-ranking'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {isAr 
                  ? 'عند تعديل أي مؤشر، يعاد ترتيب الـ 54 دولة تلقائياً وفق معادلات القوة الاقتصادية' 
                  : 'Modifying any metric triggers automatic real-time recalculation of all 54 country ranks'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Country Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              {isAr ? 'اختر الدولة لتعديل مؤشراتها الاقتصادية:' : 'Select Country to update:'}
            </label>
            <select
              value={selectedCode}
              onChange={(e) => handleSelectCountry(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-medium"
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  #{c.rank} - {isAr ? c.nameAr : c.nameEn} ({c.gdp} - {c.gdpGrowth})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Simulation Scenarios */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>{isAr ? 'سيناريوهات المحاكاة السريعة بنقرة واحدة:' : 'One-Click Quick Scenarios:'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleApplyScenario(1.15, 2.5, 'طفرة استثمارية')}
                className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors text-right rtl:text-right ltr:text-left"
              >
                <div className="font-bold">{isAr ? '🚀 طفرة استثمارية' : '🚀 Investment Surge'}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">+15% GDP & +2.5% Growth</div>
              </button>

              <button
                type="button"
                onClick={() => handleApplyScenario(1.25, 4.0, 'اكتشافات طاقة عملاقة')}
                className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors text-right rtl:text-right ltr:text-left"
              >
                <div className="font-bold">{isAr ? '⚡ اكتشاف موارد طاقة' : '⚡ Resource Boom'}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">+25% GDP & +4.0% Growth</div>
              </button>

              <button
                type="button"
                onClick={() => handleApplyScenario(0.90, -1.8, 'تباطؤ وتضخم عالمي')}
                className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors text-right rtl:text-right ltr:text-left"
              >
                <div className="font-bold">{isAr ? '📉 تباطؤ اقتصادي' : '📉 Macro Slowdown'}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">-10% GDP & -1.8% Growth</div>
              </button>
            </div>
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleApplyUpdate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* GDP Input */}
              <div className="space-y-1.5">
                <label className="flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    {isAr ? 'الناتج المحلي الإجمالي (GDP):' : 'Nominal GDP ($B):'}
                  </span>
                  <span className="text-amber-400 font-mono font-bold">${gdpVal.toFixed(1)}B</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="1000"
                  value={gdpVal}
                  onChange={(e) => setGdpVal(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                />
                <input
                  type="range"
                  min="1"
                  max="500"
                  step="1"
                  value={gdpVal}
                  onChange={(e) => setGdpVal(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>

              {/* GDP Growth Input */}
              <div className="space-y-1.5">
                <label className="flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    {isAr ? 'معدل النمو السنوي (%):' : 'Annual Growth (%):'}
                  </span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {growthVal >= 0 ? `+${growthVal.toFixed(1)}%` : `${growthVal.toFixed(1)}%`}
                  </span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="-10"
                  max="25"
                  value={growthVal}
                  onChange={(e) => setGrowthVal(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="range"
                  min="-5"
                  max="15"
                  step="0.2"
                  value={growthVal}
                  onChange={(e) => setGrowthVal(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Population Input */}
              <div className="space-y-1.5">
                <label className="flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sky-400" />
                    {isAr ? 'عدد السكان (مليون نسمة):' : 'Population (Million):'}
                  </span>
                  <span className="text-sky-400 font-mono font-bold">{popVal.toFixed(1)}M</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="400"
                  value={popVal}
                  onChange={(e) => setPopVal(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Inflation Input */}
              <div className="space-y-1.5">
                <label className="flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span>{isAr ? 'معدل التضخم السنوي (%):' : 'Inflation Rate (%):'}</span>
                  <span className="text-amber-300 font-mono font-bold">{inflationVal.toFixed(1)}%</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={inflationVal}
                  onChange={(e) => setInflationVal(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Success Feedback Banner */}
            {successToast && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {isAr 
                    ? `تم تحديث معطيات ${currentCountry.nameAr} بنجاح! تم إعادة فرز وترتيب الدول الـ 54 تلقائياً.` 
                    : `Updated ${currentCountry.nameEn}! Re-ranked all 54 African countries automatically.`}
                </span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onResetAll}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors px-3 py-2 rounded-lg hover:bg-slate-900"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isAr ? 'استعادة إحصاءات صندوق النقد الأصلية' : 'Reset to IMF Defaults'}</span>
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{isAr ? 'تطبيق التحديث وإعادة الترتيب التلقائي' : 'Apply & Auto Re-rank'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
