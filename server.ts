import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// Helper to get Google GenAI client instance using user custom key or server environment key
function getGenAIClient(customKey?: string) {
  const activeKey = customKey?.trim() || process.env.GEMINI_API_KEY || '';
  return new GoogleGenAI({
    apiKey: activeKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health & Status check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  const customKey = (req.headers['x-gemini-key'] as string) || '';
  res.json({
    status: 'ok',
    hasApiKey: Boolean(customKey || process.env.GEMINI_API_KEY),
    usingCustomKey: Boolean(customKey),
  });
});

// Helper to extract clean human-readable error messages from Google API error objects/strings
function cleanErrorMessage(err: any): string {
  if (!err) return 'نامعلوم خرابی پیش آئی (Unknown error)';
  const rawMsg = typeof err === 'string' ? err : String(err?.message || err);
  try {
    const parsed = JSON.parse(rawMsg);
    if (parsed?.error?.message) {
      return parsed.error.message;
    }
  } catch {}
  return rawMsg;
}

// Checks if the error indicates a 429 / RESOURCE_EXHAUSTED / quota limit
function isQuotaExhaustedError(err: any): boolean {
  const msg = cleanErrorMessage(err);
  const status = String(err?.status || '');
  const code = String(err?.code || err?.error?.code || '');
  return (
    status === '429' ||
    status === 'RESOURCE_EXHAUSTED' ||
    code === '429' ||
    msg.includes('429') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('Quota exceeded') ||
    msg.includes('quota') ||
    msg.includes('limit: 10')
  );
}

// Checks if the error indicates a 503 / UNAVAILABLE / High demand on Google's models
// Note: 503 occurs ONLY AFTER Google's gateway authenticates the API key!
function isHighDemandOrUnavailable(err: any): boolean {
  const msg = cleanErrorMessage(err);
  const status = String(err?.status || '');
  const code = String(err?.code || err?.error?.code || '');
  return (
    status === '503' ||
    status === 'UNAVAILABLE' ||
    code === '503' ||
    msg.includes('503') ||
    msg.includes('UNAVAILABLE') ||
    msg.includes('high demand') ||
    msg.includes('Spikes in demand') ||
    msg.includes('temporarily overloaded') ||
    msg.includes('overloaded') ||
    msg.includes('Service Unavailable')
  );
}

// Checks if key is genuinely invalid (400 INVALID_ARGUMENT, API_KEY_INVALID)
function isInvalidKeyError(err: any): boolean {
  const msg = cleanErrorMessage(err);
  return (
    msg.includes('API_KEY_INVALID') ||
    msg.includes('API key not valid') ||
    msg.includes('not found in project') ||
    msg.includes('PERMISSION_DENIED') ||
    msg.includes('unregistered') ||
    msg.includes('key has expired')
  );
}

// Validate API Key endpoint for user's multiple Gmail accounts
app.post('/api/key/validate', async (req: Request, res: Response) => {
  try {
    const rawKey = (req.headers['x-gemini-key'] as string) || req.body?.apiKey;
    const testKey = rawKey?.trim();
    if (!testKey) {
      return res.status(400).json({ valid: false, error: 'No API key provided.' });
    }

    // Google AI Studio Gemini API keys typically start with AIzaSy and are ~39 characters
    if (testKey.length < 15) {
      return res.status(400).json({
        valid: false,
        error: 'کلید نامکمل معلوم ہوتی ہے۔ جیمینائی API کی عام طور پر AIzaSy سے شروع ہوتی ہے۔',
      });
    }

    const testAi = getGenAIClient(testKey);

    // Test with lightweight, fast gemini-2.5-flash to avoid 503 spikes on heavier models
    try {
      await testAi.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'hi',
      });
      return res.json({
        valid: true,
        message: 'Gemini API Key is valid and active!',
      });
    } catch (primaryErr: any) {
      console.warn('Primary test error in /api/key/validate:', primaryErr?.message || primaryErr);

      // If it's a 503 (high demand) or 429 (quota), try a secondary lightweight model
      if (isHighDemandOrUnavailable(primaryErr) || isQuotaExhaustedError(primaryErr)) {
        try {
          await testAi.models.generateContent({
            model: 'gemini-3.8-flash-lite',
            contents: 'hi',
          });
          return res.json({
            valid: true,
            message: 'Gemini API Key is valid and active!',
          });
        } catch (secondaryErr: any) {
          console.warn('Secondary test error in /api/key/validate:', secondaryErr?.message || secondaryErr);

          // If Google returns 503 or 429, this PROVES the API key is 100% genuine and authenticated!
          if (isHighDemandOrUnavailable(secondaryErr) || isHighDemandOrUnavailable(primaryErr)) {
            return res.json({
              valid: true,
              highDemand: true,
              message: 'کلید بالکل درست اور منظور شدہ ہے! (گوگل سرور پر عارضی لوڈ کی وجہ سے ماڈل مصروف ہے، کی کامیابی سے محفوظ ہو گئی ہے)',
            });
          }
          if (isQuotaExhaustedError(secondaryErr) || isQuotaExhaustedError(primaryErr)) {
            return res.json({
              valid: true,
              quotaExceeded: true,
              message: 'کلید درست اور منظور شدہ ہے! (اس اکاؤنٹ کا یومیہ فری کوٹہ مکمل ہے، کی کامیابی سے محفوظ ہو گئی ہے)',
            });
          }
          throw secondaryErr;
        }
      }
      throw primaryErr;
    }
  } catch (err: any) {
    console.error('Validation final error:', err);

    // 503 UNAVAILABLE is only returned by Google after authenticating the API key
    if (isHighDemandOrUnavailable(err)) {
      return res.json({
        valid: true,
        highDemand: true,
        message: 'کلید بالکل درست اور تصدیق شدہ ہے! (گوگل سرورز پر عارضی لوڈ ہے، کی محفوظ ہو گئی ہے)',
      });
    }

    if (isQuotaExhaustedError(err)) {
      return res.json({
        valid: true,
        quotaExceeded: true,
        message: 'کلید درست اور تصدیق شدہ ہے! (اس اکاؤنٹ کا یومیہ کوٹہ مکمل ہے، کی محفوظ ہو گئی ہے)',
      });
    }

    const cleanMsg = cleanErrorMessage(err);
    // If the key has the authentic Google AI Studio signature (AIzaSy...) but got a temporary connection issue
    const rawKey = ((req.headers['x-gemini-key'] as string) || req.body?.apiKey || '').trim();
    if (rawKey.startsWith('AIzaSy') && rawKey.length >= 35 && !isInvalidKeyError(err)) {
      return res.json({
        valid: true,
        unverified: true,
        message: 'کلید محفوظ کر لی گئی ہے (گوگل سرور کی تصدیق بعد میں جاری رہے گی)۔',
      });
    }

    return res.status(400).json({
      valid: false,
      error: cleanMsg || 'Invalid Gemini API Key. Please verify in Google AI Studio.',
    });
  }
});

