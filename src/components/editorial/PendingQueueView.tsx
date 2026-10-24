import React from 'react';
import { 
  AlertTriangle, 
  Sparkles, 
  Edit3, 
  ShieldCheck, 
  CheckCircle2, 
  RotateCcw, 
  FileEdit, 
  User, 
  MessageSquare,
  Send
} from 'lucide-react';
import { Article } from '../../types';

interface PendingQueueViewProps {
  isAr: boolean;
  isSupervisor: boolean;
  pendingArticles: Article[];
  aiGeneratedArticles: Article[];
  editorArticles: Article[];
  pendingSubFilter: 'all' | 'ai' | 'editor';
  setPendingSubFilter: (filter: 'all' | 'ai' | 'editor') => void;
  handleOpenInEditor: (article: Article) => void;
  handlePublish: (articleId: string) => void;
  handleRequestEditorRevision: (article: Article) => void;
  handleEditorSubmitToSupervisor: (article: Article) => void;
}

export const PendingQueueView: React.FC<PendingQueueViewProps> = ({
  isAr,
  isSupervisor,
  pendingArticles,
  aiGeneratedArticles,
  editorArticles,
  pendingSubFilter,
  setPendingSubFilter,
  handleOpenInEditor,
  handlePublish,
  handleRequestEditorRevision,
  handleEditorSubmitToSupervisor
}) => {
  const listToDisplay = pendingSubFilter === 'ai' 
    ? aiGeneratedArticles 
    : pendingSubFilter === 'editor' 
    ? editorArticles 
    : pendingArticles;

  return (
    <div className="space-y-6 animate-in fade-in duration-200 w-full max-w-full min-w-0 mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 w-full max-w-full min-w-0">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
            <span className="truncate">{isAr ? 'منصة مراجعة واعتماد المقالات (غرفة إشراف المحررين والذكاء الاصطناعي)' : 'Pending Ingestion & Editorial Desk'}</span>
          </h2>
          <p className="text-xs text-slate-400">
            {isAr 
              ? 'يظهر للمشرف نوعان: مقالات مولدة بالذكاء الاصطناعي، ومقالات مرسلة من المحررين البشريين للاعتماد أو لإعادة التعديل.' 
              : 'Dual streams: Autonomous AI agent pipeline and Human Editor draft submissions awaiting review.'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1 rounded-full bg-rose-500/15 text-rose-300 text-xs font-bold border border-rose-500/30">
            {pendingArticles.length} {isAr ? 'إجمالي بانتظار الإجراء' : 'pending total'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth w-full max-w-full min-w-0">
        <button
          type="button"
          onClick={() => setPendingSubFilter('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            pendingSubFilter === 'all'
              ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400 font-black'
              : 'bg-slate-900/80 hover:bg-slate-850 text-slate-300 border border-slate-800'
          }`}
        >
          <span>{isAr ? 'كافة المقالات المعلقة' : 'All Pending'}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950/20 font-mono font-bold">
            {pendingArticles.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setPendingSubFilter('ai')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            pendingSubFilter === 'ai'
              ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400 font-black'
              : 'bg-slate-900/80 hover:bg-slate-850 text-slate-300 border border-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{isAr ? '1. مقالات الذكاء الاصطناعي والتوليد المباشر' : '1. AI Generated & Direct Ingestion'}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950/20 font-mono font-bold">
            {aiGeneratedArticles.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setPendingSubFilter('editor')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            pendingSubFilter === 'editor'
              ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400 font-black'
              : 'bg-slate-900/80 hover:bg-slate-850 text-slate-300 border border-slate-800'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5 text-blue-400" />
          <span>{isAr ? '2. مقالات ومسودات المحررين (للاعتماد أو التعديل)' : '2. Editor Submissions & Revisions'}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 font-mono font-bold">
            {editorArticles.length}
          </span>
        </button>
      </div>

      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-amber-950/30 border border-slate-800 text-xs text-slate-300 flex items-center justify-between gap-3 shadow-sm w-full max-w-full min-w-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="leading-relaxed">
            {isSupervisor 
              ? (isAr ? 'صلاحيات المشرف: قراءة كامل المسودة، اعتماد النشر المباشر للجمهور، أو إعادة طلب التعديل من المحررين مع كتابة الملاحظات وتوثيقها بالإشعارات.' : 'Supervisor Privileges: Read drafts, approve live publication, or request editorial revisions with feedback.')
              : (isAr ? 'صلاحيات المحرر: صياغة وتعديل التقارير، وإرسالها للمشرف للاعتماد والمصادقة، ومتابعة الملاحظات المطلوبة.' : 'Editor Privileges: Draft & modify articles, submit to supervisor for review, and iterate on critiques.')}
          </span>
        </div>
      </div>

      {listToDisplay.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#090D18] border border-slate-800 space-y-3 w-full max-w-full min-w-0">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-white">
            {isAr ? 'لا توجد مقالات معلقة في هذا القسم حالياً' : 'No pending articles in this section'}
          </h3>
          <p className="text-xs text-slate-400">
            {isAr 
              ? 'كافة المقالات تمت معالجتها. يمكنك استخدام "توليد فوري عشوائي" أو قيام المحررين بإرسال مسودات جديدة.' 
              : 'Queue clear. Commission a new report or submit an editor draft.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full max-w-full min-w-0">
          {listToDisplay.map((art) => {
            const isHumanEditorSubmission = art.editorSubmission || art.authorType === 'HUMAN_JOURNALIST' || art.authorType === 'HYBRID';
            const isRevisionRequested = art.status === 'revision_requested';

            return (
              <div
                key={art.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 shadow-md min-w-0 overflow-hidden break-words ${
                  isHumanEditorSubmission
                    ? 'bg-[#0B1220] border-blue-500/40 hover:border-blue-400'
                    : 'bg-slate-900 border-slate-800 hover:border-amber-500/50'
                }`}
              >
                <div className="flex items-center justify-between text-xs gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold truncate">
                    {art.countryName} · {art.sector || art.category}
                  </span>

                  {isHumanEditorSubmission ? (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border ${
                      isRevisionRequested 
                        ? 'bg-rose-950/60 text-rose-300 border-rose-500/50' 
                        : 'bg-blue-950/60 text-blue-300 border-blue-500/50'
                    }`}>
                      <Edit3 className="w-3 h-3" />
                      <span>{isRevisionRequested ? (isAr ? 'مطلوب تعديل من المحرر' : 'Revision Pending') : (isAr ? 'مرسل من محرر اقتصادي' : 'Editor Submission')}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950/50 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{isAr ? 'وكيل الذكاء الاصطناعي (AI)' : 'AI Autonomous'}</span>
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <User className="w-3 h-3 text-amber-400" />
                    <span className="font-semibold">
                      {isHumanEditorSubmission 
                        ? (art.authorName || art.editorSubmission?.editorName || (isAr ? 'المحرر الاقتصادي' : 'Economic Editor'))
                        : (isAr ? 'وكيل الذكاء الاصطناعي Gemini 3.6' : 'Autonomous Agent')}
                    </span>
                  </div>
                  <span className="font-mono text-slate-500 text-[10px]">{art.createdAt}</span>
                </div>

                <h4 
                  onClick={() => handleOpenInEditor(art)}
                  className="text-sm sm:text-base font-bold text-white hover:text-amber-400 transition-colors cursor-pointer line-clamp-2"
                >
                  {art.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {art.summary}
                </p>

                {art.reviewNotes && (
                  <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-[11px] space-y-1">
                    <span className="font-bold text-rose-300 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{isAr ? 'ملاحظات وتوجيهات المشرف للمحرر:' : 'Supervisor Revision Directive:'}</span>
                    </span>
                    <p className="text-rose-200 leading-snug line-clamp-2">
                      {art.reviewNotes}
                    </p>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleOpenInEditor(art)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <FileEdit className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'فتح في محرر الأخبار' : 'Open in Editor'}</span>
                  </button>

                  {isSupervisor ? (
                    <div className="flex items-center gap-1.5">
                      {isHumanEditorSubmission && (
                        <button
                          type="button"
                          onClick={() => handleRequestEditorRevision(art)}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold border border-rose-500/40 flex items-center gap-1 cursor-pointer transition-colors"
                          title={isAr ? 'إعادة طلب التعديل من المحرر مع كتابة الملاحظات' : 'Request Revision with Directive'}
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{isAr ? 'طلب تعديل' : 'Revise'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handlePublish(art.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center gap-1 shadow-md cursor-pointer transition-all active:scale-95"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isAr ? 'اعتماد ونشر' : 'Publish'}</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleEditorSubmitToSupervisor(art)}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black flex items-center gap-1 shadow-md cursor-pointer transition-all active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isAr ? 'إرسال للمشرف للاعتماد' : 'Submit to Supervisor'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
