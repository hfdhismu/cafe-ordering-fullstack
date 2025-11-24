# Frontend Guidelines for `cafe-ordering-fullstack`

This document describes the frontend setup for the cafe-ordering-fullstack starter template. It covers architecture, design principles, styling, component structure, state management, routing, performance, testing, and more. By following these guidelines, you’ll ensure a scalable, maintainable, and user-friendly frontend for both customers and admins.

## 1. Frontend Architecture

**Frameworks and Libraries**
- **Next.js (App Router)**: Handles routing, layouts, server-side rendering (SSR), and static site generation (SSG).  
- **React & TypeScript**: Provides a component-based approach with strong typing for safer, more maintainable code.  
- **Tailwind CSS & shadcn/ui**: Utility-first CSS plus a set of prebuilt, accessible UI components.  
- **next-themes**: Manages light and dark mode preferences.  

**How It Supports Scalability, Maintainability, and Performance**
- **Scalability**: Next.js route groups (`/app/admin`, `/app/menu`, etc.) let you split features into clear sections. TypeScript and Drizzle schemas keep frontend and backend data shapes in sync.  
- **Maintainability**: Component-driven development encourages small, reusable pieces. A central `/components` folder organizes UI elements by feature.  
- **Performance**: Built-in Next.js optimizations (SSG for public pages like `/menu`, SSR for protected dashboards) combined with image optimization (`next/image`) and Tailwind’s unused-CSS purging ensure fast load times.

## 2. Design Principles

**Key Principles**
1. **Usability**: Simple navigation, clear buttons, and predictable interactions.  
2. **Accessibility**: Semantic HTML, ARIA attributes, focus states, and keyboard navigation.  
3. **Responsiveness**: Mobile-first layout with breakpoints for tablet and desktop.  
4. **Consistency**: Uniform spacing, typography, and color usage across components.  

**Applying These Principles**
- **Buttons and Forms**: Use shadcn/ui components which include ARIA labels and focus rings by default.  
- **Navigation**: A clear top bar with links to Home, Menu, Cart, and conditional Admin Dashboard.  
- **Layouts**: Shared layouts (`/app/layout.tsx`, `/app/admin/layout.tsx`) ensure consistent header, footer, and sidebars.  
- **Mobile**: Tailwind breakpoints (`sm`, `md`, `lg`) adjust grid layouts and font sizes for readability.

## 3. Styling and Theming

**Styling Approach**
- **Tailwind CSS**: Utility-first classes for rapid styling.  
- **No custom pre-processors**: All styling is done via Tailwind’s plugin system and configuration.  
- **BEM/Atomic Concepts**: When writing custom CSS modules, follow BEM-like naming (`.menu__item`, `.order__card`).  

**Theming**
- **next-themes** manages `light` and `dark` modes automatically, storing user preference in local storage.  
- **Tailwind config** includes theme extensions for colors and font families.  

**Design Style**
- **Modern Flat Design**: Clean lines, minimal shadows, clear typography.  
- **Accent Details**: Subtle hover transitions, consistent border radii (e.g., `rounded-lg`).  

**Color Palette**
- **Primary**: `#6B4226` (Rich Coffee Brown)  
- **Secondary**: `#E1C699` (Latte Cream)  
- **Accent**: `#A3B18A` (Sage Green)  
- **Background (light)**: `#FFFFFF`  
- **Background (dark)**: `#1F1F1F`  
- **Text (light)**: `#333333`  
- **Text (dark)**: `#EEEEEE`  

**Font**
- **Primary Font**: Inter (system-ui fallback) loaded via Google Fonts.  
- **Fallback**: `ui-sans-serif, system-ui`.

## 4. Component Structure

**Organization**
- `/components/atoms`: Basic UI elements (Buttons, Inputs, Icons).  
- `/components/molecules`: Composed groups of atoms (ProductCard, CartItem).  
- `/components/organisms`: Larger sections (Header, Footer, OrderTable).  
- `/components/admin`: Admin-specific components (AdminSidebar, OrderRow).  
- `/components/shop`: Customer-specific components (MenuGrid, CheckoutForm).  

