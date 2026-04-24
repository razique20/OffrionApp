import dbConnect from '../src/lib/mongodb';
import WebhookLog from '../src/models/WebhookLog';
import PartnerWebhook from '../src/models/PartnerWebhook';
import crypto from 'crypto';

const MAX_RETRIES = 5;

/**
 * Worker script to retry failed webhooks.
 * This can be run via a Cron job every 5-15 minutes.
 */
async function processRetries() {
  console.log('--- Starting Webhook Retry Worker ---');
  await dbConnect();

  // Find failed logs that haven't reached max retries
  const failedLogs = await WebhookLog.find({
    status: 'failed',
    retryCount: { $lt: MAX_RETRIES }
  });

  console.log(`Found ${failedLogs.length} failed logs to retry...`);

  const retryPromises = failedLogs.map(async (log) => {
    try {
      // Fetch the webhook configuration again (in case it was updated or deactivated)
      const webhook = await PartnerWebhook.findById(log.webhookId);
      
      if (!webhook || !webhook.isActive) {
        console.log(`[Retry] Webhook ${log.webhookId} is no longer active. Skipping.`);
        return;
      }

      const body = JSON.stringify(log.payload);
      
      // Re-sign (secret might have changed)
      const signature = crypto
        .createHmac('sha256', webhook.secret)
        .update(body)
        .digest('hex');

      console.log(`[Retry] Attempt ${log.retryCount + 1} for log ${log._id} to ${log.url}...`);

      const response = await fetch(log.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Offrion-Signature': signature,
          'User-Agent': 'Offrion-Webhook-RetryWorker/1.0'
        },
        body
      });

      if (response.ok) {
        await WebhookLog.findByIdAndUpdate(log._id, {
          status: 'success',
          responseCode: response.status,
          lastAttemptAt: new Date()
        });
        console.log(`[Retry] Successfully delivered log ${log._id}`);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (err: any) {
      await WebhookLog.findByIdAndUpdate(log._id, {
        errorMessage: err.message,
        lastAttemptAt: new Date(),
        $inc: { retryCount: 1 }
      });
      console.error(`[Retry] Failed attempt ${log.retryCount + 1} for log ${log._id}:`, err.message);
    }
  });

  await Promise.all(retryPromises);
  console.log('--- Webhook Retry Worker Finished ---');
  process.exit(0);
}

processRetries().catch((err) => {
  console.error('Fatal Worker Error:', err);
  process.exit(1);
});
