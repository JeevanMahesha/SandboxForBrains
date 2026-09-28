/** Shown wherever an optional value (star, star match score) has not been provided. */
export const NOT_SPECIFIED_LABEL = 'Not specified';

/** Angular DatePipe formats used for audit dates (created / updated). */
export const DISPLAY_DATE_FORMAT = 'dd MMM yyyy';
export const DISPLAY_DATE_TIME_FORMAT = 'dd MMM yyyy, HH:mm';

export const STAR_SCORES = {
  Ashwini: 6,
  Bharani: 8,
  Krittika: 3,
  Rohini: 8,
  Mrigasira: 4,
  Ardra: 6,
  Punarpoosam: 3,
  Poosam: 6.5,
  Ayilyam: 7,
  Makam: 4,
  Pooram: 6,
  Uthiram: 3,
  Hastham: 7,
  Chithirai: 4,
  Swati: 6,
  Visakam: 3,
  Anusham: 6.5,
  Kettai: 4,
  Moolam: 3,
  Pooradam: 8,
  Uthiradam: 2,
  Thiruvonam: 7,
  Avittam: 7,
  Sadhayam: 6,
  Poorattadhi: 3,
  Uthirattadhi: 8.5,
  Revathi: 7,
} as const;

export type StarKey = keyof typeof STAR_SCORES;

export const STATE_LIST = ['Tamil Nadu', 'Kerala', 'Karnataka'] as const;

export const DISTRICT_LIST = {
  'Tamil Nadu': [
    'Ariyalur',
    'Chengalpattu',
    'Chennai',
    'Coimbatore',
    'Cuddalore',
    'Dharmapuri',
    'Dindigul',
    'Erode',
    'Kallakurichi',
    'Kanchipuram',
    'Kanyakumari',
    'Karur',
    'Krishnagiri',
    'Madurai',
    'Mayiladuthurai',
    'Nagapattinam',
    'Namakkal',
    'Perambalur',
    'Pudukkottai',
    'Ramanathapuram',
    'Ranipet',
    'Salem',
    'Sivaganga',
    'Tenkasi',
    'Thanjavur',
    'Theni',
    'Thiruvallur',
    'Thiruvarur',
    'Thiruvannamalai',
    'Thoothukudi (Tuticorin)',
    'Tiruchirappalli (Trichy)',
    'Tirunelveli',
    'Tirupathur',
    'Tiruppur',
    'Vellore',
    'Viluppuram',
    'Virudhunagar',
  ],
  Kerala: [
    'Alappuzha',
    'Ernakulam',
    'Idukki',
    'Kannur',
    'Kasaragod',
    'Kollam',
    'Kottayam',
    'Kozhikode',
    'Malappuram',
    'Palakkad',
    'Pathanamthitta',
    'Thiruvananthapuram',
    'Thrissur',
    'Wayanad',
  ],
  Karnataka: [
    'Bagalkot',
    'Ballari (Bellary)',
    'Belagavi (Belgaum)',
    'Bengaluru Rural',
    'Bengaluru Urban',
    'Bidar',
    'Chamarajanagar',
    'Chikkaballapur',
    'Chikkamagaluru (Chikmagalur)',
    'Chitradurga',
    'Dakshina Kannada',
    'Davanagere',
    'Dharwad',
    'Gadag',
    'Hassan',
    'Haveri',
    'Kalaburagi (Gulbarga)',
    'Kodagu',
    'Kolar',
    'Koppal',
    'Mandya',
    'Mysuru (Mysore)',
    'Raichur',
    'Ramanagara',
    'Shivamogga (Shimoga)',
    'Tumakuru (Tumkur)',
    'Udupi',
    'Uttara Kannada (Karwar)',
    'Vijayapura (Bijapur)',
    'Yadgir',
  ],
} as const;

