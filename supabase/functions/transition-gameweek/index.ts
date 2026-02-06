// MOCK MODE: Deno and Supabase connections mocked for development
export { }
// import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// @ts-ignore
const serve = (handler: any) => { console.log('Mock server registered'); }
const createClient = (url: string, key: string) => ({
    from: (table: any) => ({
        select: (cols: any) => ({
            eq: (col: any, val: any) => ({
                single: () => ({ data: { value: { current_gameweek: 1 } }, error: null })
            })
        }),
        upsert: (data: any) => ({ error: null })
    })
})

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: any) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const SUPABASE_URL = 'https://mock.supabase.co'
        const SUPABASE_SERVICE_KEY = 'mock_key'
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

        console.log('🔄 Transitioning to next gameweek...')

        // 1. Get current state
        const { data: config, error: fetchError } = await supabase
            .from('system_config')
            .select('value')
            .eq('key', 'app_state')
            .single()

        if (fetchError) throw fetchError

        const currentGW = config.value.current_gameweek
        const nextGW = currentGW + 1

        if (nextGW > 38) {
            return new Response(JSON.stringify({ message: 'Season already finished.' }), { status: 200 })
        }

        // 2. Update to next gameweek
        const { error: updateError } = await supabase
            .from('system_config')
            .upsert({
                key: 'app_state',
                value: { ...config.value, current_gameweek: nextGW },
                updated_at: new Date().toISOString()
            })

        if (updateError) throw updateError

        console.log(`✅ Transitioned from GW${currentGW} to GW${nextGW}`)

        return new Response(
            JSON.stringify({
                success: true,
                previous_gameweek: currentGW,
                current_gameweek: nextGW
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        )
    } catch (error: any) {
        console.error('❌ Error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500
            }
        )
    }
})
