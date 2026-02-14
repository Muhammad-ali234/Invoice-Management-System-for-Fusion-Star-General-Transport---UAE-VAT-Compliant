# Settings Page - Testing Guide

## ✅ What Was Implemented

The Settings page has been successfully added to Movers Invoice Pro with the following features:

### 1. **Company Information Management**
   - Company Name (required)
   - Phone Number
   - Email Address
   - Business Address
   - Website
   - Tax ID / Business Registration

### 2. **PDF Template Selection**
   - Three professional templates:
     - 🎨 **Modern Blue** - Contemporary design with blue theme
     - 📜 **Classic** - Traditional black & white elegance
     - ✨ **Minimal** - Ultra-clean minimalist with green accent
   - Visual template preview
   - Template comparison cards
   - Default template selection

### 3. **Settings Persistence**
   - All settings saved to browser's localStorage
   - Settings automatically loaded on page refresh
   - Reset to defaults option

### 4. **Integration with Invoice PDFs**
   - Company information appears on all PDF invoices
   - Default template is used when generating PDFs
   - Template can be changed per invoice on detail page
   - Quick download from invoice list uses settings

---

## 🧪 How to Test

### Step 1: Access Settings Page
1. Start both servers (backend and frontend)
2. Login to the application
3. Click **⚙️ Settings** in the sidebar
4. You should see the Settings page with two sections

### Step 2: Test Company Information
1. Fill in your company details:
   - Company Name: "ABC Movers & Logistics"
   - Phone: "+1 (555) 987-6543"
   - Email: "contact@abcmovers.com"
   - Address: "123 Transport Ave, City, State 12345"
   - Website: "www.abcmovers.com"
   - Tax ID: "TAX-123456" (optional)

2. Click **Save Settings**
3. You should see: "✅ Settings saved successfully!"
4. Refresh the page (F5)
5. Verify all your information is still there

### Step 3: Test Template Selection
1. In the "PDF Invoice Template" section, try each template:
   - Select **🎨 Modern Blue**
   - Notice the preview updates with blue theme
   - Select **📜 Classic**
   - Notice the preview shows B&W design
   - Select **✨ Minimal**
   - Notice the preview shows green accent

2. Click on the comparison cards below
3. Each click should update the selected template
4. Click **Save Settings**

### Step 4: Test PDF Generation with Settings
1. Go to **Invoices** page
2. Click on any existing invoice
3. Notice the template dropdown shows your default template
4. Click **📥 Download PDF**
5. Open the PDF and verify:
   - Your company name appears in the header
   - Your phone, email, address appear
   - The template matches your selection
   - Tax ID appears if you entered one

### Step 5: Test Template Override
1. On the invoice detail page
2. Change the template dropdown to a different template
3. Click **📥 Download PDF**
4. Verify the PDF uses the newly selected template
5. Go back to Settings
6. Verify your default template hasn't changed

### Step 6: Test Quick Download from List
1. Go to **Invoices** page
2. Click the **📥** icon next to any invoice
3. The PDF should download using:
   - Your company information from Settings
   - Your default template from Settings

### Step 7: Test Reset to Defaults
1. Go to Settings page
2. Click **Reset to Defaults**
3. Confirm the dialog
4. Verify all fields return to default values
5. Verify template returns to "Modern Blue"
6. You should see: "✅ Settings saved successfully!"

### Step 8: Test WhatsApp Sharing
1. Go to any invoice detail page
2. Click **📎 Share PDF**
3. The PDF should be generated with your company info
4. WhatsApp should open with your company details

---

## 🔍 What to Look For

### ✅ Success Indicators
- Settings page loads without errors
- All form fields are editable
- Save button shows success message
- Settings persist after page refresh
- PDFs show your company information
- Default template is applied to PDFs
- Template can be changed per invoice
- Reset button restores defaults

### ❌ Potential Issues
- If settings don't persist: Check browser localStorage
- If PDFs show default info: Clear browser cache and re-save settings
- If template doesn't change: Verify you clicked Save Settings
- If page doesn't load: Check browser console for errors

---

## 🎯 Expected Behavior

### Company Information
- **Required**: Only Company Name is required
- **Optional**: All other fields are optional
- **Format**: No validation on format (flexible input)
- **Storage**: Saved in localStorage as JSON

### Template Selection
- **Default**: Modern Blue template
- **Preview**: Updates immediately when selecting
- **Persistence**: Saved with other settings
- **Override**: Can be changed per invoice

### PDF Generation
- **Source**: Always uses Settings page data
- **Fallback**: If no settings, uses default values
- **Template**: Uses default from Settings unless overridden
- **Consistency**: Same info on all PDFs

---

## 📝 Notes

1. **Browser Storage**: Settings are stored in browser's localStorage
   - Key: `movers_invoice_settings`
   - Format: JSON object
   - Scope: Per browser, per domain

2. **No Backend**: Settings are NOT saved to database
   - Each user/browser has their own settings
   - Settings don't sync across devices
   - Clearing browser data will reset settings

3. **Template Files**: Three template functions in `pdfTemplates.ts`
   - `generateModernBluePDF()` - Default
   - `generateClassicPDF()` - B&W
   - `generateMinimalPDF()` - Green accent

4. **Integration Points**:
   - `InvoiceDetailPage.tsx` - Uses settings for PDF generation
   - `InvoicesPage.tsx` - Uses settings for quick download
   - `pdfGenerator.ts` - Accepts company info parameter
   - `pdfTemplates.ts` - Three template implementations

---

## 🚀 Next Steps

If everything works correctly:
1. ✅ Settings page is fully functional
2. ✅ Company information appears on PDFs
3. ✅ Template selection works
4. ✅ Settings persist across sessions

You can now:
- Customize your company branding
- Choose your preferred invoice template
- Generate professional PDFs with your info
- Share invoices via WhatsApp with your branding

---

## 🐛 Troubleshooting

### Settings Not Saving
```javascript
// Check localStorage in browser console:
localStorage.getItem('movers_invoice_settings')
```

### Clear Settings
```javascript
// Reset settings in browser console:
localStorage.removeItem('movers_invoice_settings')
```

### Check Settings Value
```javascript
// View current settings:
console.log(JSON.parse(localStorage.getItem('movers_invoice_settings')))
```

---

**Status**: ✅ Implementation Complete - Ready for Testing
