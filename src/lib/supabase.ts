/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
const rawKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const cleanUrl = rawUrl.trim().replace(/^['"]|['"]$/g, '');
const cleanKey = rawKey.trim().replace(/^['"]|['"]$/g, '');

export const isSupabaseConfigured = 
  cleanUrl !== '' && 
  cleanKey !== '' && 
  !cleanUrl.includes('YOUR_PROJECT_URL') && 
  !cleanUrl.includes('your_supabase_url_here') &&
  !cleanKey.includes('YOUR_PUBLISHABLE_KEY') && 
  !cleanKey.includes('your_supabase_anon_key_here') &&
  cleanUrl.startsWith('http');

// Initialize Supabase Client with environment variables directly.
// Uses a clean fallback string format only when not configured to prevent client-side initialization crash during module load.
const resolvedUrl = isSupabaseConfigured ? cleanUrl : 'https://your-actual-project-url.supabase.co';
const resolvedKey = isSupabaseConfigured ? cleanKey : 'your-actual-anon-key-here';

export const supabase = createClient(resolvedUrl, resolvedKey);


