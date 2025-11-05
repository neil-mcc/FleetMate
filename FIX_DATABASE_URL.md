# Fix DATABASE_URL Error

## The Problem
Prisma needs `DATABASE_URL` to start with `postgresql://` or `postgres://`, but it's either missing or incorrectly formatted in Vercel.

## Solution

### If using Vercel Postgres (recommended):

1. **Go to Vercel Dashboard**:
   - Visit: https://vercel.com/neil-mccs-projects/car-inventory/settings/environment-variables

2. **Check POSTGRES_URL value** (it should be set automatically)

3. **Set DATABASE_URL to match POSTGRES_URL**:
   - Click "Add New" or edit existing DATABASE_URL
   - Copy the value from POSTGRES_URL
   - Ensure it starts with `postgresql://` or `postgres://`
   - Apply to: Production, Preview, Development

4. **Alternative: Use Vercel CLI**:
   ```bash
   # Remove existing DATABASE_URL if wrong
   npx vercel env rm DATABASE_URL production
   npx vercel env rm DATABASE_URL preview
   npx vercel env rm DATABASE_URL development
   
   # Add correct DATABASE_URL (use your actual Postgres connection string)
   npx vercel env add DATABASE_URL production
   # When prompted, paste: postgresql://user:password@host:5432/dbname
   ```

### Or use an external PostgreSQL database:

1. Get connection string from your provider (Neon, Supabase, Railway, etc.)
2. Format: `postgresql://user:password@host:5432/dbname`
3. Set in Vercel Dashboard → Environment Variables → DATABASE_URL

## After fixing, redeploy:

```bash
npx vercel --prod
```

## Verify:

After deployment, check build logs to ensure Prisma can connect:
- Should see: "Datasource db: PostgreSQL database"
- Should NOT see: "Error validating datasource"

