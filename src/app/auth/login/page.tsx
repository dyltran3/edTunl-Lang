'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }

    try {
      setLoading(true);
      await signInWithEmail(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
        setError('Email hoặc mật khẩu không chính xác.');
      } else {
        setError(err.message || 'Đăng nhập không thành công.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      setLoading(true);
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Không thể đăng nhập bằng Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-8 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md shadow-2xl">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-100">Đăng nhập</h1>
        <p className="text-xs text-slate-400 mt-1">Chào mừng bạn quay lại với edTunl Lang</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 mb-4">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Google OAuth Option */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium text-xs border border-slate-700 flex items-center justify-center gap-3 transition-colors mb-6"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
          />
          <path
            fill="#FBBC05"
            d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"
          />
          <path
            fill="#34A853"
            d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
          />
        </svg>
        <span>Tiếp tục với Gmail (Google)</span>
      </button>

      <div className="relative flex items-center justify-center mb-6">
        <div className="border-t border-slate-800 w-full"></div>
        <span className="bg-slate-900 px-3 text-[10px] text-slate-500 font-semibold uppercase tracking-wider absolute">
          hoặc đăng nhập email
        </span>
      </div>

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

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-slate-300">Mật khẩu</label>
            <Link href="/auth/forgot-password" className="text-[11px] text-indigo-400 hover:underline">
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-medium text-xs hover:brightness-110 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          <span>{loading ? 'Đang xác thực...' : 'Đăng nhập'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <p className="text-center text-xs text-slate-400 mt-6">
        Chưa có tài khoản?{' '}
        <Link href="/auth/register" className="text-indigo-400 font-semibold hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
