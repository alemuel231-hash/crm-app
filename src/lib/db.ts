import { ref, get, set, update, child, remove, push } from 'firebase/database';
import { database } from './firebase';

export interface Driver {
  driverID: string;
  driverName: string;
  driverEmail: string;
  driverPhone: string;
  blocked: boolean;
  deleted_account: boolean;
  document_uploaded: boolean;
  permanently_blocked: boolean;
  licensePlate: string;
  photoURL: string;
  vehicleColor: string;
  vehicleMenufacturer: string;
  vehicleModel: string;
  vehicleType: string;
  vehicleYear: string;
  signup_setup_complete: boolean;
  phone_auth_complete?: boolean;
  emailPassword_auth?: boolean;
  facebook_signUp?: boolean;
  google_auth?: boolean;
  fcmToken?: string;
  newtrip?: string;
  history?: Record<string, boolean>;
}

export interface RideRequest {
  tripID: string;
  created_at: string;
  destination: {
    latitude: string;
    longitude: string;
  };
  destination_address: string;
  discount: number;
  driverID: string;
  location: {
    latitude: string;
    longitude: string;
  };
  paymentStatus: 'paid' | 'unpaid' | string;
  payment_method: string;
  person_number: string;
  pickup_address: string;
  rider_ID: string;
  rider_Photo: string;
  rider_name: string;
  rider_phone: string;
  tripCost: number;
  tripDistance: number;
  tripTime: number;
  userFCMToken?: string;
}

export interface AvailableDriver {
  driverID: string;
  accuracy: number;
  g: string;
  l: [number, number]; // [latitude, longitude]
  rotation: number;
  serviceType: string;
}

// --- Riders Operations ---

export interface Rider {
  riderID: string;
  riderName: string;
  riderEmail: string;
  riderPhone: string;
  riderCity?: string;
  blocked?: boolean;
  active?: boolean;
}

export async function getRiders(): Promise<Rider[]> {
  const snapshot = await get(ref(database, 'rider_users'));
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  return Object.entries(data).map(([id, info]: [string, any]) => ({
    riderID: id,
    ...info,
  } as Rider));
}

export async function addRider(rider: Omit<Rider, 'riderID'> & { riderID: string }): Promise<Rider> {
  const { riderID, ...info } = rider;
  await set(ref(database, `rider_users/${riderID}`), info);
  return rider as Rider;
}

export async function updateRider(id: string, updates: Partial<Omit<Rider, 'riderID'>>): Promise<Rider | null> {
  const riderRef = child(ref(database), `rider_users/${id}`);
  const snapshot = await get(riderRef);
  if (!snapshot.exists()) return null;

  await update(ref(database, `rider_users/${id}`), updates);
  
  const updatedSnapshot = await get(riderRef);
  return {
    riderID: id,
    ...updatedSnapshot.val(),
  } as Rider;
}

export async function deleteRider(id: string): Promise<boolean> {
  const riderRef = child(ref(database), `rider_users/${id}`);
  const snapshot = await get(riderRef);
  if (!snapshot.exists()) return false;
  await remove(riderRef);
  return true;
}

// --- Drivers Operations ---

export async function getDrivers(): Promise<Driver[]> {
  const snapshot = await get(ref(database, 'driverData'));
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  return Object.entries(data).map(([id, info]: [string, any]) => ({
    driverID: id,
    ...info,
  } as Driver));
}

export async function getDriverById(id: string): Promise<Driver | null> {
  const snapshot = await get(child(ref(database), `driverData/${id}`));
  if (!snapshot.exists()) return null;
  return {
    driverID: id,
    ...snapshot.val(),
  } as Driver;
}

export async function updateDriver(id: string, updates: Partial<Omit<Driver, 'driverID'>>): Promise<Driver | null> {
  const driverRef = child(ref(database), `driverData/${id}`);
  const snapshot = await get(driverRef);
  if (!snapshot.exists()) return null;

  await update(ref(database, `driverData/${id}`), updates);
  
  const updatedSnapshot = await get(driverRef);
  return {
    driverID: id,
    ...updatedSnapshot.val(),
  } as Driver;
}

export async function addDriver(driver: Omit<Driver, 'driverID'> & { driverID: string }): Promise<Driver> {
  const { driverID, ...info } = driver;
  await set(ref(database, `driverData/${driverID}`), info);
  return driver as Driver;
}

