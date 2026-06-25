import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = readDB();
  const creativeIdx = db.creatives.findIndex((c: any) => c.id === parseInt(id));
  if (creativeIdx === -1) return NextResponse.json({ error: 'Creative not found' }, { status: 404 });

  const { line_item_id } = await request.json();
  const creative = db.creatives[creativeIdx];

  if (!creative.line_item_ids) creative.line_item_ids = [];
  if (!creative.line_item_ids.includes(line_item_id)) {
    creative.line_item_ids.push(line_item_id);
  }

  db.creatives[creativeIdx] = creative;
  writeDB(db);

  return NextResponse.json({
    creative_id: parseInt(id),
    line_item_id,
    message: `Creative ${id} associated with line item ${line_item_id}`
  });
}
