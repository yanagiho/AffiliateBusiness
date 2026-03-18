import { NextResponse } from 'next/server';
import { query } from '@affiliate/shared';

export async function GET() {
  try {
    const accounts = await query.all('SELECT id, platform, account_name FROM sns_accounts WHERE is_active ORDER BY platform, account_name');
    return NextResponse.json(accounts);
  } catch (error) {
    console.error('Error fetching SNS accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SNS accounts' },
      { status: 500 }
    );
  }
}