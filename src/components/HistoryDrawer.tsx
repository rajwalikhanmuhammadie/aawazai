import React from 'react';
import { X, Play, Download, Trash2, Clock, Music, Volume2 } from 'lucide-react';
import { GeneratedAudioItem } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: GeneratedAudioItem[];
  onSelectAudio: (item: GeneratedAudioItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
  lang: 'ur' | 'en';
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onSelectAudio,
  onDeleteItem,
  onClearAll,
  lang,
}) => {
  if (!isOpen) return null;

  const isUrdu = lang === 'ur';

  const downloadAudio = (item: GeneratedAudioItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = `data:audio/wav;base64,${item.audioBase64}`;
    const safeTitle = item.title ? item.title.replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_').substring(0, 20) : 'video_voice';
    link.download = `AawazAI_${item.voiceName}_${safeTitle}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md h-full bg-slate-900 border-l border-slate-800 p-5 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {isUrdu ? 'تیار شدہ آوازوں کی لائبریری' : 'Audio History & Library'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {items.length} {isUrdu ? 'آوازیں محفوظ ہیں' : 'saved clips'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
              >
                {isUrdu ? 'سب حذف کریں' : 'Clear All'}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <Volume2 className="w-12 h-12 stroke-[1.2] mb-2 text-slate-600" />
              <p className="text-sm font-medium text-slate-400">
                {isUrdu ? 'ابھی تک کوئی آواز تیار نہیں کی گئی' : 'No audio clips yet'}
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                {isUrdu
                  ? 'جب آپ آواز تیار کریں گے تو وہ فوری ڈاؤنلوڈ کے لیے یہاں محفوظ ہو جائے گی'
                  : 'Generated voiceovers will be saved here for instant re-download and playback'}
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectAudio(item);
                  onClose();
                }}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-950 transition cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                      {item.voiceName}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                      {item.mode === 'dialogue' ? 'Dialogue' : 'Single'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed" dir="auto">
                  {item.text}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                  <button
                    type="button"
                    className="text-xs text-indigo-400 group-hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <Play className="w-3 h-3 fill-indigo-400" />
                    <span>{isUrdu ? 'چلائیں' : 'Play'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {item.driveWebViewLink && (
                      <a
                        href={item.driveWebViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white transition"
                        title="Open in Google Drive"
                      >
                        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 87.3 78">
                          <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.9 2.5 3.2 3.3l12.3-21.3H1.75c0 1.55.4 3.1 1.2 4.5l3.65 6.85z" fill="#0066da"/>
                          <path d="M43.65 25L29.7 1.05C28.4.35 26.9 0 25.35 0h-1.7l13.95 24.15 6.05.85z" fill="#00ac47"/>
                          <path d="M73.55 76.8c1.3-.8 2.4-1.9 3.2-3.3l1.6-2.75 3.45-5.95c.8-1.4 1.2-2.95 1.2-4.5H57.1l5.25 9.1 11.2 7.4z" fill="#ea4335"/>
                          <path d="M43.65 25L57.6 1.05C56.3.35 54.8 0 53.25 0H33.95l13.9 24.1 1.8.9z" fill="#00832d"/>
                          <path d="M57.1 52H25.95L12 76.8c1.3.8 2.8 1.2 4.35 1.2h54.6c1.55 0 3.05-.4 4.35-1.2L57.1 52z" fill="#2684fc"/>
                          <path d="M73.4 26.5l-12.3-21.3c-.8-1.4-1.9-2.5-3.2-3.3L43.65 25l13.45 23.3 16.3 3.7z" fill="#ffba00"/>
                        </svg>
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={(e) => downloadAudio(item, e)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-emerald-600 text-slate-300 hover:text-white transition"
                      title="Download WAV"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(item.id);
                      }}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-900/50 text-slate-500 hover:text-rose-400 transition"
                      title="Delete clip"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
