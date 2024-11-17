import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeletion(deletedSubscription);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customer = await stripe.customers.retrieve(subscription.customer as string);
  const userId = customer.metadata.supabase_user_id;

  await supabase
    .from('profiles')
    .update({
      is_premium: true,
      subscription_id: subscription.id,
      subscription_status: subscription.status,
    })
    .eq('id', userId);
}

async function handleSubscriptionDeletion(subscription: Stripe.Subscription) {
  const customer = await stripe.customers.retrieve(subscription.customer as string);
  const userId = customer.metadata.supabase_user_id;

  await supabase
    .from('profiles')
    .update({
      is_premium: false,
      subscription_id: null,
      subscription_status: 'canceled',
    })
    .eq('id', userId);
}