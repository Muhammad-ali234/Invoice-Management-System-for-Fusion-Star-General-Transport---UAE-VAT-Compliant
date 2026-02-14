import cron from 'node-cron';
import { processRecurringBilling } from '../services/recurringBilling.js';

/**
 * Recurring Billing Cron Job
 * Runs daily at 9:00 AM to generate invoices from active contracts
 */

let cronJob = null;

/**
 * Start the recurring billing cron job
 */
export function startRecurringBillingCron() {
  // Run every day at 9:00 AM
  // Cron format: minute hour day month weekday
  // '0 9 * * *' = At 9:00 AM every day
  
  cronJob = cron.schedule('0 9 * * *', async () => {
    console.log('\n⏰ Cron job triggered: Recurring Billing');
    console.log(`🕐 Time: ${new Date().toLocaleString()}`);
    
    try {
      await processRecurringBilling();
      console.log('✅ Recurring billing cron job completed successfully\n');
    } catch (error) {
      console.error('❌ Recurring billing cron job failed:', error);
    }
  }, {
    scheduled: true,
    timezone: 'Asia/Dubai', // UAE timezone
  });
  
  console.log('✅ Recurring billing cron job started (runs daily at 9:00 AM UAE time)');
  
  return cronJob;
}

/**
 * Stop the recurring billing cron job
 */
export function stopRecurringBillingCron() {
  if (cronJob) {
    cronJob.stop();
    console.log('🛑 Recurring billing cron job stopped');
  }
}

/**
 * Get cron job status
 */
export function getCronJobStatus() {
  return {
    running: cronJob ? true : false,
    schedule: '0 9 * * * (Daily at 9:00 AM UAE time)',
    timezone: 'Asia/Dubai',
  };
}

export default {
  startRecurringBillingCron,
  stopRecurringBillingCron,
  getCronJobStatus,
};
