# Supabase Edge Functions Deployment Guide

## Prerequisites

1. **Install Supabase CLI**:
```bash
npm install -g supabase
```

2. **Login to Supabase**:
```bash
supabase login
```

3. **Link to your project**:
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

## Deploy the Edge Function

```bash
# Deploy the fetch-fixtures function
supabase functions deploy fetch-fixtures

# Set the API key secret
supabase secrets set FOOTBALL_DATA_API_KEY=your_api_key_here
```

## Test the Function

```bash
# Test locally
supabase functions serve fetch-fixtures

# Test deployed function
curl -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/fetch-fixtures \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

## Setup Cron Jobs

Run this SQL in your Supabase SQL Editor:

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Daily sync at 3 AM UTC
SELECT cron.schedule(
  'fetch-fixtures-daily',
  '0 3 * * *',
  $$
  SELECT
    net.http_post(
      url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/fetch-fixtures',
      headers := jsonb_build_object('Authorization', 'Bearer YOUR_ANON_KEY')
    ) AS request_id;
  $$
);

-- Hourly sync on weekends (Saturday=6, Sunday=0)
SELECT cron.schedule(
  'fetch-fixtures-weekend',
  '0 * * * 6,0',
  $$
  SELECT
    net.http_post(
      url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/fetch-fixtures',
      headers := jsonb_build_object('Authorization', 'Bearer YOUR_ANON_KEY')
    ) AS request_id;
  $$
);

-- View scheduled jobs
SELECT * FROM cron.job;

-- Unschedule a job (if needed)
-- SELECT cron.unschedule('fetch-fixtures-daily');
```

## Get Your API Key

1. Go to https://www.football-data.org/client/register
2. Sign up for a free account
3. Copy your API key
4. Set it as a secret: `supabase secrets set FOOTBALL_DATA_API_KEY=your_key`

## Verify Setup

1. Run the function manually to test
2. Check the `fixtures` table in Supabase
3. Verify data is populated correctly
