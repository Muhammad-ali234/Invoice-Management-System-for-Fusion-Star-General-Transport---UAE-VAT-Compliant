# 🧪 TEST PDF TEMPLATE

## Quick Test Steps

### 1. Start System
```bash
# Terminal 1
cd backend && npm start

# Terminal 2
cd frontend && npm run dev
```

### 2. Configure TRN
1. Open http://localhost:5173
2. Login
3. Go to **Settings**
4. Enter TRN: `100000000000000` (or your actual TRN)
5. Save

### 3. Test PDF
1. Go to **Invoices**
2. Open any invoice
3. Click **Download PDF**
4. Open the PDF

### 4. Verify PDF Shows:
- [ ] "TAX INVOICE" (red, bold) - not just "INVOICE"
- [ ] TRN below title: `TRN: 100000000000000`
- [ ] Customer TRN (if customer has one)
- [ ] VAT Breakdown:
  ```
  Subtotal:  1,000.00 AED
  VAT (5%):     50.00 AED
  ─────────────────────
  TOTAL:     1,050.00 AED
  ```
- [ ] Amount in words: "One Thousand Fifty Dirhams Only"

### 5. If Something's Wrong:
- Check Settings page has TRN saved
- Check browser console for errors
- Refresh page and try again
- Check backend is running

---

## ✅ Expected Result

PDF should look like:
```
┌─────────────────────────────────────┐
│  [LOGO] FUSION STAR                 │
│                                     │
│         TAX INVOICE                 │
│      TRN: 100000000000000          │
│                                     │
│  Invoice No: INV-2026-02-0001      │
│  Date: 14/02/2026                  │
│                                     │
│  Ref To: Customer Name              │
│  TRN: [If registered]               │
│                                     │
│  Description          Amount        │
│  1-ton pickup        1,000.00       │
│                                     │
│  Subtotal:          1,000.00 AED   │
│  VAT (5%):             50.00 AED   │
│  ─────────────────────────────      │
│  TOTAL:             1,050.00 AED   │
│                                     │
│  Amount: One Thousand Fifty...      │
└─────────────────────────────────────┘
```

---

**If all checks pass:** ✅ PDF is VAT compliant!

