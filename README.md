# Mini CRM Sales & Accounts

A comprehensive CRM system built with Next.js, Prisma, and SQLite database for managing leads, sales, customers, and accounts.

## Features

- 🔐 **Authentication System** - Secure login/register with JWT tokens
- 👥 **Customer Management** - Store and manage customer information
- 🎯 **Lead Management** - Track potential customers and their interests
- 💰 **Sales Tracking** - Record and monitor sales transactions
- 📊 **Account Management** - Track income and expenses
- 🎨 **Modern UI** - Built with Shadcn/ui and Tailwind CSS
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Database Schema

### Users
- Authentication and user management
- Role-based access (admin/user)
- Secure password hashing with bcrypt

### Customers
- Contact information (name, email, phone, address)
- Company details
- Notes and additional information
- Unique phone numbers for easy lookup

### Leads
- Product interest tracking
- Lead source identification
- Status management (new, contacted, interested, converted, lost)
- Follow-up scheduling
- Customer association

### Sales
- Product and quantity tracking
- Amount and currency management
- Status tracking (pending, completed, cancelled, refunded)
- Customer association

### Accounts
- Income and expense tracking
- Category-based organization
- Customer association (optional)
- Date-based entries

## Getting Started

### Prerequisites

- Node.js 18+ 
- Yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mini-crm-sales-accounts
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up the database**
   ```bash
   # Generate Prisma client
   yarn db:generate
   
   # Push schema to database
   yarn db:push
   
   # Seed the database with sample data
   yarn db:seed
   ```

4. **Start the development server**
   ```bash
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Default Login Credentials

After seeding the database, you can log in with:

- **Admin User**: `admin@example.com` / `admin123`
- **Regular User**: `user@example.com` / `user123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Customers
- `GET /api/customers` - List customers (with pagination and search)
- `POST /api/customers` - Create new customer
- `GET /api/customers/[id]` - Get customer details
- `PUT /api/customers/[id]` - Update customer
- `DELETE /api/customers/[id]` - Delete customer

### Leads
- `GET /api/leads` - List leads (with pagination, search, and status filter)
- `POST /api/leads` - Create new lead

### Sales
- `GET /api/sales` - List sales (with pagination, search, and status filter)
- `POST /api/sales` - Create new sale

### Accounts
- `GET /api/accounts` - List accounts (with pagination, search, type, and category filters)
- `POST /api/accounts` - Create new account entry

## Database Commands

```bash
# Generate Prisma client
yarn db:generate

# Push schema changes to database
yarn db:push

# Seed database with sample data
yarn db:seed

# Reset database (if needed)
npx prisma db push --force-reset
```

## Project Structure

```
mini-crm-sales-accounts/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── modules/           # Feature modules
│   ├── ui/                # UI components
│   └── dashboard-layout.tsx
├── contexts/              # React contexts
├── lib/                   # Utilities and services
│   ├── api.ts            # API service
│   ├── db.ts             # Database client
│   └── utils.ts          # Utility functions
├── prisma/                # Database schema and migrations
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeder
└── public/               # Static assets
```

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: Shadcn/ui, Tailwind CSS, Lucide React
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Context API

## Development

### Adding New Features

1. **Database Changes**: Update `prisma/schema.prisma`
2. **API Routes**: Create new routes in `app/api/`
3. **Components**: Add components in `components/modules/`
4. **Pages**: Create pages in `app/` directory

### Database Migrations

```bash
# After schema changes
npx prisma db push
npx prisma generate
```

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 