export async function deleteDriver(id: string): Promise<boolean> {
  const driverRef = child(ref(database), `driverData/${id}`);
  const snapshot = await get(driverRef);
  if (!snapshot.exists()) return false;
  await remove(driverRef);
  return true;
}

// --- Available Drivers Operations ---

export async function getAvailableDrivers(): Promise<AvailableDriver[]> {
  const snapshot = await get(ref(database, 'availDrivers'));
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  return Object.entries(data).map(([id, info]: [string, any]) => ({
    driverID: id,
    ...info,
  } as AvailableDriver));
}

// --- Ride Requests Operations ---

export async function getRideRequests(): Promise<RideRequest[]> {
  const snapshot = await get(ref(database, 'rideRequest'));
  if (!snapshot.exists()) return [];
  const data = snapshot.val();
  return Object.entries(data)
    .map(([id, info]: [string, any]) => ({
      tripID: id,
      ...info,
    } as RideRequest))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getRideRequestById(id: string): Promise<RideRequest | null> {
  const snapshot = await get(child(ref(database), `rideRequest/${id}`));
  if (!snapshot.exists()) return null;
  return {
    tripID: id,
    ...snapshot.val(),
  } as RideRequest;
}

export async function updateRideRequest(id: string, updates: Partial<Omit<RideRequest, 'tripID'>>): Promise<RideRequest | null> {
  const requestRef = child(ref(database), `rideRequest/${id}`);
  const snapshot = await get(requestRef);
  if (!snapshot.exists()) return null;

  await update(ref(database, `rideRequest/${id}`), updates);

  const updatedSnapshot = await get(requestRef);
  return {
    tripID: id,
    ...updatedSnapshot.val(),
  } as RideRequest;
}

export async function addRideRequest(trip: Omit<RideRequest, 'tripID'> & { tripID: string }): Promise<RideRequest> {
  const { tripID, ...info } = trip;
  await set(ref(database, `rideRequest/${tripID}`), info);
  return trip as RideRequest;
}

export async function deleteRideRequest(id: string): Promise<boolean> {
  const requestRef = child(ref(database), `rideRequest/${id}`);
  const snapshot = await get(requestRef);
  if (!snapshot.exists()) return false;
  await remove(requestRef);
  return true;
}

// --- Dashboard Statistics Operations ---

export interface DashboardStats {
  totalEarnings: number;
  totalTrips: number;
  totalDrivers: number;
  activeDrivers: number;
  totalRiders: number;
  earningsByServiceType: Record<string, number>;
  tripsByServiceType: Record<string, number>;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const drivers = await getDrivers();
  const availDrivers = await getAvailableDrivers();
  const trips = await getRideRequests();
  
  const riderUsersSnapshot = await get(ref(database, 'rider_users'));
  const riderUsersData = riderUsersSnapshot.exists() ? riderUsersSnapshot.val() : {};

  const totalEarnings = trips
    .filter(t => t.paymentStatus === 'paid' || t.paymentStatus === 'unpaid')
    .reduce((sum, t) => sum + (t.tripCost || 0), 0);

  const uniqueRiders = new Set(trips.map(t => t.rider_ID));
  Object.keys(riderUsersData).forEach(id => uniqueRiders.add(id));

  const earningsByServiceType: Record<string, number> = {};
  const tripsByServiceType: Record<string, number> = {};

  trips.forEach(t => {
    const driver = drivers.find(d => d.driverID === t.driverID);
    const serviceType = driver?.vehicleType || "Orbit Taxi";

    earningsByServiceType[serviceType] = (earningsByServiceType[serviceType] || 0) + (t.tripCost || 0);
    tripsByServiceType[serviceType] = (tripsByServiceType[serviceType] || 0) + 1;
  });

  return {
    totalEarnings,
    totalTrips: trips.length,
    totalDrivers: drivers.length,
    activeDrivers: availDrivers.length,
    totalRiders: uniqueRiders.size,
    earningsByServiceType,
    tripsByServiceType,
  };
}

// --- Generic CRM Methods ---

// Contacts
export async function getContacts() {
  const snapshot = await get(ref(database, 'contacts'));
  if (!snapshot.exists()) return [];
  return Object.values(snapshot.val());
}
export async function addContact(contact: any) {
  const newRef = push(ref(database, 'contacts'));
  const id = newRef.key;
  await set(newRef, { ...contact, id });
  return { ...contact, id };
}
export async function updateContact(id: string, updates: any) {
  const snapshot = await get(ref(database, 'contacts'));
  if (!snapshot.exists()) return null;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await update(ref(database, `contacts/${key}`), updates);
    return { ...data[key], ...updates };
  }
  return null;
}
export async function deleteContact(id: string) {
  const snapshot = await get(ref(database, 'contacts'));
  if (!snapshot.exists()) return false;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await remove(ref(database, `contacts/${key}`));
    return true;
  }
  return false;
}

