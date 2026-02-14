# 🔄 Recurring Billing System

## Overview

The Recurring Billing System automatically generates invoices from active contracts on their designated billing day each month. This eliminates manual invoice creation and ensures consistent, timely billing.

---

## How It Works

### 1. Contract Setup
- Each contract has a `billing_day` (1-28) that specifies when to generate the monthly invoice
- Only `active` contracts with valid date ranges are processed
- Contracts must have `start_date <= today` and `end_date >= today`

### 2. Automatic Processing
- A cron job runs **daily at 9:00 AM UAE time**
- Checks all active contracts where `billing_day` matches today's date
- Generates invoices automatically for matching contracts
- Skips contracts that already have an invoice for the current month

### 3. Invoice Generation
- Invoice number: Auto-generated in format `INV-YYYY-MM-XXXX`
- Line items: Includes truck and driver details from contract
- Amount: Uses contract's `monthly_amount`
- VAT: Automatically calculated at 5% (or configured rate)
- Status: Set to `sent` automatically
- Due date: 15 days from invoice date (Net 15)
- Notes: Includes contract number reference

---

## Components

### 1. Service Layer
**File:** `backend/services/recurringBilling.js`

Main functions:
- `getContractsDueForBilling()` - Finds contracts to bill today
- `processRecurringBilling()` - Main processing function
- `triggerRecurringBillingManually()` - Manual trigger for testing

### 2. Cron Job
**File:** `backend/jobs/recurringBillingCron.js`

- Schedule: `0 9 * * *` (Daily at 9:00 AM)
- Timezone: Asia/Dubai (UAE)
- Auto-starts when server starts
- Functions:
  - `startRecurringBillingCron()` - Start the cron job
  - `stopRecurringBillingCron()` - Stop the cron job
  - `getCronJobStatus()` - Get current status

### 3. API Endpoints
**File:** `backend/routes/billing.js`

All endpoints require authentication.

#### GET /api/billing/status
Get cron job status
```json
{
  "running": true,
  "schedule": "0 9 * * * (Daily at 9:00 AM UAE time)",
  "timezone": "Asia/Dubai"
}
```

#### GET /api/billing/contracts-due
Get contracts due for billing today
```json
{
  "count": 2,
  "contracts": [
    {
      "id": 1,
      "contract_number": "CNT-2026-0001",
      "customer_name": "ABC Company",
      "monthly_amount": 1000.00,
      "billing_day": 14
    }
  ]
}
```

#### POST /api/billing/process
Manually trigger billing process (for testing)
```json
{
  "success": true,
  "message": "Recurring billing process completed",
  "processed": 2,
  "skipped": 0,
  "failed": 0,
  "results": [...]
}
```

#### GET /api/billing/history
Get history of auto-generated invoices
```json
{
  "count": 10,
  "invoices": [...]
}
```

---

## Testing

### Manual Test Script
Run the test script to verify the system:

```bash
cd backend
node test-recurring-billing.js
```

This will:
1. Check database connection
2. List contracts due for billing today
3. Wait 5 seconds for confirmation
4. Process the billing
5. Show detailed results

### Manual API Test
Use the API endpoint to trigger billing manually:

```bash
curl -X POST http://localhost:3001/api/billing/process \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Check Contracts Due Today
```bash
curl http://localhost:3001/api/billing/contracts-due \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Configuration

### Cron Schedule
Edit `backend/jobs/recurringBillingCron.js` to change the schedule:

```javascript
// Current: Daily at 9:00 AM
cron.schedule('0 9 * * *', ...)

// Examples:
// Every hour: '0 * * * *'
// Twice daily (9 AM and 5 PM): '0 9,17 * * *'
// Every Monday at 9 AM: '0 9 * * 1'
```

### Timezone
Change timezone in the cron job configuration:

```javascript
{
  scheduled: true,
  timezone: 'Asia/Dubai', // Change this
}
```

### Invoice Due Date
Edit `backend/services/recurringBilling.js`:

```javascript
// Current: Net 15 days
const dueDate = new Date();
dueDate.setDate(dueDate.getDate() + 15);

// Change to Net 30:
dueDate.setDate(dueDate.getDate() + 30);
```

---

## Business Logic

### Duplicate Prevention
- Checks if invoice already exists for contract in current month
- Uses `EXTRACT(YEAR FROM invoice_date)` and `EXTRACT(MONTH FROM invoice_date)`
- Skips contract if invoice found

### Contract Validation
- Only processes contracts with `status = 'active'`
- Validates `start_date <= today <= end_date`
- Matches `billing_day` with current day of month

### Error Handling
- Each contract processed independently
- Failures don't stop other contracts
- Detailed error logging
- Transaction rollback on individual failures

---

## Monitoring

### Server Logs
The cron job logs to console:
```
⏰ Cron job triggered: Recurring Billing
🕐 Time: 2/14/2026, 9:00:00 AM
📋 Found 3 contract(s) due for billing today
📝 Processing contract CNT-2026-0001...
✅ Generated invoice INV-2026-02-0015 for contract CNT-2026-0001
...
📊 Recurring Billing Summary:
   ✅ Processed: 3
   ⏭️  Skipped: 0
   ❌ Failed: 0
```

### Check Status via API
```bash
curl http://localhost:3001/api/billing/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### View Auto-Generated Invoices
```bash
curl http://localhost:3001/api/billing/history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Troubleshooting

### Cron Job Not Running
1. Check if server started successfully
2. Look for "Recurring billing cron job started" in logs
3. Verify timezone is correct
4. Check system time matches expected timezone

### Invoices Not Generated
1. Verify contracts are `active`
2. Check `billing_day` matches today's date
3. Ensure `start_date <= today <= end_date`
4. Check if invoice already exists for this month
5. Review server logs for errors

### Duplicate Invoices
- System prevents duplicates automatically
- If duplicates occur, check the duplicate prevention logic
- Verify database constraints on invoices table

### Manual Trigger Not Working
1. Ensure you're authenticated
2. Check API endpoint is correct
3. Review server logs for errors
4. Verify database connection

---

## Production Deployment

### Environment Variables
Ensure these are set:
```env
NODE_ENV=production
DATABASE_URL=your_production_db_url
TZ=Asia/Dubai
```

### Monitoring
- Set up log aggregation (e.g., CloudWatch, Papertrail)
- Monitor cron job execution
- Alert on failures
- Track invoice generation metrics

### Backup Strategy
- Daily database backups before 9:00 AM
- Keep backup of generated invoices
- Log all billing operations

### Scaling Considerations
- Current implementation handles hundreds of contracts
- For thousands of contracts, consider:
  - Batch processing
  - Queue-based system (Bull, BullMQ)
  - Separate worker process

---

## Future Enhancements

### Potential Improvements
- [ ] Email notifications when invoices generated
- [ ] SMS notifications to customers
- [ ] Retry logic for failed generations
- [ ] Dashboard for billing metrics
- [ ] Billing calendar view
- [ ] Custom billing schedules (weekly, quarterly)
- [ ] Prorated billing for partial months
- [ ] Automatic payment reminders
- [ ] Integration with payment gateways

---

## Support

For issues or questions:
1. Check server logs
2. Run test script
3. Review this documentation
4. Check contract and invoice data in database

---

**Last Updated:** February 14, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
