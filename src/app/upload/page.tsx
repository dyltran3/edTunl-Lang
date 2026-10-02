'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/client';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { SUPPORTED_LANGUAGES } from '@/lib/config/languages';
import { generateLessonFromDocument, synthesizeLessonFromWeb, GeneratedLessonOutput } from '@/lib/gemini/client';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { FileUp, Sparkles, AlertCircle, CheckCircle2, Eye, Lock, Globe, Loader2, BookOpen } from 'lucide-react';
import Link from 'next/link';

function UploadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialLang = searchParams.get('lang') || 'en';
  const { user } = useAuth();

  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [creationMode, setCreationMode] = useState<'upload' | 'ai_synthesis'>('upload');
  const [selectedLang, setSelectedLang] = useState(initialLang);
  const [selectedLevel, setSelectedLevel] = useState('Beginner');
  const [isPublic, setIsPublic] = useState(false);

  // Mode 1: Document Upload / Pasted Text
  const [pastedText, setPastedText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  // Mode 2: AI Web Synthesis Topic
  const [topic, setTopic] = useState('');

  // Execution states
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<GeneratedLessonOutput | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Check Gemini API Key presence
  useEffect(() => {
    async function checkKey() {
      if (process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY) {
        setHasApiKey(true);
        return;
      }
      try {
        const snap = await getDoc(doc(db, 'system_config', 'gemini'));
        if (snap.exists() && snap.data().apiKey) {
          setHasApiKey(true);
        } else {
          setHasApiKey(false);
        }
      } catch (err) {
        setHasApiKey(false);
      }
    }
    checkKey();
  }, []);

  const handleGeneratePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!hasApiKey) {
      setError('Chưa cấu hình Gemini API Key. Vui lòng vào trang Admin để nhập Gemini Key trước.');
      return;
    }

    setProcessing(true);
    setPreviewData(null);

    try {
      let result: GeneratedLessonOutput;

      if (creationMode === 'upload') {
        let contentToProcess = pastedText;
        if (file) {
          contentToProcess = await file.text();
        }

        if (!contentToProcess.trim()) {
          throw new Error('Vui lòng chọn file văn bản hoặc dán nội dung tài liệu.');
        }

        result = await generateLessonFromDocument(contentToProcess, selectedLang, selectedLevel);
      } else {
        if (!topic.trim()) {
          throw new Error('Vui lòng nhập chủ đề muốn AI tự tổng hợp.');
        }
        result = await synthesizeLessonFromWeb(topic, selectedLang, selectedLevel);
      }

      setPreviewData(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Không thể tạo bài học. Vui lòng kiểm tra lại tài liệu hoặc thử lại sau.');
    } finally {
      setProcessing(false);
    }
  };

  const handlePublishLesson = async () => {
    if (!user || !previewData) return;
    setSubmitting(true);
    setError(null);

    try {
      const requiresApproval = isPublic || creationMode === 'ai_synthesis';
      const lessonStatus = requiresApproval ? 'pending_review' : 'published';

      const lessonDoc = {
        title: previewData.title,
        description: previewData.description,
        languageId: selectedLang,
        level: previewData.level || selectedLevel,
        topic: previewData.topic || topic || 'Tài liệu cá nhân',
        content: previewData.content,
        vocabulary: previewData.vocabulary || [],
        citations: previewData.citations || [],
        exercises: previewData.exercises || [],
        createdBy: user.uid,
        isPublic: isPublic,
        status: lessonStatus,
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'lessons'), lessonDoc);

      if (requiresApproval) {
        alert('Bài học đã được đưa vào Hàng chờ Duyệt của Admin trước khi xuất bản công khai.');
        router.push(`/courses/${selectedLang}`);
      } else {
        router.push(`/lessons/${docRef.id}`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Không thể lưu bài học. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 flex flex-col gap-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tạo Bài Học với Google Gemini AI</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">Upload Tài Liệu → Sinh Bài Học AI</h1>
        <p className="text-xs text-slate-400 mt-1">
          Hệ thống AI tự trích xuất từ vựng, tạo câu ví dụ, audio và bài tập trắc nghiệm giữ nguyên trích dẫn nguồn.
        </p>
      </div>

      {/* Warning if API key missing */}
      {hasApiKey === false && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong>Chưa cấu hình Gemini API Key!</strong> Các tính năng AI hiện đang bị vô hiệu hoá. Vui lòng vào trang Admin để nhập API Key.
            </span>
          </div>
          <Link
            href="/admin"
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 transition-colors whitespace-nowrap"
          >
            Vào trang Admin
          </Link>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Mode Switcher */}
      <div className="flex items-center gap-3 p-1.5 rounded-xl bg-slate-900 border border-slate-800 w-fit">
        <button
          onClick={() => {
            setCreationMode('upload');
            setPreviewData(null);
          }}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            creationMode === 'upload'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileUp className="w-4 h-4" />
          <span>Tạo từ tài liệu upload</span>
        </button>

        <button
          onClick={() => {
            setCreationMode('ai_synthesis');
            setPreviewData(null);
          }}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            creationMode === 'ai_synthesis'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>AI tự tổng hợp từ Web</span>
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleGeneratePreview} className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md flex flex-col gap-6 shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Language Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Ngôn ngữ bài học</label>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.flag} {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          {/* Level Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Trình độ mục tiêu</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="Beginner">Cơ bản (Beginner / HSK 1-2 / JLPT N5)</option>
              <option value="Intermediate">Trung cấp (Intermediate / HSK 3-4 / JLPT N3-N4)</option>
              <option value="Advanced">Nâng cao (Advanced / HSK 5-6 / JLPT N1-N2)</option>
            </select>
          </div>
        </div>

        {/* Private vs Public toggle */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80">
          <div className="flex items-center gap-3">
            {isPublic ? (
              <Globe className="w-5 h-5 text-cyan-400" />
            ) : (
              <Lock className="w-5 h-5 text-indigo-400" />
            )}
            <div>
              <h4 className="text-xs font-semibold text-slate-200">
                {isPublic ? 'Công khai bài học cho Cộng đồng' : 'Riêng tư (Chỉ dành cho riêng tôi)'}
              </h4>
              <p className="text-[11px] text-slate-400">
                {isPublic
                  ? 'Bài học sẽ gửi vào hàng chờ duyệt Admin trước khi hiển thị công khai.'
                  : 'Xuất bản ngay vào kho cá nhân của bạn.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPublic(!isPublic)}
            className={`ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
              isPublic
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
            }`}
          >
            {isPublic ? 'Đổi sang Riêng tư' : 'Đổi sang Công khai'}
          </button>
        </div>

        {/* Mode specific fields */}
        {creationMode === 'upload' ? (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Chọn File văn bản (TXT, Document)
              </label>
              <input
                type="file"
                accept=".txt,.doc,.docx,.pdf,.md"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Hoặc Dán trực tiếp nội dung tài liệu:
              </label>
              <textarea
                rows={6}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Dán đoạn văn bản, truyện, giáo trình hoặc hội thoại bạn muốn học vào đây..."
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Chủ đề muốn AI tổng hợp từ Web
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="VD: Từ vựng Giao tiếp tại Sân bay, Ngữ pháp câu bị động Tiếng Anh B1..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={processing || hasApiKey === false}
          className="py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold text-xs hover:brightness-110 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {processing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Gemini AI đang phân tích & sinh bài học...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Xem trước bài học do AI sinh (Preview)</span>
            </>
          )}
        </button>
      </form>

      {/* Preview Section */}
      {previewData && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-indigo-500/40 backdrop-blur-md flex flex-col gap-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-slate-100">Xem trước Bài học (Preview)</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              AI Generated Ready
            </span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-100">{previewData.title}</h3>
            <p className="text-xs text-slate-400 mt-1">{previewData.description}</p>
          </div>

          {/* Citations list */}
          {previewData.citations && previewData.citations.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="text-xs font-semibold text-cyan-400 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>Trích dẫn nguồn tài liệu gốc:</span>
              </h4>
              <ul className="flex flex-col gap-1.5 text-xs text-slate-300">
                {previewData.citations.map((c, i) => (
                  <li key={i} className="pl-3 border-l-2 border-cyan-500">
                    <span className="font-semibold text-slate-200">{c.sourceTitle}:</span>{' '}
                    <span className="text-slate-400">{c.snippet}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Lesson Content preview */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
            {previewData.content}
          </div>

          {/* Vocabulary items preview */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 mb-2">
              Từ vựng quan trọng ({previewData.vocabulary?.length || 0} từ)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {previewData.vocabulary?.map((v, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-300">{v.word}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{v.phonetic}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">{v.meaning}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final Submit / Publish Action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => setPreviewData(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors"
            >
              Hủy & Làm lại
            </button>

            <button
              onClick={handlePublishLesson}
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {submitting
                  ? 'Đang lưu...'
                  : isPublic || creationMode === 'ai_synthesis'
                  ? 'Gửi vào Hàng chờ Duyệt Admin'
                  : 'Xuất bản bài học ngay'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Đang tải trình tạo bài học AI..." />}>
      <UploadContent />
    </Suspense>
  );
}
