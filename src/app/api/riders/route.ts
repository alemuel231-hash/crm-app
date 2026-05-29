import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getRiders, addRider, updateRider, deleteRider } from '@/src/lib/db';

export async function GET() {
  try {
    const riders = await getRiders();
    return NextResponse.json({ success: true, riders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.riderName || !body.riderEmail || !body.riderPhone) {
      return NextResponse.json({ success: false, error: 'riderName, riderEmail, riderPhone are required' }, { status: 400 });
    }

    const newRider = await addRider({
      ...body
    });

    return NextResponse.json({ success: true, rider: newRider });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (!body.riderID) {
      return NextResponse.json({ success: false, error: 'riderID is required' }, { status: 400 });
    }

    const { riderID, ...updates } = body;
    const updated = await updateRider(riderID, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Rider not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, rider: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }
    const success = await deleteRider(id);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Rider not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