export const ZODIAC_LIST = {
  aries: {
    english: 'Aries',
    tanglish: 'Mesham',
    order: 1,
    stars: ['Ashwini', 'Bharani', 'Krittika'],
  },
  taurus: {
    english: 'Taurus',
    tanglish: 'Rishabam',
    order: 2,
    stars: ['Krittika', 'Rohini', 'Mrigasira'],
  },
  gemini: {
    english: 'Gemini',
    tanglish: 'Mithunam',
    order: 3,
    stars: ['Mrigasira', 'Ardra', 'Punarpoosam'],
  },
  cancer: {
    english: 'Cancer',
    tanglish: 'Kadagam',
    order: 4,
    stars: ['Punarpoosam', 'Poosam', 'Ayilyam'],
  },
  leo: {
    english: 'Leo',
    tanglish: 'Simmam',
    order: 5,
    stars: ['Makam', 'Pooram', 'Uthiram'],
  },
  virgo: {
    english: 'Virgo',
    tanglish: 'Kanni',
    order: 6,
    stars: ['Uthiram', 'Hastham', 'Chithirai'],
  },
  libra: {
    english: 'Libra',
    tanglish: 'Thulaam',
    order: 7,
    stars: ['Chithirai', 'Swati', 'Visakam'],
  },
  scorpio: {
    english: 'Scorpio',
    tanglish: 'Viruchigam',
    order: 8,
    stars: ['Visakam', 'Anusham', 'Kettai'],
  },
  sagittarius: {
    english: 'Sagittarius',
    tanglish: 'Dhanusu',
    order: 9,
    stars: ['Moolam', 'Pooradam', 'Uthiradam'],
  },
  capricorn: {
    english: 'Capricorn',
    tanglish: 'Makaram',
    order: 10,
    stars: ['Uthiradam', 'Thiruvonam', 'Avittam'],
  },
  aquarius: {
    english: 'Aquarius',
    tanglish: 'Kumbam',
    order: 11,
    stars: ['Avittam', 'Sadhayam', 'Poorattadhi'],
  },
  pisces: {
    english: 'Pisces',
    tanglish: 'Meenam',
    order: 12,
    stars: ['Poorattadhi', 'Uthirattadhi', 'Revathi'],
  },
} as const;

export type ZodiacKey = keyof typeof ZODIAC_LIST;

export const PROFILE_STATUS = {
  NEW: 'New',
  REJECTED: 'Rejected',
  CONTACTED: 'Contacted',
  MEETING_SCHEDULED: 'Meeting Scheduled',
  ACCEPTED: 'Accepted',
  ON_HOLD: 'OnHold',
  PROFILE_SHARED: 'Profile Shared',
  NEED_TO_CONTACT: 'Need to Contact',
  SHARE_BY_RM: 'Share by RM',
} as const;

/**
 * Single source of truth for every per-status color used across the app: the
 * list/drawer badge, the select-dropdown dot, and the mobile card's accent
 * border. Kept as one map (rather than one per use site) so a status's color
 * can't drift out of sync between them.
 *
 * Classes are written out in full (not composed from a color name at
 * runtime) because Tailwind's build-time scanner only picks up class names
 * it can find as literal strings in the source.
 */
export const PROFILE_STATUS_STYLES = {
  NEW: { badge: 'bg-sky-100! text-sky-700!', dot: 'bg-sky-500', border: 'border-l-sky-400' },
  REJECTED: {
    badge: 'bg-rose-100! text-rose-700!',
    dot: 'bg-rose-500',
    border: 'border-l-rose-400',
  },
  CONTACTED: {
    badge: 'bg-indigo-100! text-indigo-700!',
    dot: 'bg-indigo-500',
    border: 'border-l-indigo-400',
  },
  MEETING_SCHEDULED: {
    badge: 'bg-lime-100! text-lime-700!',
    dot: 'bg-lime-500',
    border: 'border-l-lime-400',
  },
  ACCEPTED: {
    badge: 'bg-emerald-100! text-emerald-700!',
    dot: 'bg-emerald-500',
    border: 'border-l-emerald-400',
  },
  ON_HOLD: {
    badge: 'bg-amber-100! text-amber-700!',
    dot: 'bg-amber-500',
    border: 'border-l-amber-400',
  },
  PROFILE_SHARED: {
    badge: 'bg-cyan-100! text-cyan-700!',
    dot: 'bg-cyan-500',
    border: 'border-l-cyan-400',
  },
  SHARE_BY_RM: {
    badge: 'bg-orange-100! text-orange-700!',
    dot: 'bg-orange-500',
    border: 'border-l-orange-400',
  },
  NEED_TO_CONTACT: {
    badge: 'bg-slate-200! text-slate-700!',
    dot: 'bg-slate-500',
    border: 'border-l-slate-400',
  },
} as const;
