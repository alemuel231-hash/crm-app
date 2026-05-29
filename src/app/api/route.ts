import { NextResponse } from 'next/server';

export const metadata = {
  title: 'CRM API',
  description: 'Orbit CRM API endpoints',
};

export async function GET() {
  return NextResponse.json({
    message: 'Orbit CRM API',
    version: '1.0.0',
    endpoints: {
      contacts: '/api/contacts',
      deals: '/api/deals',
      leads: '/api/leads',
      activities: '/api/activities',
      companies: '/api/companies',
      proposals: '/api/proposals',
      projects: '/api/projects',
    },
  });
}
