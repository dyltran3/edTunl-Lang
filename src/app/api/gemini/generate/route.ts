import { NextRequest, NextResponse } from 'next/server';
import { generateLessonFromDocument, synthesizeLessonFromWeb } from '@/lib/gemini/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode, text, topic, languageId, level } = body;

    if (mode === 'upload') {
      if (!text) {
        return NextResponse.json({ error: 'Nội dung văn bản không được để trống.' }, { status: 400 });
      }
      const lesson = await generateLessonFromDocument(text, languageId || 'en', level || 'Beginner');
      return NextResponse.json({ success: true, lesson });
    } else if (mode === 'ai_synthesis') {
      if (!topic) {
        return NextResponse.json({ error: 'Chủ đề không được để trống.' }, { status: 400 });
      }
      const lesson = await synthesizeLessonFromWeb(topic, languageId || 'en', level || 'Beginner');
      return NextResponse.json({ success: true, lesson });
    } else {
      return NextResponse.json({ error: 'Chế độ (mode) không hợp lệ.' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('API Gemini Generate Error:', error);
    return NextResponse.json(
      { error: error.message || 'Lỗi xử lý server gọi Gemini API.' },
      { status: 500 }
    );
  }
}
