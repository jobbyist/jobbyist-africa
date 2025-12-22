#!/bin/bash

# Test Job Scraper Script
# This script tests the job scraper function with 10 jobs

set -e

echo "🧪 Testing Job Scraper Function"
echo "================================"
echo ""

# Check if required environment variables are set
if [ -z "$VITE_SUPABASE_URL" ]; then
  echo "❌ Error: VITE_SUPABASE_URL is not set"
  echo "Please run: export VITE_SUPABASE_URL=your_supabase_url"
  exit 1
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "❌ Error: SUPABASE_SERVICE_ROLE_KEY is not set"
  echo "Please run: export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key"
  exit 1
fi

echo "✅ Environment variables configured"
echo ""

# Test the job scraper function
echo "📡 Calling job-scraper function (test mode: 10 jobs)..."
echo ""

response=$(curl -s -X POST \
  "$VITE_SUPABASE_URL/functions/v1/job-scraper" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"test": true}')

echo "Response:"
echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
echo ""

# Check if successful
if echo "$response" | grep -q '"success":true'; then
  echo "✅ Job scraper test successful!"
  
  # Extract counts
  jobs_scraped=$(echo "$response" | grep -o '"jobsScraped":[0-9]*' | grep -o '[0-9]*' || echo "unknown")
  jobs_inserted=$(echo "$response" | grep -o '"jobsInserted":[0-9]*' | grep -o '[0-9]*' || echo "unknown")
  
  echo ""
  echo "📊 Results:"
  echo "  - Jobs scraped: $jobs_scraped"
  echo "  - Jobs inserted/updated: $jobs_inserted"
  echo ""
  echo "✅ Test completed successfully!"
else
  echo "❌ Job scraper test failed"
  echo "Please check the response above for error details"
  exit 1
fi
