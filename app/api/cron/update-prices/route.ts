import { NextResponse } from 'next/server';
import { updateProductPrices } from '@/lib/scraper';
import { headers } from 'next/headers';

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
  try {
    // Skip environment validation during build time
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ status: 'config-pending' });
    }

    const headersList = headers();
    const authHeader = headersList.get('authorization');

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