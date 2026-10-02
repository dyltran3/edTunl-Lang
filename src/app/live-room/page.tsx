'use client';

import React from 'react';
import Link from 'next/link';
import { Video, Sparkles, Lock, Mic, Users, Monitor, ArrowLeft } from 'lucide-react';

export default function LiveRoomPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Tính năng Giai đoạn Tiếp theo (Phase 2)</span>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-100">
          Phòng Học Chung Live Room (WebRTC Video)
        </h1>
        <p className="text-xs text-slate-400 mt-2 max-w-lg leading-relaxed">
          Không gian luyện nói trực tiếp nhóm thời gian thực với phòng học voice/video chất lượng cao.
        </p>
      </div>

      {/* Disabled UI Placeholder Frame */}
      <div className="relative rounded-2xl bg-slate-900/80 border border-slate-800 p-8 backdrop-blur-md shadow-2xl flex flex-col items-center text-center gap-8 overflow-hidden">
        {/* Badge Overlay */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 shadow-lg">
          <Lock className="w-3.5 h-3.5" />
          <span>Sắp ra mắt (Disabled)</span>
        </div>

        {/* Video Grid Mockup Frame */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 opacity-40 pointer-events-none select-none">
          <div className="h-40 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center flex-col gap-2 text-slate-600">
            <Users className="w-8 h-8" />
            <span className="text-xs font-mono">Thành viên 1</span>
          </div>
          <div className="h-40 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center flex-col gap-2 text-slate-600">
            <Users className="w-8 h-8" />
            <span className="text-xs font-mono">Thành viên 2</span>
          </div>
          <div className="h-40 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center flex-col gap-2 text-slate-600">
            <Users className="w-8 h-8" />
            <span className="text-xs font-mono">Giảng viên / AI Tutor</span>
          </div>
        </div>

        {/* Controls Mockup Frame */}
        <div className="flex items-center gap-4 opacity-40 pointer-events-none select-none">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
            <Mic className="w-5 h-5" />
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
            <Video className="w-5 h-5" />
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
            <Monitor className="w-5 h-5" />
          </div>
        </div>

        <div className="p-6 rounded-xl bg-indigo-950/40 border border-indigo-500/30 max-w-md">
          <h3 className="font-bold text-sm text-slate-100 mb-1">
            Đang phát triển cho Phase sau
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Hệ thống WebRTC video streaming trực tiếp với phòng học nhóm hiện đang trong danh mục phát triển tiếp theo. Hãy theo dõi các thông báo mới nhất!
          </p>
        </div>

        <Link
          href="/dashboard"
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Dashboard học tập</span>
        </Link>
      </div>
    </div>
  );
}
