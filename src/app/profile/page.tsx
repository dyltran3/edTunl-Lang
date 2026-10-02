'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db, storage } from '@/lib/firebase/client';
import { doc, updateDoc } from 'firebase/firestore';
import { generateAvatarOptions } from '@/lib/gemini/client';
import { SUPPORTED_LANGUAGES, getLanguageById } from '@/lib/config/languages';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { User, Sparkles, Flame, BookOpen, Clock, Award, Check, RefreshCw, X } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function ProfilePage() {
  const { user, userProfile, refreshProfile } = useAuth();

  // Avatar Generator Modal State
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarTheme, setAvatarTheme] = useState('cute_animals');
  const [avatarOptions, setAvatarOptions] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);

  const handleGenerateAvatars = async () => {
    setGenerating(true);
    try {
      const options = await generateAvatarOptions(avatarTheme);
      setAvatarOptions(options);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectAvatar = async (url: string) => {
    if (!user) return;
    setSavingAvatar(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        avatarUrl: url,
      });
      await refreshProfile();
      setShowAvatarModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingAvatar(false);
    }
  };

  if (!userProfile) {
    return <LoadingSpinner text="Đang tải thông tin cá nhân..." />;
  }

  // Personal weekly progress chart data
  const personalProgressData = [
    { day: 'Thứ 2', vocab: (userProfile.totalVocabularyCount || 0) > 10 ? 5 : 0, studyMinutes: 15 },
    { day: 'Thứ 3', vocab: (userProfile.totalVocabularyCount || 0) > 20 ? 12 : 0, studyMinutes: 25 },
    { day: 'Thứ 4', vocab: (userProfile.totalVocabularyCount || 0) > 30 ? 18 : 0, studyMinutes: 30 },
    { day: 'Thứ 5', vocab: (userProfile.totalVocabularyCount || 0) > 40 ? 25 : 0, studyMinutes: 20 },
    { day: 'Thứ 6', vocab: (userProfile.totalVocabularyCount || 0) > 50 ? 35 : 0, studyMinutes: 45 },
    { day: 'Thứ 7', vocab: (userProfile.totalVocabularyCount || 0) > 60 ? 42 : 0, studyMinutes: 40 },
    { day: 'Chủ Nhật', vocab: userProfile.totalVocabularyCount || 0, studyMinutes: userProfile.totalStudyTimeMinutes || 10 },
  ];

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Profile Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-slate-800 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="relative group">
            {userProfile.avatarUrl ? (
              <img
                src={userProfile.avatarUrl}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500 shadow-xl"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-indigo-500">
                {userProfile.displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <button
              onClick={() => {
                setShowAvatarModal(true);
                handleGenerateAvatars();
              }}
              className="absolute -bottom-1 -right-1 p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs shadow-lg transition-transform hover:scale-110"
              title="Tạo avatar AI"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold border border-indigo-500/30 uppercase">
                {userProfile.role}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Tham gia: {new Date(userProfile.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100">{userProfile.displayName}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{userProfile.email}</p>
          </div>
        </div>

        <button
          onClick={() => {
            setShowAvatarModal(true);
            handleGenerateAvatars();
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold text-xs hover:brightness-110 shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Tạo Avatar bằng AI (16 mẫu)</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Chuỗi Streak</span>
            <p className="text-xl font-bold text-slate-100">{userProfile.streakCount || 0} ngày</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Từ vựng đã học</span>
            <p className="text-xl font-bold text-slate-100">{userProfile.totalVocabularyCount || 0} từ</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Thời gian học</span>
            <p className="text-xl font-bold text-slate-100">{userProfile.totalStudyTimeMinutes || 0} phút</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Bài học đã học</span>
            <p className="text-xl font-bold text-slate-100">{userProfile.completedLessonsCount || 0} bài</p>
          </div>
        </div>
      </div>

      {/* Target Languages */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md">
        <h2 className="text-base font-bold text-slate-100 mb-3">Ngôn ngữ Đang Học</h2>
        <div className="flex flex-wrap gap-3">
          {userProfile.targetLanguages?.map((langId) => {
            const l = getLanguageById(langId);
            return (
              <div
                key={langId}
                className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2.5 text-xs font-semibold text-slate-200"
              >
                <span className="text-xl">{l.flag}</span>
                <span>{l.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personal Progress Area Chart */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md shadow-xl flex flex-col gap-4">
        <h2 className="text-base font-bold text-slate-100">
          Biểu Đồ Tiến Độ Cá Nhân (7 ngày qua)
        </h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={personalProgressData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVocab" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
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
              <Area
                type="monotone"
                dataKey="vocab"
                stroke="#6366F1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorVocab)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Avatar Generator Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 flex flex-col gap-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-slate-100">
                  Tạo & Chọn Avatar với AI (16 mẫu)
                </h3>
              </div>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Theme Selector */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-slate-400 font-semibold">Chủ đề:</span>
              <button
                onClick={() => {
                  setAvatarTheme('cute_animals');
                  handleGenerateAvatars();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  avatarTheme === 'cute_animals'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                🐱 Động vật dễ thương
              </button>
              <button
                onClick={() => {
                  setAvatarTheme('flowers');
                  handleGenerateAvatars();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  avatarTheme === 'flowers'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                🌸 Hoa cỏ & Thiên nhiên
              </button>
              <button
                onClick={() => {
                  setAvatarTheme('black_line_art');
                  handleGenerateAvatars();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  avatarTheme === 'black_line_art'
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                🎨 Animation & Black-line
              </button>
            </div>

            {/* Avatar Grid */}
            {generating ? (
              <LoadingSpinner text="AI đang tạo 16 mẫu avatar độc đáo..." />
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 max-h-80 overflow-y-auto p-2">
                {avatarOptions.map((dataUrl, idx) => (
                  <button
                    key={idx}
                    disabled={savingAvatar}
                    onClick={() => handleSelectAvatar(dataUrl)}
                    className="group relative rounded-full overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-all transform hover:scale-105"
                  >
                    <img src={dataUrl} alt={`Avatar option ${idx + 1}`} className="w-16 h-16 object-cover" />
                    <div className="absolute inset-0 bg-indigo-600/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                      <Check className="w-5 h-5 stroke-[3]" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
