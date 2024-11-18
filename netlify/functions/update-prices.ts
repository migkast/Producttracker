import { Handler } from '@netlify/functions';
import { updateProductPrices } from '../../lib/server/scraper';

const handler: Handler = async (event) => {
  try {
    // Verify the request is authorized
    const authHeader = event.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    await updateProductPrices();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Error in price update function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update prices' }),
    };
  }
}

export { handler };