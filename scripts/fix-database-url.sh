#!/bin/bash
# Script to sync POSTGRES_URL to DATABASE_URL in Vercel

echo "This script will help you set DATABASE_URL from POSTGRES_URL in Vercel."
echo ""
echo "Option 1: Use Vercel Dashboard (Easiest)"
echo "1. Go to: https://vercel.com/neil-mccs-projects/fleet-mate/settings/environment-variables"
echo "2. Find POSTGRES_URL and copy its value"
echo "3. Edit DATABASE_URL and paste the same value"
echo "4. Ensure it starts with 'postgresql://' or 'postgres://'"
echo ""
echo "Option 2: Use Vercel CLI"
echo "Run: npx vercel env add DATABASE_URL production"
echo "Then paste your PostgreSQL connection string when prompted"
echo ""
echo "After setting DATABASE_URL, redeploy with: npx vercel --prod"

