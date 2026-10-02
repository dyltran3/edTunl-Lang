'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/client';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { Lesson, UserProfile, Group } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import {
  Shield,
  Key,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileCheck,
  Users,
  Layers,
  Eye,
  Trash2,
  Sparkles,
} from 'lucide-react';

export default function AdminPortalPage() {
  const { user, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'gemini' | 'queue' | 'users' | 'groups'>('gemini');

  // 1. Gemini Config State
  const [apiKey, setApiKey] = useState('');
  const [savedKeyMasked, setSavedKeyMasked] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState(false);
  const [keyMsg, setKeyMsg] = useState<string | null>(null);

  // 2. Pending Review Lessons
  const [pendingLessons, setPendingLessons] = useState<Lesson[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);

  // 3. User Management
  const [userList, setUserList] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // 4. Group Management
  const [groupList, setGroupList] = useState<Group[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);

  // Fetch current Gemini API key config
  useEffect(() => {
    async function loadGeminiKey() {
      try {
        const snap = await getDoc(doc(db, 'system_config', 'gemini'));
        if (snap.exists() && snap.data().apiKey) {
          const raw = snap.data().apiKey;
          setSavedKeyMasked(`${raw.substring(0, 6)}...${raw.substring(raw.length - 4)}`);
        }
      } catch (err) {
        console.warn('Error loading Gemini key:', err);
      }
    }
    loadGeminiKey();
  }, []);

  // Fetch data based on active tab
  useEffect(() => {
    if (!isAdmin) return;

    if (activeTab === 'queue') {
      fetchPendingLessons();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'groups') {
      fetchGroups();
    }
  }, [activeTab, isAdmin]);

  const fetchPendingLessons = async () => {
    setLoadingLessons(true);
    try {
      const q = query(collection(db, 'lessons'), where('status', '==', 'pending_review'));
      const snap = await getDocs(q);
      const list: Lesson[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as Lesson));
      setPendingLessons(list);
    } catch (err) {
      console.warn('Error fetching pending lessons:', err);
    } finally {
      setLoadingLessons(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const snap = await getDocs(collection(db, 'users'));
      const list: UserProfile[] = [];
      snap.forEach((d) => list.push({ uid: d.id, ...d.data() } as UserProfile));
      setUserList(list);
    } catch (err) {
      console.warn('Error fetching users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchGroups = async () => {
    setLoadingGroups(true);
    try {
      const snap = await getDocs(collection(db, 'groups'));
      const list: Group[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as Group));
      setGroupList(list);
    } catch (err) {
      console.warn('Error fetching groups:', err);
    } finally {
      setLoadingGroups(false);
    }
  };

  // Actions
  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    setSavingKey(true);
    setKeyMsg(null);
    try {
      await setDoc(doc(db, 'system_config', 'gemini'), {
        apiKey: apiKey.trim(),
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email || 'admin',
      });
      const raw = apiKey.trim();
      setSavedKeyMasked(`${raw.substring(0, 6)}...${raw.substring(raw.length - 4)}`);
      setApiKey('');
      setKeyMsg('Đã lưu và kích hoạt Gemini API Key thành công!');
    } catch (err: any) {
      console.error(err);
      setKeyMsg(`Lỗi: ${err.message}`);
    } finally {
      setSavingKey(false);
    }
  };

  const handleApproveLesson = async (lessonId: string) => {
    try {
      await updateDoc(doc(db, 'lessons', lessonId), {
        status: 'published',
        approvedAt: new Date().toISOString(),
        approvedBy: user?.email || 'admin',
      });
      setPendingLessons(pendingLessons.filter((l) => l.id !== lessonId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectLesson = async (lessonId: string) => {
    const reason = prompt('Nhập lý do từ chối bài học này:');
    if (!reason) return;
    try {
      await updateDoc(doc(db, 'lessons', lessonId), {
        status: 'rejected',
        rejectionReason: reason,
        rejectedAt: new Date().toISOString(),
      });
      setPendingLessons(pendingLessons.filter((l) => l.id !== lessonId));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleUserRole = async (uid: string, currentRole: string) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await updateDoc(doc(db, 'users', uid), { role: nextRole });
      setUserList(userList.map((u) => (u.uid === uid ? { ...u, role: nextRole as any } : u)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xoá nhóm học này?')) return;
    try {
      await deleteDoc(doc(db, 'groups', groupId));
      setGroupList(groupList.filter((g) => g.id !== groupId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAdmin) {
    return (
      <EmptyState
        title="Truy cập bị từ chối"
        description="Trang này chỉ dành cho tài khoản Administrator."
        actionText="Quay lại Dashboard"
        actionHref="/dashboard"
      />
    );
  }

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Admin Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/40 backdrop-blur-md shadow-2xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Trang Quản Trị Hệ Thống (Admin Portal)</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cấu hình Gemini API key, duyệt bài học AI-generated, quản lý tài khoản và nhóm học.
          </p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('gemini')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'gemini'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Cấu hình Gemini API Key</span>
        </button>

        <button
          onClick={() => setActiveTab('queue')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
            activeTab === 'queue'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Hàng chờ duyệt bài học</span>
          {pendingLessons.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
              {pendingLessons.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'users'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Quản lý Người dùng</span>
        </button>

        <button
          onClick={() => setActiveTab('groups')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'groups'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Quản lý Nhóm</span>
        </button>
      </div>

      {/* Tab 1: Gemini API Key Config */}
      {activeTab === 'gemini' && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md max-w-xl flex flex-col gap-6 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Cấu hình Google Gemini API Key</h2>
              <p className="text-xs text-slate-400">Key được bảo mật trên server, không bị lộ ra client.</p>
            </div>
          </div>

          {savedKeyMasked ? (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
              <span className="font-mono">Trạng thái: Đã lưu API Key ({savedKeyMasked})</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Chưa nhập Gemini Key! Các nút tính năng AI trên site sẽ bị disable.</span>
            </div>
          )}

          {keyMsg && <p className="text-xs text-indigo-400 font-semibold">{keyMsg}</p>}

          <form onSubmit={handleSaveApiKey} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nhập Gemini API Key mới (Google AI Studio)
              </label>
              <input
                type="password"
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={savingKey}
              className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{savingKey ? 'Đang lưu...' : 'Lưu & Kích hoạt Key'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Approval Queue */}
      {activeTab === 'queue' && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-slate-100">
            Hàng chờ Duyệt Bài Học AI-Generated
          </h2>

          {loadingLessons ? (
            <LoadingSpinner text="Đang tải hàng chờ duyệt..." />
          ) : pendingLessons.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {pendingLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-4 shadow-xl"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-semibold border border-indigo-500/20">
                        {lesson.level} • {lesson.languageId}
                      </span>
                      <h3 className="font-bold text-lg text-slate-100 mt-1">{lesson.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{lesson.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApproveLesson(lesson.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Duyệt & Publish</span>
                      </button>

                      <button
                        onClick={() => handleRejectLesson(lesson.id)}
                        className="px-4 py-2 rounded-xl bg-rose-600/20 border border-rose-500/40 hover:bg-rose-600 text-rose-300 hover:text-white font-semibold text-xs flex items-center gap-1 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Từ chối</span>
                      </button>
                    </div>
                  </div>

                  {/* Citations Preview */}
                  {lesson.citations && lesson.citations.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                      <h4 className="font-semibold text-cyan-400 mb-1">Nguồn AI Trích dẫn:</h4>
                      <ul className="list-disc pl-4 text-slate-300">
                        {lesson.citations.map((c, idx) => (
                          <li key={idx}>
                            <strong>{c.sourceTitle}:</strong> {c.snippet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Không có bài học nào chờ duyệt"
              description="Tất cả bài học do người dùng hoặc AI tạo đã được duyệt xong."
            />
          )}
        </div>
      )}

      {/* Tab 3: User Management */}
      {activeTab === 'users' && (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 bg-slate-950/50">
            <h3 className="font-bold text-sm text-slate-100">Danh sách Người dùng ({userList.length})</h3>
          </div>

          {loadingUsers ? (
            <LoadingSpinner text="Đang tải người dùng..." />
          ) : (
            <div className="divide-y divide-slate-800">
              {userList.map((u) => (
                <div key={u.uid} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-200 text-xs">
                      {u.displayName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-100">{u.displayName}</h4>
                      <p className="text-[11px] text-slate-400">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-400">{u.streakCount || 0}d streak</span>
                    <button
                      onClick={() => toggleUserRole(u.uid, u.role)}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                        u.role === 'admin'
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      Role: {u.role}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Group Management */}
      {activeTab === 'groups' && (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 bg-slate-950/50">
            <h3 className="font-bold text-sm text-slate-100">Quản lý Tất cả Nhóm ({groupList.length})</h3>
          </div>

          {loadingGroups ? (
            <LoadingSpinner text="Đang tải danh sách nhóm..." />
          ) : (
            <div className="divide-y divide-slate-800">
              {groupList.map((g) => (
                <div key={g.id} className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-sm text-slate-100">{g.name}</h4>
                    <p className="text-xs text-slate-400 font-mono">Mã: {g.inviteCode} • {g.members?.length || 0} thành viên</p>
                  </div>

                  <button
                    onClick={() => handleDeleteGroup(g.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors"
                    title="Xoá nhóm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
