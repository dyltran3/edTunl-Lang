import { NextRequest, NextResponse } from 'next/server';
import { ensureAdminAccountExists } from '@/lib/seed/admin-seed';

export async function GET(req: NextRequest) {
  try {
    await ensureAdminAccountExists();
    return NextResponse.json({ success: true, message: 'Khởi tạo tài khoản Admin hoàn tất.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
