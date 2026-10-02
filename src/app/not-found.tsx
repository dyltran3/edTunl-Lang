'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-extrabold text-3xl mb-4 shadow-2xl">
        404
      </div>
      <h1 className="text-3xl font-extrabold text-slate-100">Trang Không Tồn Tại</h1>
      <p className="text-xs text-slate-400 mt-2 max-w-sm leading-relaxed">
        Đường dẫn bạn truy cập có thể đã bị thay đổi hoặc không còn tồn tại trên edTunl Lang.
      </p>

      <div className="flex items-center gap-3 mt-8">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Quay về Trang chủ</span>
        </Link>
      </div>
    </div>
  );
}
