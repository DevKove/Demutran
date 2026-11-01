import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://acqausvydpkvciwmyski.supabase.co'
const supabasePublishableKey = 'sb_publishable_EQZEfHhD6J9yD_OB3czuDw_Dtf8ccqD'

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
})
