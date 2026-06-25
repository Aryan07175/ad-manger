import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = readDB();
  const adv = db.advertisers.find((a: any) => a.id === parseInt(id));
  if (!adv) return NextResponse.json({ error: 'Advertiser not found' }, { status: 404 });
  return NextResponse.json(adv);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = readDB();
  const idx = db.advertisers.findIndex((a: any) => a.id === parseInt(id));
  if (idx === -1) return NextResponse.json({ error: 'Advertiser not found' }, { status: 404 });
  const body = await request.json();
  db.advertisers[idx] = { ...db.advertisers[idx], ...body };
  writeDB(db);
  return NextResponse.json(db.advertisers[idx]);
}
