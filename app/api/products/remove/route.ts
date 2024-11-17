import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { productId } = await request.json();

    // Get user session
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Remove user-product relationship
    const { error: userProductError } = await supabase
      .from('user_products')
      .delete()
      .eq('user_id', session.user.id)
      .eq('product_id', productId);

    if (userProductError) throw userProductError;

    // Check if any other users are tracking this product
    const { count } = await supabase
      .from('user_products')
      .select('*', { count: 'exact' })
      .eq('product_id', productId);

    // If no other users are tracking the product, remove it from the database
    if (count === 0) {
      const { error: productError } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (productError) throw productError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing product:', error);
    return NextResponse.json(
      { error: 'Failed to remove product' },
      { status: 500 }
    );
  }
}