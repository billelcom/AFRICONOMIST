import React from 'react';
import { MarketTickerItem } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface LiveTickerProps {
  items: MarketTickerItem[];
  lang: 'ar' | 'en';
}

export const LiveTicker: React.FC<LiveTickerProps> = ({ items, lang }) => {
  // Duplicate items for continuous seamless scroll
  const displayItems = [...items, ...items];

  return (
    <div 
      className="bg-[#0b101c] border-y border-slate-800 text-xs overflow-hidden py-2 select-none"
      dir="ltr"
      role="region"
      aria-label="Live Market Ticker"
    >
      <div className="flex animate-ticker whitespace-nowrap">
        {displayItems.map((item, index) => (
          <div 
            key={`${item.symbol}-${index}`} 
            className="flex items-center gap-2 px-4 border-r border-slate-800/80 hover:bg-slate-800/40 transition-colors cursor-pointer"
          >
            <span className="font-semibold text-slate-200 font-mono tracking-tight">{item.symbol}</span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              {lang === 'ar' ? item.nameAr : item.name}
            </span>
            <span className="font-mono text-slate-100 font-medium">{item.price}</span>
            <span className={`flex items-center gap-0.5 font-mono text-[11px] font-semibold ${item.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {item.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
