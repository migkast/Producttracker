import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { predictPriceDrop } from '@/lib/ai';

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

    const prediction = await predictPriceDrop(productId);

    return NextResponse.json(prediction);
  } catch (error) {
    console.error('Error getting price prediction:', error);
    return NextResponse.json(
      { error: 'Failed to get price prediction' },
      { status: 500 }
    );
  }
}