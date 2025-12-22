# Job Scraping Setup Guide

This guide will help you set up the automated job scraping system.

## Prerequisites

1. A GitHub repository with access to GitHub Actions
2. A Supabase project
3. A Firecrawl API account

## Step 1: Get Your Firecrawl API Key

1. Visit [Firecrawl.dev](https://firecrawl.dev) and sign up for an account
2. Navigate to your dashboard
3. Copy your API key from the dashboard
4. Keep this key secure - you'll need it in the next step

## Step 2: Configure GitHub Secrets

The job scraper requires several secrets to be configured in your GitHub repository:

### Required Secrets

1. Go to your GitHub repository
2. Click on **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret** and add the following:

| Secret Name | Description | Where to find it |
|------------|-------------|------------------|
| `FIRECRAWL_API_KEY` | Your Firecrawl API key | From Firecrawl dashboard |
| `VITE_SUPABASE_URL` | Your Supabase project URL | Supabase project settings |
| `VITE_SUPABASE_PROJECT_ID` | Your Supabase project ID | Supabase project settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Supabase project settings > API |
| `SUPABASE_ACCESS_TOKEN` | Supabase CLI access token | Generate from Supabase CLI |

### Getting Supabase Access Token

If you don't have a Supabase access token:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Generate access token
supabase access-token
```

Copy the output token and add it as `SUPABASE_ACCESS_TOKEN` in GitHub Secrets.

## Step 3: Test the Job Scraper

### Option A: Manual GitHub Actions Trigger (Recommended)

1. Go to **Actions** tab in your GitHub repository
2. Select **Scrape Job Listings Daily** workflow
3. Click **Run workflow**
4. Select **Test mode** (this will scrape only 10 jobs)
5. Click **Run workflow** button
6. Wait for the workflow to complete (usually 5-10 minutes)
7. Check the logs to verify success

### Option B: Local Testing

If you want to test locally:

```bash
# Clone the repository
git clone https://github.com/your-username/jobbyist-beta.git
cd jobbyist-beta

# Set environment variables
export VITE_SUPABASE_URL="your_supabase_url"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# Run the test script
./scripts/test-job-scraper.sh
```

## Step 4: Verify Job Data

After the scraper runs successfully:

1. Open your Supabase dashboard
2. Go to **Table Editor** > **jobs**
3. You should see newly scraped jobs with:
   - Recent `created_at` timestamps
   - Various `source_website` values (myjobmag.co.za, indeed.co.za, etc.)
   - Properly formatted job data

## Step 5: Enable Daily Automation

The job scraper is configured to run automatically every day at 5 PM UTC (7 PM SAST / 6 PM WAT).

To verify the schedule:

1. Go to **Actions** tab
2. Select **Scrape Job Listings Daily** workflow
3. Check the workflow runs history
4. Scheduled runs will appear automatically at the configured time

## Troubleshooting

### Issue: "FIRECRAWL_API_KEY not configured"

**Solution:**
1. Verify the secret is added in GitHub repository settings
2. Check that the secret name is exactly `FIRECRAWL_API_KEY` (case-sensitive)
3. Re-run the workflow

### Issue: "No jobs were scraped"

**Possible causes:**
1. Firecrawl API quota exceeded - check your Firecrawl dashboard
2. Target websites are temporarily unavailable
3. Network connectivity issues

**Solution:**
- Check Firecrawl dashboard for API usage and errors
- Try running in test mode with fewer jobs
- Review function logs in Supabase dashboard

### Issue: "Supabase authentication failed"

**Solution:**
1. Verify all Supabase secrets are correct
2. Check that your Supabase project is active
3. Ensure the service role key has not expired
4. Try regenerating the access token

### Issue: Workflow fails with permission errors

**Solution:**
1. Check that GitHub Actions is enabled for your repository
2. Verify you have admin access to the repository
3. Ensure all required secrets are added

## Monitoring

### View Scraper Logs

**GitHub Actions:**
1. Go to **Actions** tab
2. Click on the latest workflow run
3. Expand the job steps to see detailed logs

**Supabase Functions:**
1. Open Supabase dashboard
2. Go to **Functions** > **job-scraper**
3. Click on **Logs** tab
4. Filter by date/time to see recent executions

### Check Job Statistics

Query your jobs table to see scraping statistics:

```sql
-- Jobs scraped today
SELECT 
  source_website,
  COUNT(*) as job_count
FROM jobs
WHERE created_at >= CURRENT_DATE
GROUP BY source_website
ORDER BY job_count DESC;

-- Recent job scraping activity
SELECT 
  DATE(created_at) as date,
  COUNT(*) as jobs_scraped
FROM jobs
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

## Customization

### Change Scraping Schedule

Edit `.github/workflows/scrape-jobs.yml`:

```yaml
schedule:
  - cron: '0 17 * * *'  # 5 PM UTC daily
```

Use [crontab.guru](https://crontab.guru/) to create custom schedules.

### Add More Job Sources

Edit `supabase/functions/job-scraper/index.ts`:

```typescript
const jobSites = [
  'https://www.myjobmag.co.za/jobs',
  'https://www.indeed.co.za/jobs',
  'https://www.careers24.com/jobs',
  // Add your custom job site URL here
  'https://www.yourjobsite.com/jobs',
];
```

### Adjust Job Count

Edit `supabase/functions/job-scraper/index.ts`:

```typescript
const jobCount = isTestRun ? 10 : 50;  // Change 50 to your desired count
```

## Next Steps

After successful setup:

1. ✅ Monitor the first few scheduled runs
2. ✅ Verify job data quality and formatting
3. ✅ Adjust scraping parameters if needed
4. ✅ Set up monitoring alerts (optional)
5. ✅ Document any custom configurations

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review function logs in Supabase dashboard
3. Check workflow logs in GitHub Actions
4. Verify all secrets are correctly configured
5. Consult the main documentation: `JOB_SCRAPING_AUTOMATION.md`

## Security Notes

- Never commit API keys or secrets to the repository
- Use GitHub Secrets for all sensitive data
- Regularly rotate your API keys
- Monitor API usage to prevent abuse
- Review Supabase Row Level Security policies

## Additional Resources

- [Firecrawl Documentation](https://docs.firecrawl.dev)
- [Supabase Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Google Jobs Schema Guidelines](https://developers.google.com/search/docs/appearance/structured-data/job-posting)
