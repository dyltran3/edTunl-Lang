'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { SUPPORTED_LANGUAGES } from '@/lib/config/languages';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { userProfile, updateUserLanguages } = useAuth();
  const [selectedLangs, setSelectedLangs] = useState<string[]>(
    userProfile?.targetLanguages && userProfile.targetLanguages.length > 0
      ? userProfile.targetLanguages
      : ['en']
  );
  const [saving, setSaving] = useState(false);

  const toggleLanguage = (id: string) => {
    if (selectedLangs.includes(id)) {
      if (selectedLangs.length === 1) return; // Must select at least 1 language
      setSelectedLangs(selectedLangs.filter((l) => l !== id));
    } else {
      setSelectedLangs([...selectedLangs, id]);
    }
  };

  const handleComplete = async () => {
    try {
      setSaving(true);
      await updateUserLanguages(selectedLangs);
      // Redirect directly to course page for the primary selected language
      const firstLang = selectedLangs[0] || 'en';
      router.push(`/courses/${firstLang}`);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8 p-8 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bước 1 / 1 — Khởi đầu học tập</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-100">Bạn muốn học ngôn ngữ nào?</h1>
        <p className="text-xs text-slate-400 mt-1">
          Chọn một hoặc nhiều ngôn ngữ bạn muốn chinh phục. Bạn có thể thay đổi bất kỳ lúc nào.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = selectedLangs.includes(lang.id);
          return (
            <div
              key={lang.id}
              onClick={() => toggleLanguage(lang.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                isSelected
                  ? 'bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{lang.flag}</span>
                <div>
                  <h3 className="font-semibold text-sm text-slate-100">{lang.name}</h3>
                  <p className="text-xs text-slate-400">{lang.nativeName}</p>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'border-slate-700 text-transparent'
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleComplete}
        disabled={saving || selectedLangs.length === 0}
        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold text-sm hover:brightness-110 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
      >
        <span>{saving ? 'Đang lưu thiết lập...' : 'Bắt đầu học bài học đầu tiên'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
