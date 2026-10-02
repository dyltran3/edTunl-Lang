'use client';

import React from 'react';
import Link from 'next/link';
import { SUPPORTED_LANGUAGES } from '@/lib/config/languages';
import { useAuth } from '@/context/AuthContext';
import { Globe, ArrowRight, Check } from 'lucide-react';

export default function LanguagesPage() {
  const { userProfile, updateUserLanguages } = useAuth();

  const isLearning = (langId: string) => {
    return userProfile?.targetLanguages?.includes(langId);
  };

  const toggleLanguageSelect = async (langId: string) => {
    if (!userProfile) return;
    const current = userProfile.targetLanguages || [];
    let updated: string[];
    if (current.includes(langId)) {
      if (current.length === 1) return;
      updated = current.filter((id) => id !== langId);
    } else {
      updated = [...current, langId];
    }
    await updateUserLanguages(updated);
  };

  return (
    <div className="flex flex-col gap-8 py-4">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
          <Globe className="w-3.5 h-3.5" />
          <span>Danh mục Ngôn ngữ Hỗ trợ</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">Chọn Ngôn ngữ Muốn Học</h1>
        <p className="text-xs text-slate-400 mt-1">
          Hệ thống edTunl Lang tích hợp tự động chuẩn font CJK (Trung - Nhật - Hàn - Thái) và phân cấp trình độ bài học.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const active = isLearning(lang.id);

          return (
            <div
              key={lang.id}
              className={`p-6 rounded-2xl border backdrop-blur-md flex flex-col justify-between gap-6 transition-all ${
                active
                  ? 'bg-gradient-to-br from-indigo-950/60 to-slate-900 border-indigo-500/50 shadow-xl shadow-indigo-500/10'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{lang.flag}</span>
                    <div>
                      <h3 className="font-bold text-base text-slate-100">{lang.name}</h3>
                      <p className={`text-xs text-slate-400 ${lang.fontFamilyClass}`}>{lang.nativeName}</p>
                    </div>
                  </div>

                  {userProfile && (
                    <button
                      onClick={() => toggleLanguageSelect(lang.id)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 border transition-colors ${
                        active
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      {active && <Check className="w-3 h-3" />}
                      <span>{active ? 'Đang học' : '+ Thêm học'}</span>
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">{lang.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  {lang.levels.map((lvl) => (
                    <span
                      key={lvl}
                      className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400"
                    >
                      {lvl}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href={`/courses/${lang.id}`}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/40 hover:border-indigo-500 text-indigo-300 hover:text-white font-medium text-xs flex items-center justify-center gap-2 transition-all group"
              >
                <span>Xem danh sách bài học</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
