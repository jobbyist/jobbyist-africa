# Scraping and Publishing 50 South African Jobs

This document explains how to scrape 50 recent job listings from South African job sites using Firecrawl and publish them to the website.

## Overview

The system scrapes jobs from multiple South African job sites:
- MyJobMag (https://www.myjobmag.co.za/jobs)
- Careers24 (https://www.careers24.com/jobs)
- PNet (https://www.pnet.co.za/jobs)
- Indeed South Africa (https://www.indeed.co.za/jobs)

All scraped jobs are:
- Transformed to match the database schema
- Deduplicated based on source URL
- Published to `database/jobs.json`
- Automatically displayed on the website

## Methods

### Method 1: GitHub Actions Workflow (Recommended)

The easiest way to scrape and publish 50 South African jobs is using the GitHub Actions workflow:

1. **Navigate to GitHub Actions:**
   - Go to your repository on GitHub
   - Click the "Actions" tab
   - Select "Scrape 50 South African Jobs" workflow

2. **Run the Workflow:**
   - Click "Run workflow"
   - Optionally add a description
   - Click "Run workflow" button

3. **Monitor Progress:**
   - Watch the workflow execution in real-time
   - Check the logs for detailed information
   - Wait for completion (typically 5-10 minutes)

4. **Verify Results:**
   - Once complete, the jobs will be committed to `database/jobs.json`
   - The website will automatically redeploy with the new jobs
   - Visit the website to see the new listings

### Method 2: Run Locally

You can also run the scraper locally:

```bash
# Set your Firecrawl API key
export FIRECRAWL_API_KEY="your_api_key_here"

# Run the scraper
npx tsx scripts/scrape-and-publish-50-jobs.ts

# Commit and push the changes
git add database/jobs.json
git commit -m "feat: add 50 South African job listings"
git push
```

### Method 3: Use Existing Workflow

Update the existing `scrape-firecrawl.yml` workflow to target 50 jobs:

```bash
# The workflow is already updated to scrape 50 jobs from South African sites
# Simply trigger it manually from GitHub Actions
```

## Configuration

### Required Secrets

The scraper requires the following GitHub Secret to be configured:

- **FIRECRAWL_API_KEY**: Your Firecrawl API key
  - Get it from https://firecrawl.dev
  - Add it in: Settings → Secrets and variables → Actions → New repository secret

### Job Sites Configuration

The script scrapes from these South African job sites:

```typescript
const SA_JOB_SITES = [
  'https://www.myjobmag.co.za/jobs',
  'https://www.careers24.com/jobs',
  'https://www.pnet.co.za/jobs',
  'https://www.indeed.co.za/jobs',
];
```

You can add more sites by editing `scripts/scrape-and-publish-50-jobs.ts`.

### Target Jobs

The script is configured to scrape exactly **50 jobs**:

```typescript
const TARGET_JOBS = 50;
```

Jobs are distributed evenly across all configured sites (approximately 13 jobs per site).

## Job Data Format

Scraped jobs are transformed to match the database schema:

```typescript
{
  id: string;                    // Unique identifier
  title: string;                 // Job title
  company: string;               // Company name
  location: string;              // Location in South Africa
  job_type: string;              // full-time, part-time, contract, etc.
  salary_min: number;            // Minimum salary (0 if not specified)
  salary_max: number;            // Maximum salary (0 if not specified)
  currency: string;              // ZAR for South African jobs
  description: string;           // Job description
  requirements: string[];        // Job requirements
  benefits: string[];            // Job benefits
  skills_required: string[];     // Required skills
  experience_level: string;      // entry, mid, or senior
  remote_allowed: boolean;       // Whether remote work is allowed
  application_url: string;       // URL to apply
  company_logo_url: string;      // Company logo URL
  source_website: string;        // Source domain
  source_url: string;            // Direct link to job posting
  is_active: boolean;            // Job is active
  posted_date: string;           // When job was posted
  expires_date: string;          // When job expires (30 days)
  created_at: string;            // When added to database
  updated_at: string;            // Last update timestamp
}
```

## Features

### Duplicate Prevention

The scraper automatically prevents duplicates:
- Checks existing jobs in `database/jobs.json`
- Compares based on `source_url`
- Only adds new, unique jobs
- Reports number of duplicates skipped

### Industry Diversity

The scraper targets jobs across various industries:
- Technology and Software Development
- Finance and Accounting
- Sales and Marketing
- Engineering
- Healthcare
- Education
- Retail and Hospitality
- And many more...

### Skill Extraction

The scraper automatically extracts relevant skills from job titles and descriptions:
- Technical skills (Python, Java, React, etc.)
- Soft skills (Leadership, Communication, etc.)
- Industry-specific skills
- Up to 5 skills per job

### Experience Level Detection

Jobs are automatically categorized by experience level:
- **Entry**: Junior, Graduate, Intern, Trainee positions
- **Mid**: Standard professional positions
- **Senior**: Senior, Lead, Principal, Director positions

## Verification

After scraping, verify the results:

### Check Database File

```bash
# Count total jobs
jq 'length' database/jobs.json

# Count new jobs (with recent created_at)
jq '[.[] | select(.created_at > "2025-12-25")] | length' database/jobs.json

# View a sample of new jobs
jq '[.[] | select(.created_at > "2025-12-25")] | .[0:3]' database/jobs.json
```

### Check Website

1. Wait for GitHub Pages deployment to complete
2. Visit https://jobbyist.africa
3. Browse the job listings
4. Verify new jobs appear
5. Test filtering and search functionality

## Troubleshooting

### Issue: No jobs were scraped

**Possible causes:**
- Firecrawl API key not configured
- API quota exceeded
- Network connectivity issues
- Job sites temporarily unavailable

**Solution:**
1. Verify `FIRECRAWL_API_KEY` is set in GitHub Secrets
2. Check Firecrawl dashboard for API usage
3. Try running again later
4. Check workflow logs for detailed error messages

### Issue: All jobs are duplicates

**This is expected if:**
- Jobs were recently scraped
- No new jobs have been posted on the source sites

**Solution:**
- Wait a few days for new jobs to be posted
- Or scrape from additional job sites
- Or clear old jobs from database (not recommended)

### Issue: Workflow fails with API error

**Possible causes:**
- Invalid Firecrawl API key
- API rate limits exceeded
- Firecrawl service issues

**Solution:**
1. Verify API key is correct and active
2. Check API usage limits in Firecrawl dashboard
3. Wait before retrying (rate limit cooldown)
4. Contact Firecrawl support if issues persist

### Issue: Jobs not appearing on website

**Possible causes:**
- Deployment not yet complete
- Jobs marked as inactive
- Filtering hiding the jobs

**Solution:**
1. Wait for GitHub Pages deployment to complete (check Actions tab)
2. Verify jobs have `is_active: true` in database
3. Check job filters on the website
4. Clear browser cache and refresh

## Maintenance

### Update Job Sites

To add or change job sites, edit the `SA_JOB_SITES` array in:
- `scripts/scrape-and-publish-50-jobs.ts`

### Adjust Job Count

To change the number of jobs scraped, edit `TARGET_JOBS` in:
- `scripts/scrape-and-publish-50-jobs.ts`

### Schedule Automatic Scraping

To run automatically (e.g., daily), add a schedule to `.github/workflows/scrape-50-sa-jobs.yml`:

```yaml
on:
  workflow_dispatch:
  schedule:
    - cron: '0 6 * * *'  # Daily at 6 AM UTC
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review workflow logs in GitHub Actions
3. Check Firecrawl API documentation: https://docs.firecrawl.dev
4. Contact repository maintainers

---

**Last Updated:** December 25, 2025
