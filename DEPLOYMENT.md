# Vercel Deployment Checklist

## Before Deploying

1. **Switch Prisma to PostgreSQL** (SQLite won't work on Vercel)
   - Edit `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"  // Change from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
   - Create a new migration: `npx prisma migrate dev --name switch-to-postgres`

2. **Set up PostgreSQL Database**
   - Recommended: [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (integrated)
   - Alternatives: Neon, Supabase, Railway, or any PostgreSQL provider
   - Copy the connection string

## Deploy Steps

### Option 1: Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2: GitHub Integration
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Next.js

## Environment Variables

Set these in Vercel Dashboard → Project → Settings → Environment Variables:

```
AUTH0_SECRET=your-long-random-string
AUTH0_BASE_URL=https://your-app.vercel.app
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

Generate AUTH0_SECRET:
```bash
openssl rand -hex 32
```

## Update Auth0 Settings

In Auth0 Dashboard → Applications → Your App:

- **Allowed Callback URLs**: `https://your-app.vercel.app/api/auth/callback`
- **Allowed Logout URLs**: `https://your-app.vercel.app`
- **Allowed Web Origins**: `https://your-app.vercel.app`

## Verify Deployment

1. Visit your Vercel URL
2. Click Login (should redirect to Auth0)
3. After login, you should see the car inventory dashboard
4. Test adding/editing a car

## Troubleshooting

- **Build fails**: Check that `prisma generate` runs successfully
- **Database errors**: Verify `DATABASE_URL` is correct and database is accessible
- **Auth errors**: Double-check Auth0 callback URLs match your Vercel URL
- **Migration errors**: Run `npx prisma migrate deploy` manually if needed

