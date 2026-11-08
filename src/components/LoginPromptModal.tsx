import React from 'react';
import { X, Sparkles, ShieldCheck, CheckCircle2, Mic } from 'lucide-react';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  isLoggingIn?: boolean;
  lang: 'ur' | 'en';
}

export const LoginPromptModal: React.FC<LoginPromptModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  isLoggingIn,
  lang,
}) => {
  if (!isOpen) return null;
  const isUrdu = lang === 'ur';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 text-center"
        dir={isUrdu ? 'rtl' : 'ltr'}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon Header */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-4">
          <Mic className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug">
          {isUrdu ? 'اپنے گوگل (Gmail) اکاؤنٹ سے لاگ ان کریں' : 'Sign In with Your Google Account'}
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 mb-6 font-urdu leading-relaxed">
          {isUrdu
            ? 'بغیر کسی اے پی آئی کی (API Key) کے براہِ راست آوازیں بنانے اور اپنی تمام آڈیوز کو مستقل محفوظ رکھنے کے لیے لاگ ان کریں۔'
            : 'Sign in to generate unlimited studio voices and preserve your audio history forever without entering API keys.'}
        </p>

        {/* Benefits list */}
        <div className="space-y-2.5 text-left rtl:text-right mb-6 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 text-xs">
          <div className="flex items-center gap-2.5 text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="leading-normal">
              {isUrdu ? 'کوئی API کی ڈالنے کی ضرورت نہیں، سب خودکار ہے' : 'No API keys required, completely automated'}
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="leading-normal">
              {isUrdu ? 'ہمیشہ کے لیے مستقل رکن بنیں' : 'Become a permanent active member'}
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="leading-normal">
              {isUrdu ? 'کلاؤڈ میں ہر آڈیو اور تلاوت محفوظ رہے گی' : 'All your recordings saved securely in the cloud'}
            </span>
          </div>
        </div>

        {/* Big Google Login Button */}
        <button
          onClick={onLogin}
          disabled={isLoggingIn}
          className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-xl flex items-center justify-center gap-3 transition active:scale-[0.98] disabled:opacity-50"
        >
          {/* Google Color G */}
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z"
            />
          </svg>
          <span>
            {isLoggingIn
              ? isUrdu
                ? 'لاگ ان ہو رہا ہے...'
                : 'Signing In...'
              : isUrdu
              ? 'Google اکاؤنٹ کے ساتھ سائن ان کریں'
              : 'Sign In with Google'}
          </span>
        </button>

        <p className="text-[11px] text-slate-500 mt-3 font-urdu">
          {isUrdu
            ? 'لاگ ان کرنے کے بعد آپ فوراً اپنی پسندیدہ آواز یا تلاوت بنا سکتے ہیں۔'
            : 'After signing in, you can immediately generate voices and recitations.'}
        </p>
      </div>
    </div>
  );
};
