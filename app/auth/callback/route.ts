import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const origin = requestUrl.origin;

  // Handle OAuth errors from provider
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(errorDescription || 'Authentication failed')}`
    );
  }

  if (code) {
    const supabase = await createClient();
    
    try {
      // Exchange the code for a session
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError);
        return NextResponse.redirect(
          `${origin}/login?error=auth_failed&error_description=${encodeURIComponent(exchangeError.message)}`
        );
      }

      if (data.session) {
        // Successfully authenticated
        return NextResponse.redirect(`${origin}/dashboard`);
      }
    } catch (err) {
      console.error('Unexpected error during authentication:', err);
      return NextResponse.redirect(
        `${origin}/login?error=unexpected_error&error_description=${encodeURIComponent('An unexpected error occurred')}`
      );
    }
  }

  // No code provided, redirect to login
  return NextResponse.redirect(`${origin}/login?error=no_code`);
}