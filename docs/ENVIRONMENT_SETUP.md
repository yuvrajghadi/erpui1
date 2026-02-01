# Environment Variables Setup

## Overview
This document explains how to set up environment variables for local development and production deployment on Vercel.

## Local Development

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local` with your values:**
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
   NEXT_PUBLIC_DEBUG_LOGS=true
   ```

3. **Restart your development server:**
   ```bash
   npm run dev
   ```

## Production Deployment (Vercel)

### Setting Environment Variables in Vercel

1. **Via Vercel Dashboard:**
   - Go to your project settings: https://vercel.com/your-team/erp-ui/settings/environment-variables
   - Click "Add New"
   - Add the following variables:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `NEXT_PUBLIC_API_BASE_URL` | `https://your-api-domain.com` | Production, Preview |
   | `NEXT_PUBLIC_DEBUG_LOGS` | `false` | Production |

2. **Via Vercel CLI:**
   ```bash
   # Add environment variable for production
   vercel env add NEXT_PUBLIC_API_BASE_URL production
   # Enter value: https://your-api-domain.com
   
   # Pull environment variables locally
   vercel env pull .env.local
   ```

### Important Notes

- **All variables starting with `NEXT_PUBLIC_`** are exposed to the browser
- **Never commit `.env.local`** to version control (already in `.gitignore`)
- **Always set production values** in Vercel dashboard, not in code
- **Redeploy after adding env vars** for changes to take effect

## Required Environment Variables

### `NEXT_PUBLIC_API_BASE_URL` (Required)
The base URL for your API endpoints.

- **Local Development:** `http://localhost:3000`
- **Production:** `https://your-production-api.com`
- **Default Fallback:** Uses `window.location.origin` if not set

### `NEXT_PUBLIC_DEBUG_LOGS` (Optional)
Enable or disable debug logging.

- **Local Development:** `true`
- **Production:** `false`
- **Default:** Automatically `true` in development, `false` in production

## Troubleshooting

### "Missing environment variable" Error

If you see this error in the console:
```
Missing environment variable: NEXT_PUBLIC_API_BASE_URL
```

**Solution:**
1. Check that `.env.local` exists and contains the variable
2. Restart your development server (`npm run dev`)
3. For production, add the variable in Vercel dashboard
4. Redeploy your application

### API Calls Failing

If API calls are returning 404 or failing:
1. Verify `NEXT_PUBLIC_API_BASE_URL` points to the correct endpoint
2. Check network tab in browser DevTools
3. Ensure CORS is configured on your API server
4. Check that your API is running and accessible

### Variables Not Updating

If changes to `.env.local` aren't taking effect:
1. Stop the development server
2. Delete `.next` folder: `rm -rf .next`
3. Restart: `npm run dev`

For production:
1. Update variables in Vercel dashboard
2. Trigger a new deployment (push to git or manual deploy)

## Best Practices

1. ✅ **Use `.env.local`** for local development secrets
2. ✅ **Set production vars** in Vercel dashboard
3. ✅ **Document all required vars** in `.env.example`
4. ✅ **Never commit** `.env.local` or `.env.production`
5. ✅ **Use `NEXT_PUBLIC_` prefix** only for browser-safe variables
6. ❌ **Never expose** API keys, secrets, or passwords with `NEXT_PUBLIC_`

## Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Configuration](https://nextjs.org/docs/api-reference/next.config.js/introduction)

---

**Last Updated:** January 31, 2026
