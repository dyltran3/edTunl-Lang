'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/client';
import { doc, updateDoc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';
import { Settings, Lock, Globe, Bell, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export default function SettingsPage() {
  const { user, userProfile, refreshProfile } = useAuth();

  const [uiLanguage, setUiLanguage] = useState(userProfile?.settings?.uiLanguage || 'vi');
  const [notifications, setNotifications] = useState(userProfile?.settings?.notifications ?? true);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingSettings, setSavingSettings] = useState(false);
  const [updatingPass, setUpdatingPass] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingSettings(true);
    setMessage(null);
    setError(null);

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        'settings.uiLanguage': uiLanguage,
        'settings.notifications': notifications,
      });
      await refreshProfile();
      setMessage('Đã lưu cấu hình cài đặt thành công!');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Không thể lưu cài đặt.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setMessage(null);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    setUpdatingPass(true);
    try {
      await updatePassword(user, newPassword);
      setMessage('Đã đổi mật khẩu tài khoản thành công!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/requires-recent-login') {
        setError('Vui lòng đăng xuất và đăng nhập lại trước khi đổi mật khẩu.');
      } else {
        setError(err.message || 'Không thể đổi mật khẩu.');
      }
    } finally {
      setUpdatingPass(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4 flex flex-col gap-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>Thiết Lập Tài Khoản</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">Cài Đặt Tài Khoản</h1>
        <p className="text-xs text-slate-400 mt-1">
          Quản lý mật khẩu, ngôn ngữ giao diện ứng dụng và thông báo nhắc học.
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Preferences Section */}
      <form
        onSubmit={handleSaveSettings}
        className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md flex flex-col gap-6 shadow-xl"
      >
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-400" />
          <span>Cấu hình Giao diện & Thông báo</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Ngôn ngữ hiển thị (UI)</label>
            <select
              value={uiLanguage}
              onChange={(e) => setUiLanguage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="vi">🇻🇳 Tiếng Việt</option>
              <option value="en">🇬🇧 English</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Thông báo nhắc học hằng ngày</label>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
                  notifications ? 'bg-indigo-600 justify-end' : 'bg-slate-800 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
              <span className="text-xs text-slate-300">
                {notifications ? 'Đã bật thông báo' : 'Đã tắt thông báo'}
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={savingSettings}
          className="self-end px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{savingSettings ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
        </button>
      </form>

      {/* Change Password Section */}
      <form
        onSubmit={handleChangePassword}
        className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md flex flex-col gap-4 shadow-xl"
      >
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Lock className="w-5 h-5 text-cyan-400" />
          <span>Đổi Mật Khẩu Tài Khoản</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Mật khẩu mới</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={updatingPass}
          className="self-end px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <span>{updatingPass ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}</span>
        </button>
      </form>
    </div>
  );
}
