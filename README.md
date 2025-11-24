# Cafe Ordering System

A complete full-stack cafe ordering system with admin and customer interfaces.

## Project Structure

This is a monorepo with separate frontend and backend applications:

```
cafe-ordering-fullstack/
├── frontend/          # Next.js application (React frontend)
├── backend/           # Express.js API server
├── documentation/     # Project documentation
└── package.json       # Root package.json for monorepo management
```

## Features

### Customer Features
- Browse menu and products
- Add items to cart
- Place orders
- View order history
- User authentication (signup/login)

### Admin Features
- Menu management (CRUD operations)
- Order management and status updates
- User management
- Dashboard analytics

## Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - UI components
- **Drizzle ORM** - Database client
- **Better Auth** - Authentication

### Backend
- **Express.js** - API server
- **TypeScript** - Type safety
- **Drizzle ORM** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication tokens
- **Zod** - Schema validation

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
2. Install all dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

4. Start the database:
```bash
npm run db:up
```

5. Run database migrations:
```bash
npm run db:push
```

### Development

Start both frontend and backend:
```bash
npm run dev
```

Or start individually:
```bash
# Frontend only (http://localhost:3000)
npm run dev:frontend

# Backend only (http://localhost:3001)
npm run dev:backend
```

### Production

Build and start both applications:
```bash
npm run build
npm run start
```

## API Documentation

The backend API runs on `http://localhost:3001` with the following endpoints:

### Authentication
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/profile` - Get user profile

### Products
- `GET /api/v1/products` - Get all products
- `POST /api/v1/products` - Create product (admin only)
- `PUT /api/v1/products/:id` - Update product (admin only)
- `DELETE /api/v1/products/:id` - Delete product (admin only)

### Orders
- `GET /api/v1/orders` - Get user orders
- `POST /api/v1/orders` - Create new order
- `PUT /api/v1/orders/:id` - Update order (admin only)
- `GET /api/v1/orders/:id` - Get single order

## Database Management

Using Drizzle ORM with PostgreSQL:

- `npm run db:generate` - Generate migrations
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Drizzle Studio
- `npm run db:up` - Start PostgreSQL container
- `npm run db:down` - Stop PostgreSQL container

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC