// MOCK MODE: Deno and Supabase connections mocked for development
export { }
// import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// @ts-ignore
const serve = (handler: any) => { console.log('Mock server registered'); }
const createClient = (url: string, key: string) => ({
    from: (table: any) => ({
        upsert: (data: any, options: any) => ({
            select: () => ({ data: [], error: null })
        })
    })
})

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: any) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        console.log('MOCK MODE: Using mocked credentials and connections')

        // Mock environment variables to avoid Deno errors
        const FOOTBALL_DATA_API_KEY = 'mock_football_key'
        const SUPABASE_URL = 'https://mock.supabase.co'
        const SUPABASE_SERVICE_KEY = 'mock_service_key'

        // Mock fetching fixtures (skipping external API call)
        console.log('🏴󠁧󠁢󠁥󠁮󠁧󠁿 Fetching Premier League fixtures (MOCKED)...')

        // Mock data that would have come from the API
        const fixtures = [
            {
                match_id: 123456,
                gameweek: 1,
                home_team: 'Mock Home',
                away_team: 'Mock Away',
                home_team_id: 1,
                away_team_id: 2,
                kickoff_time: new Date().toISOString(),
                status: 'SCHEDULED',
                home_score: null,
                away_score: null,
                updated_at: new Date().toISOString()
            }
        ]

        console.log(`📊 Received ${fixtures.length} matches (MOCKED)`)

        // Mock Supabase client
        console.log(`💾 Upserting ${fixtures.length} fixtures to database...`)

        // Mock the Supabase interaction
        const upsertedData = fixtures
        const error = null

        console.log(`✅ Successfully synced ${fixtures.length} fixtures (MOCKED)`)

        return new Response(
            JSON.stringify({
                success: true,
                count: fixtures.length,
                message: `Synced ${fixtures.length} Premier League fixtures (MOCKED)`
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        )
    } catch (error: any) {
        console.error('❌ Error:', error)
        return new Response(
            JSON.stringify({
                success: false,
                error: error.message
            }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    }
})
