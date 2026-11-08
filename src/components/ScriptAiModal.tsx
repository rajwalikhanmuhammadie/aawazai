import React, { useState } from 'react';
import { Sparkles, X, Wand2, ArrowRight, Check, Loader2, RefreshCw } from 'lucide-react';

interface ScriptAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScript: string;
  onApplyScript: (script: string) => void;
  lang: 'ur' | 'en';
  apiKey?: string;
}

export const ScriptAiModal: React.FC<ScriptAiModalProps> = ({
  isOpen,
  onClose,
  currentScript,
  onApplyScript,
  lang,
  apiKey,
}) => {
  const isUrdu = lang === 'ur';

  const [prompt, setPrompt] = useState('');
  const [action, setAction] = useState<string>('generate_urdu');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (apiKey) {
        headers['x-gemini-key'] = apiKey;
      }

      const res = await fetch('/api/script/assist', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt: prompt.trim(),
          currentText: currentScript,
          action,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to process script.');
      }
      setResult(data.text);
    } catch (err: any) {
      setError(err?.message || 'Error occurred while assisting with script.');
    } finally {
      setIsLoading(false);
    }
  };

  const actions = [
    {
      id: 'quran_tajweed_formatter',
      label: isUrdu ? 'تلاوت کلام پاک مع اعراب و وقوف' : 'Quran Recitation with Tajweed & Waqf',
      desc: isUrdu ? 'کسی بھی سورۃ کا اعراب و رموزِ اوقاف والا متن لائیں' : 'Fetch Surah text with Tashkeel & pause marks',
    },
    {
      id: 'generate_child_story',
      label: isUrdu ? 'بچوں کی پیاری کہانی لکھیں' : 'Write Cute Child Story',
      desc: isUrdu ? '7-8 سال کے بچے کی معصوم آواز اور تاثرات' : '7yo child dialogue with giggles & curiosity',
    },
    {
      id: 'generate_elder_advice',
      label: isUrdu ? 'دادا جان / بزرگوں کی نصیحت' : 'Grandfather Wisdom Speech',
      desc: isUrdu ? '70 سال کے شفیق بزرگ کی باوقار دھیمی آواز' : 'Elderly grandfather speech with slow warmth',
    },
    {
      id: 'generate_urdu',
      label: isUrdu ? 'اردو وائرل اسکرپٹ بنائیں' : 'Generate Urdu Viral Script',
      desc: isUrdu ? 'کسی بھی موضوع پر شارٹس یا یوٹیوب کے لیے' : 'For Shorts or YouTube from topic',
    },
    {
      id: 'generate_english',
      label: isUrdu ? 'انگریزی اسکرپٹ بنائیں' : 'Generate English Video Script',
      desc: isUrdu ? 'پرکشش یوٹیوب نریشن' : 'Catchy narration script',
    },
    {
      id: 'polish_vocal_tags',
      label: isUrdu ? 'سانس اور صوتی ٹیگز شامل کریں' : 'Add Breathing & Vocal Tags',
      desc: isUrdu ? 'موجودہ اسکرپٹ میں <breath>, <laugh> شامل کریں' : 'Add natural pauses & breaths',
    },
    {
      id: 'translate_to_urdu',
      label: isUrdu ? 'روانی سے اردو ترجمہ کریں' : 'Translate to Expressive Urdu',
      desc: isUrdu ? 'یوٹیوب اسٹائل سلیس اردو ترجمہ' : 'Idiomatic Urdu for videos',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto break-words">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isUrdu ? 'Gemini AI اسکرپٹ ڈائریکٹر' : 'Gemini Video Scriptwriter'}
              </h3>
              <p className="text-xs text-slate-400">
                {isUrdu ? 'ویڈیوز کے لیے پرکشش وائس اوور تیار کریں' : 'Craft captivating scripts for voiceover'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Type Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            {isUrdu ? 'آپ کیا کرنا چاہتے ہیں؟' : 'Select What You Want to Do:'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {actions.map((act) => {
              const active = action === act.id;
              return (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => setAction(act.id)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    active
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">{act.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{act.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Prompt Input */}
        {(action === 'generate_urdu' ||
          action === 'generate_english' ||
          action === 'generate_child_story' ||
          action === 'generate_elder_advice' ||
          action === 'quran_tajweed_formatter') && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              {action === 'quran_tajweed_formatter'
                ? (isUrdu ? 'سورۃ کا نام یا آیات کا نمبر درج کریں:' : 'Enter Surah Name or Ayah Range:')
                : isUrdu
                ? 'موضوع یا اہم نکتہ درج کریں:'
                : 'Topic or Key Idea:'}
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                action === 'quran_tajweed_formatter'
                  ? (isUrdu ? 'مثال: سورۃ الضحیٰ، سورۃ الفلق، یا سورۃ النصر مع اعراب...' : 'E.g., Surah Ad-Duha, Surah Al-Falaq, or Ayat al-Kursi...')
                  : action === 'generate_child_story'
                  ? (isUrdu ? 'مثال: ایک چوزہ اور تتلی کی دوستی کی معصوم کہانی...' : 'E.g., A puppy and a butterfly friendship...')
                  : action === 'generate_elder_advice'
                  ? (isUrdu ? 'مثال: وقت کی قدر اور والدین کا ادب...' : 'E.g., Valuing time and respecting parents...')
                  : isUrdu
                  ? 'مثال: 5 طریقے جن سے انسان ذہنی دباؤ کم کر سکتا ہے...'
                  : 'E.g., 5 mind-blowing habits of successful creators...'
              }
              dir="auto"
              className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {/* Current text preview if polishing */}
        {(action === 'polish_vocal_tags' || action === 'translate_to_urdu' || action === 'make_punchy') && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              {isUrdu ? 'موجودہ اسکرپٹ جس کو تبدیل کیا جائے گا:' : 'Current Script to Transform:'}
            </label>
            <div className="text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 max-h-24 overflow-y-auto italic">
              {currentScript || (isUrdu ? '(کوئی اسکرپٹ نہیں ہے، نیچے موضوع درج کریں)' : '(No script provided, please type topic below)')}
            </div>
            {!currentScript && (
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={isUrdu ? 'یہاں اپنا اسکرپٹ یا متن درج کریں...' : 'Enter your script here...'}
                className="w-full text-xs px-3 py-2 mt-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            )}
          </div>
        )}

        {/* Submit button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isLoading || (!prompt.trim() && !currentScript.trim())}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition active:scale-98"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isUrdu ? 'Gemini تیار کر رہا ہے...' : 'Gemini is crafting...'}</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>{isUrdu ? 'اسکرپٹ تیار کریں (AI Generate)' : 'Generate with Gemini'}</span>
            </>
          )}
        </button>

        {error && (
          <div className="text-xs p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
            {error}
          </div>
        )}

        {/* Generated Result Preview */}
        {result && (
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'تیار شدہ اسکرپٹ:' : 'Generated Script:'}</span>
              </span>
            </div>

            <textarea
              value={result}
              onChange={(e) => setResult(e.target.value)}
              rows={4}
              dir="auto"
              className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-slate-100 focus:outline-none focus:border-emerald-500 leading-relaxed"
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onApplyScript(result);
                  onClose();
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'اسکرپٹ ایڈیٹر میں ڈالیں' : 'Apply to Editor'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
