import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = readDB();
  const creative = db.creatives.find((c: any) => c.id === parseInt(id));
  if (!creative) return NextResponse.json({ error: 'Creative not found' }, { status: 404 });
  return NextResponse.json(creative);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = readDB();
  const idx = db.creatives.findIndex((c: any) => c.id === parseInt(id));
  if (idx === -1) return NextResponse.json({ error: 'Creative not found' }, { status: 404 });
  const body = await request.json();
  db.creatives[idx] = { ...db.creatives[idx], ...body };
  writeDB(db);
  return NextResponse.json({ ...db.creatives[idx], message: `Creative ${id} updated successfully` });
}
