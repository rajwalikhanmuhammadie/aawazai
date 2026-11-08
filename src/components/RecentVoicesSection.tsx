import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  Download,
  Trash2,
  ExternalLink,
  Edit3,
  Search,
  Filter,
  ArrowUpDown,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  Music,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { GeneratedAudioItem } from '../types';

interface RecentVoicesSectionProps {
  items: GeneratedAudioItem[];
  currentAudioId?: string | null;
  onSelectAudio: (item: GeneratedAudioItem) => void;
  onDeleteItem: (id: string) => Promise<void>;
  onRenameItem: (id: string, newTitle: string) => Promise<void>;
  onSyncToDrive?: (item: GeneratedAudioItem) => Promise<void>;
  lang: 'ur' | 'en';
  isDriveConnected?: boolean;
}

export const RecentVoicesSection: React.FC<RecentVoicesSectionProps> = ({
  items,
  currentAudioId,
  onSelectAudio,
  onDeleteItem,
  onRenameItem,
  onSyncToDrive,
  lang,
  isDriveConnected,
}) => {
  const isUrdu = lang === 'ur';

  // Search & filter & sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Deletion modal state
  const [itemToDelete, setItemToDelete] = useState<GeneratedAudioItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Rename modal state
  const [itemToRename, setItemToRename] = useState<GeneratedAudioItem | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);

  // Syncing state
  const [syncingId, setSyncingId] = useState<string | null>(null);

  // Filtered and sorted items
  const filtered = items.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.text.toLowerCase().includes(q) ||
      item.voiceName.toLowerCase().includes(q)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') return b.createdAt - a.createdAt;
    if (sortBy === 'oldest') return a.createdAt - b.createdAt;
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
  const paginatedItems = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDownload = (item: GeneratedAudioItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = `data:audio/wav;base64,${item.audioBase64}`;
    const safeTitle = (item.title || 'voice')
      .replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_')
      .substring(0, 25);
    link.download = `AawazAI_${item.voiceName}_${safeTitle}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await onDeleteItem(itemToDelete.id);
      setItemToDelete(null);
    } catch (e) {
      console.error('Delete error:', e);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmRename = async () => {
    if (!itemToRename || !newTitle.trim()) return;
    setIsRenaming(true);
    try {
      await onRenameItem(itemToRename.id, newTitle.trim());
      setItemToRename(null);
    } catch (e) {
      console.error('Rename error:', e);
    } finally {
      setIsRenaming(false);
    }
  };

  const handleManualSync = async (item: GeneratedAudioItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onSyncToDrive) return;
    setSyncingId(item.id);
    try {
      await onSyncToDrive(item);
    } finally {
      setSyncingId(null);
    }
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-xl space-y-4">
      {/* Header with Title and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{isUrdu ? 'حالیہ تیار کردہ تمام آوازیں' : 'Recently Created Voices Library'}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                {items.length} {isUrdu ? 'آوازیں' : 'Saved'}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {isUrdu
                ? 'کوئی 3 کی پابندی نہیں! تمام آڈیوز کلاؤڈ اور گوگل ڈرائیو پر محفوظ ہیں'
                : 'Unlimited voice history stored securely in Firestore & Google Drive'}
            </p>
          </div>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={isUrdu ? 'آواز تلاش کریں...' : 'Search voices...'}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-2 py-1 text-xs">
            <ArrowUpDown className="w-3 h-3 text-slate-400 mr-1.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-300 text-xs focus:outline-none cursor-pointer"
            >
              <option value="newest" className="bg-slate-900">
                {isUrdu ? 'تازہ ترین' : 'Newest'}
              </option>
              <option value="oldest" className="bg-slate-900">
                {isUrdu ? 'پرانی' : 'Oldest'}
              </option>
              <option value="title" className="bg-slate-900">
                {isUrdu ? 'حروفِ تہجی' : 'Title A-Z'}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Voices List */}
      {paginatedItems.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center text-slate-500">
          <Music className="w-10 h-10 stroke-[1.2] mb-2 text-slate-600" />
          <p className="text-sm font-medium text-slate-400">
            {searchQuery
              ? isUrdu
                ? 'کوئی نتیجہ نہیں ملا'
                : 'No matching voices found'
              : isUrdu
              ? 'ابھی تک کوئی آواز تیار نہیں کی گئی'
              : 'No generated voices yet'}
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            {isUrdu
              ? 'جب آپ آواز بنائیں گے تو وہ خودکار طور پر یہاں اور آپ کی گوگل ڈرائیو میں محفوظ ہو جائے گی'
              : 'Generate your first voice above to have it saved here and in Google Drive automatically'}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {paginatedItems.map((item) => {
            const isSelected = currentAudioId === item.id;
            const hasDriveLink = Boolean(item.driveWebViewLink || item.driveFileId);

            return (
              <div
                key={item.id}
                onClick={() => onSelectAudio(item)}
                className={`p-3 rounded-xl border transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500/60 shadow-md shadow-indigo-950/30'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-950 hover:border-slate-700'
                }`}
              >
                {/* Left Info */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-indigo-200 transition truncate">
                      {item.title || 'Untitled Voiceover'}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-medium">
                      {item.voiceName}
                    </span>
                    {item.mode === 'dialogue' && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-fuchsia-500/20 text-fuchsia-300">
                        Dialogue
                      </span>
                    )}

                    {/* Google Drive Status Badge */}
                    {hasDriveLink ? (
                      <a
                        href={item.driveWebViewLink || `https://drive.google.com/file/d/${item.driveFileId}/view`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition font-medium"
                        title="Open file in Google Drive"
                      >
                        <svg className="w-3 h-3 shrink-0" viewBox="0 0 87.3 78">
                          <path
                            d="M6.6 66.85l3.85 6.65c.8 1.4 1.9 2.5 3.2 3.3l12.3-21.3H1.75c0 1.55.4 3.1 1.2 4.5l3.65 6.85z"
                            fill="#0066da"
                          />
                          <path
                            d="M43.65 25L29.7 1.05C28.4.35 26.9 0 25.35 0h-1.7l13.95 24.15 6.05.85z"
                            fill="#00ac47"
                          />
                          <path
                            d="M73.55 76.8c1.3-.8 2.4-1.9 3.2-3.3l1.6-2.75 3.45-5.95c.8-1.4 1.2-2.95 1.2-4.5H57.1l5.25 9.1 11.2 7.4z"
                            fill="#ea4335"
                          />
                          <path
                            d="M43.65 25L57.6 1.05C56.3.35 54.8 0 53.25 0H33.95l13.9 24.1 1.8.9z"
                            fill="#00832d"
                          />
                          <path
                            d="M57.1 52H25.95L12 76.8c1.3.8 2.8 1.2 4.35 1.2h54.6c1.55 0 3.05-.4 4.35-1.2L57.1 52z"
                            fill="#2684fc"
                          />
                          <path
                            d="M73.4 26.5l-12.3-21.3c-.8-1.4-1.9-2.5-3.2-3.3L43.65 25l13.45 23.3 16.3 3.7z"
                            fill="#ffba00"
                          />
                        </svg>
                        <span>Drive</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ) : (
                      onSyncToDrive && (
                        <button
                          type="button"
                          onClick={(e) => handleManualSync(item, e)}
                          disabled={syncingId === item.id}
                          className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 transition"
                          title="Save to Google Drive"
                        >
                          <Cloud className="w-3 h-3 text-slate-400" />
                          <span>
                            {syncingId === item.id
                              ? isUrdu
                                ? 'محفوظ ہو رہا ہے...'
                                : 'Saving...'
                              : isUrdu
                              ? 'ڈرائیو میں محفوظ کریں'
                              : 'Sync to Drive'}
                          </span>
                        </button>
                      )
                    )}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1 font-urdu leading-normal" dir="auto">
                    {item.text}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(item.createdAt)}</span>
                    </span>
                    <span>•</span>
                    <span>WAV 24kHz</span>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  {/* Play preview */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAudio(item);
                    }}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white'
                    }`}
                    title="Play voice clip"
                  >
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </button>

                  {/* Download */}
                  <button
                    type="button"
                    onClick={(e) => handleDownload(item, e)}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-emerald-600 text-slate-400 hover:text-white transition"
                    title="Download WAV"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  {/* Rename */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setItemToRename(item);
                      setNewTitle(item.title);
                    }}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-indigo-600 text-slate-400 hover:text-white transition"
                    title="Rename voice clip"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete with Confirmation Modal */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setItemToDelete(item);
                    }}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950/70 text-slate-500 hover:text-rose-400 transition"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-400 font-mono">
            Page {currentPage} of {totalPages} ({filtered.length} total)
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white disabled:opacity-40 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Permanent Deletion Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-md bg-slate-900 border border-rose-500/40 rounded-2xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150"
            dir={isUrdu ? 'rtl' : 'ltr'}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {isUrdu ? 'آواز مستقل طور پر حذف کریں؟' : 'Permanently Delete Voice Clip?'}
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {isUrdu
                    ? `کیا آپ واقعی "${itemToDelete.title}" کو مستقل طور پر حذف کرنا چاہتے ہیں؟ یہ آڈیو کلاؤڈ ڈیٹا بیس اور گوگل ڈرائیو دونوں سے ہمیشہ کے لیے ختم ہو جائے گی۔`
                    : `Are you sure you want to delete "${itemToDelete.title}"? This voice clip will be permanently removed from Firestore and Google Drive.`}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                disabled={isDeleting}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                {isUrdu ? 'منسوخ کریں' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-rose-600/30"
              >
                {isDeleting ? (
                  <span>{isUrdu ? 'حذف ہو رہا ہے...' : 'Deleting...'}</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'ہاں، مستقل حذف کریں' : 'Yes, Delete Permanently'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {itemToRename && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-sm bg-slate-900 border border-indigo-500/40 rounded-2xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150"
            dir={isUrdu ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-400" />
                <span>{isUrdu ? 'آواز کا نام تبدیل کریں' : 'Rename Voice Clip'}</span>
              </h4>
              <button
                onClick={() => setItemToRename(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">
                {isUrdu ? 'نیا عنوان درج کریں:' : 'Enter new title:'}
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setItemToRename(null)}
                disabled={isRenaming}
                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                {isUrdu ? 'منسوخ' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmRename}
                disabled={isRenaming || !newTitle.trim()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                {isRenaming ? (
                  <span>{isUrdu ? 'تبدیل ہو رہا ہے...' : 'Renaming...'}</span>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'محفوظ کریں' : 'Save'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
