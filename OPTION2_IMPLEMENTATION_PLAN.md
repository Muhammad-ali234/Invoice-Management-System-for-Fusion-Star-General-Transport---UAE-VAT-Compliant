# 🚀 Option 2 Implementation Plan

**Features to Add:**
1. Quote/Estimate System (2-3 days)
2. Email Invoices & Quotes (2 days)
3. Overdue Tracking (1 day)

**Total Estimated Time**: 4-5 days

---

## Phase 1: Quote System (Day 1-2)

### Backend Tasks:
- [ ] Create quotes table migration
- [ ] Create quote_items table migration
- [ ] Create quotes routes (CRUD)
- [ ] Add quote-to-invoice conversion endpoint
- [ ] Add quote status updates

### Frontend Tasks:
- [ ] Create QuotesPage (list all quotes)
- [ ] Create QuoteCreatePage
- [ ] Create QuoteEditPage
- [ ] Create QuoteDetailPage
- [ ] Add Quotes link to Sidebar
- [ ] Add quote PDF generation
- [ ] Add convert-to-invoice button
- [ ] Add quote types to TypeScript

---

## Phase 2: Email System (Day 3-4)

### Backend Tasks:
- [ ] Install nodemailer
- [ ] Create email configuration
- [ ] Create email templates (invoice, quote)
- [ ] Create send email endpoints
- [ ] Add SMTP settings to .env

### Frontend Tasks:
- [ ] Add email settings to Settings page
- [ ] Add "Send Email" button to invoice detail
- [ ] Add "Send Email" button to quote detail
- [ ] Create email preview modal
- [ ] Add email sending status notifications

---

## Phase 3: Overdue Tracking (Day 5)

### Backend Tasks:
- [ ] Add overdue status calculation
- [ ] Add overdue filter to invoices endpoint
- [ ] Add overdue count to dashboard stats

### Frontend Tasks:
- [ ] Add overdue badge to invoice cards
- [ ] Add overdue filter to invoices page
- [ ] Add overdue amount to dashboard
- [ ] Add overdue status color (red)
- [ ] Add auto-status update on page load

---

## Implementation Order:

**Step 1**: Database migrations (quotes tables)
**Step 2**: Backend API (quotes routes)
**Step 3**: Frontend pages (quotes UI)
**Step 4**: Email backend (nodemailer setup)
**Step 5**: Email frontend (send buttons)
**Step 6**: Overdue logic (status calculation)

---

Let's start!
