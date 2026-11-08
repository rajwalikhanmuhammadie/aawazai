import React, { useState } from 'react';
import { Download, Smartphone, Monitor, CheckCircle2, Share2, Sparkles, X, ExternalLink } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallSectionProps {
  lang: 'ur' | 'en';
}

export const PWAInstallSection: React.FC<PWAInstallSectionProps> = ({ lang }) => {
  const isUrdu = lang === 'ur';
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setJustInstalled(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <section className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-tr from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/40 shadow-2xl">
      {/* Decorative background glows */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-fuchsia-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: App Icon & Details */}
        <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
          {/* App icon badge */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-fuchsia-600 p-0.5 shadow-xl shadow-indigo-600/30 shrink-0">
            <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                src="/pwa-192x192.png"
                alt="AawazAI Icon"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-white shadow-sm">
              <Download className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-semibold">
                aawazai.ai.studio
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PWA Ready
              </span>
            </div>

            <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-snug">
              {isUrdu
                ? 'ایپ کو اپنی ہوم اسکرین پر ڈاؤنلوڈ / انسٹال کریں'
                : 'Download & Install AawazAI to Your Screen'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 font-urdu leading-relaxed max-w-xl">
              {isUrdu
                ? 'اپنے موبائل یا کمپیوٹر براؤزر سے بغیر ایپ اسٹور کے براہِ راست ہوم اسکرین پر شارٹ کٹ بنائیں، اور مکمل اسکرین ایپ کی طرح بلا تعطل استعمال کریں۔'
                : 'Install directly from your browser to your mobile home screen or desktop. Runs standalone with instant offline-ready access and no App Store required.'}
            </p>
          </div>
        </div>

        {/* Right: Install CTA Buttons */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0 justify-end">
          {isInstalled || justInstalled ? (
            <div className="px-5 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 shadow-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isUrdu ? 'ایپ پہلے سے انسٹال ہے!' : 'App Installed on Your Device'}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleInstallClick}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 active:scale-[0.98] transition flex items-center justify-center gap-2.5"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>
                {isUrdu
                  ? '📲 اسکرین پر ایپ ڈاؤنلوڈ کریں'
                  : '📲 Install App to Home Screen'}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowGuideModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-slate-300 text-xs font-medium transition flex items-center justify-center gap-1.5"
          >
            <span>{isUrdu ? 'انسٹالیشن کا طریقہ دیکھیں' : 'How to Install on iPhone / Android'}</span>
          </button>
        </div>
      </div>

      {/* Feature Pills */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-300">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/40 border border-slate-800/50">
          <Smartphone className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{isUrdu ? 'موبائل اور کمپیوٹر پر 1-کلک شارٹ کٹ' : '1-Click Shortcut on Mobile & PC'}</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/40 border border-slate-800/50">
          <Monitor className="w-4 h-4 text-fuchsia-400 shrink-0" />
          <span>{isUrdu ? 'فل اسکرین نیٹیو ایپ کا احساس' : 'Standalone Fullscreen App Experience'}</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/40 border border-slate-800/50">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{isUrdu ? 'انتہائی تیز رفتار اور محفوظ' : 'High Speed & Local Caching'}</span>
        </div>
      </div>

      {/* Installation Guide Modal (for iOS Safari and desktop) */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 space-y-4"
            dir={isUrdu ? 'rtl' : 'ltr'}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {isUrdu ? 'ایپ ڈاؤنلوڈ اور شارٹ کٹ کی گائیڈ' : 'How to Download & Install App'}
                  </h4>
                  <p className="text-[11px] text-indigo-400 font-mono">aawazai.ai.studio</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Platform Guides */}
            <div className="space-y-3 text-xs text-slate-200">
              {/* Android & Chrome */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-indigo-300">
                  <Smartphone className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>{isUrdu ? 'اینڈرائیڈ (Android) / گوگل کروم' : 'Android / Google Chrome'}</span>
                </div>
                <p className="text-slate-300 leading-relaxed font-urdu">
                  {isUrdu
                    ? '1. کروم براؤزر کے اوپر 3 نقطوں (Menu) پر کلک کریں۔\n2. "Install App" یا "Add to Home screen" پر کلک کریں۔'
                    : '1. Tap the 3 dots menu in Chrome browser.\n2. Tap "Install App" or "Add to Home screen".'}
                </p>
              </div>

              {/* iPhone / iPad Safari */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-fuchsia-300">
                  <Share2 className="w-4 h-4 text-fuchsia-400 shrink-0" />
                  <span>{isUrdu ? 'آئی فون اور آئی پیڈ (iOS Safari)' : 'iPhone & iPad (Safari)'}</span>
                </div>
                <p className="text-slate-300 leading-relaxed font-urdu">
                  {isUrdu
                    ? '1. سفاری کے نیچے موجود شیئر بٹن (Share Sheet) پر کلک کریں۔\n2. نیچے سکرول کر کے "Add to Home Screen" منتخب کریں۔'
                    : '1. Tap the Share button at the bottom of Safari.\n2. Scroll down and tap "Add to Home Screen".'}
                </p>
              </div>

              {/* Computer / Desktop */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <Monitor className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isUrdu ? 'کمپیوٹر اور لیپ ٹاپ (Windows / Mac)' : 'Desktop (Chrome, Edge, Mac)'}</span>
                </div>
                <p className="text-slate-300 leading-relaxed font-urdu">
                  {isUrdu
                    ? 'براؤزر کے ایڈریس بار میں دائیں جانب موجود چھوٹے انسٹال بٹن (Install Icon) پر کلک کریں۔'
                    : 'Click the small Install icon in the right side of the browser URL address bar.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
            >
              {isUrdu ? 'ٹھیک ہے، سمجھ آگئی' : 'Got it!'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
