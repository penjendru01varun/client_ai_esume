
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Supabase credentials are missing. Supabase client will not be initialized.')
        // Return a mock or handle as needed, but returning createBrowserClient with empty strings 
        // will still fail, so we might need to handle the undefined case in components.
        // However, the error usually happens because of the '!' operator.
    }

    return createBrowserClient(
        supabaseUrl || '',
        supabaseAnonKey || ''
    )
}
