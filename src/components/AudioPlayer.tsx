import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Volume2,
  VolumeX,
  Share2,
  Check,
  Sparkles,
  Music,
  X,
  Copy,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { GeneratedAudioItem } from '../types';

interface AudioPlayerProps {
  item?: GeneratedAudioItem | null;
  lang: 'ur' | 'en';
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ item, lang }) => {
  const isUrdu = lang === 'ur';
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!item?.audioBase64) return;
    // Reset state when new audio item is provided
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = playbackRate;
      // Autoplay the newly generated audio
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  }, [item?.audioBase64]);

  if (!item) {
    return (
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl flex flex-col items-center justify-center text-center min-h-[220px]">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
          <Music className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-white mb-1">
          {isUrdu ? 'آڈیو پلیئر اور سوشل شیئرنگ اسٹوڈیو' : 'Audio Player & Social Sharing Studio'}
        </h4>
        <p className="text-xs text-slate-400 font-urdu max-w-xs leading-relaxed">
          {isUrdu
            ? 'جب آپ آواز تیار کریں گے تو وہ یہاں چلے گی اور آپ اسے WhatsApp، TikTok، Instagram اور دیگر ایپس پر شیئر اور ڈاؤنلوڈ کر سکیں گے۔'
            : 'Generated voice clips will appear here for playback, instant download, and sharing to WhatsApp, TikTok, Instagram, and more.'}
        </p>
      </div>
    );
  }

  // Audio source URL
  const audioSrc = `data:audio/wav;base64,${item.audioBase64}`;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => console.error(e));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const changeSpeed = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Helper to convert base64 audio to a File object for Web Share API
  const getAudioFile = (): File | null => {
    try {
      const byteCharacters = atob(item.audioBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'audio/wav' });
      const safeTitle = item.title
        ? item.title.replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_').substring(0, 20)
        : 'audio_clip';
      return new File([blob], `AawazAI_${item.voiceName}_${safeTitle}.wav`, { type: 'audio/wav' });
    } catch (e) {
      console.error('Error creating audio file:', e);
      return null;
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = audioSrc;
    const safeTitle = item.title
      ? item.title.replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_').substring(0, 20)
      : 'audio_clip';
    link.download = `AawazAI_${item.voiceName}_${safeTitle}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShareFeedback(isUrdu ? 'آواز ڈاؤنلوڈ ہو گئی ہے!' : 'Audio downloaded successfully!');
    setTimeout(() => setShareFeedback(null), 3000);
  };

  // Web Share API handler (supports native sharing of audio file directly to apps like WhatsApp, TikTok, Instagram)
  const handleNativeWebShare = async () => {
    setIsSharing(true);
    setShareFeedback(null);

    const shareTitle = item.title || 'AawazAI Audio Voiceover';
    const shareText = `🎙️ "${item.text.substring(0, 100)}..."\nCreated with AawazAI Voice Studio (${item.voiceName} Voice)`;

    try {
      const audioFile = getAudioFile();

      // Check if Web Share API with File is supported
      if (
        audioFile &&
        navigator.canShare &&
        navigator.canShare({ files: [audioFile] })
      ) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          files: [audioFile],
        });
        setShareFeedback(isUrdu ? 'کامیابی سے شیئر کیا گیا!' : 'Shared successfully!');
        setTimeout(() => setShareFeedback(null), 3000);
        return;
      }

      // If files aren't shareable on this browser/desktop, test basic share
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: window.location.href,
        });
        setShareFeedback(isUrdu ? 'لنک شیئر کر دیا گیا!' : 'Link shared successfully!');
        setTimeout(() => setShareFeedback(null), 3000);
        return;
      }

      // If Web Share API is completely unavailable (some desktop browsers), open modal
      setShowShareModal(true);
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        console.warn('Native share cancelled or failed:', err);
        setShowShareModal(true);
      }
    } finally {
      setIsSharing(false);
    }
  };

  // Direct WhatsApp Share
  const handleWhatsAppShare = () => {
    const textToShare = `🎙️ *AawazAI Voice Clip* (${item.voiceName} Voice):\n\n"${item.text}"\n\n✨ Synthesized with AawazAI Voice Studio`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Copy text to clipboard
  const handleCopyText = () => {
    navigator.clipboard.writeText(item.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const formatTime = (timeInSec: number) => {
    if (isNaN(timeInSec)) return '0:00';
    const mins = Math.floor(timeInSec / 60);
    const secs = Math.floor(timeInSec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-indigo-500/30 shadow-xl shadow-indigo-950/30 backdrop-blur-md">
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Header Info */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Music className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 flex-wrap">
              <span>{item.voiceName} Voice</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                WAV 24kHz
              </span>
              {typeof item.pitch === 'number' && item.pitch !== 0 && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono">
                  Pitch: {item.pitch > 0 ? `+${item.pitch}` : item.pitch}
                </span>
              )}
            </h4>
            <p className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-xs font-urdu" dir="auto">
              {item.title || item.text.substring(0, 45) + '...'}
            </p>
          </div>
        </div>

        {/* Actions: Google Drive & Social Share */}
        <div className="flex items-center gap-1.5">
          {item.driveWebViewLink && (
            <a
              href={item.driveWebViewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition flex items-center gap-1 shadow-sm"
              title="Open in Google Drive (My Generated Voices)"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 87.3 78">
                <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.9 2.5 3.2 3.3l12.3-21.3H1.75c0 1.55.4 3.1 1.2 4.5l3.65 6.85z" fill="#0066da"/>
                <path d="M43.65 25L29.7 1.05C28.4.35 26.9 0 25.35 0h-1.7l13.95 24.15 6.05.85z" fill="#00ac47"/>
                <path d="M73.55 76.8c1.3-.8 2.4-1.9 3.2-3.3l1.6-2.75 3.45-5.95c.8-1.4 1.2-2.95 1.2-4.5H57.1l5.25 9.1 11.2 7.4z" fill="#ea4335"/>
                <path d="M43.65 25L57.6 1.05C56.3.35 54.8 0 53.25 0H33.95l13.9 24.1 1.8.9z" fill="#00832d"/>
                <path d="M57.1 52H25.95L12 76.8c1.3.8 2.8 1.2 4.35 1.2h54.6c1.55 0 3.05-.4 4.35-1.2L57.1 52z" fill="#2684fc"/>
                <path d="M73.4 26.5l-12.3-21.3c-.8-1.4-1.9-2.5-3.2-3.3L43.65 25l13.45 23.3 16.3 3.7z" fill="#ffba00"/>
              </svg>
              <span className="hidden sm:inline leading-none font-semibold">Drive</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-80" />
            </a>
          )}

          <button
            type="button"
            onClick={handleNativeWebShare}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition flex items-center gap-1"
            title={isUrdu ? 'سوشل میڈیا پر شیئر کریں' : 'Share to Social Media (WhatsApp, TikTok, IG)'}
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="hidden sm:inline leading-none">{isUrdu ? 'شیئر' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Visual Audio Waveform Simulation */}
      <div className="relative h-14 bg-slate-950/70 rounded-xl border border-slate-800/80 px-4 flex items-center justify-center gap-1 overflow-hidden my-3">
        {Array.from({ length: 36 }).map((_, i) => {
          const progress = duration > 0 ? currentTime / duration : 0;
          const isPassed = i / 36 <= progress;
          const baseHeight = 20 + Math.sin(i * 0.45) * 15 + Math.cos(i * 0.8) * 10;
          const animatedHeight = isPlaying
            ? Math.min(100, Math.max(15, baseHeight + Math.sin(Date.now() / 150 + i) * 15))
            : Math.max(15, baseHeight);

          return (
            <div
              key={i}
              className={`flex-1 rounded-full transition-all duration-150 ${
                isPassed
                  ? 'bg-gradient-to-t from-indigo-500 to-fuchsia-400 shadow-sm shadow-indigo-500/50'
                  : 'bg-slate-700/60'
              }`}
              style={{
                height: `${animatedHeight}%`,
                maxHeight: '85%',
              }}
            />
          );
        })}
      </div>

      {/* Progress & Time */}
      <div className="space-y-1 mb-3">
        <input
          type="range"
          min={0}
          max={duration || 1}
          step={0.01}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Feedback Toast */}
      {shareFeedback && (
        <div className="mb-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <Check className="w-3.5 h-3.5 shrink-0" />
          <span>{shareFeedback}</span>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        {/* Playback buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 transition active:scale-95"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-white" />
            ) : (
              <Play className="w-5 h-5 fill-white ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                setCurrentTime(0);
                audioRef.current.play();
                setIsPlaying(true);
              }
            }}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
            title="Replay from start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Volume toggle */}
          <button
            type="button"
            onClick={toggleMute}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Speed multiplier selector */}
        <div className="flex items-center bg-slate-950/80 rounded-lg p-0.5 border border-slate-800 text-xs">
          {[0.8, 1.0, 1.2, 1.5].map((speed) => (
            <button
              key={speed}
              type="button"
              onClick={() => changeSpeed(speed)}
              className={`px-2 py-1 rounded-md font-mono text-[11px] transition ${
                playbackRate === speed
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>

        {/* Action Buttons: Share & Download */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Social Media Share button */}
          <button
            type="button"
            onClick={handleNativeWebShare}
            disabled={isSharing}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition leading-normal"
            title="Share via WhatsApp, Instagram, TikTok"
          >
            <Share2 className="w-4 h-4 shrink-0" />
            <span>{isUrdu ? 'سوشل شیئر' : 'Share'}</span>
          </button>

          {/* Download WAV button */}
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition leading-normal"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>{isUrdu ? 'ڈاؤنلوڈ WAV' : 'Download WAV'}</span>
          </button>
        </div>
      </div>

      {/* Social Media Sharing Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-5 space-y-4"
            dir={isUrdu ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  {isUrdu ? 'سوشل میڈیا پر شیئر کریں' : 'Share Voice Clip'}
                </h3>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick platform share buttons */}
            <div className="space-y-2.5">
              {/* WhatsApp button */}
              <button
                onClick={handleWhatsAppShare}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-emerald-300 font-semibold text-xs transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#25D366] flex items-center justify-center text-white shrink-0 shadow-sm">
                    <MessageCircle className="w-4 h-4 fill-white" />
                  </div>
                  <span>{isUrdu ? 'WhatsApp پر شیئر کریں' : 'Share to WhatsApp'}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </button>

              {/* TikTok / CapCut button */}
              <button
                onClick={() => {
                  handleDownload();
                  setShowShareModal(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-semibold text-xs transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-black border border-slate-700 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 fill-cyan-400" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.42a6.33 6.33 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 9.17 5.65 6.34 6.34 0 0 0 3.52-5.65V8.84a8.18 8.18 0 0 0 4.76 1.5v-3.4a4.85 4.85 0 0 1-1-.25z"/>
                    </svg>
                  </div>
                  <div className="text-left rtl:text-right">
                    <p className="leading-tight">{isUrdu ? 'TikTok اور CapCut کے لیے ڈاؤنلوڈ' : 'Download for TikTok & CapCut'}</p>
                    <p className="text-[10px] text-slate-400 font-normal leading-none mt-0.5">
                      {isUrdu ? 'ویڈیو ٹائم لائن میں شامل کریں' : 'Import into video timeline'}
                    </p>
                  </div>
                </div>
                <Download className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Instagram Reels button */}
              <button
                onClick={() => {
                  handleDownload();
                  setShowShareModal(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-fuchsia-950/40 via-purple-950/40 to-pink-950/40 hover:from-fuchsia-900/50 hover:to-pink-900/50 border border-fuchsia-500/30 text-fuchsia-200 font-semibold text-xs transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                    <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className="text-left rtl:text-right">
                    <p className="leading-tight">{isUrdu ? 'Instagram Reels کے لیے ڈاؤنلوڈ' : 'Download for Instagram Reels'}</p>
                    <p className="text-[10px] text-slate-400 font-normal leading-none mt-0.5">
                      {isUrdu ? '24kHz اسٹوڈیو آواز' : 'Ready for Reels & Stories'}
                    </p>
                  </div>
                </div>
                <Download className="w-3.5 h-3.5 text-fuchsia-400" />
              </button>

              {/* Native Web Share Button */}
              {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                <button
                  onClick={() => {
                    setShowShareModal(false);
                    handleNativeWebShare();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-500/30 text-indigo-300 font-semibold text-xs transition"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <span>{isUrdu ? 'مزید ایپس کے ساتھ شیئر کریں' : 'More Apps (System Share Sheet)'}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </button>
              )}

              {/* Copy Script Text */}
              <button
                onClick={handleCopyText}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 font-semibold text-xs transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </div>
                  <span>{copied ? (isUrdu ? 'متن کاپی ہو گیا!' : 'Script Copied!') : (isUrdu ? 'اسکرپٹ ٹیکسٹ کاپی کریں' : 'Copy Script Text')}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
