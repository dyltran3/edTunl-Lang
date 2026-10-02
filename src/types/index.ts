export type UserRole = 'user' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  targetLanguages: string[]; // e.g. ['en', 'zh-CN', 'ja']
  role: UserRole;
  createdAt: string; // ISO String
  streakCount: number;
  lastActiveDate: string; // YYYY-MM-DD
  totalVocabularyCount: number;
  totalStudyTimeMinutes: number;
  completedLessonsCount: number;
  settings?: {
    uiLanguage: string;
    notifications: boolean;
  };
}

export interface VocabularyItem {
  id: string;
  word: string;
  phonetic?: string; // Pinyin / Romaji / IPA / Reading
  meaning: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  audioUrl?: string;
}

export interface LessonCitation {
  sourceTitle: string;
  url?: string;
  snippet?: string;
  docPage?: number;
}

export interface ExerciseQuestion {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'sentence_ordering';
  prompt: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  languageId: string; // e.g. 'en', 'zh-CN'
  level: string; // e.g. 'Beginner', 'Intermediate', 'HSK3', 'B2'
  topic: string;
  content: string;
  vocabulary: VocabularyItem[];
  citations?: LessonCitation[];
  createdBy: string; // userId or 'AI_GENERATED' or 'ADMIN'
  isPublic: boolean;
  status: 'published' | 'pending_review' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  exercises?: ExerciseQuestion[];
}

export interface MockExamQuestion {
  id: string;
  section: 'listening' | 'reading' | 'grammar' | 'vocabulary';
  questionText: string;
  audioUrl?: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface MockExam {
  id: string;
  title: string;
  languageId: string;
  level: string; // e.g. 'IELTS 6.5', 'HSK 4', 'JLPT N3'
  durationMinutes: number;
  passingScore: number;
  questions: MockExamQuestion[];
  createdAt: string;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  timeSpentSeconds: number;
  completedAt: string;
}

export interface GroupMember {
  uid: string;
  displayName: string;
  avatarUrl?: string;
  joinedAt: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  creatorId: string;
  inviteCode: string;
  languages: string[]; // target languages learned in this group
  members: GroupMember[]; // 2 to 50 members
  createdAt: string;
}

export interface DailyRecord {
  id: string; // Format: `${userId}_${dateYYYYMMDD}`
  userId: string;
  date: string; // YYYY-MM-DD
  vocabularyLearned: number;
  studyTimeMinutes: number;
  lessonsCompleted: number;
  exercisesCompleted: number;
  streakActive: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  languageId: string;
  period: 'week' | 'month' | 'quarter';
  rank: number;
  totalVocabularies: number;
  streakCount: number;
  completedLessons: number;
  totalStudyTimeMinutes: number;
  score: number;
}
