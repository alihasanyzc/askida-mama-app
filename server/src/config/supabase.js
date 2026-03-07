const { createClient } = require('@supabase/supabase-js');
const env = require('./env');

// Supabase Admin Client (Service Role Key - backend işlemleri için)
// Bu client tüm RLS politikalarını bypass eder
const supabaseAdmin = createClient(
  env.SUPABASE_URL || '',
  env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Supabase Public Client (Anon Key - kullanıcı bazlı işlemler için)
const supabase = createClient(
  env.SUPABASE_URL || '',
  env.SUPABASE_ANON_KEY || '',
);

module.exports = { supabase, supabaseAdmin };
