# Google OAuth Setup Guide

This guide will help you configure Google OAuth authentication for the ENEM Essay Corrector application.

## Prerequisites

- Supabase project created and configured
- Google Cloud Console account

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen first:
   - Choose **External** user type
   - Fill in the required fields:
     - App name: `ENEM Essay Corrector`
     - User support email: Your email
     - Developer contact email: Your email
   - Add scopes (optional for now)
   - Add test users if needed
   - Save and continue

## Step 2: Configure OAuth Client ID

1. Select **Web application** as the application type
2. Name: `ENEM Essay Corrector - Supabase`
3. Add **Authorized JavaScript origins**:
   ```
   https://<your-project-ref>.supabase.co
   ```
4. Add **Authorized redirect URIs**:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
   
   Replace `<your-project-ref>` with your actual Supabase project reference ID.
   
   You can find this in your Supabase project URL or in the project settings.

5. Click **Create**
6. Copy the **Client ID** and **Client Secret** - you'll need these for Supabase

## Step 3: Configure Supabase

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** > **Providers**
4. Find **Google** in the list and click to expand
5. Enable the Google provider
6. Paste your Google OAuth credentials:
   - **Client ID**: The Client ID from Google Cloud Console
   - **Client Secret**: The Client Secret from Google Cloud Console
7. Click **Save**

## Step 4: Add Redirect URL to Your Application

The redirect URL is already configured in the application:
- Callback route: `/auth/callback`
- Full URL: `http://localhost:3000/auth/callback` (development)

For production, update the Google OAuth authorized redirect URIs to include:
```
https://your-production-domain.com/auth/callback
```

## Step 5: Test the Authentication

1. Start your development server:
   ```bash
   cd enem-essay-corrector
   pnpm dev
   ```

2. Navigate to `http://localhost:3000`
3. Click on "Entrar" or "Começar Agora"
4. Click the "Continuar com Google" button
5. You should be redirected to Google's OAuth consent screen
6. After authorizing, you should be redirected back to `/dashboard`

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Verify that the redirect URI in Google Cloud Console exactly matches the Supabase callback URL
- Make sure there are no trailing slashes
- Check that you're using the correct Supabase project reference

### Error: "Access blocked: This app's request is invalid"
- Make sure you've configured the OAuth consent screen
- Add your email as a test user if the app is in testing mode
- Verify that all required fields in the consent screen are filled

### User not being created in database
- Check that the RLS policies are correctly set up
- Verify that the `handle_new_user()` trigger function is working
- Check Supabase logs for any errors

### Session not persisting
- Verify that cookies are enabled in your browser
- Check that the middleware is correctly configured
- Ensure environment variables are properly set

## Environment Variables

Make sure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Security Notes

1. **Never commit** your Google OAuth Client Secret to version control
2. Keep your Supabase keys secure
3. In production, use environment variables for all sensitive data
4. Regularly rotate your OAuth credentials
5. Monitor your Google Cloud Console for unusual activity

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Authentication Patterns](https://nextjs.org/docs/authentication)

## Next Steps

After setting up Google OAuth:
1. Test the complete authentication flow
2. Verify user data is being stored correctly in the database
3. Test the logout functionality
4. Proceed to Phase 4: Essay Upload System