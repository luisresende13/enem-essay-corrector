# OAuth Troubleshooting Guide

## Common Error: "Unable to exchange external code"

This error occurs when there's a mismatch between the OAuth configuration in Google Cloud Console and Supabase.

### Error Message
```
server_error: Unable to exchange external code
```

### Root Causes

1. **Incorrect Redirect URI in Google Cloud Console**
   - The redirect URI must EXACTLY match Supabase's callback URL
   - Format: `https://<your-project-ref>.supabase.co/auth/v1/callback`

2. **Google OAuth Client Not Configured in Supabase**
   - Client ID and Client Secret not added to Supabase
   - Google provider not enabled

3. **OAuth Consent Screen Issues**
   - App not published (if using external users)
   - Missing required scopes
   - Test users not added (for testing mode)

### Solution Steps

#### Step 1: Verify Supabase Project Reference
1. Go to your Supabase Dashboard
2. Navigate to Project Settings > API
3. Copy your Project URL (e.g., `https://abcdefghijklmnop.supabase.co`)
4. Your project reference is the subdomain: `abcdefghijklmnop`

#### Step 2: Update Google Cloud Console Redirect URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, ensure you have:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
   
   **Important Notes:**
   - Replace `<your-project-ref>` with your actual Supabase project reference
   - Do NOT include a trailing slash
   - Use `https://` not `http://`
   - The path must be `/auth/v1/callback` (not `/auth/callback`)

5. Click **Save**

#### Step 3: Configure Supabase Authentication

1. Go to Supabase Dashboard > Authentication > Providers
2. Find **Google** and click to expand
3. Toggle **Enable Sign in with Google** to ON
4. Enter your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
5. Click **Save**

#### Step 4: Verify OAuth Consent Screen

1. In Google Cloud Console, go to **APIs & Services** > **OAuth consent screen**
2. Ensure the following:
   - App name is set
   - User support email is set
   - Developer contact email is set
   - Authorized domains includes your domain (if applicable)

3. If using **Testing** mode:
   - Add your Google account email to **Test users**
   - Only test users can authenticate

4. If using **Production** mode:
   - Submit app for verification (if needed)
   - Or keep in testing mode for development

#### Step 5: Clear Browser Cache and Cookies

Sometimes cached OAuth data can cause issues:
1. Clear your browser cache
2. Clear cookies for both `localhost` and `supabase.co`
3. Try authentication again in an incognito/private window

#### Step 6: Check Supabase Logs

1. Go to Supabase Dashboard > Logs
2. Filter by **Auth** logs
3. Look for detailed error messages
4. Common issues shown in logs:
   - Invalid client credentials
   - Redirect URI mismatch
   - Token exchange failures

### Testing the Fix

1. Restart your development server:
   ```bash
   cd enem-essay-corrector
   pnpm dev
   ```

2. Navigate to `http://localhost:3000/login`

3. Click "Continuar com Google"

4. You should be redirected to Google's OAuth consent screen

5. After authorizing, you should be redirected to `/dashboard`

### Additional Checks

#### Verify Environment Variables

Ensure your `.env.local` has the correct values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

#### Check Network Tab

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to login
4. Look for the OAuth redirect chain:
   - Request to `/auth/callback?code=...`
   - Should see 302 redirect to `/dashboard`
   - If you see errors, check the response details

#### Verify Callback Handler

The callback route should be at: `app/auth/callback/route.ts`

It should handle:
- Code exchange
- Error handling
- Redirects

### Still Having Issues?

If you're still experiencing problems:

1. **Double-check all URLs**
   - Supabase project URL
   - Google redirect URI
   - No typos or extra characters

2. **Regenerate OAuth Credentials**
   - Create a new OAuth Client ID in Google Cloud Console
   - Update Supabase with new credentials

3. **Check Supabase Status**
   - Visit [Supabase Status Page](https://status.supabase.com/)
   - Ensure no ongoing incidents

4. **Enable Debug Mode**
   - Add console.log statements in callback handler
   - Check server logs for detailed errors

5. **Try a Different Browser**
   - Some browsers have strict cookie policies
   - Test in Chrome, Firefox, or Edge

### Development vs Production

#### Development (localhost:3000)
- Google OAuth redirect: `https://<project-ref>.supabase.co/auth/v1/callback`
- App callback: `http://localhost:3000/auth/callback`
- Supabase handles the OAuth flow and redirects back to your app

#### Production
- Add production domain to Google OAuth authorized origins
- Add production callback URL: `https://yourdomain.com/auth/callback`
- Update Supabase site URL in project settings

### Security Best Practices

1. Never commit OAuth credentials to version control
2. Use environment variables for all sensitive data
3. Regularly rotate OAuth secrets
4. Monitor authentication logs for suspicious activity
5. Keep Supabase and dependencies updated

### Related Documentation

- [Supabase Auth with OAuth](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth 2.0 Setup](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

### Quick Reference: Correct URLs

Replace `<project-ref>` with your actual Supabase project reference:

| Purpose | URL Format |
|---------|-----------|
| Supabase Project URL | `https://<project-ref>.supabase.co` |
| Google Redirect URI | `https://<project-ref>.supabase.co/auth/v1/callback` |
| App Callback (Dev) | `http://localhost:3000/auth/callback` |
| App Callback (Prod) | `https://yourdomain.com/auth/callback` |

---

**Last Updated:** Phase 3 Implementation
**Status:** Active troubleshooting guide for OAuth configuration issues