// Concatenate multiple 24kHz 16-bit mono WAV buffers into one complete WAV file
function concatenateWavBuffers(buffers: Buffer[]): Buffer {
  if (buffers.length === 0) return Buffer.alloc(0);
  if (buffers.length === 1) return buffers[0];

  const firstHeader = buffers[0].subarray(0, 44);
  const dataChunks: Buffer[] = [];
  let totalDataLength = 0;

  for (const buf of buffers) {
    if (buf.length > 44) {
      const data = buf.subarray(44);
      dataChunks.push(data);
      totalDataLength += data.length;
    }
  }

  const combinedHeader = Buffer.from(firstHeader);
  combinedHeader.writeUInt32LE(totalDataLength + 36, 4);
  combinedHeader.writeUInt32LE(totalDataLength, 40);

  return Buffer.concat([combinedHeader, ...dataChunks]);
}

// TTS Generation Endpoint
app.post('/api/tts/generate', async (req: Request, res: Response) => {
  try {
    const userCustomKey = (req.headers['x-gemini-key'] as string) || '';
    if (!userCustomKey && !process.env.GEMINI_API_KEY) {
      return res.status(400).json({
        error: 'Gemini API Key is not configured. Please add GEMINI_API_KEY in your environment, Secrets, or via Account Manager.',
      });
    }

    const ai = getGenAIClient(userCustomKey);

    const {
      mode = 'single',
      model = 'gemini-3.8-flash-lite-tts',
      text,
      voiceName = 'Kore',
      style,
      pitch = 0,
      speakingSpeed,
      emotionIntensity,
      voiceTone,
      reverbEffect,
      echoEffect,
      dialogueParts = [],
      speakers = [],
    } = req.body;

    if (mode === 'single') {
      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return res.status(400).json({ error: 'Text content is required for voice generation.' });
      }

      const requestedModel = model === 'gemini-3.8-flash-tts' ? 'gemini-3.8-flash-tts' : 'gemini-3.8-flash-lite-tts';
      let effectiveModel = requestedModel;
      let quotaFallback = false;

      const speechPart: any = {
        text: text.trim(),
      };

      // 1. Pitch control instruction
      let pitchInstruction = '';
      const pitchNum = Number(pitch) || 0;
      if (pitchNum <= -4) {
        pitchInstruction = 'very deep, heavy bass, low-pitched vocal tone';
      } else if (pitchNum <= -2) {
        pitchInstruction = 'deeper, low-pitched vocal resonance';
      } else if (pitchNum < 0) {
        pitchInstruction = 'slightly lower pitched vocal tone';
      } else if (pitchNum >= 4) {
        pitchInstruction = 'very high-pitched, child-like, light and bright vocal tone';
      } else if (pitchNum >= 2) {
        pitchInstruction = 'high-pitched, energetic and youthful vocal tone';
      } else if (pitchNum > 0) {
        pitchInstruction = 'slightly higher pitched, light vocal tone';
      }

      // 2. Speaking Speed instruction
      let speedInstruction = '';
      if (speakingSpeed === 'very_slow') {
        speedInstruction = 'speaking pace: very slow, deliberate and unhurried (approx 0.75x speed)';
      } else if (speakingSpeed === 'slow') {
        speedInstruction = 'speaking pace: slow, calm and measured (approx 0.85x speed)';
      } else if (speakingSpeed === 'fast') {
        speedInstruction = 'speaking pace: fast, brisk and energetic (approx 1.2x speed)';
      } else if (speakingSpeed === 'very_fast') {
        speedInstruction = 'speaking pace: rapid, punchy and high-tempo (approx 1.4x speed)';
      }

      // 3. Emotion Intensity instruction
      let intensityInstruction = '';
      if (emotionIntensity === 'low') {
        intensityInstruction = 'emotion intensity: subtle, restrained and understated';
      } else if (emotionIntensity === 'high') {
        intensityInstruction = 'emotion intensity: highly expressive, passionate and pronounced';
      } else if (emotionIntensity === 'very_high') {
        intensityInstruction = 'emotion intensity: intense, dramatic and deeply powerful';
      }

      // 4. Voice Tone instruction
      let toneInstruction = '';
      if (voiceTone === 'soft') {
        toneInstruction = 'vocal timbre: soft, tender and gentle';
      } else if (voiceTone === 'deep') {
        toneInstruction = 'vocal timbre: deep, rich and chest-resonant';
      } else if (voiceTone === 'powerful') {
        toneInstruction = 'vocal timbre: bold, commanding and authoritative';
      } else if (voiceTone === 'bright') {
        toneInstruction = 'vocal timbre: crisp, bright, clear and forward';
      }

      // 5. Studio Effects (Reverb & Echo)
      let fxInstruction = '';
      const fxParts: string[] = [];
      if (reverbEffect === 'room') {
        fxParts.push('natural studio room acoustics with warm subtle reverb');
      } else if (reverbEffect === 'hall') {
        fxParts.push('grand concert hall acoustics with rich spatial reverberation');
      } else if (reverbEffect === 'cathedral') {
        fxParts.push('expansive cathedral acoustics with long spiritual resonance decay');
      }

      if (echoEffect === 'subtle') {
        fxParts.push('subtle rhythmic slapback studio echo');
      } else if (echoEffect === 'dramatic') {
        fxParts.push('dramatic cinematic stereo delay echo');
      }

      if (fxParts.length > 0) {
        fxInstruction = `acoustic environment: ${fxParts.join(' and ')}`;
      }

      const combinedStyle = [
        style?.trim(),
        pitchInstruction,
        speedInstruction,
        intensityInstruction,
        toneInstruction,
        fxInstruction,
      ]
        .filter(Boolean)
        .join('. ');

      if (combinedStyle) {
        speechPart.speechMetadata = {
          style: combinedStyle,
        };
      }

      let response: any;
      try {
        response = await ai.models.generateContent({
          model: effectiveModel,
          contents: [
            {
              role: 'user',
              parts: [speechPart],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voiceName || 'Kore' },
              },
            },
          },
        });
      } catch (err: any) {
        if (effectiveModel === 'gemini-3.8-flash-tts' && (isQuotaExhaustedError(err) || isHighDemandOrUnavailable(err))) {
          console.warn('Quota limit or 503 high demand reached for gemini-3.8-flash-tts. Gracefully falling back to gemini-3.8-flash-lite-tts...');
          effectiveModel = 'gemini-3.8-flash-lite-tts';
          quotaFallback = true;
          response = await ai.models.generateContent({
            model: 'gemini-3.8-flash-lite-tts',
            contents: [
              {
                role: 'user',
                parts: [speechPart],
              },
            ],
            config: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: voiceName || 'Kore' },
                },
              },
            },
          });
        } else {
          throw err;
        }
      }

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        return res.status(500).json({
          error: 'No audio data was returned by the voice model. Please try a different prompt or shorter text.',
        });
      }

      return res.json({
        success: true,
        audioBase64: base64Audio,
        mimeType: 'audio/wav',
        voiceName,
        model: effectiveModel,
        quotaFallback,
      });
    } else if (mode === 'dialogue') {
      // Dual-speaker mode
      if (!Array.isArray(dialogueParts) || dialogueParts.length === 0) {
        return res.status(400).json({ error: 'Dialogue parts are required for dialogue mode.' });
      }

      if (!Array.isArray(speakers) || speakers.length !== 2) {
        return res.status(400).json({ error: 'Multi-speaker voice generation requires exactly 2 speaker configurations.' });
      }

      const s1 = speakers[0];
      const s2 = speakers[1];

      const parts = dialogueParts.map((p: any) => ({
        text: `${p.speaker}: ${p.text}`,
        speechMetadata: {
          speaker: p.speaker,
          ...(p.style ? { style: p.style } : {}),
        },
      }));

      let response: any;
      let isFallback = false;

      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash-tts',
          contents: [
            {
              role: 'user',
              parts,
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              multiSpeakerVoiceConfig: {
                speakerVoiceConfigs: [
                  {
                    speaker: s1.speaker,
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: s1.voiceName || 'Puck' },
                    },
                  },
                  {
                    speaker: s2.speaker,
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: s2.voiceName || 'Kore' },
                    },
                  },
                ],
              },
            },
          },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
          throw new Error('No dialogue audio returned');
        }

        return res.json({
          success: true,
          audioBase64: base64Audio,
          mimeType: 'audio/wav',
          model: 'gemini-3.8-flash-tts',
        });
      } catch (err: any) {
        if (isQuotaExhaustedError(err) || isHighDemandOrUnavailable(err)) {
          console.warn('Dialogue multi-speaker quota or 503 reached on flash-tts. Synthesizing lines via flash-lite-tts fallback...');
          isFallback = true;
          const speakerVoiceMap: Record<string, string> = {
            [s1.speaker]: s1.voiceName || 'Puck',
            [s2.speaker]: s2.voiceName || 'Kore',
          };

          const wavBuffers: Buffer[] = [];
          for (const line of dialogueParts) {
            const lineVoice = speakerVoiceMap[line.speaker] || s1.voiceName || 'Kore';
            const lineRes = await ai.models.generateContent({
              model: 'gemini-3.8-flash-lite-tts',
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: line.text,
                      ...(line.style ? { speechMetadata: { style: line.style } } : {}),
                    },
                  ],
                },
              ],
              config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: lineVoice },
                  },
                },
              },
            });

            const audioData = lineRes.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              wavBuffers.push(Buffer.from(audioData, 'base64'));
            }
          }

          if (wavBuffers.length > 0) {
            const mergedWav = concatenateWavBuffers(wavBuffers);
            return res.json({
              success: true,
              audioBase64: mergedWav.toString('base64'),
              mimeType: 'audio/wav',
              model: 'gemini-3.8-flash-lite-tts',
              quotaFallback: true,
            });
          }
        }
        throw err;
      }
    } else {
      return res.status(400).json({ error: 'Unsupported mode' });
    }
  } catch (err: any) {
    console.error('Error in /api/tts/generate:', err);
    if (isHighDemandOrUnavailable(err)) {
      return res.status(503).json({
        error: 'گوگل وائس ماڈل پر اس وقت عارضی رش (High Demand) ہے۔ براہ کرم چند لمحے بعد دوبارہ کوشش کریں۔',
        highDemand: true,
      });
    }
    if (isQuotaExhaustedError(err)) {
      return res.status(429).json({
        error: 'اس گوگل اکاؤنٹ کا روزانہ فری کوٹہ مکمل ہو چکا ہے۔ براہ کرم "Google Accounts" بٹن سے دوسرا جی میل اکاؤنٹ منتخب کریں۔',
        quotaExceeded: true,
      });
    }
    const cleanMsg = cleanErrorMessage(err);
    return res.status(500).json({
      error: cleanMsg || 'Failed to generate speech. Please check your text and settings.',
    });
  }
});