// Deals
export async function getDeals() {
  const snapshot = await get(ref(database, 'deals'));
  if (!snapshot.exists()) return [];
  return Object.values(snapshot.val());
}
export async function addDeal(deal: any) {
  const newRef = push(ref(database, 'deals'));
  const id = newRef.key;
  await set(newRef, { ...deal, id });
  return { ...deal, id };
}
export async function updateDeal(id: string, updates: any) {
  const snapshot = await get(ref(database, 'deals'));
  if (!snapshot.exists()) return null;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await update(ref(database, `deals/${key}`), updates);
    return { ...data[key], ...updates };
  }
  return null;
}
export async function deleteDeal(id: string) {
  const snapshot = await get(ref(database, 'deals'));
  if (!snapshot.exists()) return false;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await remove(ref(database, `deals/${key}`));
    return true;
  }
  return false;
}

// Leads
export async function getLeads() {
  const snapshot = await get(ref(database, 'leads'));
  if (!snapshot.exists()) return [];
  return Object.values(snapshot.val());
}
export async function addLead(lead: any) {
  const newRef = push(ref(database, 'leads'));
  const id = newRef.key;
  await set(newRef, { ...lead, id });
  return { ...lead, id };
}
export async function updateLead(id: string, updates: any) {
  const snapshot = await get(ref(database, 'leads'));
  if (!snapshot.exists()) return null;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await update(ref(database, `leads/${key}`), updates);
    return { ...data[key], ...updates };
  }
  return null;
}
export async function deleteLead(id: string) {
  const snapshot = await get(ref(database, 'leads'));
  if (!snapshot.exists()) return false;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await remove(ref(database, `leads/${key}`));
    return true;
  }
  return false;
}

// Accounting
export async function getAccounting() {
  const snapshot = await get(ref(database, 'accounting'));
  if (!snapshot.exists()) return [];
  return Object.values(snapshot.val());
}
export async function addAccounting(item: any) {
  const newRef = push(ref(database, 'accounting'));
  const id = newRef.key;
  await set(newRef, { ...item, id });
  return { ...item, id };
}
export async function updateAccounting(id: string, updates: any) {
  const snapshot = await get(ref(database, 'accounting'));
  if (!snapshot.exists()) return null;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await update(ref(database, `accounting/${key}`), updates);
    return { ...data[key], ...updates };
  }
  return null;
}
export async function deleteAccounting(id: string) {
  const snapshot = await get(ref(database, 'accounting'));
  if (!snapshot.exists()) return false;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await remove(ref(database, `accounting/${key}`));
    return true;
  }
  return false;
}

// Activities
export async function getActivities() {
  const snapshot = await get(ref(database, 'activities'));
  if (!snapshot.exists()) return [];
  return Object.values(snapshot.val());
}
export async function addActivities(item: any) {
  const newRef = push(ref(database, 'activities'));
  const id = newRef.key;
  await set(newRef, { ...item, id });
  return { ...item, id };
}
export async function updateActivities(id: string, updates: any) {
  const snapshot = await get(ref(database, 'activities'));
  if (!snapshot.exists()) return null;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await update(ref(database, `activities/${key}`), updates);
    return { ...data[key], ...updates };
  }
  return null;
}
export async function deleteActivities(id: string) {
  const snapshot = await get(ref(database, 'activities'));
  if (!snapshot.exists()) return false;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await remove(ref(database, `activities/${key}`));
    return true;
  }
  return false;
}

// Calendar
export async function getCalendar() {
  const snapshot = await get(ref(database, 'calendar'));
  if (!snapshot.exists()) return [];
  return Object.values(snapshot.val());
}
export async function addCalendar(item: any) {
  const newRef = push(ref(database, 'calendar'));
  const id = newRef.key;
  await set(newRef, { ...item, id });
  return { ...item, id };
}
export async function updateCalendar(id: string, updates: any) {
  const snapshot = await get(ref(database, 'calendar'));
  if (!snapshot.exists()) return null;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await update(ref(database, `calendar/${key}`), updates);
    return { ...data[key], ...updates };
  }
  return null;
}
export async function deleteCalendar(id: string) {
  const snapshot = await get(ref(database, 'calendar'));
  if (!snapshot.exists()) return false;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await remove(ref(database, `calendar/${key}`));
    return true;
  }
  return false;
}

