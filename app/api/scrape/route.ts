import { NextResponse } from 'next/server';
import { scrapeProductPrice } from '@/lib/server/scraper';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const priceData = await scrapeProductPrice(url);
    
    if (!priceData) {
      return NextResponse.json(
        { error: 'Failed to scrape price data' },
        { status: 404 }
      );
    }

    return NextResponse.json(priceData);
  } catch (error) {
    console.error('Error scraping product:', error);
    return NextResponse.json(
      { error: 'Failed to scrape product' },
      { status: 500 }
    );
  }
}