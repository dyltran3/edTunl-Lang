import { GoogleGenAI } from '@google/genai';
import { db } from '@/lib/firebase/client';
import { doc, getDoc } from 'firebase/firestore';

export async function getGeminiApiKey(): Promise<string | null> {
  // 1. Check process.env first
  if (process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }

  // 2. Try fetching from Firestore system_config/gemini doc
  try {
    const configDoc = await getDoc(doc(db, 'system_config', 'gemini'));
    if (configDoc.exists() && configDoc.data().apiKey) {
      return configDoc.data().apiKey;
    }
  } catch (error) {
    console.warn('Unable to read Gemini API key from Firestore:', error);
  }

  return null;
}

export async function getGeminiClient(): Promise<{ ai: GoogleGenAI; apiKey: string } | null> {
  const apiKey = await getGeminiApiKey();
  if (!apiKey) return null;
  const ai = new GoogleGenAI({ apiKey });
  return { ai, apiKey };
}

export interface GeneratedLessonOutput {
  title: string;
  description: string;
  topic: string;
  level: string;
  content: string;
  vocabulary: Array<{
    word: string;
    phonetic: string;
    meaning: string;
    exampleSentence: string;
    exampleTranslation: string;
  }>;
  citations: Array<{
    sourceTitle: string;
    url?: string;
    snippet?: string;
  }>;
  exercises: Array<{
    type: 'multiple_choice' | 'fill_blank' | 'sentence_ordering';
    prompt: string;
    options?: string[];
    correctAnswer: string | string[];
    explanation: string;
  }>;
}

export async function generateLessonFromDocument(
  fileContentText: string,
  languageId: string,
  targetLevel: string
): Promise<GeneratedLessonOutput> {
  const gemini = await getGeminiClient();
  if (!gemini) {
    throw new Error('Chưa cấu hình Gemini API Key. Vui lòng vào trang Admin để nhập API Key.');
  }

  const prompt = `
Bạn là một chuyên gia biên soạn giáo trình ngôn ngữ xuất sắc.
Dưới đây là nội dung tài liệu gốc:
${fileContentText.slice(0, 10000)}

Nhiệm vụ: Tạo một bài học ngôn ngữ (${languageId}), trình độ (${targetLevel}) dựa trên tài liệu trên.
Yêu cầu bắt buộc:
1. Giữ lại trích dẫn nguồn (citations) từ tài liệu gốc.
2. Trả về đúng 1 đối tượng JSON nguyên bản có cấu trúc sau:
{
  "title": "Tên bài học",
  "description": "Tóm tắt bài học",
  "topic": "Chủ đề",
  "level": "${targetLevel}",
  "content": "Nội dung bài giảng chi tiết (có trích dẫn tài liệu gốc)",
  "vocabulary": [
    {
      "word": "từ mới",
      "phonetic": "phiên âm Pinyin/Romaji/IPA",
      "meaning": "nghĩa tiếng Việt",
      "exampleSentence": "câu ví dụ ngôn ngữ đích",
      "exampleTranslation": "dịch câu ví dụ sang tiếng Việt"
    }
  ],
  "citations": [
    {
      "sourceTitle": "Tiêu đề tài liệu / đoạn trích",
      "snippet": "Đoạn trích gốc"
    }
  ],
  "exercises": [
    {
      "type": "multiple_choice",
      "prompt": "Câu hỏi trắc nghiệm?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "Giải thích chi tiết"
    },
    {
      "type": "fill_blank",
      "prompt": "Điền từ vào chỗ trống: I _____ to school.",
      "correctAnswer": "go",
      "explanation": "Giải thích"
    },
    {
      "type": "sentence_ordering",
      "prompt": "Sắp xếp các từ thành câu hoàn chỉnh: [go, I, school, to]",
      "options": ["go", "I", "school", "to"],
      "correctAnswer": ["I", "go", "to", "school"],
      "explanation": "Cấu trúc S + V + O"
    }
  ]
}
`;

  const response = await gemini.ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  const rawText = response.text || '';
  const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

  try {
    return JSON.parse(cleanJson);
  } catch (err) {
    console.error('Failed to parse Gemini JSON output:', rawText);
    throw new Error('AI trả về định dạng chưa hợp lệ. Vui lòng thử lại.');
  }
}

export async function synthesizeLessonFromWeb(
  topic: string,
  languageId: string,
  level: string
): Promise<GeneratedLessonOutput> {
  const gemini = await getGeminiClient();
  if (!gemini) {
    throw new Error('Chưa cấu hình Gemini API Key. Vui lòng vào trang Admin để nhập API Key.');
  }

  const prompt = `
Bạn là AI tổng hợp kiến thức học ngôn ngữ chuẩn xác.
Chủ đề: "${topic}"
Ngôn ngữ: "${languageId}"
Trình độ: "${level}"

Hãy tìm kiếm và tổng hợp bài học kèm danh sách nguồn tham khảo công khai.
Trả về đúng 1 đối tượng JSON nguyên bản có định dạng:
{
  "title": "Tiêu đề bài học tổng hợp",
  "description": "Mô tả bài học",
  "topic": "${topic}",
  "level": "${level}",
  "content": "Nội dung bài giảng kèm kiến thức ngữ pháp và từ vựng",
  "vocabulary": [
    {
      "word": "từ",
      "phonetic": "phiên âm",
      "meaning": "nghĩa",
      "exampleSentence": "ví dụ",
      "exampleTranslation": "dịch ví dụ"
    }
  ],
  "citations": [
    {
      "sourceTitle": "Tên trang web / tài liệu công khai",
      "url": "https://example.com/grammar-guide",
      "snippet": "Trích dẫn tóm tắt"
    }
  ],
  "exercises": [
    {
      "type": "multiple_choice",
      "prompt": "Câu hỏi trắc nghiệm?",
      "options": ["Đáp án 1", "Đáp án 2", "Đáp án 3", "Đáp án 4"],
      "correctAnswer": "Đáp án 1",
      "explanation": "Giải thích"
    }
  ]
}
`;

  const response = await gemini.ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  const rawText = response.text || '';
  const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

  try {
    return JSON.parse(cleanJson);
  } catch (err) {
    console.error('Failed to parse Gemini JSON output:', rawText);
    throw new Error('AI trả về định dạng chưa hợp lệ. Vui lòng thử lại.');
  }
}

export async function generateAvatarOptions(theme: string): Promise<string[]> {
  const avatars: string[] = [];
  const themeSeeds = [
    'spark', 'luna', 'cosmo', 'buddy', 'panda', 'tiger', 'koala', 'fox',
    'lotus', 'sakura', 'clover', 'phoenix', 'dragon', 'atlas', 'zen', 'aura'
  ];

  for (let i = 0; i < 16; i++) {
    const bgColors = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#3B82F6', '#14B8A6'];
    const color = bgColors[i % bgColors.length];
    const initial = themeSeeds[i].charAt(0).toUpperCase();

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
      <rect width="120" height="120" rx="60" fill="${color}"/>
      <circle cx="60" cy="45" r="24" fill="#FFFFFF" fill-opacity="0.9"/>
      <path d="M25 100 C 25 75, 95 75, 95 100 Z" fill="#FFFFFF" fill-opacity="0.85"/>
      <text x="60" y="53" font-size="20" font-weight="bold" fill="${color}" text-anchor="middle" font-family="sans-serif">${initial}</text>
    </svg>`;
    avatars.push(`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`);
  }

  return avatars;
}
