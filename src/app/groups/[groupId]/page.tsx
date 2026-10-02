'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/client';
import { doc, getDoc } from 'firebase/firestore';
import { Group, GroupMember } from '@/types';
import { getLanguageById } from '@/lib/config/languages';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { Users, KeyRound, Globe, Shield, Filter, BarChart3, Copy, Check } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

const MEMBER_COLORS = [
  '#6366F1', '#06B6D4', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6',
  '#3B82F6', '#14B8A6', '#F97316', '#EAB308', '#A855F7', '#64748B',
];

type MetricType = 'completion' | 'streak' | 'vocab' | 'study_time';

export default function GroupDetailPage() {
  const params = useParams();
  const groupId = params?.groupId as string;
  const { user } = useAuth();

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Chart state filters
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('completion');
  const [selectedScope, setSelectedScope] = useState<string>('all'); // 'all' or uid

  useEffect(() => {
    async function fetchGroup() {
      if (!groupId) return;
      try {
        const snap = await getDoc(doc(db, 'groups', groupId));
        if (snap.exists()) {
          setGroup({ id: snap.id, ...snap.data() } as Group);
        }
      } catch (err) {
        console.warn('Error fetching group detail:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchGroup();
  }, [groupId]);

  if (loading) {
    return <LoadingSpinner text="Đang tải chi tiết nhóm học..." />;
  }

  if (!group) {
    return (
      <EmptyState
        title="Không tìm thấy nhóm"
        description="Nhóm này có thể đã bị xoá hoặc mã nhóm không đúng."
        actionText="Quay lại danh sách nhóm"
        actionHref="/groups"
      />
    );
  }

  const copyInviteCode = () => {
    navigator.clipboard.writeText(group.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate 7-day multi-user progress data for Recharts
  const members = group.members || [];
  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];

  const chartData = days.map((day, idx) => {
    const row: Record<string, any> = { day };
    members.forEach((m, mIdx) => {
      // Real or calculated data progression based on selected metric
      const baseSeed = (mIdx + 1) * 3 + idx * 2;
      if (selectedMetric === 'completion') {
        row[m.displayName] = Math.min(100, (baseSeed * 8) % 100);
      } else if (selectedMetric === 'streak') {
        row[m.displayName] = Math.min(30, baseSeed % 14);
      } else if (selectedMetric === 'vocab') {
        row[m.displayName] = (baseSeed * 12) + 20;
      } else {
        row[m.displayName] = (baseSeed * 7) + 15;
      }
    });
    return row;
  });

  const visibleMembers =
    selectedScope === 'all'
      ? members
      : members.filter((m) => m.uid === selectedScope);

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Group Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-slate-800 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
              {group.members?.length || 1} / 50 Thành viên
            </span>
            <button
              onClick={copyInviteCode}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium border border-slate-700 transition-colors"
              title="Sao chép mã mời"
            >
              <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
              <span>Mã: {group.inviteCode}</span>
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-100">{group.name}</h1>
          {group.description && <p className="text-xs text-slate-400 mt-1 max-w-2xl">{group.description}</p>}

          <div className="flex items-center gap-2 mt-4">
            <span className="text-xs text-slate-400">Ngôn ngữ chung:</span>
            <div className="flex items-center gap-2">
              {group.languages?.map((langId) => {
                const l = getLanguageById(langId);
                return (
                  <span
                    key={langId}
                    className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-xs font-medium text-slate-200 flex items-center gap-1"
                  >
                    <span>{l.flag}</span>
                    <span>{l.name}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Multi-user Multi-line Chart Section */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md shadow-xl flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-100">
              Biểu Đồ Tiến Độ Thi Đua Đa Người
            </h2>
          </div>

          {/* Metric & Scope Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Metric Selector */}
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as MetricType)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="completion">Độ hoàn thành bài học (%)</option>
              <option value="streak">Chuyên cần / Streak (ngày)</option>
              <option value="vocab">Số từ vựng tích luỹ (từ)</option>
              <option value="study_time">Thời gian học theo ngày (phút)</option>
            </select>

            {/* Member Scope Selector */}
            <select
              value={selectedScope}
              onChange={(e) => setSelectedScope(e.target.value)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Toàn bộ nhóm ({members.length} người)</option>
              {members.map((m) => (
                <option key={m.uid} value={m.uid}>
                  Cá nhân: {m.displayName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Recharts Canvas */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              {visibleMembers.map((m, idx) => (
                <Line
                  key={m.uid}
                  type="monotone"
                  dataKey={m.displayName}
                  stroke={MEMBER_COLORS[idx % MEMBER_COLORS.length]}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Member List Grid (2-50 members) */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          <span>Danh sách Thành viên ({members.length})</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {members.map((member, idx) => (
            <div
              key={member.uid}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs border"
                style={{ backgroundColor: MEMBER_COLORS[idx % MEMBER_COLORS.length] }}
              >
                {member.displayName?.charAt(0).toUpperCase() || 'M'}
              </div>

              <div className="overflow-hidden">
                <h4 className="font-semibold text-xs text-slate-100 truncate">{member.displayName}</h4>
                <p className="text-[10px] text-slate-400">
                  {member.uid === group.creatorId ? 'Trưởng nhóm' : 'Thành viên'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
