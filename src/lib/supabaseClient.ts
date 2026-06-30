import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// เพิ่มบรรทัดนี้เพื่อเช็คค่าใน Console ของ Browser
console.log('Check URL:', supabaseUrl)
console.log('Check Key:', supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('ทำไมค่ามันไม่มาล่ะเนี่ย! เช็คไฟล์ .env.local ด่วน')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)