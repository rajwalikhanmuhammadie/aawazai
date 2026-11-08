import React, { useState, useRef, useEffect } from 'react';
import { Mic, History, Globe, Video, LogIn, LogOut, User as UserIcon, ShieldCheck, ChevronDown, Sparkles, Download } from 'lucide-react';
import type { User } from 'firebase/auth';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface NavbarProps {
  lang: 'ur' | 'en';
  setLang: (l: 'ur' | 'en') => void;
  onOpenHistory: () => void;
  onOpenTips: () => void;
  historyCount: number;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  isLoggingIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  onOpenHistory,
  onOpenTips,
  historyCount,
  user,
  onLogin,
  onLogout,
  isLoggingIn,
}) => {
  const isUrdu = lang === 'ur';
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isInstallable, isInstalled, install } = usePWAInstall();

  // Close user dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl transition-all w-full">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-fuchsia-500 shadow-lg shadow-indigo-500/25 shrink-0">
            <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>AawazAI</span>
                <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full font-medium bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shrink-0">
                  Studio
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 font-urdu leading-normal hidden sm:block truncate">
              {isUrdu ? 'ویڈیوز اور تلاوت کے لیے جدید آوازیں' : 'AI Voice Studio for Creators'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* User Auth Section */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 sm:gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 text-slate-200 transition shadow-sm"
                title={user.email || 'User Profile'}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-7 h-7 rounded-lg object-cover border border-indigo-500/40 shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
                <div className="hidden sm:flex flex-col text-left rtl:text-right min-w-0 max-w-[110px]">
                  <span className="text-xs font-semibold text-white truncate leading-tight">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 leading-none mt-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{isUrdu ? 'مستقل یوزر' : 'Member'}</span>
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div
                  className={`absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 animate-scale-up ${
                    isUrdu ? 'text-right' : 'text-left'
                  }`}
                  dir={isUrdu ? 'rtl' : 'ltr'}
                >
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-10 h-10 rounded-xl object-cover border border-indigo-500/40 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                        <UserIcon className="w-5 h-5" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate leading-tight">
                        {user.displayName || 'گوگل یوزر'}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="py-2.5 space-y-1 text-xs text-slate-300">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{isUrdu ? 'مستقل لاگ ان رکن فعال ہے' : 'Permanent member active'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'لاگ آؤٹ کریں' : 'Sign Out'}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onLogin}
              disabled={isLoggingIn}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-600/30 transition disabled:opacity-50 shrink-0"
              title={isUrdu ? 'اپنے جی میل اکاؤنٹ سے لاگ ان کریں' : 'Sign in with your Google Account'}
            >
              {/* Google G Icon */}
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
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
                    : 'Signing in...'
                  : isUrdu
                  ? 'Google سے لاگ ان'
                  : 'Sign in with Google'}
              </span>
            </button>
          )}

          {/* In-App PWA Install shortcut button */}
          {!isInstalled && isInstallable && (
            <button
              onClick={install}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 transition shrink-0"
              title={isUrdu ? 'ایپ کو اپنی اسکرین پر ڈاؤنلوڈ کریں' : 'Install App to Home Screen'}
            >
              <Download className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline leading-normal">{isUrdu ? 'انسٹال' : 'Install'}</span>
            </button>
          )}

          {/* Language Switcher */}
          <button
            onClick={() => setLang(isUrdu ? 'en' : 'ur')}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
            title="Toggle Urdu / English"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="leading-normal">{isUrdu ? 'EN' : 'اردو'}</span>
          </button>

          {/* Video Tips */}
          <button
            onClick={onOpenTips}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-medium rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
            title={isUrdu ? 'ویڈیو ایڈیٹنگ گائیڈ' : 'Video Editing Guide'}
          >
            <Video className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
            <span className="hidden md:inline leading-normal">{isUrdu ? 'ویڈیو گائیڈ' : 'Video Guide'}</span>
          </button>

          {/* History */}
          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 transition shrink-0"
            title={isUrdu ? 'تاریخچہ اور آڈیوز' : 'Audio Library'}
          >
            <History className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="hidden sm:inline leading-normal">{isUrdu ? 'تاریخچہ' : 'Library'}</span>
            {historyCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold rounded-full bg-indigo-500 text-white leading-none">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
