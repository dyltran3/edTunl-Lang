'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/client';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Group } from '@/types';
import { KeyRound, Users, AlertCircle, ArrowRight } from 'lucide-react';

export default function JoinGroupPage() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!user || !userProfile) {
      setError('Vui lòng đăng nhập trước khi tham gia nhóm.');
      return;
    }
    const cleanCode = inviteCode.trim().toUpperCase();
    if (!cleanCode) {
      setError('Vui lòng nhập mã mời 6 ký tự.');
      return;
    }

    setLoading(true);
    try {
      const q = query(collection(db, 'groups'), where('inviteCode', '==', cleanCode));
      const snap = await getDocs(q);

      if (snap.empty) {
        throw new Error('Mã mời không tồn tại hoặc đã hết hạn. Vui lòng kiểm tra lại.');
      }

      const groupDocSnap = snap.docs[0];
      const groupData = groupDocSnap.data() as Group;
      const members = groupData.members || [];

      // Check max 50 members rule
      if (members.length >= 50) {
        throw new Error('Nhóm này đã đạt giới hạn tối đa 50 thành viên.');
      }

      // Check if already a member
      const isAlreadyMember = members.some((m) => m.uid === user.uid);
      if (!isAlreadyMember) {
        const newMember = {
          uid: user.uid,
          displayName: userProfile.displayName,
          avatarUrl: userProfile.avatarUrl || '',
          joinedAt: new Date().toISOString(),
        };

        await updateDoc(doc(db, 'groups', groupDocSnap.id), {
          members: arrayUnion(newMember),
        });
      }

      router.push(`/groups/${groupDocSnap.id}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Không thể tham gia nhóm.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-8 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-2xl">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto mb-3">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-100">Tham Gia Nhóm Bằng Mã Mời</h1>
        <p className="text-xs text-slate-400 mt-1">
          Nhập mã 6 ký tự được người tạo nhóm chia sẻ để cùng tham gia thi đua.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 mb-4">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleJoin} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Mã mời nhóm</label>
          <input
            type="text"
            required
            maxLength={6}
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            placeholder="VD: X7K9A2"
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-center text-base tracking-widest uppercase focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !inviteCode.trim()}
          className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span>{loading ? 'Đang xác thực mã...' : 'Tham gia nhóm'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
