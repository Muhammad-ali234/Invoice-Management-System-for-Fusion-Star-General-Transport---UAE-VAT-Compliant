# 🚚 Professional Invoice Management System for Movers & Logistics

A smart, professional invoice management system designed specifically for movers and transport companies. Create invoices quickly, manage clients efficiently, track payments, and maintain organized records for your moving business.

## 🎯 Perfect For

- Moving & Relocation Companies
- Transport & Logistics Businesses
- Freight Forwarders
- Delivery Services
- Any business that needs professional invoicing

## ✨ Key Features

### 📄 Professional Invoice Management
- **Quick Invoice Creation** - Create professional invoices in seconds
- **Custom Line Items** - Add services like packing, loading, transport, storage
- **Automatic Calculations** - Subtotals, discounts, taxes calculated automatically
- **Multiple Status Tracking** - Draft, Sent, Partially Paid, Paid
- **Invoice Numbering** - Automatic sequential invoice numbers (INV-0001, INV-0002...)

### 📥 PDF Generation & Printing
- **Professional PDF Templates** - Three beautiful templates to choose from ⭐ NEW
  - 🎨 Modern Blue - Contemporary design with blue theme
  - 📜 Classic - Traditional black & white elegance
  - ✨ Minimal - Ultra-clean minimalist with green accent
- **Template Selector** - Easy dropdown to switch templates
- **One-Click Download** - Download invoices as PDF instantly
- **Print-Ready** - Optimized layout for printing
- **Company Branding** - Your logo, name, and contact details
- **Color-Coded Status** - Visual status indicators

### 💬 WhatsApp Sharing
- **Instant Sharing** - Share invoices directly via WhatsApp
- **Full Invoice Details** - Complete breakdown with line items
- **Quick Summary** - Brief invoice summary for fast communication
- **PDF Attachment** - Share PDF files via WhatsApp ⭐ NEW
- **Payment Reminders** - Send friendly payment reminders
- **Professional Format** - Clean, emoji-enhanced messages
- **Web Share API** - Native sharing on mobile devices

### 👥 Client Management
- Store client details: name, company, phone, email, address
- Quick client lookup when creating invoices
- Track payment history per client
- View top clients by revenue

### 💰 Payment Tracking
- Record payments against invoices
- Multiple payment methods: Cash, Bank Transfer, Other
- Track partial payments
- See remaining balance at a glance
- Payment history for each invoice

### 📊 Business Insights
- **Dashboard** - Overview of revenue, pending payments, invoice count
- **Reports** - Monthly revenue trends, payment method breakdown
- **Top Clients** - See which clients generate most revenue
- **Status Overview** - Visual breakdown of invoice statuses

### 🖨️ Professional Output
- **Print-Ready Invoices** - Clean, professional invoice layout
- **PDF Export** - Download or print as PDF
- **WhatsApp Sharing** - Share invoices and reminders instantly
- **Multiple Formats** - Full details or quick summary

### 🔒 Secure & Reliable
- User authentication with JWT tokens
- Password encryption with bcrypt
- PostgreSQL database for reliable data storage
- Rate limiting to prevent abuse
- SQL injection protection

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for modern styling
- **React Hook Form** + **Zod** for form validation
- **React Router** for navigation
- **Recharts** for data visualization

### Backend
- **Node.js** + **Express**
- **PostgreSQL** database
- **JWT** authentication
- **bcrypt** password hashing
- **express-validator** for input validation
- **Helmet.js** for security headers
- **Rate limiting** for API protection

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 12+ installed and running
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**
```cmd
git clone <your-repo-url>
cd invoice-management-system
```

2. **Install dependencies**
```cmd
npm run install:all
```

Or install PDF dependencies separately:
```cmd
cd frontend
npm install jspdf jspdf-autotable html2canvas
```

3. **Configure PostgreSQL**
   - Create a database named `invoice_management`
   - Update `backend/.env` with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=invoice_management
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key_here
PORT=3001
```

4. **Run database migrations**
```cmd
cd backend
npm run migrate
```

5. **Start the application**
```cmd
cd ..
npm run dev
```

The application will open at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 🚀 Quick Start Guide

### 1. Register Your Account
- Open http://localhost:5173
- Click "Register" and create your account
- Login with your credentials

### 2. Add Your First Client
- Go to "Clients" page
- Click "+ New Client"
- Fill in client details (name, phone, address, etc.)
- Save

### 3. Create Your First Invoice
- Go to "Invoices" page
- Click "+ New Invoice"
- Select client from dropdown
- Set invoice and due dates
- Add line items (e.g., "Packing Services", "Transport - 50km", "Loading/Unloading")
- Add quantities and rates
- Apply discount or tax if needed
- Click "Save & Send"

### 4. Record Payments
- Open any sent invoice
- Click "+ Record Payment"
- Enter payment amount, date, and method
- Add notes if needed
- Save

### 5. Share Invoices
- **Download PDF**: Click "📥 Download PDF" button
- **Print**: Click "🖨️ Print" button
- **Share Details**: Click "💬 Share Details" button (text only)
- **Share PDF**: Click "📎 Share PDF" button (downloads PDF + opens WhatsApp) ⭐ NEW
- **Send Reminder**: Click "🔔 Send Reminder" for unpaid invoices

### 6. View Reports
- Go to "Reports" page
- See revenue trends, top clients, payment methods
- Track business performance

## 📱 Usage Tips for Movers & Logistics

### Common Line Items
- Packing Materials
- Loading Services
- Transport (per km or flat rate)
- Unloading Services
- Storage Fees
- Insurance
- Fuel Surcharge
- Helper Charges

### Best Practices
1. **Create invoices immediately** after completing a job
2. **Record payments promptly** to keep accurate records
3. **Use notes field** for special instructions or job details
4. **Print invoices** for customer records
5. **Check dashboard daily** to track pending payments

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run dev:frontend` - Start frontend only
- `npm run dev:backend` - Start backend only
- `npm run install:all` - Install all dependencies

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start with nodemon (auto-reload)
- `npm start` - Start production server
- `npm run migrate` - Run database migrations

## 📊 Database Schema

### Tables
- **users** - User accounts
- **customers** - Client information
- **invoices** - Invoice records
- **invoice_items** - Line items for each invoice
- **payments** - Payment records

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt (10 rounds)
- Rate limiting (100 requests per 15 minutes)
- SQL injection protection via parameterized queries
- CORS configuration
- Helmet.js security headers
- Input validation on all endpoints

## 🐛 Troubleshooting

### Port Already in Use
If port 3001 is busy:
```cmd
npm run kill-port
```

### Database Connection Error
- Verify PostgreSQL is running
- Check credentials in `backend/.env`
- Ensure database `invoice_management` exists

### Frontend Not Loading
- Clear browser cache
- Check if backend is running on port 3001
- Verify `frontend/.env` has correct API URL

## 📝 License

MIT License - Feel free to use for your business!

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the Quick Start Guide
3. Check backend logs for API errors
4. Check browser console for frontend errors

## 🎉 Features Coming Soon

- 📧 Email invoice sending
- 🎨 Multiple PDF templates
- 📱 SMS notifications
- 🔗 Shareable invoice links
- 📦 Job/shipment tracking
- 📍 Route/distance calculator
- 💼 Multi-user support for teams
- 📱 Mobile app
- 🖼️ Custom logo upload
- 🎨 Color theme customization

---

**Built for movers, by developers who understand your business needs!** 🚚💼
