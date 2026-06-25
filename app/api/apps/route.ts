import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, nextId } from '@/lib/db';

export async function GET(request: NextRequest) {
  const db = readDB();
  const status = request.nextUrl.searchParams.get('status');
  const category = request.nextUrl.searchParams.get('category');
  const platform = request.nextUrl.searchParams.get('platform');
  const search = request.nextUrl.searchParams.get('search')?.toLowerCase();

  let apps = (db.apps || []) as any[];
  if (status) apps = apps.filter((a: any) => a.status === status);
  if (category) apps = apps.filter((a: any) => a.category === category);
  if (platform) apps = apps.filter((a: any) => a.platform === platform || a.platform === 'Both');
  if (search) apps = apps.filter((a: any) => a.name.toLowerCase().includes(search));

  return NextResponse.json({ apps, total: apps.length });
}

export async function POST(request: NextRequest) {
  const db = readDB();
  const body = await request.json();
  if (!db.apps) db.apps = [];
  const newApp = {
    id: String(nextId(db)),
    ...body,
    downloads: 0,
    activeUsers: 0,
    revenue: 0,
    adRevenue: 0,
    subscriptions: 0,
    rating: 0,
    status: 'Active',
    lastUpdated: 'Just now',
    healthScore: 100,
    created_at: new Date().toISOString(),
  };
  db.apps.push(newApp);
  writeDB(db);
  return NextResponse.json(newApp, { status: 201 });
}
