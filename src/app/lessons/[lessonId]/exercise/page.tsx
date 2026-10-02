'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/client';
import { doc, getDoc } from 'firebase/firestore';
import { Lesson, ExerciseQuestion } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Sparkles } from 'lucide-react';

export default function ExercisePage() {
  const params = useParams();
  const lessonId = params?.lessonId as string;
  const router = useRouter();
  const { recordActivity } = useAuth();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    async function fetchLesson() {
      if (!lessonId) return;
      try {
        const snap = await getDoc(doc(db, 'lessons', lessonId));
        if (snap.exists()) {
          setLesson({ id: snap.id, ...snap.data() } as Lesson);
        }
      } catch (err) {
        console.warn('Error loading exercises:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLesson();
  }, [lessonId]);

  if (loading) {
    return <LoadingSpinner text="Đang chuẩn bị bài tập..." />;
  }

  if (!lesson || !lesson.exercises || lesson.exercises.length === 0) {
    return (
      <EmptyState
        title="Chưa có bài tập cho bài học này"
        description="Bài học này chưa khởi tạo bài tập tự động."
        actionText="Quay lại bài học"
        actionHref={`/lessons/${lessonId}`}
      />
    );
  }

  const questions: ExerciseQuestion[] = lesson.exercises;
  const currentQ = questions[currentIndex];

  const handleSelectAnswer = (answer: any) => {
    setUserAnswers({ ...userAnswers, [currentQ.id || currentIndex]: answer });
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Calculate score
      let correct = 0;
      questions.forEach((q, idx) => {
        const userAns = userAnswers[q.id || idx];
        if (Array.isArray(q.correctAnswer) && Array.isArray(userAns)) {
          if (JSON.stringify(userAns) === JSON.stringify(q.correctAnswer)) correct++;
        } else if (userAns === q.correctAnswer) {
          correct++;
        }
      });

      setScore(correct);
      setShowResult(true);

      // Trigger celebration confetti
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}

      // Record activity into Firestore for streak and stats
      const vocabLearned = lesson.vocabulary?.length || 5;
      await recordActivity(vocabLearned, 10);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 flex flex-col gap-6">
      {/* Header progress */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100">{lesson.title} — Luyện tập</h1>
          <p className="text-xs text-slate-400">
            Câu {currentIndex + 1} / {questions.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-36 h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {!showResult ? (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex flex-col gap-6 shadow-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-semibold border border-indigo-500/20 uppercase">
              {currentQ.type.replace('_', ' ')}
            </span>
          </div>

          <h2 className="text-base font-bold text-slate-100">{currentQ.prompt}</h2>

          {/* Multiple Choice Question */}
          {currentQ.type === 'multiple_choice' && currentQ.options && (
            <div className="flex flex-col gap-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = userAnswers[currentQ.id || currentIndex] === opt;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(opt)}
                    className={`w-full p-4 rounded-xl text-left text-xs font-medium border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{opt}</span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-indigo-400 bg-indigo-500' : 'border-slate-700'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Fill in the Blank Question */}
          {currentQ.type === 'fill_blank' && (
            <div>
              <input
                type="text"
                value={userAnswers[currentQ.id || currentIndex] || ''}
                onChange={(e) => handleSelectAnswer(e.target.value)}
                placeholder="Nhập đáp án đúng vào đây..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {/* Sentence Ordering Question */}
          {currentQ.type === 'sentence_ordering' && currentQ.options && (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap gap-2 min-h-14">
                {(userAnswers[currentQ.id || currentIndex] || []).map((word: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => {
                      const currentArr = userAnswers[currentQ.id || currentIndex] || [];
                      handleSelectAnswer(currentArr.filter((_: any, idx: number) => idx !== i));
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium"
                  >
                    {word} ×
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {currentQ.options.map((word, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const currentArr = userAnswers[currentQ.id || currentIndex] || [];
                      if (!currentArr.includes(word)) {
                        handleSelectAnswer([...currentArr, word]);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700"
                  >
                    + {word}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleNext}
            disabled={!userAnswers[currentQ.id || currentIndex]}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{currentIndex === questions.length - 1 ? 'Hoàn thành bài tập' : 'Câu tiếp theo'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Results Screen */
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 backdrop-blur-md flex flex-col items-center text-center gap-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-100">Kết quả làm bài tập</h2>
            <p className="text-xs text-slate-400 mt-1">Đã cộng chuỗi chuyên cần hằng ngày vào hồ sơ của bạn!</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 w-full max-w-xs flex items-center justify-around">
            <div>
              <span className="text-xs text-slate-400">Điểm số</span>
              <p className="text-2xl font-extrabold text-indigo-400">
                {score} / {questions.length}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-400">Tỷ lệ đúng</span>
              <p className="text-2xl font-extrabold text-emerald-400">
                {Math.round((score / questions.length) * 100)}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full max-w-xs">
            <button
              onClick={() => {
                setShowResult(false);
                setCurrentIndex(0);
                setUserAnswers({});
              }}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-medium text-xs hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm lại</span>
            </button>
            <Link
              href="/dashboard"
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 text-center"
            >
              Vào Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
