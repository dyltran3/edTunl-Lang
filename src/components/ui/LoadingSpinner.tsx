'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Đang tải dữ liệu...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
      <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      <span className="text-xs font-medium">{text}</span>
    </div>
  );
}
