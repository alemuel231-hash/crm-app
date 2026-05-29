import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getRideRequests, addRideRequest, updateRideRequest, deleteRideRequest } from '@/src/lib/db';

export async function GET() {
  try {
    const trips = await getRideRequests();
    return NextResponse.json({ success: true, trips });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.rider_name || !body.pickup_address || !body.destination_address) {
      return NextResponse.json({ success: false, error: 'rider_name, pickup_address, and destination_address are required' }, { status: 400 });
    }

    const tripID = '-OFu' + Math.random().toString(36).substring(2, 15).toUpperCase();
    const cost = body.tripCost || Math.floor(Math.random() * 80) + 15;
    const distance = body.tripDistance || parseFloat((Math.random() * 15 + 2).toFixed(1));
    const duration = body.tripTime || Math.floor(distance * 2) + 5;

    const newTrip = await addRideRequest({
      tripID,
      rider_name: body.rider_name,
      rider_phone: body.rider_phone || '+233544997513',
      rider_Photo: '',
      rider_ID: 'R_USER_' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      pickup_address: body.pickup_address,
      destination_address: body.destination_address,
      driverID: body.driverID || '',
      location: {
        latitude: body.pickup_lat || '5.6037',
        longitude: body.pickup_lng || '-0.1870'
      },
      destination: {
        latitude: body.dropoff_lat || '5.6258',
        longitude: body.dropoff_lng || '-0.1982'
      },
      tripCost: cost,
      tripDistance: distance,
      tripTime: duration,
      paymentStatus: body.paymentStatus || 'unpaid',
      payment_method: body.payment_method || 'Cash',
      person_number: '1',
      discount: 0,
      created_at: new Date().toISOString()
    });

    return NextResponse.json({ success: true, trip: newTrip });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (!body.tripID) {
      return NextResponse.json({ success: false, error: 'tripID is required' }, { status: 400 });
    }

    const { tripID, ...updates } = body;
    const updated = await updateRideRequest(tripID, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Trip not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, trip: updated });
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
    const success = await deleteRideRequest(id);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Trip not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
