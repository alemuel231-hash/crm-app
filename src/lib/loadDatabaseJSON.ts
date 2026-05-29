import fs from 'fs';
import path from 'path';

interface Driver {
  driverID: string;
  driverName: string;
  driverEmail: string;
  driverPhone: string;
  vehicleType: string;
  vehicleModel: string;
  vehicleYear: string;
  blocked: boolean;
  document_uploaded: boolean;
  signup_setup_complete: boolean;
  personalData: boolean;
}

interface Trip {
  tripID?: string;
  driverID?: string;
  riderID?: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  fare?: number;
  paymentStatus?: string;
  status?: string;
  timestamp?: number;
  distance?: number;
}

interface Rider {
  riderID: string;
  riderName: string;
  riderEmail: string;
  riderPhone: string;
  riderCity: string;
}

interface DatabaseJSON {
  driverData?: Record<string, Driver>;
  riderData?: Record<string, Rider>;
  tripsData?: Record<string, Trip>;
  availDrivers?: Record<string, any>;
  [key: string]: any;
}

let cachedDatabase: DatabaseJSON | null = null;

export async function loadDatabaseJSON(): Promise<DatabaseJSON> {
  if (cachedDatabase) {
    return cachedDatabase;
  }

  try {
    const filePath = path.join(
      process.cwd(),
      '..',
      'orbit-devbox-2398e-default-rtdb-export.json'
    );

    if (!fs.existsSync(filePath)) {
      console.warn(`Database file not found at: ${filePath}`);
      cachedDatabase = {
        driverData: {},
        riderData: {},
        tripsData: {},
      };
      return cachedDatabase;
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    cachedDatabase = JSON.parse(fileContent);
    return cachedDatabase as DatabaseJSON;
  } catch (error) {
    console.error('Error loading database JSON:', error);
    cachedDatabase = {
      driverData: {},
      riderData: {},
      tripsData: {},
    };
    return cachedDatabase;
  }
}

export async function getDriverStats() {
  const db = await loadDatabaseJSON();
  const drivers = Object.values(db.driverData || {}) as Driver[];
  
  const totalDrivers = drivers.length;
  const verifiedDrivers = drivers.filter(d => d.document_uploaded).length;
  const pendingDrivers = drivers.filter(d => !d.document_uploaded && !d.blocked).length;
  const blockedDrivers = drivers.filter(d => d.blocked).length;

  return {
    total: totalDrivers,
    verified: verifiedDrivers,
    pending: pendingDrivers,
    blocked: blockedDrivers,
    drivers: drivers,
  };
}

export async function getRiderStats() {
  const db = await loadDatabaseJSON();
  const riders = Object.values(db.riderData || {}) as Rider[];
  
  return {
    total: riders.length,
    riders: riders,
  };
}

export async function getTripStats() {
  const db = await loadDatabaseJSON();
  
  let totalTrips = 0;
  let completedTrips = 0;
  let totalEarnings = 0;
  const trips: Trip[] = [];

  // Check multiple possible keys for trips data
  const tripsData = db.tripsData || db.trips || {};
  
  Object.values(tripsData).forEach((trip: any) => {
    totalTrips++;
    if (trip.status === 'completed' || trip.paymentStatus === 'paid') {
      completedTrips++;
    }
    if (trip.fare) {
      totalEarnings += typeof trip.fare === 'string' ? parseFloat(trip.fare) : trip.fare;
    }
    trips.push(trip);
  });

  return {
    total: totalTrips,
    completed: completedTrips,
    totalEarnings: totalEarnings.toFixed(2),
    trips: trips,
  };
}

export async function getRecentTrips(limit: number = 10) {
  const db = await loadDatabaseJSON();
  const trips = Object.values(db.tripsData || {}) as Trip[];
  
  // Sort by timestamp if available, otherwise return recent ones
  const sorted = trips
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .slice(0, limit);

  return sorted;
}

export async function getRecentComplaints(limit: number = 5) {
  const db = await loadDatabaseJSON();
  const complaints = Object.values(db.complaintData || {}) as any[];
  
  return complaints.slice(0, limit);
}
