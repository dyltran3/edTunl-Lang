'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SUPPORTED_LANGUAGES } from '@/lib/config/languages';
import { Award, Clock, FileCheck, ArrowRight, ShieldCheck } from 'lucide-react';

export interface StandardMockExam {
  id: string;
  title: string;
  languageId: string;
  level: string;
  durationMinutes: number;
  totalQuestions: number;
  passingScore: number;
  description: string;
}

const DEFAULT_MOCK_EXAMS: StandardMockExam[] = [
  {
    id: 'hsk3-standard-01',
    title: 'Đề thi thử HSK 3 Chuẩn hóa 2026',
    languageId: 'zh-CN',
    level: 'HSK 3',
    durationMinutes: 35,
    totalQuestions: 20,
    passingScore: 180,
    description: 'Đánh giá kỹ năng đọc hiểu và từ vựng tiếng Trung HSK 3.',
  },
  {
    id: 'ielts-b2-listening-reading',
    title: 'IELTS Academic Reading & Vocabulary Test',
    languageId: 'en',
    level: 'B2 / IELTS 6.5',
    durationMinutes: 40,
    totalQuestions: 25,
    passingScore: 70,
    description: 'Bài thi thử kỹ năng đọc hiểu & từ vựng tiếng Anh học thuật.',
  },
  {
    id: 'jlpt-n3-kanji-grammar',
    title: 'JLPT N3 Từ vựng & Ngữ pháp',
    languageId: 'ja',
    level: 'JLPT N3',
    durationMinutes: 30,
    totalQuestions: 20,
    passingScore: 60,
    description: 'Đề thi đánh giá trình độ Kanji và cấu trúc ngữ pháp JLPT N3.',
  },
  {
    id: 'topik-1-reading',
    title: 'TOPIK I Đọc hiểu & Từ vựng tiếng Hàn',
    languageId: 'ko',
    level: 'TOPIK I (Cấp 2)',
    durationMinutes: 40,
    totalQuestions: 20,
    passingScore: 120,
    description: 'Bài thi năng lực tiếng Hàn TOPIK I sơ cấp chuẩn hoá.',
  },
];

export default function MockExamsPage() {
  const [selectedLang, setSelectedLang] = useState<string>('all');

  const filteredExams = DEFAULT_MOCK_EXAMS.filter((exam) => {
    if (selectedLang === 'all') return true;
    return exam.languageId === selectedLang;
  });

  return (
    <div className="flex flex-col gap-8 py-4">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
          <Award className="w-3.5 h-3.5" />
          <span>Hệ thống Thi Thử Chuẩn Hoá</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">Thi Thử Theo Trình Độ Ngôn Ngữ</h1>
        <p className="text-xs text-slate-400 mt-1">
          Luyện đề có đồng hồ đếm ngược, chấm điểm tức thì theo thang điểm HSK, IELTS, TOPIK & JLPT.
        </p>
      </div>

      {/* Language Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedLang('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
            selectedLang === 'all'
              ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          Tất cả ngôn ngữ
        </button>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang.id}
            onClick={() => setSelectedLang(lang.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
              selectedLang === lang.id
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md flex flex-col justify-between gap-6 shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold border border-emerald-500/20">
                  {exam.level}
                </span>
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {exam.durationMinutes} phút
                </span>
              </div>

              <h3 className="font-bold text-lg text-slate-100">{exam.title}</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{exam.description}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Tổng số: <strong className="text-slate-200">{exam.totalQuestions} câu hỏi</strong>
              </span>

              <Link
                href={`/mock-exams/${exam.id}`}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
              >
                <span>Bắt đầu thi thử</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
