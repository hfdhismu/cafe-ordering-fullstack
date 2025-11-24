# Security Guidelines for `cafe-ordering-fullstack`

This document provides security best practices and recommendations tailored to the `cafe-ordering-fullstack` starter template. It embeds security by design into every layer of your application—from user authentication to deployment—and ensures you follow defense-in-depth, least privilege, and secure defaults.

---

## 1. Secure Authentication & Role-Based Access Control (RBAC)

- **Extend Better Auth securely**  
  • Add a non-nullable `role` field (`'admin' | 'customer'`) in `db/schema/auth.ts` with a unique constraint.  
  • Ensure only admins can access `/app/admin/*` routes via server-side middleware or route guards.

- **Password policies & storage**  
  • Enforce minimum length (≥ 12 characters) and complexity on registration.  
  • Use `bcrypt` or `Argon2` with a unique salt per user (Better Auth default).  
  • Implement account lockout after repeated failed attempts.

- **Session & JWT security**  
  • If using JWTs, sign with `HS256` or `RS256`—never `none`.  
  • Validate `exp` and `iat` claims on every request.  
  • Store tokens in secure, `HttpOnly`, `SameSite=Strict` cookies; avoid `localStorage`.

- **Multi-Factor Authentication (MFA)**  
  • Offer an opt-in email or TOTP-based MFA flow for admin accounts.  
  • Store MFA secrets encrypted (e.g., using KMS or Vault).

- **Least Privilege**  
  • Database users: grant only required CRUD permissions on specific tables.  
  • API tokens: scope tokens to only needed endpoints.

---

## 2. Input Validation & Output Encoding

- **Server-Side Validation**  
  • Validate all incoming JSON in Next.js API routes using a schema validator (e.g., `zod`).  
  • On `/api/orders`, verify item IDs exist and prices match the DB to prevent tampering.

- **Prevent Injection**  
  • Use Drizzle ORM’s parameterized queries; never interpolate user data into raw SQL.  
  • Sanitize any file or path inputs to avoid command or path-traversal attacks.

- **XSS & HTML Sanitization**  
  • Encode dynamic values in React (`{userInput}` is safe; avoid `dangerouslySetInnerHTML`).  
  • If accepting rich text, sanitize on the server (e.g., `dompurify` on Node).

- **CSRF Protection**  
  • For state-changing operations, implement anti-CSRF tokens.  
  • In Next.js app router, leverage built-in CSRF middleware or custom token checks.

---

## 3. Data Protection & Privacy

- **Encrypt in Transit & At Rest**  
  • Enforce HTTPS (TLS 1.2+) on Vercel; redirect HTTP to HTTPS.  
  • Enable encryption at rest on PostgreSQL (managed service defaults).  

- **Secrets Management**  
  • Store credentials (`DATABASE_URL`, `JWT_SECRET`) in environment variables or a secret vault (e.g., AWS Secrets Manager).  
  • Never commit secrets to source control.

- **Logging & Error Handling**  
  • Do not log PII (user passwords, credit card details).  
  • In production, disable stack traces in API error responses; return generic messages.

- **PII & Compliance**  
  • Limit customer data collection to what’s necessary (name, email, order history).  
  • Implement a data-deletion workflow for GDPR/CCPA requests.

---

## 4. API & Service Security

- **HTTPS & CORS**  
  • Serve all API routes over HTTPS.  
  • Configure CORS to allow only your front-end origin (e.g., `https://your-cafe-app.com`).

- **Rate Limiting & Throttling**  
  • Protect authentication and `/api/orders` endpoints with rate limits (e.g., 100 requests/min per IP).  
  • Use an in-memory store (Redis) or third-party service (e.g., Cloudflare) for throttling.

- **Versioning & Least Exposure**  
  • Prefix unstable endpoints with `/api/v1/`.  
  • Return only required fields in JSON responses; avoid over-fetching.

- **Correct HTTP Methods**  
  • GET for fetching (`/api/products`, `/api/orders?userId=…`).  
  • POST for creation (`/api/orders`).  
  • PUT/PATCH for updates (`/api/products/:id`).  
  • DELETE for removals.

---

## 5. Web Application Security Hygiene

- **Security Headers**  
  • `Content-Security-Policy`: restrict scripts/styles to self and trusted CDNs.  
  • `X-Frame-Options: SAMEORIGIN` or CSP `frame-ancestors 'self'`.  
  • `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin`.

- **Secure Cookies**  
  • Set `Secure`, `HttpOnly`, `SameSite=Strict` on session cookies.  
  • Use short cookie lifetimes and require re-login for sensitive actions.

- **Subresource Integrity (SRI)**  
  • For third-party scripts (e.g., analytics), include integrity hashes.

- **Client-Side Storage**  
  • Avoid storing tokens or PII in `localStorage` or `sessionStorage`.

---

## 6. Infrastructure & Configuration Management

- **Container & Deployment Hardening**  
  • In Dockerfile, use a minimal base image (e.g., `node:18-alpine`).  
  • Drop unnecessary Linux capabilities; run as non-root user.

- **Environment Parity & Secrets**  
  • Use `.env.local` for dev, encrypted environment variables for production on Vercel.  
  • Disable `NEXT_PUBLIC_` prefixes for sensitive secrets.

- **Patching & Updates**  
  • Regularly run `npm audit` and update dependencies.  
  • Subscribe to PostgreSQL and Drizzle ORM release notes.

- **Disable Debug in Prod**  
  • Ensure `next.config.js` has `reactStrictMode: false` in production.  
  • Do not expose the `/__next/*` debug endpoints.

---

## 7. Dependency & Supply Chain Security

- **Lockfiles & Pinning**  
  • Commit `package-lock.json` to guarantee deterministic installs.

- **Vetting & Scanning**  
  • Use Dependabot or GitHub Actions to scan for vulnerabilities.  
  • Remove unused dependencies to minimize attack surface.

- **Minimal Footprint**  
  • Only include UI libraries or polyfills that are essential for your features.

---

## 8. Monitoring, Logging & Incident Response

- **Centralized Logging**  
  • Aggregate logs to a secure service (e.g., Datadog, Logflare).  
  • Mask or truncate PII in logs.

- **Alerting**  
  • Instrument failed login attempts, rate-limit triggers, and unusual API patterns.  
  • Configure alerts for error-rate spikes in production.

- **Backup & Recovery**  
  • Schedule daily DB backups; encrypt backups at rest.  
  • Periodically test restore procedures.

---

## 9. Secure Development & Testing Practices

- **Static Analysis & Linters**  
  • Integrate ESLint with security plugins (e.g., `eslint-plugin-security`).

- **Automated Tests**  
  • Unit-test critical logic (price calculations, role enforcement).  
  • E2E tests (Playwright/Cypress) for user flows: login, order placement, admin CRUD.

- **Code Reviews & Pair Programming**  
  • Include security checklist in PR templates.  
  • Encourage peer review of any schema or API changes.

- **Threat Modeling**  
  • Periodically revisit core flows (authentication, ordering) to identify new threats.

---

Adherence to these guidelines will help ensure that your cafe ordering application remains secure, robust, and maintainable throughout its lifecycle. When in doubt, flag design choices for security review and leverage automated tools to enforce these policies.