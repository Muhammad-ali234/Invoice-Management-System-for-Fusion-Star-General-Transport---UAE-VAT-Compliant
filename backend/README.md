# Invoice Management API - Production Backend

Production-ready Node.js + Express + PostgreSQL backend for Invoice Management System.

## Features

✅ **Security**
- Helmet.js for HTTP headers security
- JWT authentication with secure token handling
- bcrypt password hashing (10 rounds)
- Rate limiting (100 requests per 15 minutes)
- Input validation with express-validator
- SQL injection protection with parameterized queries
- CORS configuration

✅ **Performance**
- Connection pooling (max 20 connections)
- Response compression with gzip
- Efficient database indexing
- Transaction support for data integrity

✅ **Production Ready**
- Error handling middleware
- Request logging (Morgan)
- Health check endpoint
- Graceful shutdown handling
- Environment-based configuration

## Setup

### 1. Install PostgreSQL

Make sure PostgreSQL is installed and running on your system.

### 2. Create Database

```sql
CREATE DATABASE invoicedb;
```

### 3. Install Dependencies

```cmd
cd backend
npm install
```

### 4. Configure Environment

Copy `.env.example` to `.env` and update with your settings:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=invoicedb
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key
```

### 5. Run Migrations

```cmd
npm run migrate
```

This will create all necessary tables and indexes.

### 6. Start Server

**Development:**
```cmd
npm run dev
```

**Production:**
```cmd
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Customers (Protected)
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Invoices (Protected)
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get single invoice with line items
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice (drafts only)

### Payments (Protected)
- `GET /api/payments` - Get all payments
- `GET /api/payments?invoiceId=X` - Get payments for invoice
- `POST /api/payments` - Create payment
- `DELETE /api/payments/:id?invoiceId=X` - Delete payment

### Health Check
- `GET /health` - Server and database health status

## Database Schema

### Tables
- `users` - User accounts
- `customers` - Customer information
- `invoices` - Invoice headers
- `invoice_items` - Invoice line items
- `payments` - Payment records

### Features
- Foreign key constraints
- Cascade deletes where appropriate
- Automatic timestamp updates
- Indexed columns for performance
- Check constraints for data integrity

## Security Best Practices

1. **Password Security**
   - Passwords hashed with bcrypt (10 rounds)
   - Never stored in plain text

2. **JWT Tokens**
   - 7-day expiration
   - Secure secret key
   - Verified on every protected route

3. **SQL Injection Prevention**
   - All queries use parameterized statements
   - No string concatenation in queries

4. **Rate Limiting**
   - 100 requests per 15 minutes per IP
   - Prevents brute force attacks

5. **Input Validation**
   - All inputs validated before processing
   - Sanitization of email addresses
   - Type checking for all fields

## Performance Optimizations

1. **Database**
   - Connection pooling (20 max connections)
   - Indexes on frequently queried columns
   - Efficient query design

2. **HTTP**
   - Gzip compression
   - Response caching headers
   - Efficient JSON serialization

3. **Transactions**
   - Used for multi-step operations
   - Ensures data consistency
   - Automatic rollback on errors

## Monitoring

### Health Check
```cmd
curl http://localhost:3001/health
```

Response:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

### Logs
- Development: Detailed request logs
- Production: Combined Apache-style logs

## Deployment

### Environment Variables
Set these in your production environment:
- `NODE_ENV=production`
- `PORT=3001`
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET` (use a strong random key)
- `CORS_ORIGIN` (your frontend URL)

### Process Management
Use PM2 for production:

```cmd
npm install -g pm2
pm2 start server.js --name invoice-api
pm2 save
pm2 startup
```

### Database Backups
Regular backups recommended:

```cmd
pg_dump invoicedb > backup.sql
```

## Troubleshooting

### Cannot connect to database
- Check PostgreSQL is running
- Verify credentials in `.env`
- Ensure database exists

### JWT errors
- Check `JWT_SECRET` is set
- Verify token format: `Bearer <token>`

### Rate limit errors
- Adjust `RATE_LIMIT_MAX_REQUESTS` in `.env`
- Clear rate limit: restart server

## License

MIT
