# Debug PDF Issue

## Possible Causes

### 1. Browser Console Errors
Check the browser console (F12) for JavaScript errors when clicking Print or Download.

### 2. Settings Not Loaded
The PDF generation requires settings from the database. Check:
- Is the backend running?
- Are settings saved in the database?
- Is the TRN field filled in Settings page?

### 3. Invoice Data Missing
Check if the invoice has:
- `lineItems` array populated
- Valid `subtotal`, `tax_amount`, `grand_total`
- Valid dates

### 4. Network Issues
Check Network tab (F12) for:
- Failed API calls to `/api/settings`
- 401 Unauthorized errors (token expired)

## Quick Debug Steps

### Step 1: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Click "Download PDF" button
4. Look for any red error messages
5. Copy the error message

### Step 2: Check Settings API
1. Open browser DevTools (F12)
2. Go to Network tab
3. Click "Download PDF" button
4. Look for request to `/api/settings`
5. Check if it returns 200 OK
6. Check the response data

### Step 3: Test with Console
Open browser console and run:
```javascript
// Test if settings can be loaded
fetch('http://localhost:3001/api/settings', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(r => r.json())
.then(d => console.log('Settings:', d))
.catch(e => console.error('Settings error:', e));
```

### Step 4: Check Invoice Data
In the invoice detail page, open console and run:
```javascript
// This will show the invoice object
console.log('Invoice:', invoice);
```

## Common Issues & Fixes

### Issue 1: "Failed to download PDF" alert
**Cause**: Settings API call failed or returned invalid data
**Fix**: 
- Make sure backend is running
- Check if TRN is saved in Settings
- Check browser console for actual error

### Issue 2: Nothing happens when clicking button
**Cause**: JavaScript error preventing function execution
**Fix**:
- Check browser console for errors
- Look for TypeScript compilation errors
- Restart frontend dev server

### Issue 3: "Cannot read property 'lineItems' of undefined"
**Cause**: Invoice data not loaded properly
**Fix**:
- Refresh the page
- Check if invoice exists in database
- Check backend logs

### Issue 4: PDF downloads but is blank/corrupted
**Cause**: Missing required fields in CompanyInfo
**Fix**:
- Ensure all required fields are provided
- Check if address, phone, email are empty strings (not undefined)

## Test This

Add this temporary debug code to `InvoiceDetailPage.tsx` in the `handleDownloadPDF` function:

```typescript
const handleDownloadPDF = async () => {
  if (!invoice) return;
  try {
    console.log('1. Starting PDF download...');
    console.log('2. Invoice:', invoice);
    
    const settings = await getSettings();
    console.log('3. Settings loaded:', settings);
    
    const companyInfo = {
      name: settings.companyName,
      nameArabic: settings.companyNameArabic,
      trn: settings.trnNumber,
      phone: settings.companyPhone,
      email: settings.companyEmail,
      address: settings.companyAddress,
      website: settings.companyWebsite,
      vatRate: settings.vatRate,
    };
    console.log('4. CompanyInfo:', companyInfo);
    
    await downloadInvoicePDF(invoice, companyInfo);
    console.log('5. PDF download complete!');
  } catch (error) {
    console.error('Error downloading PDF:', error);
    alert('Failed to download PDF: ' + error.message);
  }
};
```

This will show you exactly where the process fails.
