'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/client';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { UserProfile } from '@/types';
import { SUPPORTED_LANGUAGES, getLanguageById } from '@/lib/config/languages';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { Trophy, Flame, BookOpen, Award, Filter, BarChart2, Crown, Sparkles } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export default function RankingPage() {
  const { user, userProfile } = useAuth();
  const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedLang, setSelectedLang] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('week');

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'users'),
          orderBy('totalVocabularyCount', 'desc'),
          limit(20)
        );
        const snap = await getDocs(q);
        const list: UserProfile[] = [];
        snap.forEach((doc) => {
          list.push({ uid: doc.id, ...doc.data() } as UserProfile);
        });
        setLeaderboard(list);
      } catch (err) {
        console.warn('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, [selectedLang, selectedPeriod]);

  const filteredLeaderboard = leaderboard.filter((u) => {
    if (selectedLang === 'all') return true;
    return u.targetLanguages?.includes(selectedLang);
  });

  // Comparison chart data: Current viewer vs Leaderboard top 5 average
  const viewerVocab = userProfile?.totalVocabularyCount || 0;
  const viewerStreak = userProfile?.streakCount || 0;

  const chartComparisonData = [
    { name: 'Từ vựng đã tích luỹ', 'Bạn': viewerVocab, 'Top 1 Leaderboard': filteredLeaderboard[0]?.totalVocabularyCount || 10 },
    { name: 'Chuỗi Chuyên cần (ngày)', 'Bạn': viewerStreak, 'Top 1 Leaderboard': filteredLeaderboard[0]?.streakCount || 5 },
  ];

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>Bảng Xếp Hạng Độc Lập Toàn Nền Tảng</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">Bảng Xếp Hạng Học Viên</h1>
        <p className="text-xs text-slate-400 mt-1">
          Tổng hợp theo tuần/tháng/quý theo từng ngôn ngữ. So sánh tiến độ cá nhân của bạn với top leaderboard.
        </p>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
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

        {/* Period Filter */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedPeriod === 'week' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400'
            }`}
          >
            Theo Tuần
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedPeriod === 'month' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400'
            }`}
          >
            Theo Tháng
          </button>
          <button
            onClick={() => setSelectedPeriod('quarter')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedPeriod === 'quarter' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400'
            }`}
          >
            Theo Quý
          </button>
        </div>
      </div>

      {/* Comparison Chart: Viewer vs Leaderboard */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md shadow-xl flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-slate-100">
            So sánh Tiến độ Cá nhân của Bạn vs Top Leaderboard
          </h2>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartComparisonData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#F8FAFC',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="Bạn" fill="#6366F1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Top 1 Leaderboard" fill="#F59E0B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leaderboard Table */}
      {loading ? (
        <LoadingSpinner text="Đang tải bảng xếp hạng..." />
      ) : filteredLeaderboard.length > 0 ? (
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Bảng Xếp Hạng Hàng Đầu ({filteredLeaderboard.length} học viên)</span>
            </h3>
          </div>

          <div className="divide-y divide-slate-800/80">
            {filteredLeaderboard.map((entry, index) => {
              const isTop1 = index === 0;
              const isTop2 = index === 1;
              const isTop3 = index === 2;
              const isCurrentUser = entry.uid === user?.uid;

              return (
                <div
                  key={entry.uid}
                  className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                    isCurrentUser ? 'bg-indigo-950/40 border-l-4 border-indigo-500' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank Badge */}
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs">
                      {isTop1 ? (
                        <span className="text-xl">🥇</span>
                      ) : isTop2 ? (
                        <span className="text-xl">🥈</span>
                      ) : isTop3 ? (
                        <span className="text-xl">🥉</span>
                      ) : (
                        <span className="text-slate-400">#{index + 1}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    {entry.avatarUrl ? (
                      <img src={entry.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-slate-700" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-200 text-xs">
                        {entry.displayName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}

                    <div>
                      <h4 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                        <span>{entry.displayName}</span>
                        {isCurrentUser && (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold border border-indigo-500/30">
                            Bạn
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {entry.completedLessonsCount || 0} bài đã hoàn thành
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Streak</span>
                      <span className="text-xs font-bold text-amber-400 flex items-center justify-end gap-1">
                        <Flame className="w-3.5 h-3.5" />
                        {entry.streakCount || 0}d
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Từ vựng</span>
                      <span className="text-sm font-extrabold text-slate-100">
                        {entry.totalVocabularyCount || 0} từ
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <EmptyState
          title="Chưa có dữ liệu xếp hạng"
          description="Hiện chưa có dữ liệu xếp hạng trong cơ sở dữ liệu cho ngôn ngữ đã chọn."
          actionText="Bắt đầu bài học đầu tiên"
          actionHref="/languages"
        />
      )}
    </div>
  );
}
