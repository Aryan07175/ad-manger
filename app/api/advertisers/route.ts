import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, nextId } from '@/lib/db';

export async function GET(request: NextRequest) {
  const db = readDB();
  const search = request.nextUrl.searchParams.get('search')?.toLowerCase();
  let advertisers = db.advertisers;
  if (search) {
    advertisers = advertisers.filter((a: any) => a.name.toLowerCase().includes(search));
  }
  return NextResponse.json({ advertisers, total: advertisers.length });
}

export async function POST(request: NextRequest) {
  const db = readDB();
  const body = await request.json();
  const newAdv = { id: nextId(db), ...body, created_at: new Date().toISOString() };
  db.advertisers.push(newAdv);
  writeDB(db);
  return NextResponse.json(newAdv, { status: 201 });
}
