import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET(request: NextRequest) {
  const db = readDB();
  const type = request.nextUrl.searchParams.get('type');
  let alerts = (db.alerts || []) as any[];
  if (type) alerts = alerts.filter((a: any) => a.type === type);
  return NextResponse.json({ alerts, total: alerts.length });
}

export async function DELETE(request: NextRequest) {
  const db = readDB();
  const { id } = await request.json();
  db.alerts = (db.alerts || []).filter((a: any) => a.id !== id);
  writeDB(db);
  return NextResponse.json({ success: true });
}
