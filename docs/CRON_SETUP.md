# Vercel Cron Job Setup

This project uses a Vercel Cron job to keep the state bill search API warm and prevent cold start timeouts.

## How It Works

- **Endpoint**: `/api/cron/warmup`
- **Schedule**: Every 3 minutes (`*/3 * * * *`)
- **Purpose**: Makes lightweight requests to the state bill search API to keep it warm
- **States Warmed**: California, Texas, Florida, New York (covers ~33% of US population)
- **Prevents**: Cold start timeouts that cause "operation was aborted" errors

## Setup Instructions

### 1. Generate a CRON_SECRET

```bash
# Generate a random secret (copy the output)
openssl rand -base64 32
```

### 2. Add to Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `CRON_SECRET`
   - **Value**: (paste the secret you generated)
   - **Environment**: Production, Preview, Development (select all)
4. Click **Save**

### 3. Deploy

The cron job is configured in `vercel.json` and will automatically start running after deployment.

```bash
git add .
git commit -m "feat: Add cron job to prevent cold starts"
git push origin main
```

### 4. Verify It's Working

**Option A: Check Vercel Dashboard**
1. Go to **Deployments** → Select your latest deployment
2. Click **Logs** tab
3. Filter by `/api/cron/warmup` to see cron executions
4. You should see logs every 3 minutes

**Option B: Manual Test (local)**
```bash
# Set your CRON_SECRET in .env.local
echo "CRON_SECRET=$(openssl rand -base64 32)" >> .env.local

# Test the endpoint
curl -H "Authorization: Bearer YOUR_SECRET_HERE" http://localhost:3000/api/cron/warmup
```

## Expected Behavior

**Success Response:**
```json
{
  "success": true,
  "timestamp": "2025-10-22T16:30:00.000Z",
  "warmupUrl": "https://your-domain.vercel.app/api/bills/search-state?q=budget&jurisdiction=California",
  "status": 200,
  "billsFound": 10
}
```

**Unauthorized (missing/wrong secret):**
```json
{
  "error": "Unauthorized"
}
```

## Troubleshooting

**Cron job not running:**
- Verify `CRON_SECRET` is set in Vercel environment variables
- Check Vercel deployment logs for errors
- Ensure `vercel.json` has the `crons` configuration

**Still seeing cold start errors:**
- The cron runs every 3 minutes, so there should be minimal cold start windows
- The retry logic in `app/lib/openstates.ts` (15s + 8s) should handle most cases
- If still seeing errors, Open States API may be experiencing issues

## Cost Considerations

- Vercel Hobby plan: 100 cron executions/day (free)
- This setup uses ~480 executions/day (every 3 minutes)
- **Requires Pro plan** ($20/month) for unlimited cron jobs
- Alternative: Use external service like cron-job.org (free) to ping the warmup endpoint

## Alternative: External Cron Service

If you don't want to pay for Vercel Pro, you can use a free external cron service:

1. Sign up at [cron-job.org](https://cron-job.org) (free)
2. Create a new cron job:
   - URL: `https://your-domain.vercel.app/api/cron/warmup`
   - Schedule: Every 3 minutes
   - HTTP Header: `Authorization: Bearer YOUR_CRON_SECRET`
3. This achieves the same result without using Vercel's cron feature

## References

- [Vercel Cron Jobs Documentation](https://vercel.com/docs/cron-jobs)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
