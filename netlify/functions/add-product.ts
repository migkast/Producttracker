import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { scrapeProductPrice } from '../../lib/scraper';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { url, name, category } = JSON.parse(event.body || '{}');

    // Get user session from Supabase auth header
    const authHeader = event.headers.authorization;
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader?.replace('Bearer ', '')
    );

    if (authError || !user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }

    // Check if user has reached their product limit
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_premium')
      .eq('id', user.id)
      .single();

    const { count } = await supabase
      .from('user_products')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id);

    if (!profile?.is_premium && count >= 5) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          error: 'Free users can only track up to 5 products. Upgrade to Premium for unlimited tracking.'
        })
      };
    }

    // Scrape initial price
    const scrapedPrice = await scrapeProductPrice(url);
    if (!scrapedPrice) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Failed to fetch product price' })
      };
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
    await supabase
      .from('user_products')
      .insert({
        user_id: user.id,
        product_id: product.id,
        target_price: scrapedPrice.price * 0.9,
        notify_on_price_drop: true,
      });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, product })
    };
  } catch (error) {
    console.error('Error adding product:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to add product' })
    };
  }
};