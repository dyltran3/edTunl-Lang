'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Clock, Trophy, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExamQuestion {
  id: number;
  prompt: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const SAMPLE_QUESTIONS: ExamQuestion[] = [
  {
    id: 1,
    prompt: 'Chọn từ đúng điền vào chỗ trống: "Please submit your homework _____ Friday."',
    options: ['by', 'on', 'at', 'in'],
    correctAnswer: 0,
    explanation: '"by Friday" có nghĩa là trước hoặc muộn nhất vào thứ Sáu.',
  },
  {
    id: 2,
    prompt: 'Chọn câu có nghĩa tương đương với: "He hasn\'t arrived yet."',
    options: [
      'He is already here.',
      'He will never arrive.',
      'He is still not here.',
      'He arrived a minute ago.',
    ],
    correctAnswer: 2,
    explanation: '"He hasn\'t arrived yet" tương đương với "He is still not here".',
  },
  {
    id: 3,
    prompt: 'Trong ngữ pháp tiếng Trung, đại từ nhân xưng số nhiều của "你" (nǐ) là:',
    options: ['你们 (nǐmen)', '我们 (wǒmen)', '他们 (tāmen)', '人家 (rénjiā)'],
    correctAnswer: 0,
    explanation: 'Hậu tố "们" dùng để chỉ số nhiều cho đại từ nhân xưng.',
  },
  {
    id: 4,
    prompt: 'Từ nào sau đây có nghĩa là "Thư viện" trong tiếng Nhật?',
    options: ['図書館 (Toshokan)', '映画館 (Eigakan)', '美術館 (Bijutsukan)', '病院 (Byōin)'],
    correctAnswer: 0,
    explanation: '図書館 (Toshokan) nghĩa là Thư viện.',
  },
  {
    id: 5,
    prompt: 'Trong tiếng Hàn, câu chào "Xin chào" trang trọng là:',
    options: ['안녕하세요 (Annyeonghaseyo)', '감사합니다 (Kamsahamnida)', '죄송합니다 (Joesonghamnida)', '안녕히 계세요 (Annyeonghi gyeseyo)'],
    correctAnswer: 0,
    explanation: '안녕하세요 là câu chào lịch sự phổ biến nhất.',
  },
];

export default function MockExamRunnerPage() {
  const params = useParams();
  const examId = params?.id as string;
  const { recordActivity } = useAuth();

  const [timeLeftSeconds, setTimeLeftSeconds] = useState(1200); // 20 minutes
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (isCompleted) return;
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCompleted]);

  const handleSelectOption = (qId: number, optionIdx: number) => {
    setAnswers({ ...answers, [qId]: optionIdx });
  };

  const handleSubmitExam = async () => {
    let correctCount = 0;
    SAMPLE_QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setIsCompleted(true);

    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    } catch (e) {}

    await recordActivity(15, 20);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const currentQ = SAMPLE_QUESTIONS[currentQIndex];

  return (
    <div className="max-w-3xl mx-auto py-6 flex flex-col gap-6">
      {/* Header with timer */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 backdrop-blur-md flex items-center justify-between shadow-xl">
        <div>
          <h1 className="text-lg font-bold text-slate-100">Bài Thi Thử Chuẩn Hoá</h1>
          <p className="text-xs text-slate-400">Mã đề: {examId}</p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-sm font-bold">
          <Clock className="w-4 h-4 animate-pulse" />
          <span>Thời gian: {formatTime(timeLeftSeconds)}</span>
        </div>
      </div>

      {!isCompleted ? (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex flex-col gap-6 shadow-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Câu hỏi {currentQIndex + 1} / {SAMPLE_QUESTIONS.length}
            </span>
            <span>Đã trả lời {Object.keys(answers).length} / {SAMPLE_QUESTIONS.length} câu</span>
          </div>

          <h2 className="text-base font-bold text-slate-100">{currentQ.prompt}</h2>

          <div className="flex flex-col gap-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = answers[currentQ.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(currentQ.id, idx)}
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

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentQIndex(Math.max(0, currentQIndex - 1))}
              disabled={currentQIndex === 0}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium disabled:opacity-40"
            >
              Câu trước
            </button>

            {currentQIndex < SAMPLE_QUESTIONS.length - 1 ? (
              <button
                onClick={() => setCurrentQIndex(currentQIndex + 1)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30"
              >
                Câu tiếp
              </button>
            ) : (
              <button
                onClick={handleSubmitExam}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-600/30"
              >
                Nộp bài thi ngay
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results Screen */
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 backdrop-blur-md flex flex-col items-center text-center gap-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-100">Kết Quả Thi Thử</h2>
            <p className="text-xs text-slate-400 mt-1">Hệ thống đã tự động ghi nhận kết quả vào hồ sơ chuyên cần.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 w-full max-w-sm flex items-center justify-around">
            <div>
              <span className="text-xs text-slate-400">Số câu đúng</span>
              <p className="text-2xl font-extrabold text-indigo-400">
                {score} / {SAMPLE_QUESTIONS.length}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-400">Tỷ lệ đạt</span>
              <p className="text-2xl font-extrabold text-emerald-400">
                {Math.round((score / SAMPLE_QUESTIONS.length) * 100)}%
              </p>
            </div>
          </div>

          {/* Detailed explanations */}
          <div className="w-full text-left flex flex-col gap-3 mt-4">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Chi tiết giải thích đáp án:
            </h3>
            {SAMPLE_QUESTIONS.map((q, i) => {
              const userAns = answers[q.id];
              const isCorrect = userAns === q.correctAnswer;
              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border text-xs flex flex-col gap-1.5 ${
                    isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-rose-950/20 border-rose-500/30'
                  }`}
                >
                  <p className="font-semibold text-slate-200">
                    Câu {i + 1}: {q.prompt}
                  </p>
                  <p className="text-slate-400">
                    Đáp án đúng: <strong className="text-emerald-400">{q.options[q.correctAnswer]}</strong>
                  </p>
                  <p className="text-slate-400 text-[11px] italic">Giải thích: {q.explanation}</p>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 w-full max-w-xs mt-4">
            <button
              onClick={() => {
                setIsCompleted(false);
                setAnswers({});
                setCurrentQIndex(0);
                setTimeLeftSeconds(1200);
              }}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-medium text-xs hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Thi lại</span>
            </button>
            <Link
              href="/mock-exams"
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 text-center"
            >
              Xem danh sách đề
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
