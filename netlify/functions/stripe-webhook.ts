import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const handler: Handler = async (event) => {
  const signature = event.headers['stripe-signature']!;

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body!,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (stripeEvent.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
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
        const subscription = stripeEvent.data.object as Stripe.Subscription;
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

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };
  } catch (error) {
    console.error('Error handling webhook:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Webhook error' })
    };
  }
};