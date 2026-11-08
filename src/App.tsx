import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { VoiceSelector } from './components/VoiceSelector';
import { ScriptEditor } from './components/ScriptEditor';
import { AudioPlayer } from './components/AudioPlayer';
import { DialogueMode } from './components/DialogueMode';
import { HistoryDrawer } from './components/HistoryDrawer';
import { RecentVoicesSection } from './components/RecentVoicesSection';
import { ScriptAiModal } from './components/ScriptAiModal';
import { VideoTipsModal } from './components/VideoTipsModal';
import { LoginPromptModal } from './components/LoginPromptModal';
import { PWAInstallSection } from './components/PWAInstallSection';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  db,
  User,
} from './firebase';
import { GoogleAuthProvider } from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import {
  VoiceName,
  GeneratedAudioItem,
  DialogueLine,
  DialogueSpeakerConfig,
  AgeCategory,
} from './types';
import { ScriptTemplate, SCRIPT_TEMPLATES } from './data/templates';
import { AGE_PERSONAS } from './data/voices';
import {
  getStoredDriveToken,
  storeDriveToken,
  uploadAudioToDrive,
  deleteFileFromDrive,
} from './services/googleDrive';
import {
  Sparkles,
  Mic,
  Volume2,
  Users,
  RotateCw,
  AlertCircle,
  BookOpen,
  Baby,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  LogIn,
  Cloud,
  ExternalLink,
} from 'lucide-react';

const STORAGE_KEY = 'aawazai_history_v1';

