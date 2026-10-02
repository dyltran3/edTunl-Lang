'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/client';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { Lesson } from '@/types';
import { SUPPORTED_LANGUAGES, getLanguageById } from '@/lib/config/languages';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Flame, BookOpen, Clock, Award, PlusCircle, ArrowRight, Sparkles, Globe, Users, Trophy } from 'lucide-react';

export default function DashboardPage() {
  const { user, userProfile } = useAuth();
  const [recentLessons, setRecentLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        // Fetch published lessons or user private lessons
        const q = query(
          collection(db, 'lessons'),
          where('status', '==', 'published'),
          limit(6)
        );
        const snap = await getDocs(q);
        const list: Lesson[] = [];
        snap.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Lesson);
        });
        setRecentLessons(list);
      } catch (err) {
        console.warn('Error loading dashboard lessons:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user]);

  if (loading) {
    return <LoadingSpinner text="Đang tải tổng quan cá nhân..." />;
  }

  const primaryLangId = userProfile?.targetLanguages?.[0] || 'en';
  const primaryLang = getLanguageById(primaryLangId);

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/60 via-slate-900/80 to-slate-950 border border-indigo-500/20 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{primaryLang.flag}</span>
            <span className="text-xs font-semibold text-indigo-300">Đang học: {primaryLang.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">
            Xin chào, {userProfile?.displayName || 'Học viên'}! 👋
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sẵn sàng nâng cao vốn từ vựng hôm nay cùng edTunl Lang?
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/upload"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-medium text-xs hover:brightness-110 shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tạo bài học AI từ tài liệu</span>
          </Link>
          <Link
            href={`/courses/${primaryLangId}`}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors"
          >
            Vào khoá học
          </Link>
        </div>
      </div>

      {/* Real Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Chuỗi chuyên cần</span>
            <p className="text-xl font-bold text-slate-100">{userProfile?.streakCount ?? 0} ngày</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Từ vựng đã tích luỹ</span>
            <p className="text-xl font-bold text-slate-100">{userProfile?.totalVocabularyCount ?? 0} từ</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Thời gian học tích luỹ</span>
            <p className="text-xl font-bold text-slate-100">{userProfile?.totalStudyTimeMinutes ?? 0} phút</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Bài học đã hoàn thành</span>
            <p className="text-xl font-bold text-slate-100">{userProfile?.completedLessonsCount ?? 0} bài</p>
          </div>
        </div>
      </div>

      {/* Main Content Sections: Next Lesson & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Lessons */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>Bài học tiếp theo</span>
            </h2>
            <Link
              href={`/courses/${primaryLangId}`}
              className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Xem tất cả bài học</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentLessons.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentLessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/lessons/${lesson.id}`}
                  className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between gap-4 group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-semibold border border-indigo-500/20">
                        {lesson.level}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {lesson.vocabulary?.length || 0} từ vựng
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{lesson.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-indigo-400 font-medium pt-2 border-t border-slate-800/80">
                    <span>Bắt đầu học</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Chưa có bài học nào"
              description="Hiện chưa có bài học khả dụng trong cơ sở dữ liệu. Bạn có thể tự tạo bài học từ tài liệu bằng AI hoặc khám phá danh mục ngôn ngữ."
              actionText="Tải tài liệu tạo bài học AI"
              actionHref="/upload"
            />
          )}
        </div>

        {/* Right Column: Quick Navigation & Groups */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-slate-100">Lối tắt nhanh</h2>

          <div className="flex flex-col gap-3">
            <Link
              href="/languages"
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800/80 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-cyan-400" />
                <div>
                  <h4 className="font-semibold text-xs text-slate-200">Danh mục ngôn ngữ</h4>
                  <p className="text-[11px] text-slate-400">Đổi ngôn ngữ muốn học</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              href="/groups"
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800/80 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-indigo-400" />
                <div>
                  <h4 className="font-semibold text-xs text-slate-200">Nhóm học tập của tôi</h4>
                  <p className="text-[11px] text-slate-400">Thi đua cùng 2–50 bạn bè</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              href="/ranking"
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800/80 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="font-semibold text-xs text-slate-200">Bảng xếp hạng</h4>
                  <p className="text-[11px] text-slate-400">Xem thứ hạng tuần/tháng</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              href="/mock-exams"
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800/80 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="font-semibold text-xs text-slate-200">Thi thử (Mock Exam)</h4>
                  <p className="text-[11px] text-slate-400">HSK, IELTS, TOPIK, JLPT</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
