// CRM Data Types
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'Prospect' | 'Customer' | 'Lead';
  lastInteraction: Date;
  createdAt: Date;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: 'Qualification' | 'Proposal Sent' | 'Negotiation' | 'Won' | 'Lost';
  probability: number;
  closeDate: Date;
  ownerId: string;
  companyId: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Customer' | 'Lost';
  source: string;
  createdAt: Date;
}

export interface Activity {
  id: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Task' | 'Note';
  title: string;
  description?: string;
  date: Date;
  contactId?: string;
  dealId?: string;
  ownerId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'Admin' | 'Manager' | 'Sales' | 'Viewer';
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: 'Startup' | 'Small' | 'Mid-Market' | 'Enterprise';
  location: string;
  website?: string;
  employees?: number;
  createdAt: Date;
}