**Reusability**
- Each component has a single responsibility and clear props interface.  
- Shared components avoid duplication—update in one place for global changes.  

**Benefits**
- Easier testing of isolated pieces.  
- Faster development by composing existing blocks.  
- Clear ownership and boundaries between features.

## 5. State Management

**Client-State**
- **Authentication**: Better Auth handles login state; expose via React Context (`AuthContext`) for checks across pages.  
- **Shopping Cart**: Zustand stores cart items, totals, and persists to `localStorage`. Provides simple hooks (`useCartStore`).  

**Server-State**
- **Data Fetching**: Built-in Next.js data fetching (`getStaticProps`, `getServerSideProps`) and the App Router’s React Server Components for menus, orders, and user data.  
- **Cache & Revalidate**: ISR (Incremental Static Regeneration) for public pages; on-demand revalidation for menu updates.

**Synchronization**
- UI components consume Zustand or Context hooks to reflect real-time updates (e.g., cart badge count).  
- API calls validate data before updating state to prevent stale or invalid data.

## 6. Routing and Navigation

**Next.js App Router** (`/app` directory)
- **Public Routes**: `/`, `/menu`, `/login`, `/register`.  
- **Customer Routes**: `/cart`, `/orders`, `/profile`.  
- **Admin Routes (Protected)**: `/admin/menu`, `/admin/orders`, `/admin/users`.  

**Layout & Nested Routes**
- **Root Layout** (`/app/layout.tsx`): Navigation, theme toggle.  
- **Admin Layout** (`/app/admin/layout.tsx`): Sidebar, breadcrumb, admin header.  

**Navigation**
- Use `Link` from `next/link` for client-side transitions.  
- Use `useRouter` for imperative navigation after actions (e.g., redirect to `/login` on auth error).  
- Protect routes via Next.js middleware or a wrapper component that checks `AuthContext` and redirects unauthorized users.

## 7. Performance Optimization

**Strategies**
- **Code Splitting & Dynamic Imports**: Lazy-load heavy components (charts, data tables) using `next/dynamic`.  
- **Image Optimization**: Use `<Image>` from `next/image` with automatic resizing and lazy loading.  
- **Asset Optimization**: Purge unused CSS via Tailwind’s default purge settings.  
- **Caching & CDN**: Static assets and pages served through Vercel’s CDN.  

**Impact**
- Faster time-to-first-byte (TTFB) and improved Core Web Vitals.  
- Lower bandwidth usage for end users.  
- Smoother UI interactions and less layout shift.

## 8. Testing and Quality Assurance

**Unit Testing**
- **Jest** & **React Testing Library**: Test component rendering, props, and interactions (e.g., clicking Add to Cart updates store).  

**Integration Testing**
- Test API routes in isolation using **Supertest** or **msw** (Mock Service Worker).  

**End-to-End (E2E) Testing**
- **Playwright** or **Cypress**: Automate user flows like “customer places an order” and “admin updates menu item.”  

**Linting & Formatting**
- **ESLint** with Next.js and TypeScript plugins.  
- **Prettier** for consistent code style.  
- **Husky** + **lint-staged** to run checks on pre-commit.  

**Type Checking**
- **`tsconfig.json`** with strict settings (`strict`, `noImplicitAny`).  
- CI pipeline runs `tsc --noEmit` to catch errors before merge.

## 9. Conclusion and Frontend Summary

This frontend setup leverages Next.js, React, and TypeScript to deliver a fast, scalable, and maintainable cafe ordering application. Key highlights:
- **Component-Driven** architecture for reusability and clarity.  
- **Tailwind CSS** and modern flat design for rapid, consistent styling.  
- **Role-Based Routing** and **Better Auth** for secure customer/admin experiences.  
- **Zustand** for simple client-state (shopping cart) and **next-themes** for flexible theming.  
- **Robust Testing** strategy ensuring reliability at every layer.  

By following these guidelines, new contributors and stakeholders will find the codebase approachable, and the final product will meet performance, accessibility, and user-experience standards expected of a modern web application.