// Campaigns
export async function getCampaigns() {
  const snapshot = await get(ref(database, 'campaigns'));
  if (!snapshot.exists()) return [];
  return Object.values(snapshot.val());
}
export async function addCampaigns(item: any) {
  const newRef = push(ref(database, 'campaigns'));
  const id = newRef.key;
  await set(newRef, { ...item, id });
  return { ...item, id };
}
export async function updateCampaigns(id: string, updates: any) {
  const snapshot = await get(ref(database, 'campaigns'));
  if (!snapshot.exists()) return null;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await update(ref(database, `campaigns/${key}`), updates);
    return { ...data[key], ...updates };
  }
  return null;
}
export async function deleteCampaigns(id: string) {
  const snapshot = await get(ref(database, 'campaigns'));
  if (!snapshot.exists()) return false;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await remove(ref(database, `campaigns/${key}`));
    return true;
  }
  return false;
}

// Chat
export async function getChat() {
  const snapshot = await get(ref(database, 'chat'));
  if (!snapshot.exists()) return [];
  return Object.values(snapshot.val());
}
export async function addChat(item: any) {
  const newRef = push(ref(database, 'chat'));
  const id = newRef.key;
  await set(newRef, { ...item, id });
  return { ...item, id };
}
export async function updateChat(id: string, updates: any) {
  const snapshot = await get(ref(database, 'chat'));
  if (!snapshot.exists()) return null;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await update(ref(database, `chat/${key}`), updates);
    return { ...data[key], ...updates };
  }
  return null;
}
export async function deleteChat(id: string) {
  const snapshot = await get(ref(database, 'chat'));
  if (!snapshot.exists()) return false;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await remove(ref(database, `chat/${key}`));
    return true;
  }
  return false;
}

// Companies
export async function getCompanies() {
  const snapshot = await get(ref(database, 'companies'));
  if (!snapshot.exists()) return [];
  return Object.values(snapshot.val());
}
export async function addCompanies(item: any) {
  const newRef = push(ref(database, 'companies'));
  const id = newRef.key;
  await set(newRef, { ...item, id });
  return { ...item, id };
}
export async function updateCompanies(id: string, updates: any) {
  const snapshot = await get(ref(database, 'companies'));
  if (!snapshot.exists()) return null;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await update(ref(database, `companies/${key}`), updates);
    return { ...data[key], ...updates };
  }
  return null;
}
export async function deleteCompanies(id: string) {
  const snapshot = await get(ref(database, 'companies'));
  if (!snapshot.exists()) return false;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await remove(ref(database, `companies/${key}`));
    return true;
  }
  return false;
}

// Customers
export async function getCustomers() {
  const snapshot = await get(ref(database, 'customers'));
  if (!snapshot.exists()) return [];
  return Object.values(snapshot.val());
}
export async function addCustomers(item: any) {
  const newRef = push(ref(database, 'customers'));
  const id = newRef.key;
  await set(newRef, { ...item, id });
  return { ...item, id };
}
export async function updateCustomers(id: string, updates: any) {
  const snapshot = await get(ref(database, 'customers'));
  if (!snapshot.exists()) return null;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await update(ref(database, `customers/${key}`), updates);
    return { ...data[key], ...updates };
  }
  return null;
}
export async function deleteCustomers(id: string) {
  const snapshot = await get(ref(database, 'customers'));
  if (!snapshot.exists()) return false;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await remove(ref(database, `customers/${key}`));
    return true;
  }
  return false;
}

// Email
export async function getEmail() {
  const snapshot = await get(ref(database, 'email'));
  if (!snapshot.exists()) return [];
  return Object.values(snapshot.val());
}
export async function addEmail(item: any) {
  const newRef = push(ref(database, 'email'));
  const id = newRef.key;
  await set(newRef, { ...item, id });
  return { ...item, id };
}
export async function updateEmail(id: string, updates: any) {
  const snapshot = await get(ref(database, 'email'));
  if (!snapshot.exists()) return null;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await update(ref(database, `email/${key}`), updates);
    return { ...data[key], ...updates };
  }
  return null;
}
export async function deleteEmail(id: string) {
  const snapshot = await get(ref(database, 'email'));
  if (!snapshot.exists()) return false;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await remove(ref(database, `email/${key}`));
    return true;
  }
  return false;
}

