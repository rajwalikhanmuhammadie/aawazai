export type VoiceName = 'Kore' | 'Puck' | 'Fenrir' | 'Zephyr' | 'Charon' | 'Aoede';

export type AgeCategory = 'all' | 'child' | 'youth' | 'adult' | 'elder' | 'qari';

export interface VoiceOption {
  id: VoiceName;
  name: string;
  urduName: string;
  gender: 'female' | 'male';
  ageGroup: 'child' | 'youth' | 'adult' | 'elder';
  tone: string;
  urduTone: string;
  bestFor: string;
  urduBestFor: string;
  avatarColor: string;
  isQariRecommended?: boolean;
}

export interface AgePersonaPreset {
  id: AgeCategory;
  title: string;
  urduTitle: string;
  icon: string;
  desc: string;
  urduDesc: string;
  defaultVoice: VoiceName;
  stylePrompt: string;
}

export interface StylePreset {
  id: string;
  category: AgeCategory;
  title: string;
  urduTitle: string;
  prompt: string;
  icon: string;
  badge: string;
}

export interface VoiceEmotionOption {
  id: string;
  name: string;
  urduName: string;
  icon: string;
  promptDescription: string;
}

export interface QuranVersePreset {
  id: string;
  surahName: string;
  urduSurahName: string;
  arabicText: string;
  urduTranslation?: string;
  recommendedVoice: VoiceName;
  stylePrompt: string;
}

export interface GeneratedAudioItem {
  id: string;
  title: string;
  text: string;
  voiceName: VoiceName;
  model: string;
  audioBase64: string;
  createdAt: number;
  durationEstimateSec?: number;
  mode: 'single' | 'dialogue';
  ageCategory?: AgeCategory;
  pitch?: number;
  styleCategory?: string;
  styleId?: string;
  stylePrompt?: string;
  // Google Drive Integration fields
  driveFileId?: string;
  driveWebViewLink?: string;
  driveWebContentLink?: string;
  driveFolderId?: string;
  driveUploadStatus?: 'pending' | 'uploaded' | 'failed' | 'not_connected';
  // Audio Customization metadata
  gender?: 'male' | 'female';
  speakingSpeed?: 'very_slow' | 'slow' | 'normal' | 'fast' | 'very_fast';
  emotionIntensity?: 'low' | 'medium' | 'high' | 'very_high';
  voiceTone?: 'natural' | 'soft' | 'deep' | 'powerful' | 'bright';
  reverbEffect?: 'none' | 'room' | 'hall' | 'cathedral';
  echoEffect?: 'none' | 'subtle' | 'dramatic';
}

export interface DialogueLine {
  id: string;
  speaker: string;
  text: string;
  style?: string;
  ageGroup?: 'child' | 'youth' | 'adult' | 'elder';
}

export interface DialogueSpeakerConfig {
  speaker: string;
  voiceName: VoiceName;
  ageCategory?: AgeCategory;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  apiKey: string;
  isActive: boolean;
  avatarUrl?: string;
  isSystemDefault?: boolean;
  createdAt: number;
  lastUsedAt?: number;
  status?: 'active' | 'quota_exhausted' | 'invalid' | 'untested';
  statusMessage?: string;
}
