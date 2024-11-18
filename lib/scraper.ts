import axios from 'axios';
import * as cheerio from 'cheerio';
import { supabase } from './supabase';
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
      timeout: 10000,
    });

    const $ = cheerio.load(html);
    
    const priceSelectors = [
      '.price',
      '[data-test="product-price"]',
      '.product-price',
      '[itemprop="price"]',
      '.a-price-whole',
      '.price-characteristic',
      '[data-automation="product-price"]',
      '.product__price',
      '.price-box',
      '.current-price',
    ];

    let price: number | null = null;
    
    for (const selector of priceSelectors) {
      const priceText = $(selector).first().text().trim();
      if (priceText) {
        const matches = priceText.match(/[\d,.]+/);
        if (matches) {
          const cleanPrice = matches[0].replace(/[^\d.]/g, '');
          price = parseFloat(cleanPrice);
          if (!isNaN(price)) {
            break;
          }
        }
      }
    }

    if (!price) {
      const currencyRegex = /[\$\£\€]?\s*\d+([.,]\d{2})?/;
      $('*').each((_, element) => {
        const text = $(element).text().trim();
        const match = text.match(currencyRegex);
        if (match) {
          const cleanPrice = match[0].replace(/[^\d.]/g, '');
          price = parseFloat(cleanPrice);
          if (!isNaN(price)) {
            return false;
          }
        }
      });
    }

    if (!price || isNaN(price)) {
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

    const results = await Promise.allSettled(
      (products as Product[]).map(async (product) => {
        try {
          const scrapedPrice = await scrapeProductPrice(product.url);
          
          if (scrapedPrice) {
            await supabase
              .from('products')
              .update({
                current_price: scrapedPrice.price,
                lowest_price: Math.min(product.lowest_price, scrapedPrice.price),
                highest_price: Math.max(product.highest_price, scrapedPrice.price),
                updated_at: new Date().toISOString(),
              })
              .eq('id', product.id);

            await supabase
              .from('price_history')
              .insert({
                product_id: product.id,
                price: scrapedPrice.price,
                retailer: scrapedPrice.retailer,
              });

            const { data: alerts } = await supabase
              .from('user_products')
              .select('*')
              .eq('product_id', product.id)
              .eq('notify_on_price_drop', true)
              .lt('target_price', scrapedPrice.price);

            if (alerts && alerts.length > 0) {
              await Promise.all(
                alerts.map((alert) =>
                  fetch('/.netlify/functions/send-notification', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      userId: alert.user_id,
                      productId: product.id,
                      message: `Price alert: ${product.name} is now $${scrapedPrice.price}`,
                    }),
                  })
                )
              );
            }
          }
        } catch (error) {
          console.error(`Error updating product ${product.id}:`, error);
        }
      })
    );

    const failures = results.filter((result) => result.status === 'rejected');
    if (failures.length > 0) {
      console.error(`Failed to update ${failures.length} products`);
    }

  } catch (error) {
    console.error('Error updating product prices:', error);
    throw error;
  }
}
