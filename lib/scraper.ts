import puppeteer from 'puppeteer-core';
import { supabase } from './supabase';
import { Product } from '@/types';

interface ScrapedPrice {
  price: number;
  retailer: string;
  url: string;
}

export async function scrapeProductPrice(url: string): Promise<ScrapedPrice | null> {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: process.env.CHROME_BIN || undefined,
    headless: true,
  });
  
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Common price selectors for different retailers
    const priceSelectors = [
      '.price',
      '[data-test="product-price"]',
      '.product-price',
      '[itemprop="price"]',
      '.a-price-whole',  // Amazon
      '.price-characteristic',  // Best Buy
    ];

    let price: number | null = null;
    for (const selector of priceSelectors) {
      const priceElement = await page.$(selector);
      if (priceElement) {
        const priceText = await priceElement.evaluate(el => el.textContent);
        if (priceText) {
          price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
          break;
        }
      }
    }

    if (!price) {
      return null;
    }

    // Extract retailer from URL
    const retailer = new URL(url).hostname.replace('www.', '').split('.')[0];

    return {
      price,
      retailer,
      url,
    };
  } catch (error) {
    console.error('Error scraping price:', error);
    return null;
  } finally {
    await browser.close();
  }
}

export async function updateProductPrices() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*');

    if (error) throw error;

    for (const product of products as Product[]) {
      const scrapedPrice = await scrapeProductPrice(product.url);
      
      if (scrapedPrice) {
        // Update product price
        const { error: updateError } = await supabase
          .from('products')
          .update({
            current_price: scrapedPrice.price,
            lowest_price: Math.min(product.lowest_price, scrapedPrice.price),
            highest_price: Math.max(product.highest_price, scrapedPrice.price),
            updated_at: new Date().toISOString(),
          })
          .eq('id', product.id);

        if (updateError) throw updateError;

        // Add price history record
        const { error: historyError } = await supabase
          .from('price_history')
          .insert({
            product_id: product.id,
            price: scrapedPrice.price,
            retailer: scrapedPrice.retailer,
          });

        if (historyError) throw historyError;

        // Check for price alerts
        const { data: alerts, error: alertsError } = await supabase
          .from('user_products')
          .select('*')
          .eq('product_id', product.id)
          .eq('notify_on_price_drop', true)
          .lt('target_price', scrapedPrice.price);

        if (alertsError) throw alertsError;

        // Send notifications to users
        for (const alert of alerts || []) {
          await fetch('/.netlify/functions/send-notification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: alert.user_id,
              productId: product.id,
              message: `Price alert: ${product.name} is now $${scrapedPrice.price}`,
            }),
          });
        }
      }
    }
  } catch (error) {
    console.error('Error updating product prices:', error);
    throw error;
  }
}
