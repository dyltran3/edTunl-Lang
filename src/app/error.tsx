'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 shadow-xl">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-slate-100">Đã Có Lỗi Xảy Ra</h1>
      <p className="text-xs text-slate-400 mt-2 max-w-sm leading-relaxed">
        {error?.message || 'Hệ thống gặp sự cố ngoài dự kiến. Vui lòng thử lại sau.'}
      </p>

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Thử lại</span>
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
        >
          Trang chủ
        </Link>
      </div>
    </div>
  );
}
