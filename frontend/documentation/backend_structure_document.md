# Backend Structure Document

This document outlines the backend setup for the `cafe-ordering-fullstack` project in clear, everyday language. It covers architecture, database design, APIs, hosting, security, and more, so anyone reading it can understand how the backend works.

## 1. Backend Architecture

**Overall design**
- We’re using Next.js API Routes to serve backend logic right alongside the frontend code. This means there’s no separate server project to manage—everything lives under one roof.
- Better Auth handles user registration, login, logout, and session management.
- Drizzle ORM gives us a type-safe layer for talking to our PostgreSQL database.

**Why this setup works well**
- **Scalability**: Next.js scales automatically on Vercel by spinning up more serverless function instances as traffic grows.
- **Maintainability**: Having frontend and backend in one codebase simplifies development and ensures types line up everywhere.
- **Performance**: Serverless functions start quickly, database queries are optimized through Drizzle, and static assets are cached at the edge.

## 2. Database Management

**Database choice**
- **Type**: Relational (SQL)
- **System**: PostgreSQL

**How we manage data**
- We define tables and relationships using Drizzle ORM in TypeScript files under `/db/schema/`.
- For changes over time, we use `drizzle-kit` to run database migrations safely.
- Connection pooling and SSL/TLS are enabled in production to keep connections efficient and secure.

## 3. Database Schema

Below is a human-friendly rundown of our main tables, followed by the actual SQL definitions.

Tables:
- **users**: Stores account info and roles (admin or customer).
- **products**: Represents menu items in the cafe.
- **orders**: A top-level record for each customer order.
- **order_items**: Line items linking orders to products.

SQL schema (PostgreSQL):
```sql
-- users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending','in_progress','completed')),
  total_amount NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- order_items table
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  item_price NUMERIC(10,2) NOT NULL
);
```  

## 4. API Design and Endpoints

We use a RESTful approach with Next.js API Routes under `/app/api/`. Each file corresponds to an endpoint group.

Key endpoints:

- **Authentication** (`/app/api/auth`)  
  - POST `/login`: Log in a user
  - POST `/register`: Create a new account
  - POST `/logout`: End the session

- **Products** (`/app/api/products`)  
  - GET `/`: List all products (public)  
  - GET `/:id`: Get details for one product  
  - POST `/`: Create a new product (admin only)  
  - PUT `/:id`: Update an existing product (admin only)  
  - DELETE `/:id`: Remove a product (admin only)

- **Orders** (`/app/api/orders`)  
  - GET `/`: List all orders for the logged-in user (or all orders for admin)  
  - POST `/`: Place a new order (customer only)  
  - PATCH `/:id`: Update order status (admin only)

Each endpoint validates inputs and uses Drizzle to interact with the database. Middleware ensures only authorized roles can call protected routes.

## 5. Hosting Solutions

We develop locally with Docker and deploy to Vercel for production.

- **Local (Docker)**:  
  - Docker containers run Next.js and PostgreSQL for an isolated, consistent environment.
- **Production (Vercel)**:  
  - Serverless functions handle API Routes.  
  - Static assets (JavaScript, CSS, images) are served from a global CDN.  
  - Vercel automatically scales functions up or down based on traffic.

This setup is reliable, cost-effective (pay for what you use), and requires minimal operations work.

## 6. Infrastructure Components

- **Load Balancing**: Vercel’s platform distributes requests across edge locations and function instances automatically.
- **Caching**:
  - CDN edge caching for static pages and assets.  
  - ISR (Incremental Static Regeneration) on menu pages to keep them fresh without rebuilding everything.
- **CI/CD**: GitHub Actions (or Vercel’s built-in Git integration) runs tests and deploys on every push to `main`.

## 7. Security Measures

- **Authentication & Authorization**:  
  - Better Auth manages sessions and password hashing.  
  - Role checks in middleware block unauthorized access to admin endpoints.
- **Data Encryption**:  
  - All connections use HTTPS/TLS in production.  
  - PostgreSQL encrypts data-at-rest on the managed database service.
- **Input Validation**:  
  - Every API route validates and sanitizes incoming data to prevent SQL injection or bad data.
- **Rate Limiting**:  
  - We can add rate limiting middleware on critical routes (login, order creation) to prevent abuse.

## 8. Monitoring and Maintenance

- **Error Tracking**: Integrate Sentry (or a similar service) to capture runtime errors and performance issues.
- **Logging**: Use Vercel’s built-in logs for request and function-level output, combined with Drizzle’s query logs for database activity.
- **Health Checks**: Periodic ping endpoints or uptime monitors (e.g., UptimeRobot) to ensure the API is responsive.
- **Database Migrations**: Use `drizzle-kit` to apply and roll back schema changes in a controlled way.
- **Dependency Updates**: Regularly review and update npm packages to patch security vulnerabilities and access new features.

## 9. Conclusion and Overall Backend Summary

This backend is built to support a modern cafe ordering system with separate admin and customer roles. By leveraging Next.js API Routes, Better Auth, PostgreSQL, and Drizzle ORM, we achieve:

- Clear separation of concerns between authentication, product management, and order processing.
- A single codebase that scales automatically, maintains type safety from front to back, and keeps infrastructure overhead low.
- Robust security, monitoring, and maintenance practices to ensure reliability.

With this foundation, adding features like real-time order updates, advanced inventory checks, or promotional campaigns becomes straightforward. The chosen architecture balances performance, cost-effectiveness, and ease of development, making it a solid base for any cafe website with ordering capabilities.