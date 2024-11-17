import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy');

    const supabase = createRouteHandlerClient({ cookies });

    let queryBuilder = supabase
      .from('products')
      .select('*');

    // Apply search filters
    if (query) {
      queryBuilder = queryBuilder.ilike('name', `%${query}%`);
    }

    if (category && category !== 'all') {
      queryBuilder = queryBuilder.eq('category', category);
    }

    if (minPrice) {
      queryBuilder = queryBuilder.gte('current_price', parseFloat(minPrice));
    }

    if (maxPrice) {
      queryBuilder = queryBuilder.lte('current_price', parseFloat(maxPrice));
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        queryBuilder = queryBuilder.order('current_price', { ascending: true });
        break;
      case 'price_desc':
        queryBuilder = queryBuilder.order('current_price', { ascending: false });
        break;
      case 'name':
        queryBuilder = queryBuilder.order('name');
        break;
      default:
        queryBuilder = queryBuilder.order('created_at', { ascending: false });
    }

    const { data, error } = await queryBuilder;

    if (error) throw error;

    return NextResponse.json({ products: data });
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}