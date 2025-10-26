import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { addSampleEssaysToUser } from '@/lib/services/samples';

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

      if (data.user && data.session) {
        // Check if a user profile already exists
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('id', data.user.id)
          .maybeSingle();

        // If no profile exists, this is the user's first login.
        if (!profile && !profileError) {
          // Create a new user profile
          const { error: insertError } = await supabase.from('user_profiles').insert({
            id: data.user.id,
            full_name: data.user.user_metadata.full_name,
            avatar_url: data.user.user_metadata.avatar_url,
          });

          if (insertError) {
            console.error('Error creating user profile:', insertError);
          } else {
            // Add sample essays for the new user
            try {
              await addSampleEssaysToUser(supabase, data.user.id);
            } catch (sampleError) {
              console.error('Failed to add sample essays for new user:', sampleError);
            }
          }
        }
        
        // Successfully authenticated, redirect to dashboard
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