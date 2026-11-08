export interface VoiceStyleItem {
  id: string;
  name: string;
  urduName: string;
  category: VoiceStyleCategoryId;
  recommendedGender?: 'male' | 'female';
  recommendedVoice?: 'Kore' | 'Puck' | 'Fenrir' | 'Zephyr' | 'Charon' | 'Aoede';
  detailedPrompt: string;
  tags?: string[];
}

export type VoiceStyleCategoryId =
  | 'emotional'
  | 'news'
  | 'islamic'
  | 'storytelling'
  | 'professional'
  | 'advertising'
  | 'special';

export interface VoiceStyleCategory {
  id: VoiceStyleCategoryId;
  name: string;
  urduName: string;
  icon: string;
  description: string;
  urduDescription: string;
}

export const VOICE_STYLE_CATEGORIES: VoiceStyleCategory[] = [
  {
    id: 'emotional',
    name: 'Emotional Expressions',
    urduName: 'جذباتی تاثرات و کیفیات',
    icon: 'Heart',
    description: '18 styles ranging from loving, sad, crying to angry and enthusiastic',
    urduDescription: 'محبت، غصہ، خوشی، رونا، افسوس اور دلی جذبات کے 18 انداز',
  },
  {
    id: 'news',
    name: 'News & Media',
    urduName: 'خبریں، نشریات اور میڈیا',
    icon: 'Radio',
    description: '13 styles for breaking news, professional anchor, crime & weather',
    urduDescription: 'بریکنگ نیوز، پروفیشنل اینکر، موسم اور ڈاکومنٹری کے 13 انداز',
  },
  {
    id: 'islamic',
    name: 'Islamic & Religious Narration',
    urduName: 'اسلامی، دینی و روحانی بیانات',
    icon: 'BookOpen',
    description: '13 styles for Bayan, Tajweed recitation, Naat, Hamd, Dua & Seerah',
    urduDescription: 'تلاوت مع تجوید، نعت، حمد، دعا، سیرت اور رقت انگیز بیانات کے 13 انداز',
  },
  {
    id: 'storytelling',
    name: 'Storytelling & Drama',
    urduName: 'داستان گوئی، سسپنس و ڈرامہ',
    icon: 'Sparkles',
    description: '13 styles for cinematic drama, fairy tales, horror & suspense',
    urduDescription: 'سنسنی خیز، ڈراؤنی، سنیماٹک اور پریوں کی کہانیوں کے 13 انداز',
  },
  {
    id: 'professional',
    name: 'Professional & Conversational',
    urduName: 'پیشہ ورانہ و گفتگو کا انداز',
    icon: 'Briefcase',
    description: '14 styles for podcasting, teaching, audiobooks & customer service',
    urduDescription: 'پوڈکاسٹ، تدریس، انٹرویو، باوقار گفتگو اور آڈیو بکس کے 14 انداز',
  },
  {
    id: 'advertising',
    name: 'Advertising & Social Media',
    urduName: 'اشتہارات، ریلز اور سوشل میڈیا',
    icon: 'TrendingUp',
    description: '11 styles for viral TikTok, Facebook Reels, sales pitch & hype',
    urduDescription: 'وائرل شارٹس، فیس بک ریلز، ٹک ٹاک، اور اشتہاری پروموشن کے 11 انداز',
  },
  {
    id: 'special',
    name: 'Special Voice Effects & Delivery',
    urduName: 'خصوصی صوتی اثرات و کردار',
    icon: 'Wand2',
    description: '14 styles including whispering, deep bass, robotic & elderly characters',
    urduDescription: 'سرگوشی، گہری باس، روبوٹک، بزرگ، اور ریڈیو ہوسٹ کے 14 صوتی انداز',
  },
];

