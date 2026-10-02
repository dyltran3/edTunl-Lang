'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Mail, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email) {
      setError('Vui lòng nhập địa chỉ email.');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Không thể gửi email đặt lại mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md shadow-2xl">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Quên mật khẩu</h1>
        <p className="text-xs text-slate-400 mt-1">
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 mb-4">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5 mb-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Đã gửi liên kết hướng dẫn!</p>
            <p className="mt-1 text-slate-300">
              Hãy kiểm tra hộp thư đến của <span className="font-mono text-white">{email}</span> để thực hiện đặt lại mật khẩu.
            </p>
          </div>
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Địa chỉ Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            {loading ? 'Đang gửi...' : 'Gửi liên kết khôi phục'}
          </button>
        </form>
      )}

      <div className="mt-6 text-center">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại trang Đăng nhập</span>
        </Link>
      </div>
    </div>
  );
}
