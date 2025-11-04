# Car Inventory

A modern, Auth0-protected car inventory dashboard built with Next.js, shadcn/ui, Tailwind CSS, Prisma (SQLite), and React Query.

## Tech Stack
- Next.js 14 (App Router)
- shadcn/ui + Tailwind CSS
- Auth0 (`@auth0/nextjs-auth0`)
- Prisma ORM + SQLite
- React Query for data fetching

## Getting Started

1) Install dependencies
```bash
pnpm i # or npm i / yarn
```

2) Create environment file
```bash
cp env.example .env
```
Fill in Auth0 values:
- `AUTH0_BASE_URL` = `http://localhost:3000`
- `AUTH0_ISSUER_BASE_URL` = `https://YOUR_TENANT.region.auth0.com`
- `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`
- `AUTH0_SECRET` = a long random string

3) Initialize Prisma & database
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
```

4) Run the dev server
```bash
npm run dev
```
Open `http://localhost:3000`.

## Auth
- Login: `/api/auth/login`
- Logout: `/api/auth/logout`
- Routes protected via `middleware.ts` (all app pages and `/api/cars/*`).

## Car Model
- Registration Number
- Make & Model
- Year
- Last Service Date
- Next Service Due
- MOT Due Date
- Insurance Renewal Date
- Tax Renewal Date

## Deployment to Vercel

### Prerequisites
⚠️ **Important**: SQLite won't work on Vercel's serverless functions. You need to use a hosted database (PostgreSQL recommended).

### Steps

1. **Set up a PostgreSQL database**
   - Use [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres), [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app)
   - Get your connection string (e.g., `postgresql://user:pass@host:5432/dbname`)

2. **Update Prisma schema for PostgreSQL**
   - Edit `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"  // Change from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

3. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI (if not already installed)
   npm i -g vercel
   
   # Deploy
   vercel
   ```
   Or connect your GitHub repo to Vercel dashboard.

4. **Set Environment Variables in Vercel**
   In Vercel Dashboard → Your Project → Settings → Environment Variables:
   - `AUTH0_SECRET` - Generate with: `openssl rand -hex 32`
   - `AUTH0_BASE_URL` - Your Vercel app URL (e.g., `https://your-app.vercel.app`)
   - `AUTH0_ISSUER_BASE_URL` - Your Auth0 tenant URL
   - `AUTH0_CLIENT_ID` - From Auth0 dashboard
   - `AUTH0_CLIENT_SECRET` - From Auth0 dashboard
   - `DATABASE_URL` - Your PostgreSQL connection string

5. **Update Auth0 Application Settings**
   - Allowed Callback URLs: `https://your-app.vercel.app/api/auth/callback`
   - Allowed Logout URLs: `https://your-app.vercel.app`
   - Allowed Web Origins: `https://your-app.vercel.app`

6. **Run migrations**
   After deployment, run:
   ```bash
   vercel env pull .env.local  # Pull env vars locally
   npx prisma migrate deploy   # Deploy migrations
   npm run db:seed            # Optional: seed data
   ```
   Or use Vercel's build command: `prisma generate && prisma migrate deploy && next build`

### Other Platforms
- **Render/Netlify**: Similar setup, but ensure build command includes `prisma generate && prisma migrate deploy`

## Project Structure
- `app/` Next.js App Router pages and API routes
- `components/` UI and feature components
- `lib/` helpers and Prisma client
- `prisma/` Prisma schema and seed script

## Notes
- shadcn/ui components included locally (Button, Input, Dialog, Card, Badge, Table)
- Dark mode supported via Tailwind CSS variables
- React Query powers CRUD, optimistic updates can be added as an enhancement

# FleetMate
