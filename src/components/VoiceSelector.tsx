import React, { useState, useEffect } from 'react';
import {
  VOICE_STYLE_CATEGORIES,
  ALL_VOICE_STYLES,
  VoiceStyleCategoryId,
  VoiceStyleItem,
} from '../data/voiceStyles';
import { VOICES, AGE_PERSONAS } from '../data/voices';
import { VoiceName, AgeCategory } from '../types';
import {
  Sparkles,
  Sliders,
  Volume2,
  Check,
  Baby,
  Zap,
  User,
  HeartHandshake,
  BookOpen,
  Music2,
  RotateCcw,
  Gauge,
  Flame,
  Radio,
  Layers,
  Wand2,
} from 'lucide-react';

interface VoiceSelectorProps {
  selectedVoice: VoiceName;
  onSelectVoice: (v: VoiceName) => void;
  selectedAgeCategory: AgeCategory;
  onSelectAgeCategory: (cat: AgeCategory) => void;
  selectedModel: 'gemini-3.8-flash-lite-tts' | 'gemini-3.8-flash-tts';
  onSelectModel: (m: 'gemini-3.8-flash-lite-tts' | 'gemini-3.8-flash-tts') => void;
  stylePrompt: string;
  onStyleChange: (s: string) => void;
  pitch: number;
  onPitchChange: (p: number) => void;
  selectedEmotion?: string;
  onEmotionChange?: (e: string) => void;
  lang: 'ur' | 'en';

  // Independent Customization Controls
  gender?: 'male' | 'female';
  onGenderChange?: (g: 'male' | 'female') => void;
  speakingSpeed?: 'very_slow' | 'slow' | 'normal' | 'fast' | 'very_fast';
  onSpeakingSpeedChange?: (s: 'very_slow' | 'slow' | 'normal' | 'fast' | 'very_fast') => void;
  emotionIntensity?: 'low' | 'medium' | 'high' | 'very_high';
  onEmotionIntensityChange?: (i: 'low' | 'medium' | 'high' | 'very_high') => void;
  voiceTone?: 'natural' | 'soft' | 'deep' | 'powerful' | 'bright';
  onVoiceToneChange?: (t: 'natural' | 'soft' | 'deep' | 'powerful' | 'bright') => void;
  reverbEffect?: 'none' | 'room' | 'hall' | 'cathedral';
  onReverbEffectChange?: (r: 'none' | 'room' | 'hall' | 'cathedral') => void;
  echoEffect?: 'none' | 'subtle' | 'dramatic';
  onEchoEffectChange?: (e: 'none' | 'subtle' | 'dramatic') => void;
}