// Estimations
export async function getEstimations() {
  const snapshot = await get(ref(database, 'estimations'));
  if (!snapshot.exists()) return [];
  return Object.values(snapshot.val());
}
export async function addEstimations(item: any) {
  const newRef = push(ref(database, 'estimations'));
  const id = newRef.key;
  await set(newRef, { ...item, id });
  return { ...item, id };
}
export async function updateEstimations(id: string, updates: any) {
  const snapshot = await get(ref(database, 'estimations'));
  if (!snapshot.exists()) return null;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await update(ref(database, `estimations/${key}`), updates);
    return { ...data[key], ...updates };
  }
  return null;
}
export async function deleteEstimations(id: string) {
  const snapshot = await get(ref(database, 'estimations'));
  if (!snapshot.exists()) return false;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await remove(ref(database, `estimations/${key}`));
    return true;
  }
  return false;
}

// Marketing
export async function getMarketing() {
  const snapshot = await get(ref(database, 'marketing'));
  if (!snapshot.exists()) return [];
  return Object.values(snapshot.val());
}
export async function addMarketing(item: any) {
  const newRef = push(ref(database, 'marketing'));
  const id = newRef.key;
  await set(newRef, { ...item, id });
  return { ...item, id };
}
export async function updateMarketing(id: string, updates: any) {
  const snapshot = await get(ref(database, 'marketing'));
  if (!snapshot.exists()) return null;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await update(ref(database, `marketing/${key}`), updates);
    return { ...data[key], ...updates };
  }
  return null;
}
export async function deleteMarketing(id: string) {
  const snapshot = await get(ref(database, 'marketing'));
  if (!snapshot.exists()) return false;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await remove(ref(database, `marketing/${key}`));
    return true;
  }
  return false;
}

// Opportunities
export async function getOpportunities() {
  const snapshot = await get(ref(database, 'opportunities'));
  if (!snapshot.exists()) return [];
  return Object.values(snapshot.val());
}
export async function addOpportunities(item: any) {
  const newRef = push(ref(database, 'opportunities'));
  const id = newRef.key;
  await set(newRef, { ...item, id });
  return { ...item, id };
}
export async function updateOpportunities(id: string, updates: any) {
  const snapshot = await get(ref(database, 'opportunities'));
  if (!snapshot.exists()) return null;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await update(ref(database, `opportunities/${key}`), updates);
    return { ...data[key], ...updates };
  }
  return null;
}
export async function deleteOpportunities(id: string) {
  const snapshot = await get(ref(database, 'opportunities'));
  if (!snapshot.exists()) return false;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await remove(ref(database, `opportunities/${key}`));
    return true;
  }
  return false;
}

// Orders
export async function getOrders() {
  const snapshot = await get(ref(database, 'orders'));
  if (!snapshot.exists()) return [];
  return Object.values(snapshot.val());
}
export async function addOrders(item: any) {
  const newRef = push(ref(database, 'orders'));
  const id = newRef.key;
  await set(newRef, { ...item, id });
  return { ...item, id };
}
export async function updateOrders(id: string, updates: any) {
  const snapshot = await get(ref(database, 'orders'));
  if (!snapshot.exists()) return null;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await update(ref(database, `orders/${key}`), updates);
    return { ...data[key], ...updates };
  }
  return null;
}
export async function deleteOrders(id: string) {
  const snapshot = await get(ref(database, 'orders'));
  if (!snapshot.exists()) return false;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await remove(ref(database, `orders/${key}`));
    return true;
  }
  return false;
}

// Payments
export async function getPayments() {
  const snapshot = await get(ref(database, 'payments'));
  if (!snapshot.exists()) return [];
  return Object.values(snapshot.val());
}
export async function addPayments(item: any) {
  const newRef = push(ref(database, 'payments'));
  const id = newRef.key;
  await set(newRef, { ...item, id });
  return { ...item, id };
}
export async function updatePayments(id: string, updates: any) {
  const snapshot = await get(ref(database, 'payments'));
  if (!snapshot.exists()) return null;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await update(ref(database, `payments/${key}`), updates);
    return { ...data[key], ...updates };
  }
  return null;
}
export async function deletePayments(id: string) {
  const snapshot = await get(ref(database, 'payments'));
  if (!snapshot.exists()) return false;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await remove(ref(database, `payments/${key}`));
    return true;
  }
  return false;
}

