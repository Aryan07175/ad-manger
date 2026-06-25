import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, nextId } from '@/lib/db';

export async function GET(request: NextRequest) {
  const db = readDB();
  const advertiser_id = request.nextUrl.searchParams.get('advertiser_id');
  const line_item_id = request.nextUrl.searchParams.get('line_item_id');
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '100');

  let creatives = db.creatives as any[];
  if (advertiser_id) creatives = creatives.filter((c: any) => c.advertiser_id === parseInt(advertiser_id));
  if (line_item_id) creatives = creatives.filter((c: any) => c.line_item_ids?.includes(parseInt(line_item_id)));
  creatives = creatives.slice(0, limit);

  return NextResponse.json({ creatives, total: creatives.length });
}

export async function POST(request: NextRequest) {
  const db = readDB();
  const body = await request.json();
  const newCreative = { id: nextId(db), ...body, created_at: new Date().toISOString() };
  if (!newCreative.line_item_ids) newCreative.line_item_ids = [];
  db.creatives.push(newCreative);
  writeDB(db);
  return NextResponse.json({ ...newCreative, message: `Creative '${newCreative.name}' created successfully` }, { status: 201 });
}
