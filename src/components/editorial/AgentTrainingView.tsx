import React from 'react';
import { 
  Brain, 
  Layers, 
  Database, 
  ShieldCheck, 
  Check, 
  FileText, 
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';
import { SimulationWorkbench } from './SimulationWorkbench';
import { JOURNALISTIC_GENRES, ECONOMIC_SECTORS } from '../../data/reportOptions';
import { 
  getGenreDirective, 
  getSectorDirective 
} from '../../lib/agents/personasRegistry';
import { 
  ALL_OFFICIAL_GROUNDING_SOURCES, 
  getOfficialSourcesForCountry 
} from '../../lib/agents/officialSourcesLedger';

interface AgentTrainingViewProps {
  isAr: boolean;
  trainingSavedAlert: boolean;
  trainingSubTab: 'matrix' | 'genres' | 'sectors' | 'sources' | 'directives';
  setTrainingSubTab: (tab: 'matrix' | 'genres' | 'sectors' | 'sources' | 'directives') => void;
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
  activeGenreDetailId: string;
  setActiveGenreDetailId: (id: string) => void;
  activeSectorDetailId: string;
  setActiveSectorDetailId: (id: string) => void;
  sourcesSearchQuery: string;
  setSourcesSearchQuery: (q: string) => void;
  sourcesCategoryFilter: 'all' | 'central_bank' | 'stock_exchange' | 'continental_body';
  setSourcesCategoryFilter: (f: 'all' | 'central_bank' | 'stock_exchange' | 'continental_body') => void;
  trainingTone: 'financial_times' | 'the_economist' | 'bloomberg';
  setTrainingTone: (t: 'financial_times' | 'the_economist' | 'bloomberg') => void;
  mandatoryCitationsStrictness: number;
  setMandatoryCitationsStrictness: (s: number) => void;
  selectedAiModel: string;
  setSelectedAiModel: (m: string) => void;
  setTrainingSavedAlert: (a: boolean) => void;
}

export const AgentTrainingView: React.FC<AgentTrainingViewProps> = ({
  isAr,
  trainingSavedAlert,
  trainingSubTab,
  setTrainingSubTab,
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
  setPendingSubFilter,
  activeGenreDetailId,
  setActiveGenreDetailId,
  activeSectorDetailId,
  setActiveSectorDetailId,
  sourcesSearchQuery,
  setSourcesSearchQuery,
  sourcesCategoryFilter,
  setSourcesCategoryFilter,
  trainingTone,
  setTrainingTone,
  mandatoryCitationsStrictness,
  setMandatoryCitationsStrictness,
  selectedAiModel,
  setSelectedAiModel,
  setTrainingSavedAlert
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200 w-full max-w-full mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2.5">
            <Brain className="w-6 h-6 text-purple-400" />
            <span>{isAr ? 'منصة تدريب وهندسة وكلاء الذكاء الاصطناعي الصحفيين' : 'Journalistic AI Agents Training & Persona Engine'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isAr 
              ? 'تدريب وتخصيص هويات الوكلاء وفق مصفوفة ثلاثية الأبعاد: 18 نوعاً صحفياً × 28 قطاعاً اقتصادياً × 54 دولة إفريقية، ببروتوكول Zero Trust.' 
              : 'Training 3D Specialized Agent Matrix: 18 Genres × 28 Economic Sectors × 54 African Nations with Zero-Trust safeguards.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 text-xs font-mono font-bold border border-purple-500/30 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>18 {isAr ? 'وكيل نوع صحفي' : 'Genre Agents'}</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-mono font-bold border border-amber-500/30 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>28 {isAr ? 'وكيل قطاع' : 'Sector Agents'}</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>54 {isAr ? 'دولة جاهزة' : 'Nations'}</span>
          </span>
        </div>
      </div>

      {trainingSavedAlert && (
        <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center gap-2 w-full max-w-full">
          <Check className="w-4 h-4 text-purple-400 shrink-0" />
          <span>{isAr ? 'تم حفظ معايير التدريب بنجاح وتطبيقها على خط الإنتاج والوكلاء!' : 'Agent directives updated successfully!'}</span>
        </div>
      )}

      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-800/80">
        {[
          { id: 'matrix', nameAr: '⚡ محاكاة المصفوفة الثلاثية الحية', nameEn: '3D Matrix Sandbox', icon: Sparkles },
          { id: 'genres', nameAr: '📰 تدريب وكلاء الأنواع الصحفية (18)', nameEn: '18 Journalistic Genres', icon: FileText },
          { id: 'sectors', nameAr: '📊 تدريب وكلاء القطاعات (28)', nameEn: '28 Economic Sectors', icon: Database },
          { id: 'sources', nameAr: '🏛️ سجل المصادر وتدقيق الحقائق', nameEn: 'Official Sources & Fact-Check', icon: ShieldCheck },
          { id: 'directives', nameAr: '⚙️ الحوكمة والنبرة والذكاء الاصطناعي', nameEn: 'Directives & Models', icon: SlidersHorizontal }
        ].map((st) => {
          const Icon = st.icon;
          const isActive = trainingSubTab === st.id;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => setTrainingSubTab(st.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20 ring-1 ring-purple-400'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{isAr ? st.nameAr : st.nameEn}</span>
            </button>
          );
        })}
      </div>

      {trainingSubTab === 'matrix' && (
        <SimulationWorkbench
          isAr={isAr}
          simCountry={simCountry}
          setSimCountry={setSimCountry}
          simSector={simSector}
          setSimSector={setSimSector}
          simGenre={simGenre}
          setSimGenre={setSimGenre}
          isSimulating={isSimulating}
          handleRunMatrixSimulation={handleRunMatrixSimulation}
          simulationResult={simulationResult}
          setActiveTab={setActiveTab}
          setPendingSubFilter={setPendingSubFilter}
        />
      )}

      {trainingSubTab === 'genres' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {JOURNALISTIC_GENRES.map((g) => {
              const isSelected = activeGenreDetailId === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setActiveGenreDetailId(g.id)}
                  className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600/20 border-purple-500 text-white shadow-md ring-1 ring-purple-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold truncate">{g.nameAr}</div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">{g.category}</div>
                </button>
              );
            })}
          </div>

          {(() => {
            const directive = getGenreDirective(activeGenreDetailId);
            return (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {directive.nameEn}
                    </span>
                    <h3 className="text-base font-black text-white mt-1 flex items-center gap-2">
                      <span>{directive.nameAr}</span>
                      <span className="text-xs text-amber-400 font-normal">({directive.agentRoleAr})</span>
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300 font-mono">
                      {isAr ? 'النطاق اللفظي:' : 'Target:'} {directive.wordCountTarget.min} - {directive.wordCountTarget.max} {isAr ? 'كلمة' : 'words'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                    <h4 className="text-xs font-black text-purple-300 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>{isAr ? 'الهيكل التحريري الإلزامي للوكيل:' : 'Mandatory Structural Rubric:'}</span>
                    </h4>
                    <ol className="space-y-1.5 text-xs text-slate-300 pr-4 list-decimal">
                      {directive.structuralTemplate.map((step, idx) => (
                        <li key={idx} className="leading-relaxed">{step}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                    <h4 className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isAr ? 'الأسئلة الصحفية الإلزامية التي يتقصى عنها:' : 'Core Investigative Questions:'}</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300 pr-4 list-disc">
                      {directive.mandatoryQuestions.map((q, idx) => (
                        <li key={idx} className="leading-relaxed">{q}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-500 font-bold block mb-1">{isAr ? 'ضوابط النبرة والصوت الصحفي:' : 'Tone & Voice Guidelines:'}</span>
                    <p className="text-slate-300 leading-relaxed">{directive.toneGuidelines}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-500 font-bold block mb-1">{isAr ? 'شرط التوثيق والمصادر المعتمدة:' : 'Citation Rule:'}</span>
                    <p className="text-emerald-400 leading-relaxed">{directive.citationRequirement}</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {trainingSubTab === 'sectors' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 max-h-52 overflow-y-auto p-1 border border-slate-800/80 rounded-2xl bg-slate-950/50 no-scrollbar">
            {ECONOMIC_SECTORS.map((s) => {
              const isSelected = activeSectorDetailId === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSectorDetailId(s.id)}
                  className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500 text-white shadow-md ring-1 ring-amber-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold truncate">{s.nameAr}</div>
                  <div className="text-[9px] text-slate-500 truncate mt-0.5">{s.groupNameAr}</div>
                </button>
              );
            })}
          </div>

          {(() => {
            const sectorDir = getSectorDirective(activeSectorDetailId);
            return (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {sectorDir.nameEn}
                    </span>
                    <h3 className="text-base font-black text-white mt-1 flex items-center gap-2">
                      <span>{sectorDir.nameAr}</span>
                      <span className="text-xs text-purple-400 font-normal">({sectorDir.specialistTitleAr})</span>
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-black text-amber-400">{isAr ? 'المعجم المالي والمصطلحات الإلزامية:' : 'Domain Lexicon:'}</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {sectorDir.keyTerminologies.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[11px] border border-slate-800">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-black text-purple-400">{isAr ? 'المؤشرات الحسابية المعيارية:' : 'Benchmark Metrics:'}</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {sectorDir.benchmarkMetrics.map((m, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-purple-300 font-mono text-[11px] border border-slate-800">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-black text-emerald-400">{isAr ? 'المؤسسات الرسمية المعتمدة:' : 'Trusted Institutions:'}</h4>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {sectorDir.trustedInstitutions.map((inst, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>{inst}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                  <span className="text-slate-500 font-bold block mb-1">{isAr ? 'التوجيه المنهجي لوكيل القطاع:' : 'Sector Directive:'}</span>
                  <p className="text-slate-300 leading-relaxed font-mono">{sectorDir.systemDirectivePrompt}</p>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {trainingSubTab === 'sources' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={sourcesSearchQuery}
                onChange={(e) => setSourcesSearchQuery(e.target.value)}
                placeholder={isAr ? 'البحث في سجل المصادر الرسمية (البنوك المركزية، الوزارات، الهيئات)...' : 'Search official sources ledger...'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sourcesCategoryFilter}
                onChange={(e) => setSourcesCategoryFilter(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="all">{isAr ? 'كافة الفئات' : 'All Categories'}</option>
                <option value="central_bank">{isAr ? 'بنوك مركزية' : 'Central Banks'}</option>
                <option value="stock_exchange">{isAr ? 'بورصات مالية' : 'Stock Exchanges'}</option>
                <option value="continental_body">{isAr ? 'هيئات قارية' : 'Continental Bodies'}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALL_OFFICIAL_GROUNDING_SOURCES
              .filter(s => {
                if (sourcesCategoryFilter !== 'all' && s.category !== sourcesCategoryFilter) return false;
                if (!sourcesSearchQuery) return true;
                return s.nameEn.toLowerCase().includes(sourcesSearchQuery.toLowerCase()) || 
                       s.nameAr.includes(sourcesSearchQuery) || 
                       s.country.includes(sourcesSearchQuery);
              })
              .slice(0, 30)
              .map((source, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition-colors space-y-2 shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{isAr ? source.nameAr : source.nameEn}</h4>
                      <span className="text-[10px] text-slate-500">{source.country}</span>
                    </div>
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">{source.category}</span>
                    <span className="text-emerald-400 font-bold">100% Verified</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {trainingSubTab === 'directives' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <SlidersHorizontal className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-bold text-white">
                {isAr ? 'حوكمة النبرة التحريرية والذكاء الاصطناعي' : 'Editorial Tone & AI Governance'}
              </h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">{isAr ? 'النبرة التحريرية المعتمدة (Tone):' : 'Editorial Tone:'}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'financial_times', label: 'Financial Times' },
                    { id: 'the_economist', label: 'The Economist' },
                    { id: 'bloomberg', label: 'Bloomberg' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTrainingTone(t.id as any)}
                      className={`py-2 rounded-xl text-[10px] font-bold border transition-all ${
                        trainingTone === t.id
                          ? 'bg-purple-600 border-purple-400 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">{isAr ? 'صرامة التوثيق والمصادر (Citations):' : 'Citation Strictness:'}</label>
                  <span className="text-xs font-mono text-purple-400 font-bold">{mandatoryCitationsStrictness}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={mandatoryCitationsStrictness}
                  onChange={(e) => setMandatoryCitationsStrictness(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">{isAr ? 'محرك الذكاء الاصطناعي النشط:' : 'Active AI Model:'}</label>
                <select
                  value={selectedAiModel}
                  onChange={(e) => setSelectedAiModel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="gemini-3.6-flash">Gemini 3.6 Flash (Fast & Analytical)</option>
                  <option value="gemini-3.6-pro">Gemini 3.6 Pro (Deep Reasoning)</option>
                  <option value="gemini-ultra">Gemini 1.5 Ultra (Strategic)</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setTrainingSavedAlert(true);
                  setTimeout(() => setTrainingSavedAlert(false), 3000);
                }}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-lg transition-all"
              >
                {isAr ? 'حفظ وتطبيق إعدادات الحوكمة' : 'Save & Deploy Governance'}
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/20 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>{isAr ? 'بروتوكولات الأمان والنزاهة (Zero-Trust)' : 'Zero-Trust Security Protocols'}</span>
            </h3>
            <div className="space-y-3">
              {[
                { titleAr: 'تحقق الهوية المزدوجة', titleEn: 'MFA Identity Check', descAr: 'لا يمكن للوكلاء النشر دون مصادقة بشرية.', descEn: 'Agents cannot publish without human MFA.' },
                { titleAr: 'مطابقة المصادر اللحظية', titleEn: 'Real-time Grounding', descAr: 'فحص كل معلومة مقابل سجل المصادر المعتمد.', descEn: 'Validate all data against official registry.' },
                { titleAr: 'تشفير بيانات MongoDB', titleEn: 'DB Encryption', descAr: 'تشفير كافة التقارير قيد المراجعة في السحابة.', descEn: 'Encrypted cloud storage for drafts.' }
              ].map((p, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                  <h4 className="text-xs font-bold text-emerald-300">{isAr ? p.titleAr : p.titleEn}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{isAr ? p.descAr : p.descEn}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
