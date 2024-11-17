import { NextResponse } from 'next/server';
import { updateProductPrices } from '@/lib/scraper';
import { headers } from 'next/headers';

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
  try {
    const headersList = headers();
    const authHeader = headersList.get('authorization');

    // Verify the request is authorized
    if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await updateProductPrices();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in price update cron:', error);
    return NextResponse.json(
      { error: 'Failed to update prices' },
      { status: 500 }
    );
  }
}