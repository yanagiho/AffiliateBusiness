import { NextRequest, NextResponse } from 'next/server';
import { query } from '@affiliate/shared';

export async function GET() {
  try {
    const offers = await query.all('SELECT * FROM offers ORDER BY name');
    return NextResponse.json(offers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch offers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, url, description } = body;

    if (!id || !name || !url) {
      return NextResponse.json(
        { error: 'id, name, url は必須です' },
        { status: 400 }
      );
    }

    await query.run(
      'INSERT INTO offers (id, name, url, description) VALUES (?, ?, ?, ?)',
      [id, name, url, description || null]
    );

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('Error creating offer:', error);
    if (error?.message?.includes('UNIQUE') || error?.code === '23505') {
      return NextResponse.json({ error: 'そのIDはすでに使用されています' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }
    await query.run('DELETE FROM offers WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting offer:', error);
    return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 });
  }
}