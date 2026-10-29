import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://dnjovcnbtzcipysxxbiz.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuam92Y25idHpjaXB5c3h4Yml6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyOTE0OTMsImV4cCI6MjEwODg2NzQ5M30.c2WWMXyr2ovCeNYxXagpwLQ7SyOzWmfkBvIDM29jKa0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
