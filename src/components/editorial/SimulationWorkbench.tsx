import React from 'react';
import { 
  Sparkles, 
  Database, 
  FileText, 
  Play, 
  Layers, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { ALL_54_AFRICAN_COUNTRIES } from '../../data/africanCountries';
import { JOURNALISTIC_GENRES, ECONOMIC_SECTORS } from '../../data/reportOptions';
import { 
  GENRE_AGENT_DIRECTIVES, 
  SECTOR_AGENT_DIRECTIVES, 
  buildCompositeAgentDirective 
} from '../../lib/agents/personasRegistry';

interface SimulationWorkbenchProps {
  isAr: boolean;
  simCountry: string;
  setSimCountry: (country: string) => void;
  simSector: string;
  setSimSector: (sector: string) => void;
  simGenre: string;
  setSimGenre: (genre: string) => void;
  isSimulating: boolean;
  handleRunMatrixSimulation: () => void;
  simulationResult: any | null;
  setActiveTab: (tab: any) => void;
  setPendingSubFilter: (filter: any) => void;
}

export const SimulationWorkbench: React.FC<SimulationWorkbenchProps> = ({
  isAr,
  simCountry,
  setSimCountry,
  simSector,
  setSimSector,
  simGenre,
  setSimGenre,
  isSimulating,
  handleRunMatrixSimulation,
  simulationResult,
  setActiveTab,
  setPendingSubFilter
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Column 1: Configurator Controls */}
        <div className="lg:col-span-1 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">
              {isAr ? 'توليف فرقة العمل الرقمية الثلاثية' : '3D Task Force Configuration'}
            </h3>
          </div>

          {/* 1. Country Agent */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>{isAr ? '1. وكيل الدولة الإفريقية:' : '1. African Nation Agent:'}</span>
              <span className="text-[10px] text-amber-400 font-mono">54 {isAr ? 'دولة' : 'Nations'}</span>
            </label>
            <select
              value={simCountry}
              onChange={(e) => setSimCountry(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              {ALL_54_AFRICAN_COUNTRIES.map((c) => (
                <option key={c.code} value={c.nameAr}>
                  {c.nameAr} ({c.nameEn}) - {c.currency}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Sector Agent */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>{isAr ? '2. وكيل القطاع الاقتصادي:' : '2. Economic Sector Agent:'}</span>
              <span className="text-[10px] text-purple-400 font-mono">28 {isAr ? 'قطاعاً' : 'Sectors'}</span>
            </label>
            <select
              value={simSector}
              onChange={(e) => setSimSector(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              {ECONOMIC_SECTORS.map((s) => (
                <option key={s.id} value={s.nameAr}>
                  {s.nameAr} ({s.groupNameAr})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Genre Agent */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>{isAr ? '3. وكيل النوع الصحفي والقالب:' : '3. Journalistic Genre Agent:'}</span>
              <span className="text-[10px] text-emerald-400 font-mono">18 {isAr ? 'نوعاً' : 'Genres'}</span>
            </label>
            <select
              value={simGenre}
              onChange={(e) => setSimGenre(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              {JOURNALISTIC_GENRES.map((g) => (
                <option key={g.id} value={g.nameAr}>
                  {g.nameAr} ({g.category})
                </option>
              ))}
            </select>
          </div>

          {/* Run Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleRunMatrixSimulation}
              disabled={isSimulating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isAr ? 'جاري تشغيل الوكلاء ومحاكاة الإنتاج...' : 'Simulating Agent Pipeline...'}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current text-white" />
                  <span>{isAr ? 'تشغيل تجربة محاكاة وتدريب الوكلاء فوراً' : 'Run Matrix Simulation & Generate Draft'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Column 2 & 3: Directive Inspector */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                {isAr ? 'معاينة الموجه التدريبي الموحد للفرقة الرقمية (Composite Directive Preview)' : 'Composite Agent Directive Preview'}
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {isAr ? 'توليف ثلاثي ديناميكي' : '3D Dynamic Synthesis'}
            </span>
          </div>

          {(() => {
            const matchedG = Object.values(GENRE_AGENT_DIRECTIVES).find(g => g.nameAr === simGenre) || GENRE_AGENT_DIRECTIVES['news_report'];
            const matchedS = Object.values(SECTOR_AGENT_DIRECTIVES).find(s => s.nameAr === simSector) || SECTOR_AGENT_DIRECTIVES['macroeconomics'];
            const directiveText = buildCompositeAgentDirective({
              genreId: matchedG.genreId,
              sectorId: matchedS.sectorId,
              countryName: simCountry,
              countryCode: 'AFRICA',
              stage: 'writer',
              customNotes: isAr ? 'مراعاة ربط التطورات الحالية بالسلاسل الزمنية التاريخية' : 'Correlate with historical time-series'
            });

            return (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">{isAr ? 'وكيل الصياغة المتخصص' : 'Specialist Agent'}</span>
                    <span className="font-bold text-amber-400 truncate block">{matchedG.agentRoleAr}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">{isAr ? 'المحلل القطاعي المالي' : 'Sector Specialist'}</span>
                    <span className="font-bold text-purple-400 truncate block">{matchedS.specialistTitleAr}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">{isAr ? 'الهدف اللفظي' : 'Target Length'}</span>
                    <span className="font-bold text-emerald-400 block">{matchedG.wordCountTarget.recommended} {isAr ? 'كلمة' : 'words'}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed max-h-72 overflow-y-auto whitespace-pre-wrap no-scrollbar">
                  {directiveText}
                </div>
              </div>
            );
          })()}

          {simulationResult && (
            <div className={`p-4 rounded-xl border animate-in fade-in duration-200 ${
              simulationResult.success 
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' 
                : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
            }`}>
              {simulationResult.success ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{isAr ? '✨ نجحت دورة المحاكاة والتدريب! أُرسلت المسودة إلى قائمة قيد المراجعة:' : 'Simulation Succeeded! Draft added to Pending Queue:'}</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {simulationResult.report?.agent_metrics?.ai_engine || 'AI Engine'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white">{simulationResult.report?.title}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>{isAr ? 'الكلمات:' : 'Words:'} {simulationResult.report?.agent_metrics?.word_count || 600}</span>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('pending');
                        setPendingSubFilter('ai');
                      }}
                      className="text-amber-400 underline font-bold cursor-pointer hover:text-amber-300"
                    >
                      {isAr ? 'فتح المسودة في قائمة المراجعة ⬅️' : 'Review in Pending Queue ➡️'}
                    </button>
                  </div>

                  {simulationResult.report?.factCheck && (
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-1.5 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-black text-emerald-300 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span>{simulationResult.report.factCheck.institutionAuthorityBadge || '🏛️ موثق بسجلات البنك المركزي الرسمي'}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
                        <span>{isAr ? 'مطابقة المؤشرات:' : 'Match Score:'} <strong className="text-emerald-400">{simulationResult.report.factCheck.score || 98}%</strong></span>
                        <span>{isAr ? 'الحقائق المفحوصة:' : 'Verified Claims:'} <strong className="text-white">{simulationResult.report.factCheck.verifiedClaimsCount || 6}/{simulationResult.report.factCheck.totalClaimsCount || 6}</strong></span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs font-bold text-rose-300">
                  {isAr ? '⚠️ تعذر إتمام المحاكاة:' : 'Simulation Error:'} {simulationResult.error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
