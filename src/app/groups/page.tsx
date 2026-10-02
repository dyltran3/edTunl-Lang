'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/client';
import { collection, getDocs } from 'firebase/firestore';
import { Group } from '@/types';
import { getLanguageById } from '@/lib/config/languages';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Users, Plus, KeyRound, ArrowRight, Globe, Shield } from 'lucide-react';

export default function MyGroupsPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyGroups() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const snap = await getDocs(collection(db, 'groups'));
        const joined: Group[] = [];
        snap.forEach((docSnap) => {
          const data = docSnap.data();
          const isMember = data.members?.some((m: any) => m.uid === user.uid);
          if (isMember || data.creatorId === user.uid) {
            joined.push({
              id: docSnap.id,
              name: data.name,
              description: data.description,
              creatorId: data.creatorId,
              inviteCode: data.inviteCode,
              languages: data.languages || [],
              members: data.members || [],
              createdAt: data.createdAt,
            });
          }
        });
        setGroups(joined);
      } catch (err) {
        console.warn('Error fetching groups:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMyGroups();
  }, [user]);

  if (loading) {
    return <LoadingSpinner text="Đang tải danh sách nhóm học..." />;
  }

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Học Tập Theo Nhóm 2–50 Thành Viên</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100">Nhóm Học Của Tôi</h1>
          <p className="text-xs text-slate-400 mt-1">
            Thi đua chuyên cần, theo dõi biểu đồ tiến độ học tập đa đường trực quan cùng bạn bè.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/groups/join"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 flex items-center gap-2 transition-colors"
          >
            <KeyRound className="w-4 h-4 text-indigo-400" />
            <span>Nhập mã mời vào nhóm</span>
          </Link>
          <Link
            href="/groups/create"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo nhóm mới</span>
          </Link>
        </div>
      </div>

      {/* Groups List */}
      {groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Link
              key={group.id}
              href={`/groups/${group.id}`}
              className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 backdrop-blur-md transition-all flex flex-col justify-between gap-6 shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[11px] font-mono font-semibold border border-indigo-500/20">
                    Mã: {group.inviteCode}
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {group.members?.length || 1} / 50 thành viên
                  </span>
                </div>

                <h3 className="font-bold text-lg text-slate-100 group-hover:text-indigo-300 transition-colors">
                  {group.name}
                </h3>
                {group.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {group.description}
                  </p>
                )}

                {/* Target languages flags */}
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-[11px] text-slate-400 font-medium">Ngôn ngữ:</span>
                  <div className="flex items-center gap-1.5">
                    {group.languages?.map((langId) => {
                      const l = getLanguageById(langId);
                      return (
                        <span key={langId} title={l.name} className="text-lg">
                          {l.flag}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs font-semibold text-indigo-400">
                <span>Vào nhóm chi tiết</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Chưa tham gia nhóm học nào"
          description="Tham gia nhóm giúp bạn có động lực thi đua học tập hằng ngày và so sánh biểu đồ chuyên cần trực quan cùng bạn bè."
          actionText="Tạo nhóm học mới ngay"
          actionHref="/groups/create"
        />
      )}
    </div>
  );
}
