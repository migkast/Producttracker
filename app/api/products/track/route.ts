import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { scrapeProductPrice } from '@/lib/scraper';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { url, name, category } = await request.json();

    // Get user session
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Scrape initial price
    const scrapedPrice = await scrapeProductPrice(url);
    if (!scrapedPrice) {
      return NextResponse.json(
        { error: 'Failed to fetch product price' },
        { status: 400 }
      );
    }

    // Add product to database
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        name,
        url,
        category,
        current_price: scrapedPrice.price,
        lowest_price: scrapedPrice.price,
        highest_price: scrapedPrice.price,
      })
      .select()
      .single();

    if (productError) throw productError;

    // Add user-product relationship
    const { error: userProductError } = await supabase
      .from('user_products')
      .insert({
        user_id: session.user.id,
        product_id: product.id,
        target_price: scrapedPrice.price * 0.9, // Default target price 10% below current
        notify_on_price_drop: true,
      });

    if (userProductError) throw userProductError;

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error tracking product:', error);
    return NextResponse.json(
      { error: 'Failed to track product' },
      { status: 500 }
    );
  }
}