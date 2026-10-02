'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/60 bg-slate-950/60 backdrop-blur-md py-8 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-200">edTunl Lang</span>
          <span>&copy; {new Date().getFullYear()} — Nền tảng học ngôn ngữ thông minh với Google Gemini AI.</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/languages" className="hover:text-slate-200 transition-colors">
            Danh mục ngôn ngữ
          </Link>
          <Link href="/library" className="hover:text-slate-200 transition-colors">
            Thư viện cộng đồng
          </Link>
          <Link href="/ranking" className="hover:text-slate-200 transition-colors">
            Bảng xếp hạng
          </Link>
          <Link href="/admin" className="hover:text-slate-200 transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
