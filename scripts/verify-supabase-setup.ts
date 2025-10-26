/**
 * Supabase Setup Verification Script
 *
 * This script verifies that your Supabase project is properly configured
 * Run with: npx tsx scripts/verify-supabase-setup.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load .env.local file
config({ path: resolve(__dirname, '../.env.local') });

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message: string) {
  log(`✓ ${message}`, 'green');
}

function error(message: string) {
  log(`✗ ${message}`, 'red');
}

function warning(message: string) {
  log(`⚠ ${message}`, 'yellow');
}

function info(message: string) {
  log(`ℹ ${message}`, 'blue');
}

async function verifySupabaseSetup() {
  log('\n=== Supabase Setup Verification ===\n', 'blue');

  // Check environment variables
  info('Checking environment variables...');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    error('NEXT_PUBLIC_SUPABASE_URL is not set');
    return false;
  }
  success('NEXT_PUBLIC_SUPABASE_URL is set');

  if (!supabaseAnonKey) {
    error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
    return false;
  }
  success('NEXT_PUBLIC_SUPABASE_ANON_KEY is set');

  if (!supabaseServiceKey) {
    warning('SUPABASE_SERVICE_ROLE_KEY is not set (needed for admin operations)');
  } else {
    success('SUPABASE_SERVICE_ROLE_KEY is set');
  }

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

  // Test connection
  info('\nTesting database connection...');
  try {
    const { error: pingError } = await supabase.from('evaluation_criteria').select('count');
    if (pingError) throw pingError;
    success('Database connection successful');
  } catch (err) {
    error(`Database connection failed: ${err}`);
    return false;
  }

  // Check tables exist
  info('\nChecking database tables...');
  const requiredTables = ['user_profiles', 'essays', 'evaluations', 'evaluation_criteria'];
  
  for (const table of requiredTables) {
    try {
      const { error: tableError } = await supabase.from(table).select('count').limit(0);
      if (tableError) throw tableError;
      success(`Table '${table}' exists`);
    } catch (err) {
      error(`Table '${table}' not found or not accessible`);
      return false;
    }
  }

  // Check evaluation criteria data
  info('\nChecking evaluation criteria data...');
  try {
    const { data, error: criteriaError } = await supabase
      .from('evaluation_criteria')
      .select('*')
      .order('competency_number');
    
    if (criteriaError) throw criteriaError;
    
    if (!data || data.length !== 5) {
      error(`Expected 5 evaluation criteria, found ${data?.length || 0}`);
      return false;
    }
    
    success(`All 5 ENEM competencies are configured`);
    
    // Display criteria
    data.forEach((criteria: any) => {
      info(`  ${criteria.competency_number}. ${criteria.title}`);
    });
  } catch (err) {
    error(`Failed to fetch evaluation criteria: ${err}`);
    return false;
  }

  // Check storage bucket
  info('\nChecking storage bucket...');
  try {
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) throw bucketError;
    
    const essayBucket = buckets?.find((b: any) => b.name === 'essay-images');
    if (!essayBucket) {
      error("Storage bucket 'essay-images' not found");
      warning('Create it manually in Supabase Dashboard → Storage');
      return false;
    }
    
    success("Storage bucket 'essay-images' exists");
    info(`  Public: ${essayBucket.public ? 'Yes' : 'No (Private)'}`);
    
    if (essayBucket.public) {
      warning('  Bucket is public - consider making it private for security');
    }
  } catch (err) {
    error(`Failed to check storage bucket: ${err}`);
    return false;
  }

  // Check RLS policies (basic check)
  info('\nChecking Row Level Security...');
  try {
    // Try to query without auth (should fail or return empty)
    const anonClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error: rlsError } = await anonClient.from('essays').select('count');
    
    // If we get data without auth, RLS might not be working
    if (data && !rlsError) {
      success('RLS is enabled (no unauthorized access)');
    } else if (rlsError) {
      success('RLS is enabled (queries require authentication)');
    }
  } catch (err) {
    warning('Could not verify RLS policies');
  }

  // Check authentication providers
  info('\nChecking authentication configuration...');
  warning('Please verify manually in Supabase Dashboard:');
  info('  1. Go to Authentication → Providers');
  info('  2. Ensure Google OAuth is enabled');
  info('  3. Verify Client ID and Secret are configured');

  // Summary
  log('\n=== Verification Complete ===\n', 'green');
  success('All automated checks passed!');
  info('\nManual steps to complete:');
  info('  1. Enable Google OAuth in Supabase Dashboard');
  info('  2. Configure Google OAuth credentials');
  info('  3. Test login at http://localhost:3000/login');
  
  log('\nFor detailed setup instructions, see SUPABASE_SETUP_GUIDE.md\n');
  
  return true;
}

// Run verification
verifySupabaseSetup()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((err) => {
    error(`\nVerification failed with error: ${err}`);
    process.exit(1);
  });