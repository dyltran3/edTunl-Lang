'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/client';
import { collection, addDoc } from 'firebase/firestore';
import { SUPPORTED_LANGUAGES } from '@/lib/config/languages';
import { Users, Sparkles, Check, ArrowRight, AlertCircle } from 'lucide-react';

export default function CreateGroupPage() {
  const router = useRouter();
  const { user, userProfile } = useAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedLangs, setSelectedLangs] = useState<string[]>(['en']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInviteCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const toggleLanguage = (id: string) => {
    if (selectedLangs.includes(id)) {
      if (selectedLangs.length === 1) return;
      setSelectedLangs(selectedLangs.filter((l) => l !== id));
    } else {
      setSelectedLangs([...selectedLangs, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!user || !userProfile) {
      setError('Vui lòng đăng nhập trước khi tạo nhóm.');
      return;
    }
    if (!name.trim()) {
      setError('Vui lòng nhập tên nhóm.');
      return;
    }

    setLoading(true);
    try {
      const inviteCode = generateInviteCode();
      const newGroupDoc = {
        name: name.trim(),
        description: description.trim(),
        creatorId: user.uid,
        inviteCode: inviteCode,
        languages: selectedLangs,
        members: [
          {
            uid: user.uid,
            displayName: userProfile.displayName,
            avatarUrl: userProfile.avatarUrl || '',
            joinedAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'groups'), newGroupDoc);
      router.push(`/groups/${docRef.id}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Không thể tạo nhóm. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-6 p-8 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-2xl">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
          <Users className="w-3.5 h-3.5" />
          <span>Tạo Nhóm Học Tập Đa Người</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-100">Tạo Nhóm Học Mới</h1>
        <p className="text-xs text-slate-400 mt-1">
          Nhóm cho phép từ 2 đến 50 thành viên tham gia thi đua chuyên cần & biểu đồ so sánh.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 mb-4">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Tên nhóm học</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="VD: Nhóm Săn HSK4 & IELTS 7.0"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Mô tả nhóm</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mục tiêu của nhóm, lịch học chung..."
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Ngôn ngữ nhóm sẽ học chung
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = selectedLangs.includes(lang.id);
              return (
                <div
                  key={lang.id}
                  onClick={() => toggleLanguage(lang.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{lang.flag}</span>
                    <span className="text-xs font-medium">{lang.name}</span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold text-xs hover:brightness-110 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          <span>{loading ? 'Đang khởi tạo nhóm...' : 'Tạo nhóm & Sinh mã mời'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
