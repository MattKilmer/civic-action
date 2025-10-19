# Deployment Guide - takecivicaction.org

## Quick Deploy to Vercel

### Step 1: Install Vercel CLI (Optional)

```bash
npm i -g vercel
```

### Step 2: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository: `MattKilmer/civic-action`
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

### Step 3: Add Environment Variables

In the Vercel dashboard, add these environment variables:

**Required:**
- `OPENAI_API_KEY`: Your OpenAI API key from https://platform.openai.com/api-keys

**Optional:**
- `APP_BASE_URL`: `https://takecivicaction.org` (or leave blank, Vercel auto-detects)

### Step 4: Connect Custom Domain

1. In Vercel dashboard, go to **Project Settings** → **Domains**
2. Add domain: `takecivicaction.org`
3. Add `www.takecivicaction.org` (optional, will redirect to main domain)
4. Vercel will provide DNS records to add to your domain registrar

**DNS Configuration:**

If your domain is already on Vercel's nameservers, it should auto-configure.

Otherwise, add these DNS records at your domain registrar:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 5: Deploy

Click **Deploy** and wait for build to complete (~2 minutes).

Your site will be live at:
- https://takecivicaction.org
- https://civic-action-[random].vercel.app (preview URL)

## Deploy via CLI (Alternative)

If you prefer command line:

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow the prompts
```

## Post-Deployment Checklist

- [ ] Visit https://takecivicaction.org and test address lookup
- [ ] Enter a test address (e.g., "San Francisco, CA")
- [ ] Verify officials load correctly
- [ ] Test AI draft generation (requires OPENAI_API_KEY)
- [ ] Check that all links work (phone, website)
- [ ] Test on mobile device
- [ ] Verify privacy footer displays correctly

## Environment Variables Setup

### Local Development
```bash
cp .env.local.example .env.local
# Edit .env.local and add your OPENAI_API_KEY
```

### Production (Vercel)
Add via dashboard: **Project Settings** → **Environment Variables**

## Automatic Deployments

Once connected, Vercel will automatically:
- Deploy `main` branch to production (takecivicaction.org)
- Deploy pull requests to preview URLs
- Run builds on every push

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all dependencies in package.json
- Ensure Next.js 14.2.5 compatibility

### Domain Not Working
- Wait 24-48 hours for DNS propagation
- Verify DNS records at registrar
- Check Vercel domain settings

### API Errors
- Verify OPENAI_API_KEY is set in Vercel environment variables
- Check Vercel function logs for errors
- 5 Calls API requires no key (should work automatically)

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Project Issues: https://github.com/MattKilmer/civic-action/issues
