import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { userId, productId, message } = JSON.parse(event.body || '{}');

    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        product_id: productId,
        message,
        read: false,
      });

    // TODO: Implement email notifications using a service like SendGrid
    // This would be a good place to add that functionality

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Error sending notification:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send notification' })
    };
  }
};