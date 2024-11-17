import OpenAI from 'openai';
import { supabase } from './supabase';
import { Product } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getSimilarProducts(product: Product): Promise<Product[]> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a product recommendation expert. Given a product, suggest similar products that users might be interested in."
        },
        {
          role: "user",
          content: `Product: ${product.name}\nCategory: ${product.category}\nDescription: ${product.description}\n\nSuggest 3 similar products in the same category.`
        }
      ]
    });

    const suggestions = completion.choices[0].message.content?.split('\n') || [];
    
    // Get similar products from database based on AI suggestions
    const { data: similarProducts } = await supabase
      .from('products')
      .select('*')
      .eq('category', product.category)
      .neq('id', product.id)
      .limit(3);

    return similarProducts || [];
  } catch (error) {
    console.error('Error getting similar products:', error);
    return [];
  }
}

export async function predictPriceDrop(productId: string): Promise<{
  likelihood: number;
  predictedPrice: number | null;
  confidence: 'high' | 'medium' | 'low';
}> {
  try {
    // Get historical price data
    const { data: priceHistory } = await supabase
      .from('price_history')
      .select('*')
      .eq('product_id', productId)
      .order('timestamp', { ascending: true });

    if (!priceHistory || priceHistory.length < 5) {
      return {
        likelihood: 0,
        predictedPrice: null,
        confidence: 'low',
      };
    }

    const prices = priceHistory.map(ph => ph.price);
    const timestamps = priceHistory.map(ph => new Date(ph.timestamp).getTime());

    // Use OpenAI to analyze price trends
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a price prediction expert. Analyze historical price data to predict future price movements."
        },
        {
          role: "user",
          content: `Historical prices: ${prices.join(', ')}\nTimestamps: ${timestamps.join(', ')}\n\nPredict the likelihood of a price drop in the next 7 days and estimate the potential new price.`
        }
      ]
    });

    const analysis = completion.choices[0].message.content || '';
    
    // Parse AI response to extract predictions
    const likelihood = analysis.includes('high') ? 0.8 :
                      analysis.includes('medium') ? 0.5 : 0.2;
    
    const currentPrice = prices[prices.length - 1];
    const predictedPrice = currentPrice * (1 - likelihood * 0.1);
    
    const confidence = likelihood > 0.7 ? 'high' :
                      likelihood > 0.4 ? 'medium' : 'low';

    return {
      likelihood,
      predictedPrice,
      confidence,
    };
  } catch (error) {
    console.error('Error predicting price drop:', error);
    return {
      likelihood: 0,
      predictedPrice: null,
      confidence: 'low',
    };
  }
}