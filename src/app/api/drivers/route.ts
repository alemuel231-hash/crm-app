import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getDrivers, addDriver, updateDriver, deleteDriver } from '@/src/lib/db';

export async function GET() {
  try {
    const drivers = await getDrivers();
    return NextResponse.json({ success: true, drivers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.driverID || !body.driverName) {
      return NextResponse.json({ success: false, error: 'driverID and driverName are required' }, { status: 400 });
    }

    const newDriver = await addDriver({
      driverID: body.driverID,
      driverName: body.driverName,
      driverEmail: body.driverEmail || '',
      driverPhone: body.driverPhone || '',
      blocked: body.blocked ?? false,
      deleted_account: body.deleted_account ?? false,
      document_uploaded: body.document_uploaded ?? false,
      permanently_blocked: body.permanently_blocked ?? false,
      licensePlate: body.licensePlate || '',
      photoURL: body.photoURL || '',
      vehicleColor: body.vehicleColor || '',
      vehicleMenufacturer: body.vehicleMenufacturer || '',
      vehicleModel: body.vehicleModel || '',
      vehicleType: body.vehicleType || '',
      vehicleYear: body.vehicleYear || '',
      signup_setup_complete: body.signup_setup_complete ?? true,
    });

    return NextResponse.json({ success: true, driver: newDriver });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (!body.driverID) {
      return NextResponse.json({ success: false, error: 'driverID is required' }, { status: 400 });
    }

    const { driverID, ...updates } = body;
    const updated = await updateDriver(driverID, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Driver not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, driver: updated });
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
    const success = await deleteDriver(id);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Driver not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
