'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase/client';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Lesson } from '@/types';
import { SUPPORTED_LANGUAGES, getLanguageById } from '@/lib/config/languages';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { BookOpen, Search, Filter, FileText, ArrowRight, Sparkles, Globe } from 'lucide-react';

export default function LibraryPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState('all');

  useEffect(() => {
    async function fetchPublicLibrary() {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'lessons'),
          where('isPublic', '==', true),
          where('status', '==', 'published')
        );
        const snap = await getDocs(q);
        const list: Lesson[] = [];
        snap.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Lesson);
        });
        setLessons(list);
      } catch (err) {
        console.warn('Error fetching public library:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPublicLibrary();
  }, []);

  const filteredLessons = lessons.filter((item) => {
    const matchesLang = selectedLang === 'all' || item.languageId === selectedLang;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLang && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
          <Globe className="w-3.5 h-3.5" />
          <span>Thư viện Tài liệu & Bài học Công khai</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">Kho Kiến Thức Cộng Đồng</h1>
        <p className="text-xs text-slate-400 mt-1">
          Tất cả bài học công khai đều trải qua quy trình kiểm duyệt chất lượng bởi Admin trước khi xuất bản.
        </p>
      </div>

      {/* Search & Language Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tiêu đề, chủ đề bài học..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Language Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Tất cả ngôn ngữ</option>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <LoadingSpinner text="Đang tải thư viện công khai..." />
      ) : filteredLessons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => {
            const lang = getLanguageById(lesson.languageId);

            return (
              <Link
                key={lesson.id}
                href={`/lessons/${lesson.id}`}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 backdrop-blur-md transition-all flex flex-col justify-between gap-4 group shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-semibold border border-indigo-500/20">
                      {lesson.level}
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
                      <span>Có trích dẫn nguồn</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs font-semibold text-indigo-400">
                  <span>Vào khám phá</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Chưa có bài học công khai phù hợp"
          description="Hiện chưa có bài học công khai nào khớp với bộ lọc của bạn hoặc các bài học đang trong quá trình duyệt của Admin."
          actionText="Tải tài liệu đóng góp bài học"
          actionHref="/upload"
        />
      )}
    </div>
  );
}