// Script Assistant endpoint for video creators
app.post('/api/script/assist', async (req: Request, res: Response) => {
  try {
    const userCustomKey = (req.headers['x-gemini-key'] as string) || '';
    if (!userCustomKey && !process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: 'Gemini API key is not configured.' });
    }

    const ai = getGenAIClient(userCustomKey);

    const { prompt, currentText, action, targetLanguage = 'ur' } = req.body;

    let systemInstruction = `You are an elite video scriptwriter and voiceover director for YouTube, TikTok, Instagram Reels, and documentaries.
You craft natural, engaging, high-retention narration scripts.
Support both Urdu (اردو) and English fluently.
Output ONLY the final script text to be read by the voice model.
Do not add meta-commentary like "Here is your script:".
You can optionally include natural pacing cues like <breath>, <laugh>, <gasp>, |mhm|, |yeah| if suitable for expressive voiceover.`;

    let userPrompt = '';
    switch (action) {
      case 'generate_urdu':
        userPrompt = `Write a viral, captivating video script in Urdu (اردو) based on this topic/idea: "${prompt}".
Length: around 50 to 120 words (perfect for a 30-60 second short or reel). Make the opening hook irresistible.`;
        break;
      case 'generate_english':
        userPrompt = `Write an engaging video voiceover script in English based on this topic: "${prompt}".
Length: 60-120 words, punchy and clear for YouTube/Shorts narration.`;
        break;
      case 'polish_vocal_tags':
        userPrompt = `Take this script and optimize it for natural AI voiceover reading by adding expressive tags where natural, like <breath>, <laugh>, <gasp>, or ellipsis (...) for dramatic pauses:
"""
${currentText || prompt}
"""`;
        break;
      case 'translate_to_urdu':
        userPrompt = `Translate and adapt the following video voiceover script into fluent, expressive, idiomatic Urdu (اردو) suitable for a natural YouTube/video narrator:
"""
${currentText || prompt}
"""`;
        break;
      case 'generate_child_story':
        userPrompt = `Write a delightful, cute, innocent story or monologue in Urdu for a 7-8 year old child voice: "${prompt}".
Use simple words, wonder, curiosity, and include natural pauses like <laugh>, <gasp>, or <breath>. Keep it under 100 words.`;
        break;
      case 'generate_elder_advice':
        userPrompt = `Write a deep, wise, heartwarming life advice speech in Urdu spoken by a loving 70-year-old grandfather (دادا جان) to his grandchildren about: "${prompt}".
Use respectful, touching words, gentle pauses like <breath>, and sincere warmth. Keep it around 70-120 words.`;
        break;
      case 'quran_tajweed_formatter':
        userPrompt = `Provide the Arabic text with complete Tashkeel (harakat / اعراب) and accurate Waqf pause symbols (رموزِ اوقاف جیسے ۝ <breath> اور ۚ اور ۘ) for the requested Surah or verses: "${prompt || currentText}".
Ensure each verse or stop point has "<breath>" for realistic Qari recitation timing. Provide ONLY the Arabic text.`;
        break;
      default:
        userPrompt = prompt || currentText;
        break;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
      },
    });

    const generatedText = response.text || '';
    return res.json({ success: true, text: generatedText.trim() });
  } catch (err: any) {
    console.error('Error in /api/script/assist:', err);
    return res.status(500).json({
      error: err?.message || 'Failed to generate script assistance.',
    });
  }
});

// Vite Middleware for Dev or Static Server for Prod
async function startServer() {
  const distPath = path.resolve(__dirname, 'dist');
  const isDev = process.env.npm_lifecycle_event === 'dev' || process.env.NODE_ENV === 'development';

  if (!isDev && fs.existsSync(distPath)) {
    console.log(`Starting production server. Serving static files from ${distPath}`);
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else if (isDev) {
    console.log('Starting development server with Vite middleware...');
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.warn(`Warning: "dist" directory not found at ${distPath}. Run "npm run build" first.`);
    app.get('*', (_req: Request, res: Response) => {
      res.status(500).send('Production build not found. Please run "npm run build".');
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
  });
}

startServer();

