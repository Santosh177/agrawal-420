# Namkeen 420

A production-quality MVP for an Indian namkeen/snacks ordering website with an admin panel, built with **Next.js (App Router)**, **TypeScript**, **MongoDB/Mongoose**, and **Tailwind CSS**.

Customers browse the catalog, add items to a cart, and place an order that is saved to MongoDB and handed off to WhatsApp with a prefilled message. Admins manage products and orders from a JWT-protected panel and paste a payment link to send back over WhatsApp.

## Tech stack

- Next.js App Router + TypeScript
- MongoDB + Mongoose
- Tailwind CSS v3
- Next.js API routes as the backend (no separate Express server)
- `bcryptjs` for password hashing, `jose` for JWT (edge-compatible middleware)
- `zod` for input validation, `zustand` for the cart store

## Architecture

The codebase is split by runtime/domain. `src/app` stays as the Next.js route
layer, while storefront code, admin code, backend code, and shared contracts live
in separate folders.

Server-rendered pages can call backend services directly for initial data. Client
mutations go through small API helper modules and then through Next.js API
routes.

```
Server page / API route
  -> backend service (business logic)
  -> backend repository (DB queries)
  -> backend Mongoose model (schema only)
  -> MongoDB
```

```
Client component
  -> website/admin/shared API helper
  -> /api/* route
  -> backend service
  -> backend repository
  -> backend model
```

```
src/
  app/            # Next.js route layer: public pages, admin pages, API routes
  website/        # public storefront UI, cart store, checkout, website APIs
  admin/          # admin UI, admin forms, login/logout, image upload helpers
  backend/        # services, repositories, Mongoose models, seed script
  shared/         # shared types, validators, auth/db/env helpers, UI badges
  middleware.ts   # protects /admin/* pages
```

Rules enforced:
- Route files stay thin and delegate business behavior to backend services.
- Server pages fetch initial data through `src/backend/services/*`.
- Client-side mutations use API helpers in `src/website/services`,
  `src/admin/services`, or `src/shared/services`.
- Backend services contain business logic and call repositories.
- Backend repositories contain database queries.
- Backend models only define Mongoose schemas.
- Shared validation lives in `src/shared/lib/validators.ts`.
- No DB logic in React components; no business logic in route files.

> Note: public pages use a `(shop)` route group so the storefront shares one
> Navbar/Footer shell. URLs are unchanged (`/`, `/products`, `/cart`,
> `/checkout`).

## Rendering strategy (SSR / ISR / CSR)

| Area | Strategy | Why |
| --- | --- | --- |
| Home page | **ISR** (`revalidate = 60`) | Public, SEO-friendly catalog; refreshes periodically. |
| Product listing | **ISR** (`revalidate = 60`) | Catalog is public; search/filter/sort are done client-side. |
| Cart | **CSR** | Cart lives in `localStorage` and is fully interactive. |
| Checkout | **CSR** | Interactive form, posts the order, then opens WhatsApp. |
| Add to cart / filters | **CSR** | Per-user, highly interactive. |
| Admin dashboard | **SSR** (`force-dynamic`) | Must be fresh and protected. |
| Admin orders + order detail | **SSR** | Fresh, protected, filterable. |
| Admin product management | **SSR** list + **CSR** forms | Fresh data; interactive editing. |

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment files

Create one file for local development and one for production:

```bash
cp .env.example .env.development.local
cp .env.example .env.production.local
```

```
MONGODB_URI=mongodb://localhost:27017/namkeen420
JWT_SECRET=change_this_to_a_long_secret
ADMIN_EMAIL=admin@namkeen420.com
ADMIN_PASSWORD=admin123
NEXT_PUBLIC_BUSINESS_WHATSAPP_NUMBER=91XXXXXXXXXX
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> **Change the WhatsApp number** in `NEXT_PUBLIC_BUSINESS_WHATSAPP_NUMBER`
> (format `91XXXXXXXXXX`, country code + number, digits only). This is the
> number customer orders are sent to. The helper that builds messages lives in
> `src/shared/lib/whatsapp.ts`.

> Product image uploads use signed Cloudinary uploads. Set
> `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and
> `CLOUDINARY_API_SECRET`; admins can still paste an image URL manually from the
> product form.

Next.js loads `.env.development.local` when running `npm run dev`, and
`.env.production.local` when running `npm run build` / `npm run start`.

### 3. Run MongoDB

Make sure MongoDB is running locally (or point `MONGODB_URI` at Atlas):

```bash
# macOS (Homebrew)
brew services start mongodb-community

# or with Docker
docker run -d -p 27017:27017 --name namkeen-mongo mongo:7
```

### 4. Seed the database

Inserts the 8 starter products and one admin user (from `ADMIN_EMAIL` / `ADMIN_PASSWORD`):

```bash
npm run seed:dev
```

Use `npm run seed:prod` only when you intentionally want to seed the production
database.

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin login

- URL: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Email: value of `ADMIN_EMAIL` (default `admin@namkeen420.com`)
- Password: value of `ADMIN_PASSWORD` (default `admin123`)

Auth uses a JWT stored in an httpOnly cookie. `src/middleware.ts` protects all
`/admin/*` pages; admin API routes additionally enforce auth in their handlers.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run seed` | Seed the development database |
| `npm run seed:dev` | Seed with `.env.development.local` |
| `npm run seed:prod` | Seed with `.env.production.local` |

## API routes

| Method | Path | Auth |
| --- | --- | --- |
| POST | `/api/auth/login` | public |
| POST | `/api/auth/logout` | public |
| GET | `/api/auth/me` | admin |
| GET | `/api/products` | public (`?all=true` is admin) |
| POST | `/api/products` | admin |
| GET | `/api/products/:id` | public |
| PUT | `/api/products/:id` | admin |
| DELETE | `/api/products/:id` | admin |
| POST | `/api/orders` | public (checkout) |
| GET | `/api/orders` | admin |
| GET | `/api/orders/:id` | admin |
| PUT | `/api/orders/:id` | admin (updates status) |
| PUT | `/api/orders/:id/status` | admin |
| PUT | `/api/orders/:id/payment-link` | admin |

All responses use a consistent envelope: `{ success, data }` or
`{ success, error: { message } }`.

## MVP boundaries

Included: catalog, cart, checkout, WhatsApp order, admin login, dashboard,
product CRUD, order management, manual payment-link field.

Not included yet: Razorpay automatic payment links, customer accounts, delivery
tracking, multi-vendor, inventory batches, coupons, reviews.
