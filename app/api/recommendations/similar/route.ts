import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getSimilarProducts } from '@/lib/ai';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Get product details
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) throw error;

    const similarProducts = await getSimilarProducts(product);

    return NextResponse.json({ products: similarProducts });
  } catch (error) {
    console.error('Error getting similar products:', error);
    return NextResponse.json(
      { error: 'Failed to get similar products' },
      { status: 500 }
    );
  }
}