export interface LanguageConfig {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  code: string; // HTML lang attribute e.g., 'en', 'zh-CN', 'zh-TW', 'ja', 'ko', 'th'
  fontFamilyClass: string;
  description: string;
  levels: string[];
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    id: 'en',
    name: 'Tiếng Anh',
    nativeName: 'English',
    flag: '🇬🇧',
    code: 'en',
    fontFamilyClass: 'font-sans',
    description: 'Ngôn ngữ toàn cầu với hàng triệu tài liệu & cơ hội phát triển.',
    levels: ['Beginner A1', 'Elementary A2', 'Intermediate B1', 'Upper Intermediate B2', 'Advanced C1'],
  },
  {
    id: 'zh-CN',
    name: 'Tiếng Trung (Giản thể)',
    nativeName: '简体中文',
    flag: '🇨🇳',
    code: 'zh-CN',
    fontFamilyClass: 'font-noto-sc',
    description: 'Chữ Hán giản thể sử dụng tại Trung Quốc đại lục & Singapore.',
    levels: ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'],
  },
  {
    id: 'zh-TW',
    name: 'Tiếng Trung (Phồn thể)',
    nativeName: '繁體中文',
    flag: '🇹🇼',
    code: 'zh-TW',
    fontFamilyClass: 'font-noto-tc',
    description: 'Chữ Hán phồn thể lưu giữ nét đẹp truyền thống văn hoá.',
    levels: ['TOCFL 1', 'TOCFL 2', 'TOCFL 3', 'TOCFL 4', 'TOCFL 5'],
  },
  {
    id: 'ja',
    name: 'Tiếng Nhật',
    nativeName: '日本語',
    flag: '🇯🇵',
    code: 'ja',
    fontFamilyClass: 'font-sans',
    description: 'Chữ Kanji, Hiragana & Katakana cùng nền văn hoá Nhật Bản phong phú.',
    levels: ['JLPT N5', 'JLPT N4', 'JLPT N3', 'JLPT N2', 'JLPT N1'],
  },
  {
    id: 'ko',
    name: 'Tiếng Hàn',
    nativeName: '한국어',
    flag: '🇰🇷',
    code: 'ko',
    fontFamilyClass: 'font-noto-kr',
    description: 'Bảng chữ cái Hangul khoa học và dễ học.',
    levels: ['TOPIK I (Cấp 1)', 'TOPIK I (Cấp 2)', 'TOPIK II (Cấp 3)', 'TOPIK II (Cấp 4)', 'TOPIK II (Cấp 5-6)'],
  },
  {
    id: 'th',
    name: 'Tiếng Thái',
    nativeName: 'ไทย',
    flag: '🇹🇭',
    code: 'th',
    fontFamilyClass: 'font-noto-thai',
    description: 'Ngôn ngữ có ngữ điệu độc đáo và chữ viết Thái nghệ thuật.',
    levels: ['Cơ bản 1', 'Cơ bản 2', 'Trung cấp 1', 'Trung cấp 2', 'Nâng cao'],
  },
];

export function getLanguageById(id: string): LanguageConfig {
  return SUPPORTED_LANGUAGES.find((lang) => lang.id === id) || SUPPORTED_LANGUAGES[0];
}
