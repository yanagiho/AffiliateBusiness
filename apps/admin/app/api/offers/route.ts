import { NextResponse } from 'next/server';
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