import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getDriverById, updateDriver } from '@/src/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const driver = await getDriverById(id);
    if (!driver) {
      return NextResponse.json({ success: false, error: 'Driver not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, driver });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updatedDriver = await updateDriver(id, body);
    if (!updatedDriver) {
      return NextResponse.json({ success: false, error: 'Driver not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, driver: updatedDriver });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