export default function App() {
  const [lang, setLang] = useState<'ur' | 'en'>('en');
  const [mode, setMode] = useState<'single' | 'dialogue'>('single');
  const [selectedAgeCategory, setSelectedAgeCategory] = useState<AgeCategory>('all');
  const [selectedVoice, setSelectedVoice] = useState<VoiceName>('Kore');
  const [selectedModel, setSelectedModel] = useState<
    'gemini-3.8-flash-lite-tts' | 'gemini-3.8-flash-tts'
  >('gemini-3.8-flash-lite-tts');
  const [stylePrompt, setStylePrompt] = useState<string>(
    'Warm, tender, deeply affectionate and loving delivery. Soft, intimate voice tone with gentle emotional warmth, subtle breathiness, caring inflection, and sincere pauses.'
  );
  const [pitch, setPitch] = useState<number>(0);

  // Independent Customization Controls
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [speakingSpeed, setSpeakingSpeed] = useState<
    'very_slow' | 'slow' | 'normal' | 'fast' | 'very_fast'
  >('normal');
  const [emotionIntensity, setEmotionIntensity] = useState<
    'low' | 'medium' | 'high' | 'very_high'
  >('medium');
  const [voiceTone, setVoiceTone] = useState<
    'natural' | 'soft' | 'deep' | 'powerful' | 'bright'
  >('natural');
  const [reverbEffect, setReverbEffect] = useState<'none' | 'room' | 'hall' | 'cathedral'>('none');
  const [echoEffect, setEchoEffect] = useState<'none' | 'subtle' | 'dramatic'>('none');

  const [text, setText] = useState<string>(
    `Did you know that every extraordinary journey begins with a single small step? <breath> When challenges arise in life, stay resilient and keep moving forward. Patience and persistent focus are the keys to true success.`
  );

  // Dialogue mode state
  const [speakers, setSpeakers] = useState<[DialogueSpeakerConfig, DialogueSpeakerConfig]>([
    { speaker: 'Elder (Wise Grandfather)', voiceName: 'Charon' },
    { speaker: 'Ali (Curious Child)', voiceName: 'Puck' },
  ]);

  const [dialogueLines, setDialogueLines] = useState<DialogueLine[]>([
    {
      id: 'd1',
      speaker: 'Elder (Wise Grandfather)',
      text: 'My dear child, do you know why trees share their shade and sweet fruits with the whole world?',
    },
    {
      id: 'd2',
      speaker: 'Ali (Curious Child)',
      text: 'No Grandfather! <gasp> Please tell me, they never even ask for anything in return!',
    },
    {
      id: 'd3',
      speaker: 'Elder (Wise Grandfather)',
      text: 'Well said, my child! <breath> That is the golden law of nature: whoever brings value and kindness to others is always elevated.',
    },
  ]);

  // Audio history & current
  const [history, setHistory] = useState<GeneratedAudioItem[]>([]);
  const [currentAudio, setCurrentAudio] = useState<GeneratedAudioItem | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [quotaNotice, setQuotaNotice] = useState<string | null>(null);

  // User Authentication & Google Drive state
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [driveToken, setDriveToken] = useState<string | null>(() => getStoredDriveToken());
  const [showLoginPromptModal, setShowLoginPromptModal] = useState<boolean>(false);

  // Modals
  const [showAiModal, setShowAiModal] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          await setDoc(
            doc(db, 'users', currentUser.uid),
            {
              email: currentUser.email,
              displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
              photoURL: currentUser.photoURL || '',
              lastLoginAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (e) {
          console.warn('Firestore user profile sync error:', e);
        }
      } else {
        setDriveToken(null);
        storeDriveToken(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync Audio History with Firestore when user is logged in, or fallback to localStorage
  useEffect(() => {
    if (!user) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setHistory(parsed);
            if (!currentAudio) setCurrentAudio(parsed[0]);
          }
        }
      } catch (e) {
        console.warn('Failed to parse local history:', e);
      }
      return;
    }

    // Subscribe to cloud Firestore history
    const historyCol = collection(db, 'users', user.uid, 'audioHistory');
    const q = query(historyCol, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const cloudItems: GeneratedAudioItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          cloudItems.push({
            id: docSnap.id,
            title: data.title || '',
            text: data.text || '',
            voiceName: data.voiceName || 'Kore',
            model: data.model || 'gemini-3.8-flash-lite-tts',
            audioBase64: data.audioBase64 || '',
            createdAt: typeof data.createdAt === 'number' ? data.createdAt : Date.now(),
            mode: data.mode || 'single',
            ageCategory: data.ageCategory,
            pitch: data.pitch,
            styleCategory: data.styleCategory,
            styleId: data.styleId,
            stylePrompt: data.stylePrompt,
            driveFileId: data.driveFileId,
            driveWebViewLink: data.driveWebViewLink,
            driveWebContentLink: data.driveWebContentLink,
            driveFolderId: data.driveFolderId,
            driveUploadStatus: data.driveUploadStatus,
            gender: data.gender,
            speakingSpeed: data.speakingSpeed,
            emotionIntensity: data.emotionIntensity,
            voiceTone: data.voiceTone,
            reverbEffect: data.reverbEffect,
            echoEffect: data.echoEffect,
          });
        });

        setHistory(cloudItems);
        if (cloudItems.length > 0 && !currentAudio) {
          setCurrentAudio(cloudItems[0]);
        }
      },
      (err) => {
        console.warn('Firestore history subscription error:', err);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Google Login handler with Drive scope & token extraction
  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const loggedUser = result.user;
      setUser(loggedUser);
      setShowLoginPromptModal(false);

      // Extract and cache OAuth Access Token for Google Drive API
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      if (token) {
        storeDriveToken(token);
        setDriveToken(token);
      }

      try {
        await setDoc(
          doc(db, 'users', loggedUser.uid),
          {
            email: loggedUser.email,
            displayName: loggedUser.displayName || loggedUser.email?.split('@')[0] || 'User',
            photoURL: loggedUser.photoURL || '',
            lastLoginAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (e) {
        console.warn('Error saving user profile on login:', e);
      }
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError(
          lang === 'ur'
            ? 'گوگل لاگ ان مکمل نہیں ہو سکا۔ براہ کرم دوبارہ کوشش کریں۔'
            : 'Google Sign-In could not be completed. Please try again.'
        );
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Google Logout handler
  const handleGoogleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setDriveToken(null);
      storeDriveToken(null);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  // Save history item to Firestore with matching document ID and localStorage fallback
  const saveToHistory = async (item: GeneratedAudioItem) => {
    setHistory((prev) => [item, ...prev.filter((i) => i.id !== item.id)]);

    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'audioHistory', item.id), {
          userId: user.uid,
          title: item.title,
          text: item.text,
          voiceName: item.voiceName,
          model: item.model,
          audioBase64: item.audioBase64,
          createdAt: item.createdAt,
          mode: item.mode,
          ageCategory: item.ageCategory || 'all',
          pitch: item.pitch || 0,
          stylePrompt: item.stylePrompt || '',
          driveFileId: item.driveFileId || '',
          driveWebViewLink: item.driveWebViewLink || '',
          driveWebContentLink: item.driveWebContentLink || '',
          driveFolderId: item.driveFolderId || '',
          driveUploadStatus: item.driveUploadStatus || 'pending',
          gender: item.gender || 'female',
          speakingSpeed: item.speakingSpeed || 'normal',
          emotionIntensity: item.emotionIntensity || 'medium',
          voiceTone: item.voiceTone || 'natural',
          reverbEffect: item.reverbEffect || 'none',
          echoEffect: item.echoEffect || 'none',
        });
      } catch (e) {
        console.warn('Failed to save audio to Firestore:', e);
      }
    } else {
      try {
        const updated = [item, ...history.filter((i) => i.id !== item.id)];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }
    }
  };

  // Permanently delete audio from Firestore, Google Drive, and local state
  const deleteHistoryItem = async (id: string) => {
    const targetItem = history.find((i) => i.id === id);

    // 1. Remove from React state immediately
    setHistory((prev) => prev.filter((i) => i.id !== id));
    if (currentAudio?.id === id) {
      setCurrentAudio(history.find((i) => i.id !== id) || null);
    }

    // 2. Remove from Google Drive if fileId exists
    if (targetItem?.driveFileId && driveToken) {
      try {
        await deleteFileFromDrive(driveToken, targetItem.driveFileId);
      } catch (err) {
        console.warn('Failed to delete file from Google Drive:', err);
      }
    }

    // 3. Remove from Firestore
    if (user) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'audioHistory', id));
      } catch (e) {
        console.warn('Failed to delete audio from Firestore:', e);
      }
    } else {
      try {
        const filtered = history.filter((i) => i.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      } catch (e) {}
    }
  };

  // Rename audio item in local state and Firestore
  const renameHistoryItem = async (id: string, newTitle: string) => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, title: newTitle } : item))
    );
    if (currentAudio?.id === id) {
      setCurrentAudio((prev) => (prev ? { ...prev, title: newTitle } : null));
    }

    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid, 'audioHistory', id), {
          title: newTitle,
        });
      } catch (e) {
        console.warn('Failed to rename audio in Firestore:', e);
      }
    } else {
      try {
        const updated = history.map((item) =>
          item.id === id ? { ...item, title: newTitle } : item
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
    }
  };

  // Manual Sync to Google Drive
  const syncItemToDrive = async (item: GeneratedAudioItem) => {
    if (!driveToken) {
      handleGoogleLogin();
      return;
    }

    try {
      const driveRes = await uploadAudioToDrive(driveToken, {
        title: item.title,
        voiceName: item.voiceName,
        audioBase64: item.audioBase64,
        createdAt: item.createdAt,
        text: item.text,
      });

      const updatedItem: GeneratedAudioItem = {
        ...item,
        driveFileId: driveRes.fileId,
        driveWebViewLink: driveRes.webViewLink,
        driveWebContentLink: driveRes.webContentLink,
        driveFolderId: driveRes.folderId,
        driveUploadStatus: 'uploaded',
      };

      await saveToHistory(updatedItem);
      if (currentAudio?.id === item.id) {
        setCurrentAudio(updatedItem);
      }
    } catch (err: any) {
      console.error('Manual Drive sync failed:', err);
      setError(
        lang === 'ur'
          ? 'گوگل ڈرائیو میں محفوظ کرنے میں ناکامی ہوئی۔ براہ کرم دوبارہ کوشش کریں۔'
          : 'Failed to upload to Google Drive. Please try again.'
      );
    }
  };

  const clearAllHistory = () => {
    setHistory([]);
    setCurrentAudio(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleSelectTemplate = (tmpl: ScriptTemplate) => {
    setText(tmpl.text);
    setSelectedVoice(tmpl.recommendedVoice);
    if (tmpl.stylePrompt) {
      setStylePrompt(tmpl.stylePrompt);
    }
    if (tmpl.ageGroup) {
      setSelectedAgeCategory(tmpl.ageGroup);
    }
  };

  // Quick preset button for Quran Recitation mode
  const activateQariMode = () => {
    setSelectedAgeCategory('qari');
    setSelectedVoice('Fenrir');
    setGender('male');
    const qariTemplate = SCRIPT_TEMPLATES.find((t) => t.id === 'quran_fatihah') || SCRIPT_TEMPLATES[0];
    handleSelectTemplate(qariTemplate);
  };

  const activateChildMode = () => {
    setSelectedAgeCategory('child');
    setSelectedVoice('Puck');
    setGender('male');
    const childTemplate = SCRIPT_TEMPLATES.find((t) => t.id === 'child_curiosity') || SCRIPT_TEMPLATES[0];
    handleSelectTemplate(childTemplate);
  };

  const activateElderMode = () => {
    setSelectedAgeCategory('elder');
    setSelectedVoice('Charon');
    setGender('male');
    const elderTemplate = SCRIPT_TEMPLATES.find((t) => t.id === 'elder_advice') || SCRIPT_TEMPLATES[0];
    handleSelectTemplate(elderTemplate);
  };

  const handleGenerateVoice = async () => {
    // If not logged in, prompt user to log in with Google first
    if (!user) {
      setShowLoginPromptModal(true);
      return;
    }

    setError(null);
    setQuotaNotice(null);
    setIsGenerating(true);

    try {
      let payload: any = {};
      if (mode === 'single') {
        if (!text.trim()) {
          throw new Error(
            lang === 'ur'
              ? 'براہ کرم آواز بنانے کے لیے اسکرپٹ ٹیکسٹ درج کیجیے۔'
              : 'Please enter a script text to generate voice.'
          );
        }
        payload = {
          mode: 'single',
          model: selectedModel,
          text: text.trim(),
          voiceName: selectedVoice,
          style: stylePrompt.trim(),
          pitch: pitch,
          speakingSpeed,
          emotionIntensity,
          voiceTone,
          reverbEffect,
          echoEffect,
        };
      } else {
        const validLines = dialogueLines.filter((l) => l.text.trim());
        if (validLines.length === 0) {
          throw new Error(
            lang === 'ur'
              ? 'براہ کرم کم از کم ایک مکالمہ کی لائن درج کیجیے۔'
              : 'Please enter at least one dialogue line.'
          );
        }
        payload = {
          mode: 'dialogue',
          model: selectedModel,
          dialogueParts: validLines,
          speakers: speakers,
        };
      }

      const res = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Voice generation failed');
      }

      if (data.quotaFallback) {
        setQuotaNotice(
          lang === 'ur'
            ? 'Flash TTS کی روزانہ فری لمٹ (10 درخواستیں) مکمل ہو گئی تھی۔ آپ کی آواز خودکار طور پر Flash Lite TTS سے کامیابی سے تیار کر دی گئی ہے۔'
            : 'Flash TTS daily free quota reached. Audio was seamlessly generated using Flash Lite TTS.'
        );
      }

      // Pre-assign Firestore Document ID to eliminate any mismatch
      const historyCollection = collection(db, 'users', user.uid, 'audioHistory');
      const docRef = doc(historyCollection);
      const generatedDocId = docRef.id;

      const itemTitle =
        mode === 'single'
          ? text.substring(0, 35) + '...'
          : `${speakers[0].speaker} & ${speakers[1].speaker} Dialogue`;

      const newItem: GeneratedAudioItem = {
        id: generatedDocId,
        title: itemTitle,
        text:
          mode === 'single'
            ? text
            : dialogueLines.map((l) => `${l.speaker}: ${l.text}`).join('\n'),
        voiceName: mode === 'single' ? selectedVoice : (speakers[0].voiceName as VoiceName),
        model: data.model || selectedModel,
        audioBase64: data.audioBase64,
        createdAt: Date.now(),
        mode,
        ageCategory: selectedAgeCategory,
        pitch,
        stylePrompt,
        gender,
        speakingSpeed,
        emotionIntensity,
        voiceTone,
        reverbEffect,
        echoEffect,
        driveUploadStatus: 'pending',
      };

      // Set audio and unlock button IMMEDIATELY so the user is never stuck
      setCurrentAudio(newItem);
      setIsGenerating(false);

      // Scroll smoothly to player if on mobile
      const playerEl = document.getElementById('audio-player-section');
      if (playerEl) {
        playerEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Background save to Firestore & LocalStorage (non-blocking)
      saveToHistory(newItem).catch((e) => console.warn('History save error:', e));

      // Background upload to Google Drive without blocking the next generation
      if (driveToken) {
        uploadAudioToDrive(driveToken, {
          title: itemTitle,
          voiceName: newItem.voiceName,
          audioBase64: newItem.audioBase64,
          createdAt: newItem.createdAt,
          text: newItem.text,
        })
          .then(async (driveResult) => {
            const syncedItem: GeneratedAudioItem = {
              ...newItem,
              driveFileId: driveResult.fileId,
              driveWebViewLink: driveResult.webViewLink,
              driveWebContentLink: driveResult.webContentLink,
              driveFolderId: driveResult.folderId,
              driveUploadStatus: 'uploaded',
            };
            setCurrentAudio((curr) => (curr?.id === newItem.id ? syncedItem : curr));
            await saveToHistory(syncedItem);
          })
          .catch((driveErr) => {
            console.warn('Google Drive auto-upload warning:', driveErr);
            const failedItem: GeneratedAudioItem = {
              ...newItem,
              driveUploadStatus: 'failed',
            };
            saveToHistory(failedItem).catch(() => {});
          });
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      let rawMsg = String(err?.message || '');
      try {
        const parsed = JSON.parse(rawMsg);
        if (parsed?.error?.message) {
          rawMsg = parsed.error.message;
        }
      } catch {}

      if (
        rawMsg.includes('503') ||
        rawMsg.includes('UNAVAILABLE') ||
        rawMsg.includes('high demand') ||
        rawMsg.includes('Spikes in demand')
      ) {
        setError(
          lang === 'ur'
            ? 'گوگل سرورز پر اس وقت وقتی رش (High Demand) ہے۔ براہ کرم چند لمحے بعد دوبارہ کوشش کیجیے۔'
            : 'Google voice model is experiencing high demand. Please try again in a few moments.'
        );
      } else if (
        rawMsg.includes('429') ||
        rawMsg.includes('quota') ||
        rawMsg.includes('RESOURCE_EXHAUSTED')
      ) {
        setError(
          lang === 'ur'
            ? 'گوگل سرور کی روزانہ فری لمٹ مکمل ہو چکی ہے۔ ماڈل خودکار طور پر لائٹ ورژن پر شفٹ ہو رہا ہے۔'
            : 'Gemini free quota reached. The system will automatically use the Lite version.'
        );
      } else {
        setError(rawMsg || 'Voice generation failed. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const isUrdu = lang === 'ur';

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col ${
        isUrdu ? 'font-arabic' : ''
      }`}
    >
      {/* Top Navigation */}
      <Navbar
        lang={lang}
        setLang={setLang}
        onOpenHistory={() => setShowHistoryDrawer(true)}
        onOpenTips={() => setShowTipsModal(true)}
        historyCount={history.length}
        user={user}
        onLogin={handleGoogleLogin}
        onLogout={handleGoogleLogout}
        isLoggingIn={isLoggingIn}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* User Status & Google Drive Integration Banner */}
        {user ? (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-lg shadow-indigo-950/20">
            <div className="flex items-center gap-3 min-w-0">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Google User'}
                  className="w-10 h-10 rounded-xl object-cover border border-emerald-500/40 shrink-0 shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0 font-bold">
                  {user.displayName?.[0] || 'U'}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-white text-sm truncate">
                    {user.displayName || 'Google User'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold flex items-center gap-1 shrink-0">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{isUrdu ? 'مستقل رکن فعال ہے' : 'Permanent Member'}</span>
                  </span>

                  {/* Google Drive Status */}
                  {driveToken ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 font-semibold flex items-center gap-1 shrink-0">
                      <Cloud className="w-3 h-3 text-blue-400" />
                      <span>{isUrdu ? 'گوگل ڈرائیو منسلک ہے' : 'Drive Connected'}</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition flex items-center gap-1 shrink-0"
                    >
                      <Cloud className="w-3 h-3 text-amber-400" />
                      <span>{isUrdu ? 'ڈرائیو کنیکٹ کریں' : 'Connect Google Drive'}</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                  {user.email}
                </p>
                <p className="text-[11px] text-slate-300 font-urdu mt-1 leading-normal">
                  {isUrdu
                    ? 'آپ گوگل کے ساتھ لاگ ان ہیں؛ تمام آڈیوز اور ہسٹری "My Generated Voices" گوگل ڈرائیو میں محفوظ ہو رہی ہیں۔'
                    : 'Audio clips are automatically stored in your Google Drive ("My Generated Voices") & Firestore.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => setShowHistoryDrawer(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-semibold transition flex items-center gap-1.5 shadow-sm"
              >
                <span>{isUrdu ? 'میری محفوظ شدہ آڈیوز' : 'My Saved Audios'}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-indigo-500 text-white text-[10px]">
                  {history.length}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-indigo-950/70 border border-indigo-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xl">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-md">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              </div>
              <div>
                <p className="font-bold text-white text-sm sm:text-base leading-snug">
                  {isUrdu
                    ? 'کسی بھی جی میل (Gmail) کے ساتھ لاگ ان کریں اور مستقل رکن بنیں'
                    : 'Sign in with any Gmail and become a permanent member'}
                </p>
                <p className="text-slate-300 text-xs mt-0.5 font-urdu leading-normal">
                  {isUrdu
                    ? 'کوئی کی (API Key) ڈالنے کی ضرورت نہیں! بس ایک کلک سے لاگ ان کریں، گوگل ڈرائیو میں فولڈر بنائیں اور بلا روک ٹوک آوازیں محفوظ کریں۔'
                    : 'No API keys required! Sign in with 1 click to generate voiceovers and save to Google Drive automatically.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 shrink-0 active:scale-95 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4 text-indigo-600" />
              <span>
                {isLoggingIn
                  ? isUrdu
                    ? 'لاگ ان ہو رہا ہے...'
                    : 'Signing In...'
                  : isUrdu
                  ? 'Google سے لاگ ان کریں'
                  : 'Sign in with Google'}
              </span>
            </button>
          </div>
        )}

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden p-5 sm:p-8 bg-gradient-to-r from-indigo-950/70 via-slate-900/90 to-fuchsia-950/70 border border-slate-800/80 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex-wrap">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>
                {isUrdu
                  ? 'مرد، عورت، بچے، بوڑھے اور تلاوتِ کلام پاک'
                  : 'All Ages & Tajweed Recitation'}
              </span>
              <span className="text-slate-500 hidden xs:inline">•</span>
              <span className="text-emerald-400">24kHz Studio WAV</span>
            </div>

            <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-normal sm:leading-snug break-words">
              {isUrdu ? (
                <>
                  عمر کے حساب سے آوازیں: <span className="text-amber-300">بچے</span>،{' '}
                  <span className="text-indigo-400">نوجوان</span>،{' '}
                  <span className="text-fuchsia-400">بالغ</span>،{' '}
                  <span className="text-rose-400">بزرگ</span> اور{' '}
                  <span className="text-emerald-400">تلاوتِ کلام پاک</span>
                </>
              ) : (
                <>
                  Voice by Age & Persona:{' '}
                  <span className="text-amber-300">Children</span>,{' '}
                  <span className="text-indigo-400">Youth</span>,{' '}
                  <span className="text-fuchsia-400">Adults</span>,{' '}
                  <span className="text-rose-400">Elders</span> &{' '}
                  <span className="text-emerald-400">Quran Recitation</span>
                </>
              )}
            </h2>

            <p
              className="text-xs sm:text-sm text-slate-300 leading-relaxed font-urdu break-words"
              dir="auto"
            >
              {isUrdu
                ? 'جس عمر یا انداز کو بھی منتخب کریں، جیمینائی اسی مخصوص لہجے میں آواز تخلیق کرے گا۔ قاری کے انداز میں پوری تجوید، مد، غنہ اور رموزِ اوقاف کے صحیح وقفوں کے ساتھ تلاوت کی سہولت۔'
                : 'Choose any age group or style to synthesize tailored speech. Includes full Tajweed Quran recitation with accurate Waqf pause stops.'}
            </p>

            {/* Quick 1-Click Modes Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
              <button
                type="button"
                onClick={activateQariMode}
                className="px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 hover:bg-emerald-900/60 text-emerald-200 font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-900/30 transition active:scale-95 leading-normal"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{isUrdu ? '📖 تلاوت کلام پاک مع تجوید' : 'Quran Recitation (Tajweed)'}</span>
              </button>

              <button
                type="button"
                onClick={activateChildMode}
                className="px-3 py-1.5 rounded-xl bg-amber-950/70 border border-amber-500/50 hover:bg-amber-900/60 text-amber-200 font-bold flex items-center gap-1.5 shadow-sm shadow-amber-900/30 transition active:scale-95 leading-normal"
              >
                <Baby className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{isUrdu ? '🧒 معصوم بچے کی آواز' : 'Child Voice'}</span>
              </button>

              <button
                type="button"
                onClick={activateElderMode}
                className="px-3 py-1.5 rounded-xl bg-rose-950/70 border border-rose-500/50 hover:bg-rose-900/60 text-rose-200 font-bold flex items-center gap-1.5 shadow-sm shadow-rose-900/30 transition active:scale-95 leading-normal"
              >
                <HeartHandshake className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{isUrdu ? '👴 شفیق بزرگ / دادا جان' : 'Elder / Grandfather'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mode Switcher Tabs (Single Narrator vs 2-Speaker Dialogue) */}
        <div className="border-b border-slate-800 pb-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            <button
              type="button"
              onClick={() => setMode('single')}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
                mode === 'single'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Mic className="w-4 h-4 shrink-0" />
              <span className="leading-normal truncate">
                {isUrdu ? 'واحد راوی / تلاوت (Single Voice)' : 'Single Voice / Reciter'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('dialogue');
                setSelectedModel('gemini-3.8-flash-tts');
              }}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
                mode === 'dialogue'
                  ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/25'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span className="leading-normal truncate">
                {isUrdu ? 'دو کرداروں کا مکالمہ (دادا و بچہ)' : 'Dialogue / 2 Speakers'}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-normal shrink-0">
                Flash TTS
              </span>
            </button>
          </div>
        </div>

        {/* Quota fallback notification */}
        {quotaNotice && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">
                {isUrdu ? 'خودکار کوٹہ متبادل (Quota Fallback):' : 'Auto Fallback:'}
              </span>{' '}
              {quotaNotice}
            </div>
            <button
              onClick={() => setQuotaNotice(null)}
              className="text-amber-400 hover:text-amber-200 text-xs font-bold px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Error notification if any */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start justify-between gap-2.5 animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold">{isUrdu ? 'توجہ فرمائیں:' : 'Notice:'}</span> {error}
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-rose-200 text-xs font-bold px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Main Creation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left / Center Column: Script & Options (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-5">
              {mode === 'single' ? (
                <>
                  <VoiceSelector
                    selectedVoice={selectedVoice}
                    onSelectVoice={setSelectedVoice}
                    selectedAgeCategory={selectedAgeCategory}
                    onSelectAgeCategory={setSelectedAgeCategory}
                    selectedModel={selectedModel}
                    onSelectModel={setSelectedModel}
                    stylePrompt={stylePrompt}
                    onStyleChange={setStylePrompt}
                    pitch={pitch}
                    onPitchChange={setPitch}
                    lang={lang}
                    gender={gender}
                    onGenderChange={setGender}
                    speakingSpeed={speakingSpeed}
                    onSpeakingSpeedChange={setSpeakingSpeed}
                    emotionIntensity={emotionIntensity}
                    onEmotionIntensityChange={setEmotionIntensity}
                    voiceTone={voiceTone}
                    onVoiceToneChange={setVoiceTone}
                    reverbEffect={reverbEffect}
                    onReverbEffectChange={setReverbEffect}
                    echoEffect={echoEffect}
                    onEchoEffectChange={setEchoEffect}
                  />

                  <div className="border-t border-slate-800/80 pt-4">
                    <ScriptEditor
                      text={text}
                      onChangeText={setText}
                      onOpenAiAssistant={() => setShowAiModal(true)}
                      onSelectTemplate={handleSelectTemplate}
                      lang={lang}
                      onQuickInsert={(tag) => setText((prev) => prev + ' ' + tag)}
                      selectedModel={selectedModel}
                      selectedAgeCategory={selectedAgeCategory}
                    />
                  </div>
                </>
              ) : (
                <DialogueMode
                  dialogueLines={dialogueLines}
                  onChangeLines={setDialogueLines}
                  speakers={speakers}
                  onChangeSpeakers={setSpeakers}
                  lang={lang}
                />
              )}

              {/* Generate Voice Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGenerateVoice}
                  disabled={isGenerating}
                  className={`w-full py-4 px-6 rounded-2xl text-white font-bold text-base shadow-xl transition-all flex items-center justify-center gap-3 ${
                    isGenerating
                      ? 'bg-slate-800 cursor-not-allowed opacity-75'
                      : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-600/30 hover:shadow-indigo-600/50 active:scale-[0.99]'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <RotateCw className="w-5 h-5 animate-spin text-white" />
                      <span className="leading-normal">
                        {isUrdu ? 'آواز تیار کی جا رہی ہے...' : 'Generating Studio Voice...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-5 h-5 text-white" />
                      <span className="leading-normal">
                        {isUrdu
                          ? mode === 'single'
                            ? selectedAgeCategory === 'qari'
                              ? '📖 تلاوتِ کلام پاک کی آواز بنائیں'
                              : '🎙️ اسکرپٹ سے آواز بنائیں'
                            : '🎭 دونوں کرداروں کا مکالمہ بنائیں'
                          : 'Generate Studio Voice'}
                      </span>
                    </>
                  )}
                </button>

                {isGenerating && (
                  <div className="flex justify-center pt-1.5">
                    <button
                      type="button"
                      onClick={() => setIsGenerating(false)}
                      className="text-[11px] text-slate-400 hover:text-white underline transition"
                    >
                      {isUrdu ? 'بٹن کو فوری ان لاک کریں (Reset)' : 'Unlock Button / Cancel'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Audio Player & Current Result (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-5" id="audio-player-section">
            <AudioPlayer item={currentAudio} lang={lang} />

            {/* FULL RECENT VOICES LIBRARY SECTION (No 3-Item Limit!) */}
            <RecentVoicesSection
              items={history}
              currentAudioId={currentAudio?.id}
              onSelectAudio={(item) => setCurrentAudio(item)}
              onDeleteItem={deleteHistoryItem}
              onRenameItem={renameHistoryItem}
              onSyncToDrive={syncItemToDrive}
              lang={lang}
              isDriveConnected={Boolean(driveToken)}
            />
          </div>
        </div>

        {/* PWA App Download & Install Section */}
        <PWAInstallSection lang={lang} />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 mt-8 py-5 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300 font-mono">aawazai.ai.studio</span>
            <span>•</span>
            <span className="font-urdu" dir="auto">
              {isUrdu
                ? 'تخلیق کاروں کے لیے جیمینائی وائس اسٹوڈیو'
                : 'Gemini AI Voice Studio for Creators'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            PWA Standalone App • Google Drive Integration • Gemini 3.8 Flash TTS
          </p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ScriptAiModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        currentScript={text}
        onApplyScript={(newScript) => setText(newScript)}
        lang={lang}
      />

      <VideoTipsModal
        isOpen={showTipsModal}
        onClose={() => setShowTipsModal(false)}
        lang={lang}
      />

      <HistoryDrawer
        isOpen={showHistoryDrawer}
        onClose={() => setShowHistoryDrawer(false)}
        items={history}
        onSelectAudio={(item) => setCurrentAudio(item)}
        onDeleteItem={deleteHistoryItem}
        onClearAll={clearAllHistory}
        lang={lang}
      />

      <LoginPromptModal
        isOpen={showLoginPromptModal}
        onClose={() => setShowLoginPromptModal(false)}
        onLogin={handleGoogleLogin}
        isLoggingIn={isLoggingIn}
        lang={lang}
      />
    </div>
  );
}
