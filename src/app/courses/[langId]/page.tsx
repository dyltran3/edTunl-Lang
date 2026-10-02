'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/client';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Lesson } from '@/types';
import { getLanguageById } from '@/lib/config/languages';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { BookOpen, PlusCircle, Sparkles, Filter, ArrowRight, Lock, Globe, FileText } from 'lucide-react';

export default function CourseLanguagePage() {
  const params = useParams();
  const langId = (params?.langId as string) || 'en';
  const language = getLanguageById(langId);
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'public' | 'private'>('public');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLessons() {
      setLoading(true);
      try {
        let q;
        if (activeTab === 'public') {
          q = query(
            collection(db, 'lessons'),
            where('languageId', '==', langId),
            where('isPublic', '==', true),
            where('status', '==', 'published')
          );
        } else {
          if (!user) {
            setLessons([]);
            setLoading(false);
            return;
          }
          q = query(
            collection(db, 'lessons'),
            where('languageId', '==', langId),
            where('createdBy', '==', user.uid)
          );
        }

        const snap = await getDocs(q);
        const list: Lesson[] = [];
        snap.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Lesson);
        });
        setLessons(list);
      } catch (err) {
        console.warn('Error fetching course lessons:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLessons();
  }, [langId, activeTab, user]);

  const filteredLessons = lessons.filter((lesson) => {
    if (selectedLevel === 'all') return true;
    return lesson.level === selectedLevel;
  });

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Language Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-slate-800 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <span className="text-5xl">{language.flag}</span>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[11px] font-mono font-semibold border border-indigo-500/30">
                {language.code}
              </span>
              <span className={`text-xs text-slate-400 ${language.fontFamilyClass}`}>{language.nativeName}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100">Khoá học {language.name}</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">{language.description}</p>
          </div>
        </div>

        <Link
          href={`/upload?lang=${langId}`}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-medium text-xs hover:brightness-110 shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tự tạo bài học {language.name} với AI</span>
        </Link>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('public')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'public'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Bài học công khai</span>
          </button>
          <button
            onClick={() => setActiveTab('private')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'private'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Bài học cá nhân của tôi</span>
          </button>
        </div>

        {/* Level Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400">Trình độ:</span>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Tất cả trình độ</option>
            {language.levels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner text="Đang tải danh sách bài học..." />
      ) : filteredLessons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/lessons/${lesson.id}`}
              className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 backdrop-blur-md transition-all flex flex-col justify-between gap-4 group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-semibold border border-indigo-500/20">
                    {lesson.level}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-slate-500" />
                    {lesson.vocabulary?.length || 0} từ vựng
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
                  {lesson.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                  {lesson.description}
                </p>

                {lesson.citations && lesson.citations.length > 0 && (
                  <div className="mt-3 inline-flex items-center gap-1 text-[11px] text-cyan-400 font-medium">
                    <FileText className="w-3 h-3" />
                    <span>Có trích dẫn nguồn ({lesson.citations.length})</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs font-semibold text-indigo-400">
                <span>Vào học ngay</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title={activeTab === 'public' ? 'Chưa có bài học công khai' : 'Bạn chưa có bài học riêng nào'}
          description={
            activeTab === 'public'
              ? `Hiện chưa có bài học công khai nào cho ${language.name}. Hãy là người đầu tiên tạo bài học từ tài liệu!`
              : `Bạn chưa tải lên hoặc tự tạo bài học riêng nào cho ${language.name}.`
          }
          actionText={`Tải tài liệu tạo bài học ${language.name}`}
          actionHref={`/upload?lang=${langId}`}
        />
      )}
    </div>
  );
}
