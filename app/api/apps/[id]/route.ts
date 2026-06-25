import { NextRequest, NextResponse } from 'next/server';
import { readDB } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = readDB();
  const app = (db.apps || []).find((a: any) => a.id === id);
  if (!app) return NextResponse.json({ error: 'App not found' }, { status: 404 });
  return NextResponse.json(app);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = readDB();
  const idx = (db.apps || []).findIndex((a: any) => a.id === id);
  if (idx === -1) return NextResponse.json({ error: 'App not found' }, { status: 404 });
  const body = await request.json();
  db.apps[idx] = { ...db.apps[idx], ...body, lastUpdated: 'Just now' };
  const { writeDB } = await import('@/lib/db');
  writeDB(db);
  return NextResponse.json(db.apps[idx]);
}