export const ALL_VOICE_STYLES: VoiceStyleItem[] = [
  // A. Emotional Expressions (18 styles)
  {
    id: 'romantic_loving',
    name: 'Romantic / Loving',
    urduName: 'محبت بھرا اور رومانی (Loving)',
    category: 'emotional',
    recommendedGender: 'female',
    recommendedVoice: 'Aoede',
    detailedPrompt:
      'Warm, tender, deeply affectionate and loving delivery. Soft, intimate voice tone with gentle emotional warmth, subtle breathiness, caring inflection, and sincere pauses.',
  },
  {
    id: 'hateful',
    name: 'Hateful',
    urduName: 'نفرت انگیز و حقارت آمیز (Hateful)',
    category: 'emotional',
    recommendedGender: 'male',
    recommendedVoice: 'Fenrir',
    detailedPrompt:
      'Cold, bitter, resentful delivery filled with contempt and intense disdain. Sharp enunciation, harsh undertone, tense pacing, and suppressed venom in vocal cadence.',
  },
  {
    id: 'angry',
    name: 'Angry',
    urduName: 'غضب ناک و شدید غصہ (Angry)',
    category: 'emotional',
    recommendedGender: 'male',
    recommendedVoice: 'Fenrir',
    detailedPrompt:
      'Furious, heated, aggressive vocal delivery. Sharp emphatic syllable hits, raised volume, rapid assertive rhythm, sharp inhales, and raw emotional intensity.',
  },
  {
    id: 'happy',
    name: 'Happy',
    urduName: 'خوشگوار و مسرور (Happy)',
    category: 'emotional',
    recommendedGender: 'female',
    recommendedVoice: 'Kore',
    detailedPrompt:
      'Bright, cheerful, smiling vocal tone. Uplifting lilt, lively melody, joyful resonance, friendly cadence, and sunny, positive energy.',
  },
  {
    id: 'excited',
    name: 'Excited',
    urduName: 'پرجوش و بے قرار (Excited)',
    category: 'emotional',
    recommendedGender: 'male',
    recommendedVoice: 'Puck',
    detailedPrompt:
      'High-energy, thrilled, breathless excitement. Quick-paced delivery, animated pitch shifts, enthusiastic vocal bursts, and vibrant cheerful dynamism.',
  },
  {
    id: 'sad',
    name: 'Sad',
    urduName: 'اداس و غمگین (Sad)',
    category: 'emotional',
    recommendedGender: 'female',
    recommendedVoice: 'Aoede',
    detailedPrompt:
      'Somber, melancholic, low-energy vocal delivery. Downcast pitch, slow sorrowful cadence, heavy emotional pauses, quiet vulnerability, and heavy sighing breaths.',
  },
  {
    id: 'crying',
    name: 'Crying',
    urduName: 'روتے ہوئے و سسکیاں (Crying)',
    category: 'emotional',
    recommendedGender: 'female',
    recommendedVoice: 'Aoede',
    detailedPrompt:
      'Heart-wrenching, weeping vocal delivery with a trembling voice, tearful choking stops, quivering vocal cords, broken cadence, and helpless emotional sobbing.',
  },
  {
    id: 'painful_emotional',
    name: 'Painful / Emotional',
    urduName: 'دردناک و رقت انگیز (Painful / Emotional)',
    category: 'emotional',
    recommendedGender: 'male',
    recommendedVoice: 'Charon',
    detailedPrompt:
      'Deeply pained, tormented and emotionally burdened delivery. Heavy aching resonance, strained vocal undertones, weary pacing, and raw vulnerability.',
  },
  {
    id: 'fearful',
    name: 'Fearful',
    urduName: 'خوفزدہ و سراسیمہ (Fearful)',
    category: 'emotional',
    recommendedGender: 'male',
    recommendedVoice: 'Puck',
    detailedPrompt:
      'Trembling, anxious, panicked voice. Rapid irregular shallow breathing, nervous hesitation, elevated tense pitch, and cautious fearful whispers.',
  },
  {
    id: 'surprised',
    name: 'Surprised',
    urduName: 'حیرت زدہ و ششدر (Surprised)',
    category: 'emotional',
    recommendedGender: 'female',
    recommendedVoice: 'Zephyr',
    detailedPrompt:
      'Sudden startled delivery, wide-eyed vocal inflection, sudden sharp pitch rise, audible gasp, and genuinely stunned, incredulous cadence.',
  },
  {
    id: 'regretful',
    name: 'Regretful',
    urduName: 'پشیمان و شرمسار (Regretful)',
    category: 'emotional',
    recommendedGender: 'male',
    recommendedVoice: 'Charon',
    detailedPrompt:
      'Reflective, heavy-hearted remorse. Subdued vocal delivery, contemplative pauses, downcast sighing inflections, and quiet aching regret.',
  },
  {
    id: 'enthusiastic',
    name: 'Enthusiastic',
    urduName: 'ولولہ انگیز و پُرشوق (Enthusiastic)',
    category: 'emotional',
    recommendedGender: 'male',
    recommendedVoice: 'Puck',
    detailedPrompt:
      'Spirited, engaging, high-motivation voice. Dynamic cadence, passionate vocal emphasis on key words, bright forward resonance, and contagious drive.',
  },
  {
    id: 'disappointed',
    name: 'Disappointed',
    urduName: 'مایوس و دل شکستہ (Disappointed)',
    category: 'emotional',
    recommendedGender: 'female',
    recommendedVoice: 'Kore',
    detailedPrompt:
      'Disheartened, defeated, deflated vocal tone. Trailing sentence endings, quiet heavy sighs, dull hollow pitch, and subdued emotional letdown.',
  },
  {
    id: 'sarcastic',
    name: 'Sarcastic',
    urduName: 'طنز آمیز و شوخ طعنہ (Sarcastic)',
    category: 'emotional',
    recommendedGender: 'male',
    recommendedVoice: 'Puck',
    detailedPrompt:
      'Dry, sardonic, mocking vocal delivery. Exaggerated ironic pitch swings, wry pauses, subtle smirk in tone, and sharp biting comedic wit.',
  },
  {
    id: 'embarrassed',
    name: 'Embarrassed',
    urduName: 'شرمندہ و جھینپا ہوا (Embarrassed)',
    category: 'emotional',
    recommendedGender: 'female',
    recommendedVoice: 'Zephyr',
    detailedPrompt:
      'Flustered, awkward, self-conscious voice. Soft nervous chuckles, hesitant pauses, gentle pitch wavers, and bashful, apologetic delivery.',
  },
  {
    id: 'calm',
    name: 'Calm',
    urduName: 'پرسکون و متین (Calm)',
    category: 'emotional',
    recommendedGender: 'female',
    recommendedVoice: 'Kore',
    detailedPrompt:
      'Serene, soothing, perfectly centered vocal delivery. Gentle measured pacing, smooth steady breathing, relaxing warmth, and balanced gentle cadence.',
  },
  {
    id: 'determined',
    name: 'Determined',
    urduName: 'پُرعزم و اٹل (Determined)',
    category: 'emotional',
    recommendedGender: 'male',
    recommendedVoice: 'Fenrir',
    detailedPrompt:
      'Steadfast, resolute, unbreakable conviction. Firm consonant enunciation, steady grounded low-pitch rhythm, unyielding drive, and commanding inner strength.',
  },
  {
    id: 'heartbroken',
    name: 'Heartbroken',
    urduName: 'شکستہ دل و نوحہ کناں (Heartbroken)',
    category: 'emotional',
    recommendedGender: 'female',
    recommendedVoice: 'Aoede',
    detailedPrompt:
      'Fragile, shattered, profoundly sorrowful delivery. Quivering breathless delivery, aching melancholy pauses, tear-stained whisper undertone, and profound grief.',
  },

  // B. News & Media (13 styles)
  {
    id: 'breaking_news',
    name: 'Breaking News',
    urduName: 'بریکنگ نیوز و فوری خبر (Breaking News)',
    category: 'news',
    recommendedGender: 'male',
    recommendedVoice: 'Fenrir',
    detailedPrompt:
      'High-urgency, authoritative, crisp breaking-news delivery. Rapid yet razor-sharp diction, prominent emphasis on key developments, fast-paced serious momentum, and commanding presence.',
  },
  {
    id: 'news_anchor',
    name: 'Professional News Anchor',
    urduName: 'پیشہ ورانہ نیوز اینکر (News Anchor)',
    category: 'news',
    recommendedGender: 'female',
    recommendedVoice: 'Kore',
    detailedPrompt:
      'Polished, balanced, broadcast-standard television anchor delivery. Impeccable neutrality, clear objective enunciation, confident cadence, and professional television broadcast pacing.',
  },
  {
    id: 'international_news',
    name: 'International News',
    urduName: 'عالمی و بین الاقوامی خبریں (International News)',
    category: 'news',
    recommendedGender: 'male',
    recommendedVoice: 'Charon',
    detailedPrompt:
      'Dignified, serious, global geopolitical news correspondent delivery. Sophisticated tone, measured pacing, authoritative enunciation of world events, and thoughtful gravity.',
  },
  {
    id: 'serious_news',
    name: 'Serious News',
    urduName: 'سنجیدہ و اہم خبر (Serious News)',
    category: 'news',
    recommendedGender: 'male',
    recommendedVoice: 'Fenrir',
    detailedPrompt:
      'Sober, solemn, restrained delivery for grave developments. Deep composed vocal tone, dignified cadence, respectful gravity, and firm, steady pacing.',
  },
  {
    id: 'urgent_announcement',
    name: 'Urgent Announcement',
    urduName: 'ہنگامی اعلان و فوری اطلاع (Urgent Announcement)',
    category: 'news',
    recommendedGender: 'female',
    recommendedVoice: 'Kore',
    detailedPrompt:
      'Alert, immediate, public safety alert delivery. Firm, unmistakable clarity, brisk tempo, heightened attention-grabbing vocal intensity, and precise articulation.',
  },
  {
    id: 'special_report',
    name: 'Special Report',
    urduName: 'خصوصی نشریاتی رپورٹ (Special Report)',
    category: 'news',
    recommendedGender: 'male',
    recommendedVoice: 'Fenrir',
    detailedPrompt:
      'Investigative television special report delivery. Dramatic pacing, deep resonant vocal emphasis, structured pauses before pivotal revelations, and journalistic rigor.',
  },
  {
    id: 'investigative_reporting',
    name: 'Investigative Reporting',
    urduName: 'تحقیقاتی صحافت (Investigative Reporting)',
    category: 'news',
    recommendedGender: 'male',
    recommendedVoice: 'Charon',
    detailedPrompt:
      'Intriguing, analytical, inquisitive documentary journalist voice. Measured suspenseful cadence, crisp factual articulation, and focused intellectual weight.',
  },
  {
    id: 'weather_report',
    name: 'Weather Report',
    urduName: 'موسم کی رپورٹ و پیش گوئی (Weather Report)',
    category: 'news',
    recommendedGender: 'female',
    recommendedVoice: 'Zephyr',
    detailedPrompt:
      'Brisk, friendly, articulate meteorologist delivery. Pleasant upbeat inflection, clear projection, smooth transitions between forecasts, and welcoming energy.',
  },
  {
    id: 'sports_commentary',
    name: 'Sports Commentary',
    urduName: 'کھیلوں پر رواں تبصرہ (Sports Commentary)',
    category: 'news',
    recommendedGender: 'male',
    recommendedVoice: 'Puck',
    detailedPrompt:
      'Fast-paced, electric, exhilarating play-by-play stadium commentator delivery. Dynamic vocal peaks, thunderous excitement during action, and rapid-fire rhythm.',
  },
  {
    id: 'political_analysis',
    name: 'Political Analysis',
    urduName: 'سیاسی تجزیہ و مکالمہ (Political Analysis)',
    category: 'news',
    recommendedGender: 'male',
    recommendedVoice: 'Charon',
    detailedPrompt:
      'Astute, articulate, experienced political analyst voice. Composed deliberation, nuanced inflection, intelligent emphasis on strategic points, and distinguished authority.',
  },
  {
    id: 'crime_reporting',
    name: 'Crime Reporting',
    urduName: 'جرائم کی رپورٹنگ (Crime Reporting)',
    category: 'news',
    recommendedGender: 'male',
    recommendedVoice: 'Fenrir',
    detailedPrompt:
      'Dark, gritty, suspenseful crime and forensic journalist delivery. Low raspy tone, tense deliberate pacing, and serious investigative realism.',
  },
  {
    id: 'news_headlines',
    name: 'News Headlines',
    urduName: 'اہم ترین خبروں کی سرخیاں (News Headlines)',
    category: 'news',
    recommendedGender: 'female',
    recommendedVoice: 'Kore',
    detailedPrompt:
      'Crisp, snappy, high-impact headline bulletin delivery. Brief structured pauses between bulletins, punchy key-word emphasis, and rapid broadcast clarity.',
  },
  {
    id: 'documentary_narration',
    name: 'Documentary Narration',
    urduName: 'دستاویزی و سنیماٹک راوی (Documentary Narration)',
    category: 'news',
    recommendedGender: 'male',
    recommendedVoice: 'Charon',
    detailedPrompt:
      'Majestic, cinematic, National Geographic style documentary voice. Slow, breathtaking cadence, deep warm resonance, rich acoustic texture, and contemplative wonder.',
  },

  // C. Islamic & Religious Narration (13 styles)
  {
    id: 'islamic_speech',
    name: 'Islamic Speech',
    urduName: 'اسلامی خطاب و بیان (Islamic Speech)',
    category: 'islamic',
    recommendedGender: 'male',
    recommendedVoice: 'Fenrir',
    detailedPrompt:
      'Dignified, articulate, deeply sincere Islamic religious speech. Respectful scholarly cadence, proper pronunciation of Arabic religious terms, heartwarming warmth, and moral conviction.',
  },
  {
    id: 'oratorical_speech',
    name: 'Oratorical Speech',
    urduName: 'خطیبانہ و فصیح خطاب (Oratorical Speech)',
    category: 'islamic',
    recommendedGender: 'male',
    recommendedVoice: 'Fenrir',
    detailedPrompt:
      'Grand, eloquent, classical Khateeb oratorical delivery. Powerful acoustic resonance, rhythmic rhetorical climaxes, majestic Urdu phrasing, and inspiring spiritual authority.',
  },
  {
    id: 'religious_preaching',
    name: 'Religious Preaching',
    urduName: 'دینی وعظ و نصیحت (Religious Preaching)',
    category: 'islamic',
    recommendedGender: 'male',
    recommendedVoice: 'Charon',
    detailedPrompt:
      'Gentle, compassionate, heart-to-heart religious admonition. Sincere fatherly tone, reflective spiritual pauses, emotional tenderness, and ethical clarity.',
  },
  {
    id: 'naat_recitation',
    name: 'Naat Recitation',
    urduName: 'نعت رسول مقبول ﷺ کی لحن (Naat Recitation)',
    category: 'islamic',
    recommendedGender: 'male',
    recommendedVoice: 'Fenrir',
    detailedPrompt:
      'Melodious, deeply reverent, emotional Naat recitation tone. Soft devotional lilt, heartfelt poetic cadence, spiritual sweetness, and profound love for the Prophet ﷺ.',
  },
  {
    id: 'quran_recitation',
    name: 'Quranic Recitation (Tajweed)',
    urduName: 'تلاوت کلام پاک مع مکمل تجوید (Quranic Recitation)',
    category: 'islamic',
    recommendedGender: 'male',
    recommendedVoice: 'Fenrir',
    detailedPrompt:
      'Deeply reverent, spiritual Quranic recitation strictly observing all Tajweed rules: precise vowel elongation (Madd), nasal resonance (Ghunnah), clear makharij articulation, and natural respectful pauses at Waqf symbols (رموزِ اوقاف) with deep breath intervals.',
  },
  {
    id: 'hamd_recitation',
    name: 'Hamd Recitation',
    urduName: 'حمد باری تعالیٰ کی لحن (Hamd Recitation)',
    category: 'islamic',
    recommendedGender: 'male',
    recommendedVoice: 'Charon',
    detailedPrompt:
      'Sublime, awe-inspired, melodious praise of Almighty Allah. Tender reverence, humble cadence, uplifting spiritual acoustics, and deep theological beauty.',
  },
  {
    id: 'dua_supplication',
    name: 'Dua / Supplication',
    urduName: 'رقت انگیز دعا و مناجات (Dua / Supplication)',
    category: 'islamic',
    recommendedGender: 'male',
    recommendedVoice: 'Charon',
    detailedPrompt:
      'Humble, tearful, deeply moving supplication (Dua). Soft trembling voice, heartfelt pleading, sincere spiritual humility, and quiet emotional breathiness.',
  },
  {
    id: 'humble_devotional',
    name: 'Humble & Devotional',
    urduName: 'عاجزانہ و پرخلوص روحانی (Humble & Devotional)',
    category: 'islamic',
    recommendedGender: 'female',
    recommendedVoice: 'Aoede',
    detailedPrompt:
      'Meek, tender, contemplative spiritual reflection. Whispered reverence, serene devotion, gentle acoustic pace, and heartfelt inner stillness.',
  },
  {
    id: 'heart_touching_bayan',
    name: 'Heart-Touching Bayan',
    urduName: 'رقت انگیز دلسوز بیان (Heart-Touching Bayan)',
    category: 'islamic',
    recommendedGender: 'male',
    recommendedVoice: 'Charon',
    detailedPrompt:
      'Emotionally captivating, tear-inducing Islamic bayan. Empathetic raspy warmth, slow poignant pauses, deep spiritual sincerity, and touching narrative vulnerability.',
  },
  {
    id: 'passionate_islamic_speech',
    name: 'Passionate Islamic Speech',
    urduName: 'پُرجوش اسلامی خطاب (Passionate Speech)',
    category: 'islamic',
    recommendedGender: 'male',
    recommendedVoice: 'Fenrir',
    detailedPrompt:
      'Fiery, passionate, electrifying Islamic address. High conviction, thunderous rhetorical cadences, unwavering conviction, and mobilizing vocal energy.',
  },
  {
    id: 'islamic_educational',
    name: 'Islamic Educational Speech',
    urduName: 'اسلامی تعلیمی و فقہی درس (Educational Speech)',
    category: 'islamic',
    recommendedGender: 'male',
    recommendedVoice: 'Charon',
    detailedPrompt:
      'Clear, articulate, pedagogical Islamic lecture delivery. Methodical pacing, respectful clarity, accessible scholarly tone, and precise terminology.',
  },
  {
    id: 'historical_islamic',
    name: 'Historical Islamic Narration',
    urduName: 'تاریخ اسلام کے درخشاں ابواب (Historical Narration)',
    category: 'islamic',
    recommendedGender: 'male',
    recommendedVoice: 'Fenrir',
    detailedPrompt:
      'Epic, majestic, historical narration of Islamic battles and golden age events. Cinematic cadence, solemn historical gravity, and vivid descriptive projection.',
  },
  {
    id: 'seerah_narration',
    name: 'Seerah Narration',
    urduName: 'سیرت النبی ﷺ کا مبارک تذکرہ (Seerah Narration)',
    category: 'islamic',
    recommendedGender: 'male',
    recommendedVoice: 'Charon',
    detailedPrompt:
      'Deeply loving, respectful, touching narration of the blessed Seerah of Prophet Muhammad ﷺ. Soft affectionate lilt, sublime adoration, and reverent storytelling cadence.',
  },

  // D. Storytelling & Drama (13 styles)
  {
    id: 'storytelling',
    name: 'Storytelling',
    urduName: 'داستان گوئی و روایتی قصہ (Storytelling)',
    category: 'storytelling',
    recommendedGender: 'female',
    recommendedVoice: 'Kore',
    detailedPrompt:
      'Captivating, expressive narrative storytelling. Dynamic character shifts, warm immersive pacing, engaging emotional arcs, and natural pauses for dramatic impact.',
  },
  {
    id: 'suspenseful',
    name: 'Suspenseful',
    urduName: 'پُرسسپنس و سنسنی خیز (Suspenseful)',
    category: 'storytelling',
    recommendedGender: 'male',
    recommendedVoice: 'Fenrir',
    detailedPrompt:
      'Tense, edge-of-the-seat suspense delivery. Controlled hushed volume, slow deliberate pacing, sudden dramatic pauses, and intense atmospheric anticipation.',
  },
  {
    id: 'mysterious',
    name: 'Mysterious',
    urduName: 'پراسرار و طلسماتی (Mysterious)',
    category: 'storytelling',
    recommendedGender: 'female',
    recommendedVoice: 'Aoede',
    detailedPrompt:
      'Enigmatic, haunting, mystical voice delivery. Ethereal breathiness, intriguing smoky inflection, slow shadowy rhythm, and mesmerizing secrecy.',
  },
  {
    id: 'horror',
    name: 'Horror',
    urduName: 'خوفناک و ڈراؤنی داستان (Horror)',
    category: 'storytelling',
    recommendedGender: 'male',
    recommendedVoice: 'Charon',
    detailedPrompt:
      'Chilling, eerie, bone-deep horror narration. Raspy sinister undertone, macabre slow cadence, sudden sharp spine-tingling whispers, and terrifying dread.',
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    urduName: 'سنیماٹک و ہالی ووڈ ٹریلر (Cinematic)',
    category: 'storytelling',
    recommendedGender: 'male',
    recommendedVoice: 'Fenrir',
    detailedPrompt:
      'Epic movie trailer voice. Low bass rumble, monumental gravitas, commanding theatrical pauses, booming authority, and blockbuster impact.',
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    urduName: 'ڈرامائی و جذباتی کشمکش (Dramatic)',
    category: 'storytelling',
    recommendedGender: 'male',
    recommendedVoice: 'Charon',
    detailedPrompt:
      'Intense, emotionally heightened theatrical delivery. Fluctuating vocal dynamics, high emotional stakes, emphatic pauses, and rich narrative resonance.',
  },
  {
    id: 'comedic',
    name: 'Comedic',
    urduName: 'مزاحیہ و پرمزاح (Comedic)',
    category: 'storytelling',
    recommendedGender: 'male',
    recommendedVoice: 'Puck',
    detailedPrompt:
      'Witty, playful, humorous storytelling delivery. Clever comedic timing, exaggerated playful inflections, chuckles, and lively witty banter.',
  },
  {
    id: 'childlike',
    name: 'Childlike',
    urduName: 'معصوم بچوں جیسی آواز (Childlike)',
    category: 'storytelling',
    recommendedGender: 'male',
    recommendedVoice: 'Puck',
    detailedPrompt:
      'Pure, sweet, high-pitched young child voice (7-8 years old). Wide-eyed wonder, innocent curiosity, cheerful lisping cadence, and playful giggles.',
  },
  {
    id: 'friendly',
    name: 'Friendly',
    urduName: 'دوستانہ و مخلص (Friendly)',
    category: 'storytelling',
    recommendedGender: 'female',
    recommendedVoice: 'Zephyr',
    detailedPrompt:
      'Warm, welcoming, approachable storytelling. Kind conversational pacing, supportive tone, smiling resonance, and comfortable intimacy.',
  },
  {
    id: 'adventure',
    name: 'Adventure',
    urduName: 'مہم جوئی و سنسنی (Adventure)',
    category: 'storytelling',
    recommendedGender: 'male',
    recommendedVoice: 'Puck',
    detailedPrompt:
      'Thrilling, bold, heroic adventure quest narration. Brisk energetic cadence, courageous vocal projection, soaring optimism, and pulse-pounding excitement.',
  },
  {
    id: 'intriguing',
    name: 'Intriguing',
    urduName: 'تجسس انگیز و چونکا دینے والا (Intriguing)',
    category: 'storytelling',
    recommendedGender: 'female',
    recommendedVoice: 'Kore',
    detailedPrompt:
      'Thought-provoking, curious, intellect-sparking narration. Nuanced questioning inflections, subtle mystery, and alluring pacing that keeps listeners hooked.',
  },
  {
    id: 'serious_storytelling',
    name: 'Serious Storytelling',
    urduName: 'سنجیدہ و تاریخی کہانی (Serious Storytelling)',
    category: 'storytelling',
    recommendedGender: 'male',
    recommendedVoice: 'Charon',
    detailedPrompt:
      'Mature, grounded, poignant narrative realism. Deep emotional truth, sober reflections, steady unhurried cadence, and dignified literary beauty.',
  },
  {
    id: 'fairy_tale',
    name: 'Fairy Tale Narration',
    urduName: 'پریوں کی خوابناک داستان (Fairy Tale)',
    category: 'storytelling',
    recommendedGender: 'female',
    recommendedVoice: 'Aoede',
    detailedPrompt:
      'Dreamy, enchanting, magical bedtime fairy tale voice. Soft musical cadence, whimsical lilting inflection, gentle soothing pauses, and wondrous charm.',
  },

  // E. Professional & Conversational (14 styles)
  {
    id: 'natural_conversation',
    name: 'Natural Conversation',
    urduName: 'قدرتی و عام بات چیت (Natural Conversation)',
    category: 'professional',
    recommendedGender: 'female',
    recommendedVoice: 'Kore',
    detailedPrompt:
      'Authentic, relaxed, everyday conversational speech. Natural colloquial cadence, realistic micro-pauses, smooth comfortable inflection, and zero artificial stiffness.',
  },
  {
    id: 'friendly_conversation',
    name: 'Friendly Conversation',
    urduName: 'خوشگوار دوستانہ گفتگو (Friendly Conversation)',
    category: 'professional',
    recommendedGender: 'female',
    recommendedVoice: 'Zephyr',
    detailedPrompt:
      'Warm, pleasant, upbeat casual banter. Easygoing camaraderie, gentle smiling laughter in the voice, and encouraging friendly warmth.',
  },
  {
    id: 'professional',
    name: 'Professional',
    urduName: 'کارپوریٹ و باوقار پیشہ ورانہ (Professional)',
    category: 'professional',
    recommendedGender: 'male',
    recommendedVoice: 'Fenrir',
    detailedPrompt:
      'Polished, articulate, executive corporate presentation tone. Crisp confident articulation, composed measured tempo, and authoritative business professionalism.',
  },
  {
    id: 'teacher_instructor',
    name: 'Teacher / Instructor',
    urduName: 'استاد و معلمانہ انداز (Teacher / Instructor)',
    category: 'professional',
    recommendedGender: 'female',
    recommendedVoice: 'Kore',
    detailedPrompt:
      'Patient, lucid, encouraging educator delivery. Clear step-by-step pacing, engaging instructional emphasis, pedagogical warmth, and accessible clarity.',
  },
  {
    id: 'lecture',
    name: 'Lecture',
    urduName: 'یونیورسٹی لیکچر و علمی درس (Lecture)',
    category: 'professional',
    recommendedGender: 'male',
    recommendedVoice: 'Charon',
    detailedPrompt:
      'Scholarly, intellectual, academic keynote lecture voice. Methodical structured exposition, thoughtful theoretical pauses, and authoritative wisdom.',
  },
  {
    id: 'interview',
    name: 'Interview',
    urduName: 'انٹرویو و سوال و جواب (Interview)',
    category: 'professional',
    recommendedGender: 'female',
    recommendedVoice: 'Zephyr',
    detailedPrompt:
      'Attentive, insightful, inquisitive interviewer delivery. Empathetic active-listening cadence, crisp question inflections, and engaging interactive dialogue.',
  },
  {
    id: 'motivational_speech',
    name: 'Motivational Speech',
    urduName: 'ولولہ انگیز و حوصلہ افزا خطاب (Motivational)',
    category: 'professional',
    recommendedGender: 'male',
    recommendedVoice: 'Fenrir',
    detailedPrompt:
      'Inspiring, passionate, high-conviction life coach delivery. Soaring emotional climaxes, rhythmic empowerment, punchy memorable takeaways, and unstoppable drive.',
  },
  {
    id: 'advisory',
    name: 'Advisory',
    urduName: 'مشاورتی و ناصحانہ انداز (Advisory)',
    category: 'professional',
    recommendedGender: 'male',
    recommendedVoice: 'Charon',
    detailedPrompt:
      'Prudent, trustworthy, comforting counsel. Measured thoughtful advice, balanced reassuring cadence, mature empathy, and calming guidance.',
  },
  {
    id: 'confident',
    name: 'Confident',
    urduName: 'پُراعتماد و حتمی انداز (Confident)',
    category: 'professional',
    recommendedGender: 'female',
    recommendedVoice: 'Kore',
    detailedPrompt:
      'Self-assured, decisive, assertive vocal delivery. Strong unwavering projection, clear decisive phrasing, no hesitation, and magnetic certainty.',
  },
  {
    id: 'gentle_polite',
    name: 'Gentle & Polite',
    urduName: 'نرم، شائستہ اور مودبانہ (Gentle & Polite)',
    category: 'professional',
    recommendedGender: 'female',
    recommendedVoice: 'Zephyr',
    detailedPrompt:
      'Courteous, soft-spoken, exceptionally respectful delivery. Delicate warm inflection, humble deference, sweet hospitable cadence, and graceful manners.',
  },
  {
    id: 'formal_announcement',
    name: 'Formal Announcement',
    urduName: 'رسمی اعلان و پبلک نوٹس (Formal Announcement)',
    category: 'professional',
    recommendedGender: 'male',
    recommendedVoice: 'Fenrir',
    detailedPrompt:
      'Official, institutional, structured public announcement voice. Impartial clarity, standard pacing, distinct dignified pauses, and protocol authority.',
  },
  {
    id: 'customer_service',
    name: 'Customer Service',
    urduName: 'کسٹمر سپورٹ و ہیلپ لائن (Customer Service)',
    category: 'professional',
    recommendedGender: 'female',
    recommendedVoice: 'Kore',
    detailedPrompt:
      'Helpful, empathetic, friendly customer support voice. Attentive listening tone, patient problem-solving cadence, warm reassurance, and courteous smile.',
  },
  {
    id: 'podcast_host',
    name: 'Podcast Host',
    urduName: 'پوڈکاسٹ ہوسٹ و جدید اینکر (Podcast Host)',
    category: 'professional',
    recommendedGender: 'male',
    recommendedVoice: 'Puck',
    detailedPrompt:
      'Charismatic, conversational, studio podcast host voice. Rich dynamic mic presence, natural vocal intimacy, engaging humor, and smooth listener rapport.',
  },
  {
    id: 'audiobook_narration',
    name: 'Audiobook Narration',
    urduName: 'آڈیو بک راوی و ادبی کتاب (Audiobook Narration)',
    category: 'professional',
    recommendedGender: 'female',
    recommendedVoice: 'Aoede',
    detailedPrompt:
      'Literary, immersive, marathon audiobook narration voice. Unhurried soothing cadence, velvety acoustic warmth, pristine diction, and effortless long-form readability.',
  },

  // F. Advertising & Social Media (11 styles)
  {
    id: 'advertisement',
    name: 'Advertisement',
    urduName: 'کمرشل و اشتہاری آواز (Advertisement)',
    category: 'advertising',
    recommendedGender: 'male',
    recommendedVoice: 'Fenrir',
    detailedPrompt:
      'High-impact, punchy commercial advertising voice. Polished studio sheen, dynamic persuasive emphasis, memorable hooks, and irresistible brand appeal.',
  },
  {
    id: 'product_promotion',
    name: 'Product Promotion',
    urduName: 'پراڈکٹ پروموشن و تعارف (Product Promotion)',
    category: 'advertising',
    recommendedGender: 'female',
    recommendedVoice: 'Zephyr',
    detailedPrompt:
      'Enthusiastic, benefit-focused showcase voice. Bright clear projection, genuine excitement about features, sleek presentation, and compelling call to action.',
  },
  {
    id: 'youtube_voiceover',
    name: 'YouTube Voiceover',
    urduName: 'یوٹیوب ویڈیو راوی (YouTube Voiceover)',
    category: 'advertising',
    recommendedGender: 'male',
    recommendedVoice: 'Puck',
    detailedPrompt:
      'Engaging, fast-paced YouTube creator voiceover. High viewer retention hooks, lively vocal modulation, punchy line delivery, and friendly relatable charisma.',
  },
  {
    id: 'facebook_reels',
    name: 'Facebook Reels',
    urduName: 'فیس بک ریلز و وائرل ویڈیو (Facebook Reels)',
    category: 'advertising',
    recommendedGender: 'female',
    recommendedVoice: 'Kore',
    detailedPrompt:
      'Attention-grabbing social reel voiceover. Instant 3-second hook emphasis, energetic vocal energy, dynamic pace tuned for quick scrolling mobile feeds.',
  },
  {
    id: 'tiktok_voiceover',
    name: 'TikTok Voiceover',
    urduName: 'ٹک ٹاک وائرل ٹرینڈ (TikTok Voiceover)',
    category: 'advertising',
    recommendedGender: 'male',
    recommendedVoice: 'Puck',
    detailedPrompt:
      'Ultra-punchy, trendy, viral TikTok narration. Youthful swagger, fast-paced rhythmic delivery, crisp syllable snaps, and contagious viral charisma.',
  },
  {
    id: 'viral_video_narration',
    name: 'Viral Video Narration',
    urduName: 'وائرل ویڈیو راوی (Viral Narration)',
    category: 'advertising',
    recommendedGender: 'male',
    recommendedVoice: 'Fenrir',
    detailedPrompt:
      'Hypnotic, dramatic viral voiceover designed to maximize watch time. Punchy question hooks, breathless suspense, rising curiosity, and rewarding payoff.',
  },
  {
    id: 'sales_pitch',
    name: 'Sales Pitch',
    urduName: 'سیلز پچ و کاروباری پیشکش (Sales Pitch)',
    category: 'advertising',
    recommendedGender: 'male',
    recommendedVoice: 'Fenrir',
    detailedPrompt:
      'Persuasive, results-driven, irresistible sales closing voice. Strong confidence, trustworthy conviction, urgency-driven cadence, and clear next steps.',
  },
  {
    id: 'engaging_presentation',
    name: 'Engaging Presentation',
    urduName: 'پُراثر و دلکش پریزنٹیشن (Engaging Presentation)',
    category: 'advertising',
    recommendedGender: 'female',
    recommendedVoice: 'Kore',
    detailedPrompt:
      'Dynamic, crystal-clear presentation speaker. Excellent modulation between key ideas, captivating audience connection, and confident forward momentum.',
  },
  {
    id: 'hype_energetic',
    name: 'Hype / Energetic Promotion',
    urduName: 'ہائپ و دھماکے دار پروموشن (Hype / Energetic)',
    category: 'advertising',
    recommendedGender: 'male',
    recommendedVoice: 'Puck',
    detailedPrompt:
      'Electrifying, maximum-hype, high-octane hype man delivery. Explosive energy bursts, booming excitement, relentless enthusiasm, and stadium festival buzz.',
  },
  {
    id: 'short_video_intro',
    name: 'Short Video Introduction',
    urduName: 'شارٹ ویڈیو انٹرو و ہک (Video Hook)',
    category: 'advertising',
    recommendedGender: 'female',
    recommendedVoice: 'Zephyr',
    detailedPrompt:
      'Razor-sharp opening hook narration. Irresistible 5-second curiosity trigger, dramatic pause right before revelation, and brisk seamless momentum.',
  },
  {
    id: 'promotional_announcement',
    name: 'Promotional Announcement',
    urduName: 'ڈسکاؤنٹ و پروموشنل اعلان (Promotional Announcement)',
    category: 'advertising',
    recommendedGender: 'female',
    recommendedVoice: 'Kore',
    detailedPrompt:
      'Upbeat, limited-time special offer promotional voice. Urgent discount emphasis, cheerful celebratory tone, and direct compelling call to action.',
  },

  // G. Special Voice Effects & Delivery (14 styles)
  {
    id: 'whispering',
    name: 'Whispering',
    urduName: 'دھیمی سرگوشی (Whispering / ASMR)',
    category: 'special',
    recommendedGender: 'female',
    recommendedVoice: 'Aoede',
    detailedPrompt:
      'Intimate, quiet, ASMR-style pure whisper delivery. Soft airiness, zero vocal cord rasp, close-mic sensitivity, soothing gentle breath sounds, and relaxing tranquility.',
  },
  {
    id: 'soft_voice',
    name: 'Soft Voice',
    urduName: 'نرم و دھیمی آواز (Soft Voice)',
    category: 'special',
    recommendedGender: 'female',
    recommendedVoice: 'Zephyr',
    detailedPrompt:
      'Gentle, delicate, soothing vocal tone. Feathery cadence, warm peaceful inflection, restful bedtime pace, and caring softness.',
  },
  {
    id: 'deep_voice',
    name: 'Deep Voice',
    urduName: 'گہری و گونج دار آواز (Deep Voice)',
    category: 'special',
    recommendedGender: 'male',
    recommendedVoice: 'Fenrir',
    detailedPrompt:
      'Deep, low-frequency, bass-heavy chest voice. Rich acoustic reverberation, commanding gravelly depth, and solid grounding presence.',
  },
  {
    id: 'powerful_voice',
    name: 'Powerful Voice',
    urduName: 'طاقتور و بارعب آواز (Powerful Voice)',
    category: 'special',
    recommendedGender: 'male',
    recommendedVoice: 'Fenrir',
    detailedPrompt:
      'Thunderous, commanding, stadium-projecting vocal strength. Full diaphragmatic breath, bold resonant consonants, unyielding authority, and regal force.',
  },
  {
    id: 'loud_voice',
    name: 'Loud Voice',
    urduName: 'بلند بانگ و پرجوش پکار (Loud Voice)',
    category: 'special',
    recommendedGender: 'male',
    recommendedVoice: 'Fenrir',
    detailedPrompt:
      'Projected, booming, high-volume broadcast yell or rallying cry. Clear unclipped clarity, wide dynamic range, and intense far-reaching volume.',
  },
  {
    id: 'soft_and_calm',
    name: 'Soft & Calm',
    urduName: 'نرم، خاموش اور پرسکون (Soft & Calm)',
    category: 'special',
    recommendedGender: 'female',
    recommendedVoice: 'Kore',
    detailedPrompt:
      'Deeply relaxing meditation guide delivery. Slow unhurried rhythmic breathing, serene emotional balance, hushed warmth, and complete peacefulness.',
  },
  {
    id: 'authoritative',
    name: 'Authoritative',
    urduName: 'حاکمانہ و بااثر (Authoritative)',
    category: 'special',
    recommendedGender: 'male',
    recommendedVoice: 'Charon',
    detailedPrompt:
      'Supreme leader, seasoned judge, commanding statesman voice. Absolute unwavering gravitas, deliberate solemn pauses, and unquestionable credibility.',
  },
  {
    id: 'radio_host',
    name: 'Radio Host',
    urduName: 'کلاسک ریڈیو ہوسٹ (Radio Host)',
    category: 'special',
    recommendedGender: 'male',
    recommendedVoice: 'Fenrir',
    detailedPrompt:
      'Classic midnight FM radio jockey delivery. Rich velvety warmth, close proximity mic effect, smooth melodic cadence, and charming late-night intimacy.',
  },
  {
    id: 'telephone_voice',
    name: 'Telephone Voice',
    urduName: 'ٹیلیفون و فون کال ایفیکٹ (Telephone Voice)',
    category: 'special',
    recommendedGender: 'female',
    recommendedVoice: 'Kore',
    detailedPrompt:
      'Filter-band telephone acoustic delivery. Crisp mid-range vocal focus, pleasant automated receptionist or phone dialogue enunciation, and natural caller cadence.',
  },
  {
    id: 'robotic_voice',
    name: 'Robotic Voice',
    urduName: 'روبوٹک و سائنس فکشن (Robotic / AI Voice)',
    category: 'special',
    recommendedGender: 'male',
    recommendedVoice: 'Fenrir',
    detailedPrompt:
      'Futuristic, precise, robotic AI synthesizer delivery. Monotone mechanical inflection, deliberate digitized cadence, crisp electronic enunciation, and sci-fi aesthetic.',
  },
  {
    id: 'elderly_character',
    name: 'Elderly Character',
    urduName: 'ضعیف العمر بزرگ کردار (Elderly Character)',
    category: 'special',
    recommendedGender: 'male',
    recommendedVoice: 'Charon',
    detailedPrompt:
      'Authentic 75-year-old elder voice. Textured raspy vocal timbre, slow thoughtful pauses, affectionate trembling breath, and profound grandfatherly warmth.',
  },
  {
    id: 'youthful_character',
    name: 'Youthful Character',
    urduName: 'البیلا نوجوان کردار (Youthful Character)',
    category: 'special',
    recommendedGender: 'male',
    recommendedVoice: 'Puck',
    detailedPrompt:
      'Lively, spirited, 16-20 year old teenager or young creator voice. Bright, punchy, quick-witted cadence with cheerful expressive bursts.',
  },
  {
    id: 'whispered_storytelling',
    name: 'Whispered Storytelling',
    urduName: 'سرگوشیوں میں کہانی (Whispered Storytelling)',
    category: 'special',
    recommendedGender: 'female',
    recommendedVoice: 'Aoede',
    detailedPrompt:
      'Intimate whispered narrative for bedtime tales or dark folklore. Soft soothing breathy voice, gentle pauses, eerie comforting magic, and deep closeness.',
  },
  {
    id: 'deep_serious_voice',
    name: 'Deep Serious Voice',
    urduName: 'انتہائی گہری و سنجیدہ آواز (Deep Serious Voice)',
    category: 'special',
    recommendedGender: 'male',
    recommendedVoice: 'Charon',
    detailedPrompt:
      'Monumental deep bass resonant baritone voice. Maximum gravitas, slow solemn cadence, heavy emotional weight, and profound philosophical seriousness.',
  },
];
