import React from 'react';
import { X, Video, Sliders, Sparkles, CheckCircle2, Film } from 'lucide-react';

interface VideoTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ur' | 'en';
}

export const VideoTipsModal: React.FC<VideoTipsModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;
  const isUrdu = lang === 'ur';

  const tips = [
    {
      title: isUrdu ? 'CapCut اور موبائل ویڈیو ایپس میں شامل کرنا' : 'Importing into CapCut, VN & InShot',
      desc: isUrdu
        ? 'یہاں سے ڈاؤنلوڈ ہونے والی .WAV فائل کو سیدھا موبائل فائلز میں محفوظ کریں۔ پھر CapCut یا VN میں جا کر Audio > Sounds > From Device منتخب کریں اور ویڈیو ٹائم لائن پر رکھ دیں۔'
        : 'Download the .WAV file directly to your phone or PC. In CapCut or VN, tap Audio > Sounds > From Device and snap it to your video timeline.',
    },
    {
      title: isUrdu ? 'بیک گراؤنڈ میوزک اور آواز کا توازن (Audio Mixing)' : 'BGM & Voiceover Balancing',
      desc: isUrdu
        ? 'ہمیشہ اے آئی وائس کا والیوم 100% سے 120% رکھیں، اور بیک گراؤنڈ میوزک (BGM) کا والیوم 10% سے 18% رکھیں تاکہ ناظرین کو ہر لفظ صاف اور واضح سنائی دے۔'
        : 'Keep AI voiceover track at 100%-120% volume, and lower background music (BGM) to 10%-18% for crisp speech clarity.',
    },
    {
      title: isUrdu ? 'صوتی ٹیگز (Vocal Cues) کا استعمال' : 'Using Emotional Tags (<breath>, <laugh>)',
      desc: isUrdu
        ? 'اسکرپٹ میں <breath> کا اضافہ کرنے سے آواز میں انسانوں جیسی قدرتی سانس کا احساس پیدا ہوتا ہے۔ اسی طرح سسپنس کے لیے ڈبل ڈاٹ یا تین نقطے (...) کا استعمال کریں۔'
        : 'Insert <breath> tags before major sentences to give the voice natural human respiration. Use ellipsis (...) for suspenseful dramatic timing.',
    },
    {
      title: isUrdu ? 'آٹو کیپشنز (Auto Captions)' : 'Syncing Auto-Captions',
      desc: isUrdu
        ? 'Gemini کی 24kHz کلین آڈیو کوالٹی کی وجہ سے CapCut اور Premiere کا Auto Caption فیچر 99% درست اردو اور انگریزی سب ٹائٹلز فوراً بنا دیتا ہے۔'
        : 'Because Gemini delivers studio 24kHz clarity, CapCut and Premiere auto-captions generate with near 100% accuracy.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 sm:p-6 space-y-4 max-h-[88vh] overflow-y-auto break-words">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-fuchsia-600/20 text-fuchsia-400 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isUrdu ? 'ویڈیو ایڈیٹنگ اور کوالٹی گائیڈ' : 'Video Creator Voiceover Guide'}
              </h3>
              <p className="text-xs text-slate-400">
                {isUrdu ? 'ویڈیوز کے لیے بہترین آواز حاصل کرنے کے مشورے' : 'Pro tips for YouTube, Reels & Shorts'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {tips.map((tip, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <h4 className="text-xs sm:text-sm font-bold text-slate-200">{tip.title}</h4>
              </div>
              <p className="text-xs text-slate-400 pl-6 leading-relaxed" dir="auto">
                {tip.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
          >
            {isUrdu ? 'سمجھ گیا، آواز بنانا شروع کریں' : 'Got it, let’s create voices'}
          </button>
        </div>
      </div>
    </div>
  );
};
