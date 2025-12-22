# Job Scraping Automation

This document describes the automated job scraping system that updates job listings daily.

## Overview

The system automatically scrapes job listings from multiple South African and Nigerian job sites every day at 5 PM UTC using Firecrawl's web scraper API and stores them in the Supabase database with proper Google Jobs Schema formatting.

## Features

- **Automated Daily Scraping**: Runs every day at 5 PM UTC (7 PM SAST / 6 PM WAT)
- **Multiple Job Sources**: Scrapes from MyJobMag, Indeed, Careers24, and other reliable job sites
- **Google Jobs Schema Compliance**: All jobs are formatted according to Google Jobs Schema guidelines
- **Duplicate Prevention**: Automatically filters out duplicate job listings based on source URL
- **Test Mode**: Supports test runs with only 10 jobs for testing purposes
- **Fallback Mode**: Uses mock data if Firecrawl API is not configured

## Architecture

### Components

1. **Supabase Edge Function** (`supabase/functions/job-scraper/index.ts`)
   - Handles the actual job scraping logic
   - Integrates with Firecrawl API for web scraping
   - Transforms scraped data to match database schema
   - Validates and inserts jobs into the database

2. **GitHub Actions Workflow** (`.github/workflows/scrape-jobs.yml`)
   - Schedules daily execution at 5 PM UTC
   - Deploys the latest job-scraper function
   - Invokes the scraper with appropriate parameters
   - Reports success/failure status

3. **Test Script** (`scripts/test-job-scraper.sh`)
   - Manual testing tool for the job scraper
   - Tests with 10 jobs for quick validation

## Configuration

### Required Environment Variables

The following secrets must be configured in GitHub repository settings:

1. **VITE_SUPABASE_URL**: Your Supabase project URL
2. **VITE_SUPABASE_PROJECT_ID**: Your Supabase project ID
3. **SUPABASE_SERVICE_ROLE_KEY**: Supabase service role key (has admin access)
4. **SUPABASE_ACCESS_TOKEN**: Supabase CLI access token
5. **FIRECRAWL_API_KEY**: Your Firecrawl API key

### Setting up Firecrawl

1. Sign up for Firecrawl at https://firecrawl.dev
2. Get your API key from the dashboard
3. Add it as `FIRECRAWL_API_KEY` in GitHub Secrets
4. The workflow will automatically configure it for the Supabase function

## Usage

### Automatic Daily Scraping

The job scraper runs automatically every day at 5 PM UTC. No manual intervention is required.

### Manual Trigger

You can manually trigger the job scraper from GitHub Actions:

1. Go to GitHub Actions tab
2. Select "Scrape Job Listings Daily" workflow
3. Click "Run workflow"
4. Choose test mode (10 jobs) or production mode (50+ jobs)
5. Click "Run workflow" to start

### Testing Locally

To test the job scraper function locally:

```bash
# Set environment variables
export VITE_SUPABASE_URL="your_supabase_url"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# Run the test script
./scripts/test-job-scraper.sh
```

## Job Data Format

Jobs are scraped and formatted according to Google Jobs Schema with the following fields:

- **title**: Job title
- **company**: Hiring company name
- **location**: Job location (City, Country)
- **job_type**: Employment type (full-time, part-time, contract, etc.)
- **description**: Job description
- **requirements**: List of job requirements
- **benefits**: List of job benefits
- **skills_required**: Required skills
- **experience_level**: Experience level (entry, mid, senior)
- **remote_allowed**: Boolean indicating if remote work is allowed
- **application_url**: URL to apply for the job
- **source_website**: Original job board domain
- **source_url**: Direct URL to the job listing
- **posted_date**: When the job was posted
- **expires_date**: When the job listing expires (30 days from scraping)
- **is_active**: Boolean indicating if job is active

## Job Sources

The scraper targets the following job sites:

1. **MyJobMag** (https://www.myjobmag.co.za/jobs)
   - South African and Nigerian jobs
   - Multiple industries

2. **Indeed** (https://www.indeed.co.za/jobs)
   - Wide range of job listings
   - Various experience levels

3. **Careers24** (https://www.careers24.com/jobs)
   - South African focused
   - All industries

Additional sources can be added by modifying the `jobSites` array in `supabase/functions/job-scraper/index.ts`.

## Monitoring

### Viewing Workflow Runs

1. Go to GitHub Actions tab
2. View the "Scrape Job Listings Daily" workflow
3. Check run history and logs

### Checking Scraped Jobs

Jobs are stored in the `jobs` table in Supabase. You can query them:

```sql
SELECT 
  id, title, company, location, posted_date, source_website
FROM jobs
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

## Troubleshooting

### Common Issues

1. **Firecrawl API Key Not Configured**
   - Ensure `FIRECRAWL_API_KEY` is set in GitHub Secrets
   - Check that the workflow sets the secret for the Supabase function

2. **No Jobs Scraped**
   - Check Firecrawl API quota
   - Verify job sites are accessible
   - Review function logs in Supabase dashboard

3. **Duplicate Jobs**
   - The system uses `source_url` as a unique constraint
   - Duplicates are automatically ignored during upsert

4. **Workflow Failures**
   - Check GitHub Actions logs for detailed error messages
   - Verify all secrets are properly configured
   - Ensure Supabase project is accessible

### Debugging

To debug the scraper:

1. Enable test mode to scrape only 10 jobs
2. Check Supabase function logs in the dashboard
3. Review the workflow logs in GitHub Actions
4. Test locally using the test script

## Maintenance

### Updating Job Sources

To add or modify job sources:

1. Edit `supabase/functions/job-scraper/index.ts`
2. Update the `jobSites` array with new URLs
3. Commit and push changes
4. The workflow will automatically deploy the updated function

### Adjusting Scrape Count

To change the number of jobs scraped:

1. Modify the `jobCount` calculation in the scraper function
2. Current: 10 jobs in test mode, 50 jobs in production
3. Adjust based on API quota and needs

### Changing Schedule

To modify the scraping schedule:

1. Edit `.github/workflows/scrape-jobs.yml`
2. Update the `cron` expression in the `schedule` section
3. Current: `0 17 * * *` (5 PM UTC daily)
4. Use https://crontab.guru/ to generate new cron expressions

## Google Jobs Schema Compliance

The scraper ensures all jobs comply with Google Jobs Schema requirements:

- Valid employment types (FULL_TIME, PART_TIME, CONTRACT, etc.)
- Proper date formatting (ISO 8601)
- Location data with city and country
- Hiring organization information
- Valid job posting and expiration dates

This compliance ensures jobs can be indexed by Google Jobs and displayed in search results.

## Performance

- **Scraping Time**: ~2-5 minutes for 50 jobs (depends on API response time)
- **Database Upserts**: ~1-2 seconds
- **Total Workflow Time**: ~5-10 minutes including deployment

## Security

- API keys are stored securely in GitHub Secrets
- Supabase service role key is used for admin operations
- Row Level Security (RLS) policies protect job data
- All API calls use HTTPS encryption

## Future Enhancements

Potential improvements for the job scraping system:

1. Add more job sources (LinkedIn, Glassdoor, etc.)
2. Implement intelligent deduplication across different sources
3. Add job quality scoring and filtering
4. Integrate AI for better job description enhancement
5. Add email notifications for new job categories
6. Implement location-based scraping preferences
7. Add support for Nigerian-specific job sites
