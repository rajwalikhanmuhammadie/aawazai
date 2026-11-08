import React from 'react';
import { VOICES } from '../data/voices';
import { VoiceName, DialogueLine, DialogueSpeakerConfig } from '../types';
import { Users, Plus, Trash2, Sparkles, MessageSquare, ArrowRightLeft, BookOpen, Baby, HeartHandshake } from 'lucide-react';

interface DialogueModeProps {
  dialogueLines: DialogueLine[];
  onChangeLines: (lines: DialogueLine[]) => void;
  speakers: [DialogueSpeakerConfig, DialogueSpeakerConfig];
  onChangeSpeakers: (speakers: [DialogueSpeakerConfig, DialogueSpeakerConfig]) => void;
  lang: 'ur' | 'en';
}

export const DialogueMode: React.FC<DialogueModeProps> = ({
  dialogueLines,
  onChangeLines,
  speakers,
  onChangeSpeakers,
  lang,
}) => {
  const isUrdu = lang === 'ur';

  const [s1, s2] = speakers;

  const handleSpeakerVoiceChange = (index: 0 | 1, voice: VoiceName) => {
    const updated: [DialogueSpeakerConfig, DialogueSpeakerConfig] = [
      { ...speakers[0] },
      { ...speakers[1] },
    ];
    updated[index].voiceName = voice;
    onChangeSpeakers(updated);
  };

  const handleSpeakerNameChange = (index: 0 | 1, name: string) => {
    const oldName = speakers[index].speaker;
    const updated: [DialogueSpeakerConfig, DialogueSpeakerConfig] = [
      { ...speakers[0] },
      { ...speakers[1] },
    ];
    updated[index].speaker = name;
    onChangeSpeakers(updated);

    const updatedLines = dialogueLines.map((line) =>
      line.speaker === oldName ? { ...line, speaker: name } : line
    );
    onChangeLines(updatedLines);
  };

  const addLine = (speaker: string) => {
    const newLine: DialogueLine = {
      id: Math.random().toString(36).substring(2, 9),
      speaker,
      text: '',
    };
    onChangeLines([...dialogueLines, newLine]);
  };

  const updateLineText = (id: string, text: string) => {
    onChangeLines(
      dialogueLines.map((line) => (line.id === id ? { ...line, text } : line))
    );
  };

  const toggleLineSpeaker = (id: string) => {
    onChangeLines(
      dialogueLines.map((line) => {
        if (line.id === id) {
          const nextSpeaker = line.speaker === s1.speaker ? s2.speaker : s1.speaker;
          return { ...line, speaker: nextSpeaker };
        }
        return line;
      })
    );
  };

  const removeLine = (id: string) => {
    onChangeLines(dialogueLines.filter((line) => line.id !== id));
  };

  // Preset 1: Grandfather & Child (بزرگ دادا جان اور ننھا بچہ)
  const loadElderAndChildPreset = () => {
    const updatedSpeakers: [DialogueSpeakerConfig, DialogueSpeakerConfig] = [
      { speaker: 'دادا جان (بزرگ)', voiceName: 'Charon' },
      { speaker: 'علی (ننھا بچہ)', voiceName: 'Puck' },
    ];
    onChangeSpeakers(updatedSpeakers);

    const sample: DialogueLine[] = [
      {
        id: '1',
        speaker: 'دادا جان (بزرگ)',
        text: 'پیارے علی! کیا تم جانتے ہو کہ درخت ہمیں پھل اور سایہ کیوں دیتے ہیں؟',
      },
      {
        id: '2',
        speaker: 'علی (ننھا بچہ)',
        text: 'نہیں دادا جان! <gasp> آپ بتائیے نا، وہ تو ہم سے کچھ مانگتے بھی نہیں!',
      },
      {
        id: '3',
        speaker: 'دادا جان (بزرگ)',
        text: 'شاباش میرے بچے! <breath> یہی قدرت کا اصول ہے، جو دوسروں کو فائدہ پہنچاتا ہے، اللہ تعالیٰ اس کو ہمیشہ بلند مقام دیتا ہے۔',
      },
    ];
    onChangeLines(sample);
  };

  // Preset 2: Qari & Urdu Tarjuma (تلاوت قاری اور اردو ترجمہ)
  const loadQariAndTarjumaPreset = () => {
    const updatedSpeakers: [DialogueSpeakerConfig, DialogueSpeakerConfig] = [
      { speaker: 'قاری صاحب (تلاوت)', voiceName: 'Fenrir' },
      { speaker: 'مترجم (اردو ترجمہ)', voiceName: 'Kore' },
    ];
    onChangeSpeakers(updatedSpeakers);

    const sample: DialogueLine[] = [
      {
        id: '1',
        speaker: 'قاری صاحب (تلاوت)',
        text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ <breath> الرَّحْمَٰنُ ۝ عَلَّمَ الْقُرْآنَ ۝ خَلَقَ الْإِنْسَانَ ۝ عَلَّمَهُ الْبَيَانَ ۝',
      },
      {
        id: '2',
        speaker: 'مترجم (اردو ترجمہ)',
        text: 'شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔ <breath> رحمان نے ہی اس قرآن کی تعلیم دی، اسی نے انسان کو پیدا کیا اور اسے بولنا سکھایا۔',
      },
    ];
    onChangeLines(sample);
  };

  return (
    <div className="space-y-4">
      {/* Quick Intergenerational / Specialized Presets */}
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isUrdu ? 'مقبول مکالماتی جوڑیاں (Presets)' : 'Popular Dialogue Presets'}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={loadElderAndChildPreset}
            className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 text-left transition flex items-center gap-2 group"
          >
            <div className="flex -space-x-1.5">
              <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold border border-slate-900">
                👴
              </span>
              <span className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-[10px] text-white font-bold border border-slate-900">
                🧒
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200 group-hover:text-white">
                {isUrdu ? 'دادا جان اور ننھا بچہ (Elder & Child)' : 'Grandfather & Child'}
              </div>
              <div className="text-[10px] text-slate-400">
                {isUrdu ? 'سبق آموز کہانیوں اور کارٹونز کے لیے' : 'Moral story dialogue'}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={loadQariAndTarjumaPreset}
            className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 text-left transition flex items-center gap-2 group"
          >
            <div className="flex -space-x-1.5">
              <span className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] text-white font-bold border border-slate-900">
                📖
              </span>
              <span className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold border border-slate-900">
                🎙️
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200 group-hover:text-white">
                {isUrdu ? 'تلاوت مع اردو ترجمہ (Qari & Tarjuma)' : 'Qari Recitation & Translation'}
              </div>
              <div className="text-[10px] text-slate-400">
                {isUrdu ? 'خوش الحان قاری + پروقار ترجمہ' : 'Recitation followed by translation'}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Speaker Configuration Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Speaker 1 */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
              <span>{isUrdu ? 'پہلا کردار' : 'Speaker 1'}</span>
            </span>
            <input
              type="text"
              value={s1.speaker}
              onChange={(e) => handleSpeakerNameChange(0, e.target.value)}
              className="text-xs font-semibold px-2 py-1 rounded bg-slate-950 border border-slate-700/80 text-white w-28 sm:w-32 max-w-[50%] text-right focus:outline-none focus:border-indigo-500"
            />
          </div>

          <label className="text-[11px] text-slate-400 block mb-1">
            {isUrdu ? 'آواز منتخب کریں:' : 'Select Voice:'}
          </label>
          <select
            value={s1.voiceName}
            onChange={(e) => handleSpeakerVoiceChange(0, e.target.value as VoiceName)}
            className="w-full text-xs p-2 rounded-lg bg-slate-950 border border-slate-700/80 text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            {VOICES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.id} ({v.gender === 'female' ? 'Female' : 'Male'} - {v.tone})
              </option>
            ))}
          </select>
        </div>

        {/* Speaker 2 */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-fuchsia-400 flex items-center gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-fuchsia-500 shrink-0"></span>
              <span>{isUrdu ? 'دوسرا کردار' : 'Speaker 2'}</span>
            </span>
            <input
              type="text"
              value={s2.speaker}
              onChange={(e) => handleSpeakerNameChange(1, e.target.value)}
              className="text-xs font-semibold px-2 py-1 rounded bg-slate-950 border border-slate-700/80 text-white w-28 sm:w-32 max-w-[50%] text-right focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <label className="text-[11px] text-slate-400 block mb-1">
            {isUrdu ? 'آواز منتخب کریں:' : 'Select Voice:'}
          </label>
          <select
            value={s2.voiceName}
            onChange={(e) => handleSpeakerVoiceChange(1, e.target.value as VoiceName)}
            className="w-full text-xs p-2 rounded-lg bg-slate-950 border border-slate-700/80 text-slate-200 focus:outline-none focus:border-fuchsia-500"
          >
            {VOICES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.id} ({v.gender === 'female' ? 'Female' : 'Male'} - {v.tone})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Header and Lines List */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
          <span>{isUrdu ? 'مکالمہ کی لسٹ (Dialogue Script)' : 'Dialogue Lines'}</span>
        </label>
      </div>

      <div className="space-y-2.5">
        {dialogueLines.map((line, index) => {
          const isS1 = line.speaker === s1.speaker;
          return (
            <div
              key={line.id}
              className={`p-3 rounded-xl border transition ${
                isS1
                  ? 'bg-indigo-950/20 border-indigo-500/30'
                  : 'bg-fuchsia-950/20 border-fuchsia-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <button
                  type="button"
                  onClick={() => toggleLineSpeaker(line.id)}
                  className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5 transition ${
                    isS1
                      ? 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30'
                      : 'bg-fuchsia-500/20 text-fuchsia-300 hover:bg-fuchsia-500/30'
                  }`}
                  title="Click to switch speaker"
                >
                  <span>{line.speaker}</span>
                  <ArrowRightLeft className="w-3 h-3 opacity-60" />
                </button>

                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-500">#{index + 1}</span>
                  {dialogueLines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLine(line.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <textarea
                value={line.text}
                onChange={(e) => updateLineText(line.id, e.target.value)}
                placeholder={
                  isUrdu
                    ? `${line.speaker} کی گفتگو یہاں لکھیے...`
                    : `Enter dialogue spoken by ${line.speaker}...`
                }
                dir="auto"
                rows={2}
                className="w-full text-xs sm:text-sm p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition resize-none"
              />
            </div>
          );
        })}
      </div>

      {/* Add Line Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => addLine(s1.speaker)}
          className="flex-1 py-2 px-3 rounded-lg border border-indigo-500/30 bg-indigo-950/30 hover:bg-indigo-900/40 text-indigo-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ {s1.speaker} {isUrdu ? 'کی لائن' : 'line'}</span>
        </button>

        <button
          type="button"
          onClick={() => addLine(s2.speaker)}
          className="flex-1 py-2 px-3 rounded-lg border border-fuchsia-500/30 bg-fuchsia-950/30 hover:bg-fuchsia-900/40 text-fuchsia-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ {s2.speaker} {isUrdu ? 'کی لائن' : 'line'}</span>
        </button>
      </div>
    </div>
  );
};
