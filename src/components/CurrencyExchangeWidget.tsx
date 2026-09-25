import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Coins, 
  ChevronDown, 
  ChevronUp, 
  X, 
  ArrowLeftRight, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Globe2, 
  Check, 
  RefreshCw,
  Move
} from 'lucide-react';
import { DraggableFloatingContainer } from './DraggableFloatingContainer';
import { CURRENCY_LIST, CURRENCY_MAP, convertCurrencies, fetchLiveConversion, CurrencyItem } from '../lib/forexEngine';

interface CurrencyExchangeWidgetProps {
  lang: 'ar' | 'en';
}

export const CurrencyExchangeWidget: React.FC<CurrencyExchangeWidgetProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  
  // Stages: 0 = floating icon only, 1 = title bar with arrow, 2 = full accordion expanded
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  
  // Converter State
  const [fromCode, setFromCode] = useState<string>('USD');
  const [toCode, setToCode] = useState<string>('DZD');
  const [amount, setAmount] = useState<string>('100');
  const [activeTab, setActiveTab] = useState<'converter' | 'african' | 'global'>('converter');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFetchingApi, setIsFetchingApi] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const numAmount = parseFloat(amount) || 0;

  // Calculation
  const conversionResult = useMemo(() => {
    return convertCurrencies(fromCode, toCode, numAmount);
  }, [fromCode, toCode, numAmount]);

  // Sync with /api/forex when pair changes or user clicks refresh
  const triggerApiSync = useCallback(async () => {
    setIsFetchingApi(true);
    try {
      const data = await fetchLiveConversion(fromCode, toCode, numAmount);
      if (data && data.timestamp) {
        setLastUpdated(new Date(data.timestamp).toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }));
      }
    } finally {
      setIsFetchingApi(false);
    }
  }, [fromCode, toCode, numAmount, isAr]);

  useEffect(() => {
    if (stage === 2) {
      triggerApiSync();
    }
  }, [stage, triggerApiSync]);

  const handleSwap = () => {
    setFromCode(toCode);
    setToCode(fromCode);
  };

  // Filtered currencies for the list
  const filteredCurrencies = useMemo(() => {
    let list = CURRENCY_LIST;
    if (activeTab === 'african') {
      list = list.filter(c => c.category === 'african');
    } else if (activeTab === 'global') {
      list = list.filter(c => c.category === 'global');
    }

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(c => 
      c.code.toLowerCase().includes(q) ||
      c.nameAr.toLowerCase().includes(q) ||
      c.nameEn.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q)
    );
  }, [activeTab, searchQuery]);

  return (
    <DraggableFloatingContainer
      defaultAlign={isAr ? 'left' : 'right'}
      defaultBottomOffset={175}
      zIndex={38}
    >
      {({ isDragging }) => (
        <div className="relative">
          {/* =========================================================================
              المرحلة 0: الأيقونة الطافية القابلة للسحب والتحريك في أي مكان
             ========================================================================= */}
          {stage === 0 && (
            <button
              onClick={() => {
                if (!isDragging) {
                  setStage(1);
                }
              }}
              className="flex items-center gap-2 px-3.5 py-3 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 font-black shadow-2xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all border border-emerald-300/40 cursor-grab active:cursor-grabbing group"
              title={isAr ? 'أسعار العملات والتحويل (اسحب لتحريك الأيقونة)' : 'FX Rates & Converter (Drag to reposition)'}
              aria-label={isAr ? 'أسعار العملات ومحول الصرف' : 'Currency Exchange Rates'}
            >
              <div className="relative">
                <Coins className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white animate-ping"></span>
              </div>
              <span className="text-xs font-black tracking-tight hidden sm:inline whitespace-nowrap">
                {isAr ? 'أسعار العملات' : 'FX Converter'}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-slate-950/20 text-[10px] font-mono font-bold">
                EXCH
              </span>
            </button>
          )}

          {/* =========================================================================
              المرحلة 1 & 2: شريط فيه العنوان مع سهم للأسفل (Accordion)
             ========================================================================= */}
          {stage > 0 && (
            <div className="w-[92vw] sm:w-[410px] shadow-2xl rounded-2xl bg-[#080d1a]/98 backdrop-blur-xl border border-emerald-500/40 ring-1 ring-emerald-500/20 overflow-hidden animate-in slide-in-from-bottom-3 duration-200">
              {/* شريط العنوان مع سهم للأسفل / للأعلى (المرحلة 1) */}
              <div
                onClick={() => {
                  if (!isDragging) {
                    setStage(prev => prev === 1 ? 2 : 1);
                  }
                }}
                className="px-3.5 py-3 bg-gradient-to-r from-[#0d1627] via-[#09101d] to-[#0d1627] flex items-center justify-between cursor-pointer border-b border-slate-800/90 select-none group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1 text-slate-400 cursor-grab active:cursor-grabbing hover:text-emerald-400" title={isAr ? 'اسحب من هنا لنقل الصندوق' : 'Drag to reposition'}>
                    <Move className="w-3.5 h-3.5" />
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                      <span>{isAr ? 'أسعار العملات ومحول الصرف' : 'Forex Rates & Converter Engine'}</span>
                    </h3>
                    <p className="text-[10px] text-emerald-400/90 font-mono">
                      {isAr ? 'محرك API حي للعملات الأفريقية والعالمية' : 'Live Pan-African & Global FX API'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* سهم للأسفل في المرحلة 1، أو للأعلى في المرحلة 2 */}
                  <div className="p-1 rounded-lg bg-slate-800 text-emerald-400 group-hover:bg-slate-700 transition-colors">
                    {stage === 2 ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4 animate-bounce" />
                    )}
                  </div>

                  {/* زر تصغير للعودة للأيقونة الطافية */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setStage(0);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title={isAr ? 'تصغير' : 'Minimize'}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* =========================================================================
                  المرحلة 2: محتوى الـ Accordion الكامل (محول الصرف + جدول الأسعار المباشرة)
                 ========================================================================= */}
              {stage === 2 && (
                <div className="p-3.5 space-y-3.5 max-h-[72vh] overflow-y-auto no-scrollbar animate-in fade-in duration-200">
                  {/* Tab Selector */}
                  <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                    <button
                      onClick={() => setActiveTab('converter')}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                        activeTab === 'converter'
                          ? 'bg-emerald-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <ArrowLeftRight className="w-3 h-3" />
                      <span>{isAr ? 'محول الصرف' : 'Converter'}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('african')}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-center cursor-pointer ${
                        activeTab === 'african'
                          ? 'bg-emerald-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{isAr ? 'العملات الأفريقية' : 'African FX'}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('global')}
                      className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-center cursor-pointer ${
                        activeTab === 'global'
                          ? 'bg-emerald-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{isAr ? 'العالمية' : 'Global'}</span>
                    </button>
                  </div>

                  {/* TAB 1: المحول التفاعلي (Interactive Converter) */}
                  {activeTab === 'converter' && (
                    <div className="space-y-3">
                      {/* Amount Input */}
                      <div>
                        <label className="text-[11px] text-slate-400 font-medium block mb-1">
                          {isAr ? 'المبلغ المراد تحويله:' : 'Amount to convert:'}
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="100"
                            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl py-2 px-3 text-sm font-mono font-bold text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                          />
                          <span className="absolute left-3 rtl:left-3 ltr:right-3 top-2.5 text-xs text-slate-400 font-mono">
                            {CURRENCY_MAP[fromCode]?.symbol}
                          </span>
                        </div>
                      </div>

                      {/* Currency Pair Selectors + Swap Button */}
                      <div className="grid grid-cols-5 gap-2 items-center">
                        {/* From Currency */}
                        <div className="col-span-2 space-y-1">
                          <span className="text-[10px] text-slate-400 block font-medium">
                            {isAr ? 'من عملة:' : 'From:'}
                          </span>
                          <select
                            value={fromCode}
                            onChange={(e) => setFromCode(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs font-mono font-bold text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
                          >
                            <optgroup label={isAr ? 'العملات الأفريقية' : 'African Currencies'}>
                              {CURRENCY_LIST.filter(c => c.category === 'african').map(c => (
                                <option key={c.code} value={c.code}>
                                  {c.flag} {c.code} - {isAr ? c.nameAr : c.nameEn}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label={isAr ? 'العملات العالمية' : 'Global Currencies'}>
                              {CURRENCY_LIST.filter(c => c.category === 'global').map(c => (
                                <option key={c.code} value={c.code}>
                                  {c.flag} {c.code} - {isAr ? c.nameAr : c.nameEn}
                                </option>
                              ))}
                            </optgroup>
                          </select>
                        </div>

                        {/* Swap Button */}
                        <div className="col-span-1 flex items-center justify-center pt-4">
                          <button
                            type="button"
                            onClick={handleSwap}
                            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 flex items-center justify-center transition-all border border-slate-700/80 cursor-pointer shadow-sm active:scale-90"
                            title={isAr ? 'تبديل العملتين' : 'Swap currencies'}
                          >
                            <ArrowLeftRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* To Currency */}
                        <div className="col-span-2 space-y-1">
                          <span className="text-[10px] text-slate-400 block font-medium">
                            {isAr ? 'إلى عملة:' : 'To:'}
                          </span>
                          <select
                            value={toCode}
                            onChange={(e) => setToCode(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs font-mono font-bold text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
                          >
                            <optgroup label={isAr ? 'العملات الأفريقية' : 'African Currencies'}>
                              {CURRENCY_LIST.filter(c => c.category === 'african').map(c => (
                                <option key={c.code} value={c.code}>
                                  {c.flag} {c.code} - {isAr ? c.nameAr : c.nameEn}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label={isAr ? 'العملات العالمية' : 'Global Currencies'}>
                              {CURRENCY_LIST.filter(c => c.category === 'global').map(c => (
                                <option key={c.code} value={c.code}>
                                  {c.flag} {c.code} - {isAr ? c.nameAr : c.nameEn}
                                </option>
                              ))}
                            </optgroup>
                          </select>
                        </div>
                      </div>

                      {/* Real-time Result Card */}
                      <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#0e1828] to-[#0a111e] border border-emerald-500/30 space-y-2 shadow-inner">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>{isAr ? 'القيمة المحولة الفورية:' : 'Converted Value:'}</span>
                          <button
                            onClick={triggerApiSync}
                            disabled={isFetchingApi}
                            className="flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 font-mono"
                            title="تحديث من API"
                          >
                            <RefreshCw className={`w-3 h-3 ${isFetchingApi ? 'animate-spin' : ''}`} />
                            <span>{lastUpdated ? lastUpdated : 'API Live'}</span>
                          </button>
                        </div>

                        <div className="flex items-baseline justify-between gap-2">
                          <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                            {conversionResult.result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                          </div>
                          <div className="text-xs font-bold text-emerald-400 font-mono">
                            {CURRENCY_MAP[toCode]?.flag} {toCode}
                          </div>
                        </div>

                        {/* Exchange Rate details */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10.5px] font-mono text-slate-400">
                          <div>
                            1 {fromCode} = <span className="text-slate-200 font-bold">{conversionResult.rate.toFixed(4)}</span> {toCode}
                          </div>
                          <div>
                            1 {toCode} = <span className="text-slate-200 font-bold">{conversionResult.inverseRate.toFixed(4)}</span> {fromCode}
                          </div>
                        </div>
                      </div>

                      {/* Quick Popular African Pairs */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] text-slate-400 font-medium block">
                          {isAr ? 'أزواج شائعة وسريعة:' : 'Popular Quick Pairs:'}
                        </span>
                        <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono">
                          {[
                            { from: 'USD', to: 'DZD' },
                            { from: 'EUR', to: 'DZD' },
                            { from: 'USD', to: 'EGP' },
                            { from: 'USD', to: 'NGN' },
                            { from: 'USD', to: 'ZAR' },
                            { from: 'DZD', to: 'MAD' },
                          ].map((p, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setFromCode(p.from);
                                setToCode(p.to);
                              }}
                              className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                                fromCode === p.from && toCode === p.to
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
                              }`}
                            >
                              {p.from}/{p.to}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2 & 3: قائمة العملات وأسعار الصرف الحية */}
                  {(activeTab === 'african' || activeTab === 'global') && (
                    <div className="space-y-2.5">
                      {/* Search Bar */}
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute top-2.5 right-3 rtl:right-3 ltr:left-3" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={isAr ? 'بحث عن عملة أو دولة...' : 'Search currency or nation...'}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl py-1.5 px-8 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      {/* Rates Table / List */}
                      <div className="space-y-1.5 max-h-[46vh] overflow-y-auto pr-1">
                        {filteredCurrencies.map((c) => {
                          const rateVsFrom = c.rateToUsd / (CURRENCY_MAP[fromCode]?.rateToUsd || 1);
                          return (
                            <div
                              key={c.code}
                              onClick={() => {
                                setToCode(c.code);
                                setActiveTab('converter');
                              }}
                              className="p-2 rounded-xl bg-slate-900/70 hover:bg-slate-850 border border-slate-800/80 hover:border-emerald-500/30 transition-all flex items-center justify-between cursor-pointer group"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-lg leading-none">{c.flag}</span>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-white group-hover:text-emerald-400 font-mono">
                                      {c.code}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-sans truncate max-w-[120px]">
                                      {isAr ? c.nameAr : c.nameEn}
                                    </span>
                                  </div>
                                  <span className="text-[9.5px] text-slate-500 block">
                                    {c.country}
                                  </span>
                                </div>
                              </div>

                              <div className="text-right rtl:text-right ltr:text-left font-mono">
                                <div className="text-xs font-bold text-slate-200">
                                  {rateVsFrom.toFixed(2)} <span className="text-[10px] text-slate-500">{c.symbol}</span>
                                </div>
                                <div className={`text-[10px] flex items-center justify-end gap-0.5 ${
                                  c.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                                }`}>
                                  {c.change24h >= 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                                  <span>{c.change24h >= 0 ? '+' : ''}{c.change24h}%</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </DraggableFloatingContainer>
  );
};
