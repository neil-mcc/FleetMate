# Vercel Deployment - Next Steps

## ✅ Deployment Started!

Your app was deployed to:
- **Preview**: https://car-inventory-e2g613p3l-neil-mccs-projects.vercel.app
- **Dashboard**: https://vercel.com/neil-mccs-projects/car-inventory

## ❌ Build Failed - Missing Database

The build failed because `DATABASE_URL` is not set. Here's how to fix it:

### Step 1: Set Up PostgreSQL Database

**Option A: Vercel Postgres (Recommended - Integrated)**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `car-inventory`
3. Go to **Storage** tab
4. Click **Create Database** → **Postgres**
5. Create database and copy the connection string

**Option B: External Database (Neon, Supabase, etc.)**
- Create a PostgreSQL database
- Get connection string (format: `postgresql://user:pass@host:5432/dbname`)

### Step 2: Add Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/neil-mccs-projects/car-inventory)
2. Click **Settings** → **Environment Variables**
3. Add these variables:

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
AUTH0_SECRET=generate-with-openssl-rand-hex-32
AUTH0_BASE_URL=https://car-inventory-e2g613p3l-neil-mccs-projects.vercel.app
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
```

**Generate AUTH0_SECRET:**
```bash
openssl rand -hex 32
```

### Step 3: Update Auth0 Settings

In Auth0 Dashboard → Applications → Your App:

- **Allowed Callback URLs**: 
  ```
  https://car-inventory-e2g613p3l-neil-mccs-projects.vercel.app/api/auth/callback
  ```
- **Allowed Logout URLs**: 
  ```
  https://car-inventory-e2g613p3l-neil-mccs-projects.vercel.app
  ```
- **Allowed Web Origins**: 
  ```
  https://car-inventory-e2g613p3l-neil-mccs-projects.vercel.app
  ```

### Step 4: Redeploy

After adding environment variables, Vercel will automatically redeploy. Or manually trigger:
```bash
npx vercel --prod
```

## 🎯 Expected Result

Once environment variables are set:
- Build will succeed
- Database migrations will run automatically
- App will be accessible at the Vercel URL
- Auth0 login will work

## 📝 Notes

- Your production URL might change when you promote to production domain
- Update Auth0 URLs if you set a custom domain
- First deployment may take 2-3 minutes for migrations