const PITCH_LEVELS = [
  { value: -4, label: 'Very Low', urduLabel: 'بہت نیچی', pitchValue: -4 },
  { value: -2, label: 'Low', urduLabel: 'نیچی', pitchValue: -2 },
  { value: 0, label: 'Normal', urduLabel: 'معمول', pitchValue: 0 },
  { value: 2, label: 'High', urduLabel: 'اونچی', pitchValue: 2 },
  { value: 4, label: 'Very High', urduLabel: 'بہت اونچی', pitchValue: 4 },
];

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  onSelectVoice,
  selectedAgeCategory,
  onSelectAgeCategory,
  selectedModel,
  onSelectModel,
  stylePrompt,
  onStyleChange,
  pitch,
  onPitchChange,
  lang,
  gender = 'female',
  onGenderChange,
  speakingSpeed = 'normal',
  onSpeakingSpeedChange,
  emotionIntensity = 'medium',
  onEmotionIntensityChange,
  voiceTone = 'natural',
  onVoiceToneChange,
  reverbEffect = 'none',
  onReverbEffectChange,
  echoEffect = 'none',
  onEchoEffectChange,
}) => {
  const isUrdu = lang === 'ur';

  // Category and sub-style states
  const [selectedCategory, setSelectedCategory] = useState<VoiceStyleCategoryId>('emotional');
  const [selectedStyleId, setSelectedStyleId] = useState<string>('romantic_loving');

  // Filter available styles for current category
  const availableStyles = ALL_VOICE_STYLES.filter((s) => s.category === selectedCategory);
  const activeStyle = ALL_VOICE_STYLES.find((s) => s.id === selectedStyleId) || availableStyles[0];

  // When category changes, set to first available style in that category
  const handleCategoryChange = (catId: VoiceStyleCategoryId) => {
    setSelectedCategory(catId);
    const stylesInCat = ALL_VOICE_STYLES.filter((s) => s.category === catId);
    if (stylesInCat.length > 0) {
      const firstStyle = stylesInCat[0];
      setSelectedStyleId(firstStyle.id);
      applyStylePrompt(firstStyle);
    }
  };

  // When style changes within category
  const handleStyleChange = (styleId: string) => {
    setSelectedStyleId(styleId);
    const target = ALL_VOICE_STYLES.find((s) => s.id === styleId);
    if (target) {
      applyStylePrompt(target);
    }
  };

  // Apply style prompt while respecting user customizations
  const applyStylePrompt = (styleItem: VoiceStyleItem) => {
    // Populate prompt text area with detailed instructions
    onStyleChange(styleItem.detailedPrompt);

    // Switch recommended voice if available and user hasn't explicitly locked
    if (styleItem.recommendedVoice) {
      onSelectVoice(styleItem.recommendedVoice);
    }
    if (styleItem.recommendedGender && onGenderChange) {
      onGenderChange(styleItem.recommendedGender);
    }

    // Auto-select Flash TTS for Quranic Recitation to support optimal pause timing
    if (styleItem.id === 'quran_recitation' || styleItem.id === 'naat_recitation') {
      onSelectModel('gemini-3.8-flash-tts');
    }
  };

  // Gender change handler
  const handleGenderSelect = (newGender: 'male' | 'female') => {
    if (onGenderChange) onGenderChange(newGender);
    // Switch to a suitable voice matching this gender
    if (newGender === 'male') {
      if (selectedVoice === 'Kore' || selectedVoice === 'Zephyr' || selectedVoice === 'Aoede') {
        onSelectVoice('Fenrir');
      }
    } else {
      if (selectedVoice === 'Fenrir' || selectedVoice === 'Charon' || selectedVoice === 'Puck') {
        onSelectVoice('Kore');
      }
    }
  };

  const getAgeIcon = (id: AgeCategory) => {
    switch (id) {
      case 'child':
        return <Baby className="w-3.5 h-3.5 text-amber-400" />;
      case 'youth':
        return <Zap className="w-3.5 h-3.5 text-cyan-400" />;
      case 'adult':
        return <User className="w-3.5 h-3.5 text-indigo-400" />;
      case 'elder':
        return <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />;
      case 'qari':
        return <BookOpen className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  // Filter voices if age category is not 'all'
  const filteredVoices = VOICES.filter((v) => {
    if (selectedAgeCategory === 'all') return true;
    if (selectedAgeCategory === 'qari') return v.isQariRecommended;
    return v.ageGroup === selectedAgeCategory || (selectedAgeCategory === 'child' && v.id === 'Puck');
  });

  const displayVoices = filteredVoices.length > 0 ? filteredVoices : VOICES;

  return (
    <div className="space-y-4">
      {/* 1. COMPREHENSIVE VOICE STYLE SELECTION SYSTEM (Dropdown Based) */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-indigo-950/40 border border-indigo-500/30 shadow-xl space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-1.5 pb-1 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                {isUrdu ? 'آواز کے اسلوب اور انداز (Voice Style System)' : 'Voice Style System'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {isUrdu
                  ? '7 اہم زمرہ جات اور 96 سے زائد صوتی انداز'
                  : '7 Categories & 96 Professional Styles'}
              </p>
            </div>
          </div>

          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
            {ALL_VOICE_STYLES.length} {isUrdu ? 'اسٹائلز' : 'Styles'}
          </span>
        </div>

        {/* Dual Compact Dropdowns: Category -> Specific Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Category Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
              <span>{isUrdu ? '1. زمرہ منتخب کریں (Category):' : '1. Category:'}</span>
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value as VoiceStyleCategoryId)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 hover:border-indigo-500 text-white font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition cursor-pointer appearance-none pr-9 shadow-inner"
              >
                {VOICE_STYLE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-slate-900 text-white py-1.5">
                    {isUrdu ? cat.urduName : cat.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs flex items-center">
                ▼
              </div>
            </div>
          </div>

          {/* Style Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
              <span>{isUrdu ? '2. صوتی انداز (Specific Style):' : '2. Voice Style:'}</span>
              <span className="text-[10px] text-indigo-400 font-mono">
                {availableStyles.length} {isUrdu ? 'اختیارات' : 'options'}
              </span>
            </label>
            <div className="relative">
              <select
                value={selectedStyleId}
                onChange={(e) => handleStyleChange(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 hover:border-indigo-500 text-white font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition cursor-pointer appearance-none pr-9 shadow-inner"
              >
                {availableStyles.map((style) => (
                  <option key={style.id} value={style.id} className="bg-slate-900 text-white py-1.5">
                    {isUrdu ? style.urduName : style.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs flex items-center">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* 2. AUTOMATICALLY GENERATED & FULLY EDITABLE VOICE PROMPT */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {isUrdu
                  ? 'جیمینائی وائس ہدایت نامہ (Editable Voice Prompt)'
                  : 'Voice Generation Prompt (Fully Editable)'}
              </span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (activeStyle) {
                    onStyleChange(activeStyle.detailedPrompt);
                  }
                }}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-0.5 transition"
                title={isUrdu ? 'ڈیفالٹ پرامپٹ بحال کریں' : 'Restore style default prompt'}
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>{isUrdu ? 'بحال کریں' : 'Reset'}</span>
              </button>
              {stylePrompt && (
                <button
                  type="button"
                  onClick={() => onStyleChange('')}
                  className="text-[10px] text-slate-500 hover:text-rose-400 transition"
                  title="Clear prompt"
                >
                  ✕ {isUrdu ? 'صاف' : 'Clear'}
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              value={stylePrompt}
              onChange={(e) => onStyleChange(e.target.value)}
              placeholder={
                isUrdu
                  ? 'یہاں منتخب کردہ انداز کی مکمل ہدایات خودکار طور پر درج ہو گئی ہیں۔ آپ اس میں ترمیم، نئی ہدایات کا اضافہ یا تبدیلی کر سکتے ہیں۔..'
                  : 'Voice style directives are automatically populated here. Feel free to view, edit, add custom notes, or modify delivery pacing...'
              }
              className="w-full text-xs sm:text-[13px] leading-relaxed p-3 rounded-xl bg-slate-950/90 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 placeholder-slate-500 font-sans transition resize-y shadow-inner"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-400 pt-0.5">
            <span className="flex items-center gap-1 text-slate-400 font-urdu leading-normal">
              💡 {isUrdu
                ? 'جیمینائی ماڈل آواز بناتے وقت آپ کے اس حتمی ایڈیٹ شدہ پرامپٹ کا استعمال کرے گا۔'
                : 'The AI model uses your edited prompt directly during audio synthesis.'}
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {stylePrompt.length} chars
            </span>
          </div>
        </div>
      </div>

      {/* 3. INDEPENDENT VOICE CUSTOMIZATION CONTROLS */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-md space-y-3.5">
        <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {isUrdu ? 'آزاد صوتی ترتیبات (Voice Customization)' : 'Independent Voice Controls'}
            </span>
          </label>
          <span className="text-[10px] text-slate-500">
            {isUrdu ? 'صوت، رفتار، پچ اور اثرات' : 'Gender, Speed, Pitch, Tone & FX'}
          </span>
        </div>

        {/* Grid of Independent Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          {/* A. Voice Gender */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
              <User className="w-3 h-3 text-indigo-400" />
              <span>{isUrdu ? 'صنف (Gender):' : 'Gender:'}</span>
            </label>
            <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => handleGenderSelect('male')}
                className={`py-1 text-[11px] font-medium rounded transition ${
                  gender === 'male'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isUrdu ? 'مرد (Male)' : 'Male'}
              </button>
              <button
                type="button"
                onClick={() => handleGenderSelect('female')}
                className={`py-1 text-[11px] font-medium rounded transition ${
                  gender === 'female'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isUrdu ? 'خاتون (Female)' : 'Female'}
              </button>
            </div>
          </div>

          {/* B. Speaking Speed */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
              <Gauge className="w-3 h-3 text-amber-400" />
              <span>{isUrdu ? 'بولنے کی رفتار (Speed):' : 'Speaking Speed:'}</span>
            </label>
            <select
              value={speakingSpeed}
              onChange={(e) => onSpeakingSpeedChange && onSpeakingSpeedChange(e.target.value as any)}
              className="w-full py-1.5 px-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="very_slow">{isUrdu ? 'بہت دھیمی (Very Slow)' : 'Very Slow (0.7x)'}</option>
              <option value="slow">{isUrdu ? 'دھیمی (Slow)' : 'Slow (0.85x)'}</option>
              <option value="normal">{isUrdu ? 'معمول (Normal)' : 'Normal (1.0x)'}</option>
              <option value="fast">{isUrdu ? 'تیز (Fast)' : 'Fast (1.2x)'}</option>
              <option value="very_fast">{isUrdu ? 'بہت تیز (Very Fast)' : 'Very Fast (1.4x)'}</option>
            </select>
          </div>

          {/* C. Voice Pitch */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Music2 className="w-3 h-3 text-cyan-400" />
                <span>{isUrdu ? 'آواز کی پچ (Pitch):' : 'Voice Pitch:'}</span>
              </span>
              <span className="font-mono text-[10px] text-cyan-400">
                {pitch > 0 ? `+${pitch}` : pitch}
              </span>
            </label>
            <select
              value={pitch}
              onChange={(e) => onPitchChange(parseInt(e.target.value, 10))}
              className="w-full py-1.5 px-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {PITCH_LEVELS.map((p) => (
                <option key={p.value} value={p.value}>
                  {isUrdu ? p.urduLabel : p.label} ({p.value > 0 ? `+${p.value}` : p.value})
                </option>
              ))}
            </select>
          </div>

          {/* D. Emotion Intensity */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
              <Flame className="w-3 h-3 text-rose-400" />
              <span>{isUrdu ? 'جذبات کی شدت (Intensity):' : 'Emotion Intensity:'}</span>
            </label>
            <select
              value={emotionIntensity}
              onChange={(e) =>
                onEmotionIntensityChange && onEmotionIntensityChange(e.target.value as any)
              }
              className="w-full py-1.5 px-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-rose-500 cursor-pointer"
            >
              <option value="low">{isUrdu ? 'ہلکی (Low / Subtle)' : 'Low (Subtle)'}</option>
              <option value="medium">{isUrdu ? 'متوازن (Medium / Natural)' : 'Medium (Natural)'}</option>
              <option value="high">{isUrdu ? 'زیادہ (High / Expressive)' : 'High (Expressive)'}</option>
              <option value="very_high">{isUrdu ? 'شدید (Very High / Dramatic)' : 'Very High (Dramatic)'}</option>
            </select>
          </div>

          {/* E. Voice Tone */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
              <Radio className="w-3 h-3 text-fuchsia-400" />
              <span>{isUrdu ? 'صوتی لہجہ (Tone):' : 'Voice Tone:'}</span>
            </label>
            <select
              value={voiceTone}
              onChange={(e) => onVoiceToneChange && onVoiceToneChange(e.target.value as any)}
              className="w-full py-1.5 px-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-fuchsia-500 cursor-pointer"
            >
              <option value="natural">{isUrdu ? 'قدرتی (Natural)' : 'Natural'}</option>
              <option value="soft">{isUrdu ? 'نرم (Soft)' : 'Soft & Tender'}</option>
              <option value="deep">{isUrdu ? 'گہرا / بھاری (Deep)' : 'Deep & Resonant'}</option>
              <option value="powerful">{isUrdu ? 'طاقتور (Powerful)' : 'Powerful & Bold'}</option>
              <option value="bright">{isUrdu ? 'روشن و تیز (Bright)' : 'Bright & Clear'}</option>
            </select>
          </div>

          {/* F. Studio Audio Effects: Reverb & Echo */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
              <Wand2 className="w-3 h-3 text-emerald-400" />
              <span>{isUrdu ? 'صوتی اثرات (Studio FX):' : 'Studio Effects:'}</span>
            </label>
            <div className="grid grid-cols-2 gap-1">
              <select
                value={reverbEffect}
                onChange={(e) =>
                  onReverbEffectChange && onReverbEffectChange(e.target.value as any)
                }
                className="w-full py-1.5 px-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-[11px] focus:outline-none focus:border-emerald-500 cursor-pointer"
                title="Studio Reverb"
              >
                <option value="none">No Reverb</option>
                <option value="room">Room Reverb</option>
                <option value="hall">Large Hall</option>
                <option value="cathedral">Cathedral</option>
              </select>
              <select
                value={echoEffect}
                onChange={(e) => onEchoEffectChange && onEchoEffectChange(e.target.value as any)}
                className="w-full py-1.5 px-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-[11px] focus:outline-none focus:border-emerald-500 cursor-pointer"
                title="Echo / Delay"
              >
                <option value="none">No Echo</option>
                <option value="subtle">Subtle Echo</option>
                <option value="dramatic">Dramatic Delay</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Personas Grid */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isUrdu ? 'آواز کا ماڈل کردار (Voice Persona)' : 'Voice Character Selection'}</span>
          </label>
          <span className="text-[11px] text-slate-500">
            {displayVoices.length} {isUrdu ? 'کردار' : 'characters'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {displayVoices.map((v) => {
            const isSelected = selectedVoice === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  onSelectVoice(v.id);
                  if (onGenderChange) onGenderChange(v.gender);
                }}
                className={`relative p-3 rounded-xl border text-left transition-all group overflow-hidden ${
                  isSelected
                    ? 'bg-slate-900/90 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/70 hover:border-slate-700'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}

                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${v.avatarColor} flex items-center justify-center text-white text-xs font-bold shadow-sm`}
                  >
                    {v.id[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 group-hover:text-white">
                      {isUrdu ? v.urduName : v.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {v.gender === 'female' ? (isUrdu ? 'خاتون' : 'Female') : (isUrdu ? 'مرد' : 'Male')}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-normal line-clamp-2 mb-1 break-words">
                  {isUrdu ? v.urduTone : v.tone}
                </p>
                <div className="text-[10px] text-indigo-400/90 font-medium truncate leading-normal">
                  💡 {isUrdu ? v.urduBestFor : v.bestFor}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Model Mode Selection */}
      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isUrdu ? 'جیمینائی اسپیچ ماڈل' : 'Gemini Speech Model'}</span>
          </span>
          <span className="text-[11px] text-slate-400">
            {selectedModel === 'gemini-3.8-flash-tts'
              ? (isUrdu ? 'جذباتی و ایکسپریسو' : 'Expressive Studio Pro')
              : (isUrdu ? 'تیز رفتار و معیاری' : 'Fast & High-Efficiency')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onSelectModel('gemini-3.8-flash-lite-tts')}
            className={`p-2.5 rounded-lg border text-left transition ${
              selectedModel === 'gemini-3.8-flash-lite-tts'
                ? 'bg-indigo-600/20 border-indigo-500 text-white'
                : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold flex items-center justify-between">
              <span>Flash Lite TTS</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                {isUrdu ? 'مقبول / زیادہ کوٹہ' : 'High Quota'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
              {isUrdu ? 'ہموار، تیز رفتار اور وسیع کوٹہ' : 'Crisp, smooth & high free quota'}
            </p>
          </button>

          <button
            type="button"
            onClick={() => onSelectModel('gemini-3.8-flash-tts')}
            className={`p-2.5 rounded-lg border text-left transition ${
              selectedModel === 'gemini-3.8-flash-tts'
                ? 'bg-indigo-600/20 border-indigo-500 text-white'
                : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold flex items-center justify-between">
              <span>Flash TTS (Studio Pro)</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                {isUrdu ? '10 فری یومیہ' : '10 reqs/day'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
              {isUrdu ? 'جدید تاثرات و تلاوت کے وقفے' : 'Pro audio & expressive nuances'}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
