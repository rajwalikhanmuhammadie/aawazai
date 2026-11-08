import React, { useRef, useState } from 'react';
import { Sparkles, Clock, FileText, Trash2, Copy, Check, Wand2, Hash, BookOpen } from 'lucide-react';
import { SCRIPT_TEMPLATES, ScriptTemplate } from '../data/templates';
import { VoiceName, AgeCategory } from '../types';

interface ScriptEditorProps {
  text: string;
  onChangeText: (t: string) => void;
  onOpenAiAssistant: () => void;
  onSelectTemplate: (template: ScriptTemplate) => void;
  lang: 'ur' | 'en';
  onQuickInsert: (tag: string) => void;
  selectedModel: string;
  selectedAgeCategory: AgeCategory;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  text,
  onChangeText,
  onOpenAiAssistant,
  onSelectTemplate,
  lang,
  onQuickInsert,
  selectedModel,
  selectedAgeCategory,
}) => {
  const isUrdu = lang === 'ur';
  const isQari = selectedAgeCategory === 'qari';
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  // Calculate stats
  const trimmed = text.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
  const charCount = text.length;

  // Approximate duration: average speaking rate ~130 wpm, but Quran recitation is slower (~70-80 wpm)
  const rate = isQari ? 80 : 135;
  const estimatedSeconds = Math.round(wordCount > 0 ? (wordCount / rate) * 60 : 0);

  const getFormatBadge = (sec: number) => {
    if (sec === 0) return null;
    if (isQari) {
      return { label: `تلاوت کا تخمینہ: ~${sec}s`, color: 'text-emerald-400 bg-emerald-500/10' };
    }
    if (sec <= 15) return { label: 'Short / 15s Story', color: 'text-emerald-400 bg-emerald-500/10' };
    if (sec <= 45) return { label: 'Reel / Shorts (~30s)', color: 'text-indigo-400 bg-indigo-500/10' };
    if (sec <= 75) return { label: 'TikTok / Shorts (~60s)', color: 'text-violet-400 bg-violet-500/10' };
    return { label: `Long-form (${Math.floor(sec / 60)}m ${sec % 60}s)`, color: 'text-cyan-400 bg-cyan-500/10' };
  };

  const formatInfo = getFormatBadge(estimatedSeconds);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsertTag = (tag: string) => {
    if (!textareaRef.current) {
      onQuickInsert(tag);
      return;
    }
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const prev = text;
    const next = prev.substring(0, start) + ' ' + tag + ' ' + prev.substring(end);
    onChangeText(next);
    setTimeout(() => {
      el.focus();
      const pos = start + tag.length + 2;
      el.setSelectionRange(pos, pos);
    }, 50);
  };

  // Filter templates matching current age category if applicable
  const displayTemplates = SCRIPT_TEMPLATES.filter((t) => {
    if (selectedAgeCategory === 'all') return true;
    return t.ageGroup === selectedAgeCategory;
  });

  const templatesToShow = displayTemplates.length > 0 ? displayTemplates : SCRIPT_TEMPLATES;

  return (
    <div className="space-y-3">
      {/* Editor Header with Actions */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 shrink-0">
          {isQari ? (
            <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : (
            <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          )}
          <span className="leading-normal break-words">
            {isQari
              ? (isUrdu ? 'متنِ تلاوتِ کلام پاک (Recitation Script)' : 'Quranic Recitation Text')
              : (isUrdu ? 'ویڈیو اسکرپٹ (Video Script)' : 'Video Script')}
          </span>
        </label>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Templates toggle */}
          <button
            type="button"
            onClick={() => setShowTemplates(!showTemplates)}
            className="text-xs px-2 sm:px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition flex items-center gap-1 leading-normal"
          >
            <span>📜</span>
            <span className="truncate">
              {isQari
                ? (isUrdu ? 'منتخب سورتیں' : 'Surahs')
                : (isUrdu ? 'نمونہ اسکرپٹس' : 'Templates')}
            </span>
          </button>

          {/* AI Script Assistant */}
          <button
            type="button"
            onClick={onOpenAiAssistant}
            className="text-xs px-2 sm:px-2.5 py-1 rounded-lg bg-gradient-to-r from-indigo-600/30 to-fuchsia-600/30 hover:from-indigo-600/50 hover:to-fuchsia-600/50 border border-indigo-500/40 text-indigo-200 transition flex items-center gap-1 shadow-sm leading-normal"
          >
            <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
            <span className="truncate">{isUrdu ? 'AI مددگار' : 'AI Assistant'}</span>
          </button>
        </div>
      </div>

      {/* Templates Drawer / Popover */}
      {showTemplates && (
        <div className="p-3.5 rounded-xl bg-slate-900/95 border border-slate-800 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <span>📖</span>
              <span>
                {isQari
                  ? (isUrdu ? 'تلاوت کے لیے قرآنی سورتیں مع اعراب و رموزِ اوقاف:' : 'Select Quranic Verses with Tajweed & Waqf:')
                  : (isUrdu ? 'ریڈی میڈ اسکرپٹ منتخب کریں:' : 'Select a ready-made template:')}
              </span>
            </span>
            <button
              onClick={() => setShowTemplates(false)}
              className="text-slate-500 hover:text-slate-300 text-xs px-1"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
            {templatesToShow.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => {
                  onSelectTemplate(tmpl);
                  setShowTemplates(false);
                }}
                className="text-left p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-900 transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {isUrdu ? tmpl.urduCategory : tmpl.category}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {tmpl.recommendedVoice}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                  {isUrdu ? tmpl.urduTitle : tmpl.title}
                </h5>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed font-arabic" dir="auto">
                  {tmpl.text}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Textarea */}
      <div className="relative rounded-2xl border border-slate-800 bg-slate-900/40 focus-within:border-indigo-500/80 focus-within:ring-1 focus-within:ring-indigo-500/40 transition">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder={
            isQari
              ? 'یہاں عربی تلاوت کا متن اعراب اور رموز اوقاف کے ساتھ لکھیے...\nمثال: بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ <breath>\nالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ <breath>'
              : isUrdu
              ? 'یہاں اپنی ویڈیو کا اسکرپٹ اردو یا انگریزی میں لکھیے (مرد، عورت، بچے یا بزرگ کی آواز کے لیے)...\nمثال: کیا آپ جانتے ہیں کہ کامیابی کا راز کیا ہے؟ <breath> آج ہم بتائیں گے...'
              : 'Type your narration script here in Urdu or English...'
          }
          dir="auto"
          rows={5}
          className={`w-full p-3.5 bg-transparent text-slate-100 placeholder-slate-500 leading-relaxed focus:outline-none resize-y min-h-[140px] ${
            isQari ? 'text-base sm:text-lg font-arabic tracking-wide' : 'text-sm sm:text-base'
          }`}
        />

        {/* Quick Toolbar (Waqf symbols for Quran, or Vocal cues for videos) */}
        <div className="px-3 py-2.5 border-t border-slate-800/60 bg-slate-950/60 rounded-b-2xl flex items-center justify-between flex-wrap gap-2">
          {/* If Qari mode: Show Tajweed & Waqf Symbols */}
          {isQari ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-emerald-400 mr-1 flex items-center gap-1">
                <span>📖</span>
                <span>{isUrdu ? 'رموزِ اوقاف (وقوف):' : 'Waqf Marks:'}</span>
              </span>
              <button
                type="button"
                onClick={() => handleInsertTag('۝ <breath>')}
                className="text-xs px-2.5 py-1 rounded-md bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 transition font-bold"
                title="آیت کا اختتام اور تلاوتی سانس"
              >
                ۝ {isUrdu ? 'آیت + سانس' : 'Ayah stop'}
              </button>
              <button
                type="button"
                onClick={() => handleInsertTag('ۘ <breath>')}
                className="text-xs px-2 py-1 rounded-md bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 transition font-bold"
                title="وقف لازم - لازماً ٹھہریں"
              >
                ۘ {isUrdu ? 'وقف لازم' : 'Waqf Lazim'}
              </button>
              <button
                type="button"
                onClick={() => handleInsertTag('ۚ <breath>')}
                className="text-xs px-2 py-1 rounded-md bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 transition font-bold"
                title="وقف جائز - ٹھہرنا بہتر ہے"
              >
                ۚ {isUrdu ? 'وقف جائز' : 'Waqf Jaiz'}
              </button>
              <button
                type="button"
                onClick={() => handleInsertTag('ۗ <breath>')}
                className="text-xs px-2 py-1 rounded-md bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 transition font-bold"
                title="الوقف اولیٰ (ٹھہرنا بہتر ہے)"
              >
                ۗ {isUrdu ? 'قف' : 'Stop'}
              </button>
              <button
                type="button"
                onClick={() => handleInsertTag('<breath>')}
                className="text-xs px-2 py-1 rounded-md bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-700/60 transition"
                title="تلاوتی سانس کا وقفہ"
              >
                &lt;breath&gt; {isUrdu ? 'سانس' : 'Breath'}
              </button>
            </div>
          ) : (
            /* Standard Video Vocal tags */
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400 hidden sm:inline mr-1">
                {isUrdu ? 'صوتی اثرات:' : 'Vocal cues:'}
              </span>
              <button
                type="button"
                onClick={() => handleInsertTag('<breath>')}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-slate-700/60 transition"
                title="Add natural breathing pause"
              >
                &lt;breath&gt; {isUrdu ? 'سانس' : 'breath'}
              </button>
              <button
                type="button"
                onClick={() => handleInsertTag('<laugh>')}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-slate-700/60 transition"
                title="Add gentle laugh"
              >
                &lt;laugh&gt; {isUrdu ? 'ہنسی' : 'laugh'}
              </button>
              <button
                type="button"
                onClick={() => handleInsertTag('<gasp>')}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-rose-300 border border-slate-700/60 transition"
                title="Add gasp of surprise"
              >
                &lt;gasp&gt; {isUrdu ? 'حیرت' : 'gasp'}
              </button>
              <button
                type="button"
                onClick={() => handleInsertTag('...')}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-indigo-300 border border-slate-700/60 transition"
                title="Add deliberate pause"
              >
                ... {isUrdu ? 'وقفہ' : 'pause'}
              </button>
            </div>
          )}

          {/* Action icons */}
          <div className="flex items-center gap-1.5 ml-auto">
            {text && (
              <>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition"
                  title="Copy text"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => onChangeText('')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition"
                  title="Clear text"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Live Duration and Word Count Status */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Hash className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {wordCount} {isUrdu ? 'الفاظ' : 'words'} ({charCount} {isUrdu ? 'حروف' : 'chars'})
            </span>
          </span>

          {estimatedSeconds > 0 && (
            <span className="flex items-center gap-1 text-slate-300 font-medium">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                ~{estimatedSeconds}s {isUrdu ? 'دورانیہ' : 'duration'}
              </span>
            </span>
          )}
        </div>

        {formatInfo && (
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${formatInfo.color}`}>
            {formatInfo.label}
          </span>
        )}
      </div>
    </div>
  );
};
