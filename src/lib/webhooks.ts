import crypto from 'crypto';
import PartnerWebhook from '@/models/PartnerWebhook';

/**
 * Dispatches a signed webhook to a partner's configured endpoint.
 */
export async function dispatchWebhook(
  partnerId: string, 
  event: 'deal.redeemed' | 'commission.earned' | 'payout.processed', 
  payload: any,
  environment: 'production' | 'sandbox' = 'production'
) {
  try {
    // 1. Find active webhook for the partner and environment
    const webhook = await PartnerWebhook.findOne({ 
      partnerId, 
      environment,
      isActive: true,
      enabledEvents: event
    });

    if (!webhook) {
      console.log(`[Webhook] No active subscription found for partner ${partnerId} on event ${event} in ${environment}`);
      return;
    }

    // 2. Prepare payload with metadata
    const fullPayload = {
      event,
      timestamp: new Date().toISOString(),
      environment,
      data: payload
    };

    const body = JSON.stringify(fullPayload);

    // 3. Create HMAC Signature
    const signature = crypto
      .createHmac('sha256', webhook.secret)
      .update(body)
      .digest('hex');

    // 4. Dispatch the request
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
    return true;

  } catch (err: any) {
    console.error(`[Webhook ERROR] Delivery failed for partner ${partnerId}:`, err.message);
    // In a production system, we would log this to a WebhookAttempt model and retry
    return false;
  }
}
