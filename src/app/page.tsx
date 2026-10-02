'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, FileUp, Trophy, Flame, Shield, ArrowRight, CheckCircle2, Globe2 } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '@/lib/config/languages';
import { useAuth } from '@/context/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-16 py-8">
      {/* Hero Section */}
      <section className="text-center flex flex-col items-center max-w-4xl mx-auto pt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Tích hợp Google Gemini AI 2.5 — Học từ tài liệu thực tế</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-100 leading-tight"
        >
          Chinh phục ngoại ngữ với <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-teal-300">
            Trí tuệ nhân tạo Gemini
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed"
        >
          Tải tài liệu học bất kỳ (PDF, Doc, Text) để AI biến thành bài học cá nhân hoá kèm trích dẫn nguồn, từ vựng, audio chuẩn và bài tập trắc nghiệm tự động.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          {user ? (
            <Link
              href="/dashboard"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold text-sm hover:brightness-110 shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Vào trang Dashboard học tập</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/auth/register"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold text-sm hover:brightness-110 shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <span>Bắt đầu học ngay — Miễn phí</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/languages"
                className="px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 font-semibold text-sm hover:bg-slate-800 transition-colors"
              >
                Khám phá khoá học
              </Link>
            </>
          )}
        </motion.div>
      </section>

      {/* Language Catalog Highlights */}
      <section className="flex flex-col items-center">
        <h2 className="text-2xl font-bold text-slate-100 mb-2 flex items-center gap-2">
          <Globe2 className="w-6 h-6 text-indigo-400" />
          <span>Hỗ trợ đa ngôn ngữ phong phú</span>
        </h2>
        <p className="text-xs text-slate-400 mb-8">Hiển thị đúng font chữ tượng hình CJK & tiếng Thái</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <Link
              key={lang.id}
              href={`/courses/${lang.id}`}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-900 transition-all flex flex-col items-center text-center group"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{lang.flag}</span>
              <span className="font-semibold text-sm text-slate-200">{lang.name}</span>
              <span className="text-xs text-slate-400 mt-1">{lang.nativeName}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md flex flex-col gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <FileUp className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-100">Upload Tài liệu & Tự tạo Bài học</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI tự phân tích văn bản, trích xuất từ vựng quan trọng, tạo câu ví dụ và bài tập trắc nghiệm kèm giữ lại trích dẫn nguồn gốc.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md flex flex-col gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-100">Chuyên cần Streak & Đội nhóm</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Duy trì ngọn lửa học tập hằng ngày. Tham gia nhóm học từ 2–50 người với biểu đồ tiến độ đa đường trực quan.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md flex flex-col gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-100">Bảng Xếp Hạng & Thi Thử</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Thi thử chuẩn định dạng HSK, IELTS, TOPIK, JLPT. So sánh kết quả cá nhân với bảng xếp hạng cộng đồng theo tuần/tháng/quý.
          </p>
        </div>
      </section>

      {/* Safety & Quality Pledge */}
      <section className="p-8 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-slate-950 border border-indigo-800/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            <span>Nguồn học được duyệt nghiêm ngặt</span>
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Mọi bài học AI công khai đều qua hàng chờ kiểm duyệt bởi Administrator trước khi hiển thị cho cộng đồng, đảm bảo nguồn học chuẩn xác.
          </p>
        </div>
        <Link
          href="/auth/register"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors shadow-md shadow-indigo-600/20 whitespace-nowrap"
        >
          Tạo tài khoản miễn phí
        </Link>
      </section>
    </div>
  );
}
