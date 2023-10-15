import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = "https://xejcpoignjppkukvjzqt.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlamNwb2lnbmpwcGt1a3ZqenF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAzMDcyNjcsImV4cCI6MjAwNTg4MzI2N30.wiX8Q7_uSfGan9CwlRk00nz7IfJo_WVo8yz3rWUYNs8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: false
    }
})