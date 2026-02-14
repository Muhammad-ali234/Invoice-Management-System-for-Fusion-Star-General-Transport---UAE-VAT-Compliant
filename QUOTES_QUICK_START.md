# 🚀 Quotes System - Quick Start Guide

## Step 1: Run Migration (1 minute)

```cmd
RUN_QUOTES_MIGRATION.cmd
```

Wait for: "✅ Quotes tables created"

---

## Step 2: Restart Servers (1 minute)

1. Stop backend (Ctrl+C in backend terminal)
2. Stop frontend (Ctrl+C in frontend terminal)
3. Run:
```cmd
QUICK_RUN.cmd
```

---

## Step 3: Test Quotes (5 minutes)

### Create Your First Quote
1. Go to: http://localhost:5173
2. Login
3. Click **📋 Quotes** in sidebar
4. Click **+ New Quote**
5. Select a customer
6. Add line items
7. Click **Create Quote**

### View Quote
1. Click on the quote in the list
2. See quote details
3. Notice the status: "Draft"

### Send Quote
1. Click **Mark as Sent**
2. Status changes to "Sent"

### Approve Quote
1. Click **✓ Approve**
2. Status changes to "Approved"

### Convert to Invoice
1. Click **📄 Convert to Invoice**
2. Confirm conversion
3. You're redirected to the new invoice!
4. Go back to quotes - quote is now "Converted"

---

## ✅ Success Checklist

- [ ] Migration ran successfully
- [ ] Servers restarted
- [ ] Quotes page loads
- [ ] Created a quote
- [ ] Viewed quote details
- [ ] Changed quote status
- [ ] Converted quote to invoice
- [ ] Invoice was created
- [ ] Quote marked as converted

---

## 🎉 You're Done!

Quotes system is working! You now have:
- Professional quote management
- Quote-to-invoice conversion
- Status tracking
- Search and filters

---

## 📚 More Info

- Full documentation: `QUOTES_SYSTEM_COMPLETE.md`
- Implementation status: `OPTION2_STATUS.md`
- Troubleshooting: See `QUOTES_SYSTEM_COMPLETE.md`

---

## 🐛 Problems?

### Migration fails
- Check PostgreSQL is running
- Check `backend/.env` database settings

### Quotes page is blank
- Check browser console (F12)
- Verify backend is running on port 3001
- Check backend terminal for errors

### Can't convert quote
- Quote must be "Approved" or "Sent" status
- Check if quote already converted

---

**Need help? Check the full documentation in `QUOTES_SYSTEM_COMPLETE.md`**
