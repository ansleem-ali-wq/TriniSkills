import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://voddmxgjweilleoxezdq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvZGRteGdqd2VpbGxlb3hlemRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0Njk2ODYsImV4cCI6MjA4ODA0NTY4Nn0.xuKKORIKP2aGGJZ9FF2prDoKQaQRiahQS5_baHnAXPI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
