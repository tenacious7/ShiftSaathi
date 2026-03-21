import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aqtcojbigzhzdofcbluc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxdGNvamJpZ3poemRvZmNibHVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNzE3MjYsImV4cCI6MjA4ODY0NzcyNn0.CvYmV4KE_hW_kBr_OTAacSI4BNBc1uax_wgWzgAi5Gs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
