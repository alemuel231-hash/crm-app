import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getDashboardStats } from '@/src/lib/db';

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json({ success: true, stats });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
