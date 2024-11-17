import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature')!;

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    try {
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription;
          const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
          
          if (customer.deleted) {
            throw new Error('Customer has been deleted');
          }

          await supabase
            .from('profiles')
            .update({
              is_premium: true,
              subscription_id: subscription.id,
              subscription_status: subscription.status,
            })
            .eq('id', customer.metadata.supabase_user_id);
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
          
          if (customer.deleted) {
            throw new Error('Customer has been deleted');
          }

          await supabase
            .from('profiles')
            .update({
              is_premium: false,
              subscription_id: null,
              subscription_status: 'canceled',
            })
            .eq('id', customer.metadata.supabase_user_id);
          break;
        }
      }

      return NextResponse.json({ received: true });
    } catch (error) {
      console.error('Error handling webhook event:', error);
      return NextResponse.json(
        { error: 'Webhook handler failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }
}