// Payout
export async function getPayout() {
  const snapshot = await get(ref(database, 'payout'));
  if (!snapshot.exists()) return [];
  return Object.values(snapshot.val());
}
export async function addPayout(item: any) {
  const newRef = push(ref(database, 'payout'));
  const id = newRef.key;
  await set(newRef, { ...item, id });
  return { ...item, id };
}
export async function updatePayout(id: string, updates: any) {
  const snapshot = await get(ref(database, 'payout'));
  if (!snapshot.exists()) return null;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await update(ref(database, `payout/${key}`), updates);
    return { ...data[key], ...updates };
  }
  return null;
}
export async function deletePayout(id: string) {
  const snapshot = await get(ref(database, 'payout'));
  if (!snapshot.exists()) return false;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await remove(ref(database, `payout/${key}`));
    return true;
  }
  return false;
}

// Pipeline
export async function getPipeline() {
  const snapshot = await get(ref(database, 'pipeline'));
  if (!snapshot.exists()) return [];
  return Object.values(snapshot.val());
}
export async function addPipeline(item: any) {
  const newRef = push(ref(database, 'pipeline'));
  const id = newRef.key;
  await set(newRef, { ...item, id });
  return { ...item, id };
}
export async function updatePipeline(id: string, updates: any) {
  const snapshot = await get(ref(database, 'pipeline'));
  if (!snapshot.exists()) return null;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await update(ref(database, `pipeline/${key}`), updates);
    return { ...data[key], ...updates };
  }
  return null;
}
export async function deletePipeline(id: string) {
  const snapshot = await get(ref(database, 'pipeline'));
  if (!snapshot.exists()) return false;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await remove(ref(database, `pipeline/${key}`));
    return true;
  }
  return false;
}

// Projects
export async function getProjects() {
  const snapshot = await get(ref(database, 'projects'));
  if (!snapshot.exists()) return [];
  return Object.values(snapshot.val());
}
export async function addProjects(item: any) {
  const newRef = push(ref(database, 'projects'));
  const id = newRef.key;
  await set(newRef, { ...item, id });
  return { ...item, id };
}
export async function updateProjects(id: string, updates: any) {
  const snapshot = await get(ref(database, 'projects'));
  if (!snapshot.exists()) return null;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await update(ref(database, `projects/${key}`), updates);
    return { ...data[key], ...updates };
  }
  return null;
}
export async function deleteProjects(id: string) {
  const snapshot = await get(ref(database, 'projects'));
  if (!snapshot.exists()) return false;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await remove(ref(database, `projects/${key}`));
    return true;
  }
  return false;
}

// Proposals
export async function getProposals() {
  const snapshot = await get(ref(database, 'proposals'));
  if (!snapshot.exists()) return [];
  return Object.values(snapshot.val());
}
export async function addProposals(item: any) {
  const newRef = push(ref(database, 'proposals'));
  const id = newRef.key;
  await set(newRef, { ...item, id });
  return { ...item, id };
}
export async function updateProposals(id: string, updates: any) {
  const snapshot = await get(ref(database, 'proposals'));
  if (!snapshot.exists()) return null;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await update(ref(database, `proposals/${key}`), updates);
    return { ...data[key], ...updates };
  }
  return null;
}
export async function deleteProposals(id: string) {
  const snapshot = await get(ref(database, 'proposals'));
  if (!snapshot.exists()) return false;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await remove(ref(database, `proposals/${key}`));
    return true;
  }
  return false;
}

// Reports
export async function getReports() {
  const snapshot = await get(ref(database, 'reports'));
  if (!snapshot.exists()) return [];
  return Object.values(snapshot.val());
}
export async function addReports(item: any) {
  const newRef = push(ref(database, 'reports'));
  const id = newRef.key;
  await set(newRef, { ...item, id });
  return { ...item, id };
}
export async function updateReports(id: string, updates: any) {
  const snapshot = await get(ref(database, 'reports'));
  if (!snapshot.exists()) return null;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await update(ref(database, `reports/${key}`), updates);
    return { ...data[key], ...updates };
  }
  return null;
}
export async function deleteReports(id: string) {
  const snapshot = await get(ref(database, 'reports'));
  if (!snapshot.exists()) return false;
  const data = snapshot.val();
  const key = Object.keys(data).find(k => data[k].id === id);
  if (key) {
    await remove(ref(database, `reports/${key}`));
    return true;
  }
  return false;
}
