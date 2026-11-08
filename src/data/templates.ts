import { VoiceName } from '../types';

export interface ScriptTemplate {
  id: string;
  category: string;
  urduCategory: string;
  ageGroup: 'child' | 'youth' | 'adult' | 'elder' | 'qari';
  title: string;
  urduTitle: string;
  text: string;
  recommendedVoice: VoiceName;
  stylePrompt: string;
}

export const SCRIPT_TEMPLATES: ScriptTemplate[] = [
  // --- Quran Recitation Templates (تلاوت کلام پاک مع تجوید و رموز اوقاف) ---
  {
    id: 'quran_fatihah',
    category: 'Quran Recitation',
    urduCategory: 'تلاوت کلام پاک',
    ageGroup: 'qari',
    title: 'Surah Al-Fatihah (سورۃ الفاتحہ مع تجوید)',
    urduTitle: 'سورۃ الفاتحہ مع تجوید و رموز اوقاف',
    text: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ <breath>
الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ <breath>
الرَّحْمَٰنِ الرَّحِيمِ ۝ <breath>
مَالِكِ يَوْمِ الدِّينِ ۝ <breath>
إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ <breath>
اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ <breath>
صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ ۙ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ۝`,
    recommendedVoice: 'Fenrir',
    stylePrompt: 'Deeply reverent, melodious Quranic recitation by a master Qari with slow dignified Tartil, clear Tajweed, proper prolongation of Madd, nasalization (Ghunnah), and respectful full stops at each Ayah ۝ with peaceful breathing',
  },
  {
    id: 'quran_kursi',
    category: 'Quran Recitation',
    urduCategory: 'تلاوت کلام پاک',
    ageGroup: 'qari',
    title: 'Ayat al-Kursi (آیت الکرسی مع وقوف)',
    urduTitle: 'آیت الکرسی مع رموزِ اوقاف',
    text: `اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ <breath>
لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ <breath>
لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ <breath>
مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ <breath>
يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ <breath>
وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ ۝`,
    recommendedVoice: 'Fenrir',
    stylePrompt: 'Majestic, spiritual Quranic recitation by an experienced Qari with solemn Tajweed, respecting the stops at Waqf marks (ۚ , ۗ) with natural breath intervals',
  },
  {
    id: 'quran_ikhlas',
    category: 'Quran Recitation',
    urduCategory: 'تلاوت کلام پاک',
    ageGroup: 'qari',
    title: 'Surah Al-Ikhlas (سورۃ الاخلاص)',
    urduTitle: 'سورۃ الاخلاص مع تجوید',
    text: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ <breath>
قُلْ هُوَ اللَّهُ أَحَدٌ ۝ <breath>
اللَّهُ الصَّمَدُ ۝ <breath>
لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ <breath>
وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ ۝`,
    recommendedVoice: 'Charon',
    stylePrompt: 'Serene, clear, measured Tartil recitation with precise Qalqalah on Dal, proper Tajweed pauses, and reverent tone',
  },

  // --- Child Age Category (بچہ / معصوم بچے کی آواز) ---
  {
    id: 'child_curiosity',
    category: 'Kids & Cartoons',
    urduCategory: 'بچوں کی کہانی',
    ageGroup: 'child',
    title: 'Innocent Child Story (ایک ننھے بچے کی کہانی)',
    urduTitle: 'ایک ننھے بچے کا خواب',
    text: `ہیلو دوستو! <laugh> آج میں آپ کو ایک بہت مزے دار بات بتانے آیا ہوں! کیا آپ نے کبھی رات کو آسمان پر چمکتے ہوئے تارے گنے ہیں؟ <gasp> میں نے کل رات گننے کی کوشش کی لیکن مجھے نیند آ گئی! کیا آپ میرے ساتھ تارے گنیں گے؟`,
    recommendedVoice: 'Puck',
    stylePrompt: 'Cute, innocent 7-year-old child speaking with sweet curiosity, playful excitement, high natural pitch, and gentle giggles',
  },

  // --- Elder Age Category (بزرگ / دانا بوڑھا شخص) ---
  {
    id: 'elder_advice',
    category: 'Elder Wisdom',
    urduCategory: 'بزرگوں کی نصیحت',
    ageGroup: 'elder',
    title: 'Grandfather Wisdom (دادا جان کی سبق آموز نصیحت)',
    urduTitle: 'دادا جان کی زندگی کا سبق',
    text: `میرے پیارے بچو! <breath> ستر سال کی اس طویل زندگی نے مجھے ایک ہی سبق سکھایا ہے... کہ دولت آنی جانی چیز ہے، لیکن آپ کے بولے ہوئے میٹھے بول اور آپ کا اچھا اخلاق ہمیشہ لوگوں کے دلوں میں زندہ رہتا ہے۔ <breath> کبھی کسی کا دل مت دکھانا۔`,
    recommendedVoice: 'Charon',
    stylePrompt: 'Warm, elderly grandfather voice (around 70 years old), speaking slowly with wisdom, slight raspy age resonance, affectionate pauses, and deep emotional sincerity',
  },

  // --- Youth Age Category (نوجوان / شارٹس و ریلز) ---
  {
    id: 'youth_shorts',
    category: 'Viral Shorts',
    urduCategory: 'شارٹس اور ریلز',
    ageGroup: 'youth',
    title: 'Viral 30s Hook (تیز رفتار وائرل حقائق)',
    urduTitle: 'تین چونکا دینے والے حقائق',
    text: `رک جائیے! کیا آپ جانتے ہیں کہ سمندر کی گہرائیوں میں سورج کی روشنی کبھی نہیں پہنچتی؟ <gasp> اور وہاں ایسے جاندار رہتے ہیں جو اندھیرے میں خود روشنی پیدا کرتے ہیں! کیا آپ کو ان جانداروں کا نام معلوم ہے؟ کمنٹس میں بتائیے!`,
    recommendedVoice: 'Puck',
    stylePrompt: 'Fast-paced, exciting, retention-grabbing viral TikTok voice in Urdu',
  },

  // --- Adult / Storyteller (بالغ داستان گو) ---
  {
    id: 'adult_history',
    category: 'Documentary',
    urduCategory: 'دستاویزی کہانی',
    ageGroup: 'adult',
    title: 'Wonders of History (تاریخ کے حیرت انگیز راز)',
    urduTitle: 'تاریخ کے حیرت انگیز راز',
    text: `کیا آپ جانتے ہیں کہ ہزاروں سال پہلے انسانوں نے ایسے عجائبات کیسے تعمیر کیے جن کا راز سائنسدان آج تک حل نہیں کر سکے؟ <breath> آج ہم ایک ایسے حیرت انگیز سفر پر روانہ ہو رہے ہیں جو آپ کی سوچ بدل دے گا۔ ویڈیو کو آخر تک ضرور دیکھئے گا!`,
    recommendedVoice: 'Fenrir',
    stylePrompt: 'Deep, mysterious, dramatic Urdu history narrator with clear enunciation',
  },
];
