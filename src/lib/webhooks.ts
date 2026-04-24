import crypto from 'crypto';
import PartnerWebhook from '@/models/PartnerWebhook';
import WebhookLog from '@/models/WebhookLog';

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

      // Create initial log entry
      const log = await WebhookLog.create({
        partnerId,
        webhookId: webhook._id,
        event,
        url: webhook.url,
        payload: fullPayload,
        status: 'pending'
      });

      try {
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

        // Update log on success
        await WebhookLog.findByIdAndUpdate(log._id, {
          status: 'success',
          responseCode: response.status,
          lastAttemptAt: new Date()
        });

        console.log(`[Webhook] Successfully delivered ${event} to ${webhook.url}`);
      } catch (err: any) {
        // Update log on failure
        await WebhookLog.findByIdAndUpdate(log._id, {
          status: 'failed',
          errorMessage: err.message,
          lastAttemptAt: new Date(),
          $inc: { retryCount: 1 }
        });
        console.error(`[Webhook ERROR] Delivery failed for ${webhook.url}:`, err.message);
      }
    });

    await Promise.all(dispatchPromises);
    return true;

  } catch (err: any) {
    console.error(`[Webhook SYSTEM ERROR] Partner ${partnerId}:`, err.message);
    return false;
  }
}
