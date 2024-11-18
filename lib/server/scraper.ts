import axios from 'axios';
import * as cheerio from 'cheerio';
import { supabase } from '../supabase';
import { Product } from '@/types';

interface ScrapedPrice {
  price: number;
  retailer: string;
  url: string;
}

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

export async function scrapeProductPrice(url: string): Promise<ScrapedPrice | null> {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': USER_AGENT,
      },
    });

    const $ = cheerio.load(html);
    
    // Common price selectors for different retailers
    const priceSelectors = [
      '.price',
      '[data-test="product-price"]',
      '.product-price',
      '[itemprop="price"]',
      '.a-price-whole',
      '.price-characteristic',
      // Add more selectors as needed for different retailers
    ];

    let price: number | null = null;
    
    // Try each selector until we find a price
    for (const selector of priceSelectors) {
      const priceText = $(selector).first().text().trim();
      if (priceText) {
        // Extract numbers from the price text
        const matches = priceText.match(/[\d,.]+/);
        if (matches) {
          // Convert price string to number, handling different formats
          price = parseFloat(matches[0].replace(/[,.]/g, '')) / 100;
          break;
        }
      }
    }

    if (!price) {
      // Try finding any element with a currency symbol
      const currencyRegex = /[\$\£\€]?\s*\d+([.,]\d{2})?/;
      $('*').each((_, element) => {
        const text = $(element).text().trim();
        const match = text.match(currencyRegex);
        if (match) {
          price = parseFloat(match[0].replace(/[^\d.]/g, ''));
          return false; // Break the loop
        }
      });
    }

    if (!price) {
      return null;
    }

    const retailer = new URL(url).hostname.replace('www.', '').split('.')[0];

    return {
      price,
      retailer,
      url,
    };
  } catch (error) {
    console.error('Error scraping price:', error);
    return null;
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

        // Send notifications for price drops
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
