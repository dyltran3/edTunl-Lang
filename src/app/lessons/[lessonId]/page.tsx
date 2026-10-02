'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase/client';
import { doc, getDoc } from 'firebase/firestore';
import { Lesson, VocabularyItem } from '@/types';
import { getLanguageById } from '@/lib/config/languages';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { Volume2, BookOpen, CheckCircle, ArrowRight, FileText, Sparkles, Layers } from 'lucide-react';

export default function LessonDetailPage() {
  const params = useParams();
  const lessonId = params?.lessonId as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLesson() {
      if (!lessonId) return;
      try {
        const snap = await getDoc(doc(db, 'lessons', lessonId));
        if (snap.exists()) {
          setLesson({ id: snap.id, ...snap.data() } as Lesson);
        }
      } catch (err) {
        console.warn('Error fetching lesson details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLesson();
  }, [lessonId]);

  const speakText = (text: string, langCode: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Map language code to Web Speech API lang tag
    if (langCode === 'zh-CN') utterance.lang = 'zh-CN';
    else if (langCode === 'zh-TW') utterance.lang = 'zh-TW';
    else if (langCode === 'ja') utterance.lang = 'ja-JP';
    else if (langCode === 'ko') utterance.lang = 'ko-KR';
    else if (langCode === 'th') utterance.lang = 'th-TH';
    else utterance.lang = 'en-US';

    setPlayingWord(text);
    utterance.onend = () => setPlayingWord(null);
    utterance.onerror = () => setPlayingWord(null);

    window.speechSynthesis.speak(utterance);
  };

  if (loading) {
    return <LoadingSpinner text="Đang tải nội dung bài học..." />;
  }

  if (!lesson) {
    return (
      <EmptyState
        title="Không tìm thấy bài học"
        description="Bài học này có thể đã bị xoá hoặc không tồn tại."
        actionText="Quay lại khoá học"
        actionHref="/languages"
      />
    );
  }

  const langConfig = getLanguageById(lesson.languageId);

  return (
    <div className="max-w-4xl mx-auto py-4 flex flex-col gap-8" lang={langConfig.code}>
      {/* Lesson Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-slate-800 backdrop-blur-md shadow-xl flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{langConfig.flag}</span>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
            {lesson.level}
          </span>
          <span className="text-xs text-slate-400 font-medium">• {lesson.topic}</span>
        </div>

        <h1 className={`text-3xl font-extrabold text-slate-100 ${langConfig.fontFamilyClass}`}>
          {lesson.title}
        </h1>
        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">{lesson.description}</p>
      </div>

      {/* Citations section if present */}
      {lesson.citations && lesson.citations.length > 0 && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/30 text-xs flex flex-col gap-2">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold">
            <FileText className="w-4 h-4" />
            <span>Nguồn tài liệu trích dẫn (Citations):</span>
          </div>
          <ul className="flex flex-col gap-1 pl-4 list-disc text-slate-300">
            {lesson.citations.map((c, idx) => (
              <li key={idx}>
                <strong>{c.sourceTitle}:</strong> {c.snippet}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Lesson Content */}
      <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-md">
        <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <span>Nội dung Bài giảng</span>
        </h2>
        <div
          className={`text-sm text-slate-200 leading-relaxed whitespace-pre-wrap ${langConfig.fontFamilyClass}`}
        >
          {lesson.content}
        </div>
      </div>

      {/* Vocabulary List with Audio TTS */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>Từ vựng & Mẫu câu ({lesson.vocabulary?.length || 0})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lesson.vocabulary?.map((v: VocabularyItem, idx: number) => (
            <div
              key={v.id || idx}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between gap-3 shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-base font-bold text-indigo-300 ${langConfig.fontFamilyClass}`}>
                    {v.word}
                  </span>
                  <button
                    onClick={() => speakText(v.word, langConfig.code)}
                    className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white transition-colors"
                    title="Phát âm từ vựng"
                  >
                    <Volume2 className={`w-4 h-4 ${playingWord === v.word ? 'animate-bounce text-cyan-300' : ''}`} />
                  </button>
                </div>
                {v.phonetic && <p className="text-xs text-slate-400 font-mono mt-0.5">{v.phonetic}</p>}
                <p className="text-xs text-slate-200 mt-2 font-medium">{v.meaning}</p>
              </div>

              {v.exampleSentence && (
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-300">
                  <p className={`font-semibold text-slate-200 ${langConfig.fontFamilyClass}`}>
                    "{v.exampleSentence}"
                  </p>
                  {v.exampleTranslation && <p className="text-slate-400 mt-0.5">{v.exampleTranslation}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Start Exercise Action */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/50 via-slate-900 to-slate-950 border border-indigo-500/30 flex items-center justify-between gap-4 shadow-2xl">
        <div>
          <h3 className="text-base font-bold text-slate-100">Sẵn sàng củng cố kiến thức?</h3>
          <p className="text-xs text-slate-400 mt-0.5">Làm bài tập trắc nghiệm và điền từ để ghi nhận điểm chuyên cần.</p>
        </div>
        <Link
          href={`/lessons/${lesson.id}/exercise`}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold text-xs hover:brightness-110 shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all whitespace-nowrap"
        >
          <span>Làm bài tập luyện tập</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
