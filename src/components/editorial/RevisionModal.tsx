import React from 'react';
import { 
  MessageSquare, 
  X, 
  Send 
} from 'lucide-react';
import { Article } from '../../types';

interface RevisionModalProps {
  isAr: boolean;
  article: Article;
  revisionDirectiveNote: string;
  setRevisionDirectiveNote: (note: string) => void;
  onClose: () => void;
  onSubmit: (articleId: string, note: string) => void;
}

export const RevisionModal: React.FC<RevisionModalProps> = ({
  isAr,
  article,
  revisionDirectiveNote,
  setRevisionDirectiveNote,
  onClose,
  onSubmit
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0e172a] border border-rose-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-rose-400" />
            <span>{isAr ? 'طلب إعادة التعديل من المحرر مع كتابة الملاحظات' : 'Request Revision with Directive'}</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] text-slate-400 block">{isAr ? 'المقال المستهدف:' : 'Target Article:'}</span>
          <p className="text-xs font-bold text-amber-300 line-clamp-2">
            {article.title}
          </p>
          <p className="text-[11px] text-slate-400">
            {isAr ? 'المحرر الكاتب:' : 'Author/Editor:'}{' '}
            <span className="text-white font-semibold">
              {article.authorName || article.editorSubmission?.editorName || (isAr ? 'محرر اقتصادي' : 'Economic Editor')}
            </span>
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-white block">
            {isAr ? 'ملاحظات ونقد وتوجيهات المشرف للمحرر:' : 'Supervisor Critique Directive:'}
          </label>
          <textarea
            rows={4}
            value={revisionDirectiveNote}
            onChange={(e) => setRevisionDirectiveNote(e.target.value)}
            placeholder={isAr 
              ? "اكتب توجيهاتك التحريرية المحددة (مثال: تدقيق أرقام البنك المركزي، تعديل صياغة المقدمة، تعميق فقرة السيولة النقدية، أو إضافة مصادر رسمية)..."
              : "Enter critique notes for the editor..."}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500/70 leading-relaxed"
          />
          <p className="text-[10px] text-slate-400">
            {isAr 
              ? 'سيتم إشعار المحرر فوراً بملاحظاتك وتثبيت التوجيهات في سجل المقال ليقوم بتعديله وإعادة إرساله.'
              : 'The editor will receive an immediate notification with these notes.'}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>

          <button
            type="button"
            disabled={!revisionDirectiveNote.trim()}
            onClick={() => onSubmit(article.id, revisionDirectiveNote)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isAr ? 'إرسال الملاحظات للمحرر وتوثيقها' : 'Dispatch Directive to Editor'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
