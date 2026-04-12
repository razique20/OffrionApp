import crypto from 'crypto';
import PartnerWebhook from '@/models/PartnerWebhook';

/**
 * Dispatches a signed webhook to a partner's configured endpoint.
 */
export async function dispatchWebhook(
  partnerId: string, 
  event: 'deal.redeemed' | 'commission.earned' | 'payout.processed', 
  payload: any
) {
  try {
    // 1. Find active webhooks for the partner that listens for this event in the correct environment.
    const webhooks = await PartnerWebhook.find({ 
      partnerId, 
      isActive: true,
      enabledEvents: event
    });

    if (!webhooks || webhooks.length === 0) {
      console.log(`[Webhook] No active subscription found for partner ${partnerId} on event ${event}`);
      return;
    }

    // 2. Prepare payload with metadata
    const fullPayload = {
      event,
      timestamp: new Date().toISOString(),
      data: payload
    };

    const body = JSON.stringify(fullPayload);

    // 3. Dispatch to all matching endpoints
    const dispatchPromises = webhooks.map(async (webhook) => {
      // Create HMAC Signature
      const signature = crypto
        .createHmac('sha256', webhook.secret)
        .update(body)
        .digest('hex');

      console.log(`[Webhook] Dispatching ${event} to ${webhook.url}...`);
      
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Offrion-Signature': signature,
          'User-Agent': 'Offrion-Webhook-Dispatcher/1.0'
        },
        body
      });

      if (!response.ok) {
        throw new Error(`Webhook responded with status: ${response.status}`);
      }

      console.log(`[Webhook] Successfully delivered ${event} to ${webhook.url}`);
    });

    await Promise.all(dispatchPromises);
    return true;

  } catch (err: any) {
    console.error(`[Webhook ERROR] Delivery failed for partner ${partnerId}:`, err.message);
    // In a production system, we would log this to a WebhookAttempt model and retry
    return false;
  }
}
