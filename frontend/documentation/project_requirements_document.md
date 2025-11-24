# Project Requirements Document (PRD)

## 1. Project Overview

The `cafe-ordering-fullstack` repository is a full-stack web application starter kit built with Next.js, React, TypeScript, Tailwind CSS, and Drizzle ORM on PostgreSQL. It comes prewired with user authentication (via Better Auth), a responsive UI with light/dark themes, and an interactive dashboard. The template solves the common problem of wiring up authentication, database schema, API routes, and theming from scratch, so you can focus on building your cafe’s ordering system.

This project will evolve the starter kit into a complete cafe website with two user roles—customers and admins. Customers can browse the menu, add items to a shopping cart, and place orders. Admins can manage menu items (CRUD), view and update incoming orders, and oversee user accounts. Success is measured by delivering a secure, responsive site where customers can order seamlessly and admins can manage everything from one dashboard.

## 2. In-Scope vs. Out-of-Scope

**In-Scope (Version 1):**
- Role-Based Access Control (RBAC): differentiating `admin` and `customer` users.
- Database schema updates: add `role` field to users, create `products`, `orders`, and `orderItems` tables.
- Menu Management (CRUD): Admin UI + `/api/products` endpoints.
- Public Menu Page (`/menu`): fetches products via API.
- Shopping Cart: client-side state (e.g., Zustand) to add/remove items.
- Checkout & Order Submission: `/api/orders` with server-side validation.
- Admin Order Dashboard: view/filter orders, update statuses (Pending → In Progress → Completed).
- Customer Dashboard: view order history and order details.
- Responsive UI with Tailwind and shadcn/ui, light/dark theme toggle.
- Containerized development (Docker) and deployment (Vercel).

**Out-of-Scope (Planned for Later Phases):**
- Payment gateway integration (Stripe, PayPal).
- Native mobile apps or PWA support.
- Loyalty/Rewards program or coupon codes.
- Advanced analytics, reporting, or sales dashboards.
- Multi-language (i18n) support.
- Real-time order status updates via WebSockets.

## 3. User Flow

When a **new customer** visits the site, they land on the public `/menu` page displaying all available products. They can browse items, view details on a product card, and add choices to a shopping cart. At any point, they click “Cart” to review selected items, adjust quantities, and proceed to checkout. If not logged in, they are prompted to sign up or log in. On successful checkout, the order is recorded in the database, and the customer sees a confirmation screen. From their personal dashboard (`/dashboard`), they can revisit past orders, see statuses, and reorder.

An **admin user** logs in and is directed to an `/admin`-scoped dashboard. Here they find two main sections: **Menu Management** and **Order Management**. In Menu Management, admins create, edit, or delete products—each action calling the `/api/products` CRUD routes. In Order Management, they see a list of incoming orders fetched from `/api/orders`, can filter by status, click into order details, and update statuses (e.g., mark an order as “In Progress” or “Completed”). All admin screens are protected by RBAC middleware that checks the user’s `role` field.

## 4. Core Features

- **Authentication & RBAC**: Better Auth integration with roles `admin` and `customer`; middleware to protect routes.
- **Database Schema**: Drizzle ORM schemas for `users` (with `role`), `products`, `orders`, `orderItems`.
- **Menu Management (CRUD)**: `/api/products` endpoints + admin UI components (`ProductForm`, `ProductTable`).
- **Public Menu Page**: `/menu` page fetching product list with SSG or ISR for performance.
- **Shopping Cart**: Client-side state store (Zustand or React Context) to manage cart items across pages.
- **Checkout & Orders**: `/api/orders` POST endpoint with validation (price match, stock check); records in `orders` and `orderItems` tables.
- **Admin Order Dashboard**: UI for listing orders, filtering by status, updating order state.
- **Customer Order History**: Dashboard page with server-side rendered order history.
- **Theming & UI**: Tailwind CSS, shadcn/ui, next-themes for light/dark mode.
- **Deployment & Migrations**: Docker setup, Vercel deployment, drizzle-kit for DB migrations.

## 5. Tech Stack & Tools

- Frontend: Next.js (App Router), React, TypeScript.
- Styling: Tailwind CSS, shadcn/ui, next-themes.
- State Management: Zustand (or built-in React Context).
- Backend: Next.js API Routes (Node.js/Express style), Better Auth for authentication.
- Database: PostgreSQL, Drizzle ORM, drizzle-kit for migrations.
- Deployment: Docker (development), Vercel (production).
- Testing: Jest (unit tests), Playwright or Cypress (end-to-end tests).
- IDE & AI Assist: VS Code with plugins like Cursor or Windsurf (optional).

## 6. Non-Functional Requirements

- **Performance:** Public menu page load < 2s; API responses < 200 ms under normal load.
- **Security:** All protected routes enforce RBAC; input validation on server; sanitize user input; guard against CSRF and XSS.
- **Compliance:** Secure password storage (bcrypt); GDPR-style privacy (users can delete their account).
- **Usability & Accessibility:** WCAG 2.1 AA compliance; responsive design across mobile, tablet, desktop.
- **Scalability:** Designed to handle at least 1,000 concurrent users; database indexing on foreign keys.

## 7. Constraints & Assumptions

- Better Auth supports custom role field and middleware.
- Hosting environment supports PostgreSQL (cloud-hosted or managed service).
- No payment gateway available in Version 1, so orders are “cash on delivery” or internal only.
- Customers use modern browsers; no legacy IE support required.
- Cart state persists in localStorage only; server-side persistence is out of scope.

## 8. Known Issues & Potential Pitfalls

- **Race Conditions:** Concurrent checkouts might oversell limited-stock items—use DB transactions to lock stock counts.
- **Schema Drift:** Without migrations, schema updates can become inconsistent—enforce drizzle-kit usage.
- **API Limits:** If hosted on free tiers, watch Postgres connection limits—implement simple caching on `/api/products`.
- **Price Tampering:** Verify item prices on the server, not trusting client-sent prices.
- **Large Data Sets:** If product catalog or order history grows large, implement pagination or infinite scroll.


---

This PRD serves as the single source of truth for system behavior, features, and constraints. All subsequent technical documents—Tech Stack, Frontend Guidelines, Backend Structure—should refer back to these sections to ensure consistency and completeness.