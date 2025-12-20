# Adding Firecrawl Job Listings to Database

This guide explains how to add the 50 job listings scraped from myjobmag.co.za using Firecrawl API to the Jobbyist database.

## Quick Start

### Option 1: Use the Provided JSON Data

The user has provided a JSON file with 50 job listings. To add them:

1. Save the complete JSON data to a file (e.g., `scripts/myjobmag-jobs.json`)
2. Run the transformation script:

```bash
node scripts/add-firecrawl-jobs.cjs scripts/myjobmag-jobs.json
```

This will:
- Read the Firecrawl-formatted jobs from the JSON file
- Transform them to the application's format
- Add them to `database/jobs.json`
- Preserve all existing jobs

### Option 2: Fetch Fresh Jobs Using Firecrawl API

If you have the Firecrawl API key set up, you can fetch fresh jobs directly:

```javascript
// Create a script: scripts/fetch-and-add-jobs.js
import { firecrawlService } from '../src/lib/firecrawl.js';
import fs from 'fs';

async function fetchAndAddJobs() {
  try {
    // Fetch jobs from myjobmag.co.za
    const result = await firecrawlService.gatherJobListings(
      'https://www.myjobmag.co.za/jobs',
      50
    );
    
    // Save to file for processing
    fs.writeFileSync(
      'scripts/fetched-jobs.json',
      JSON.stringify(result, null, 2)
    );
    
    console.log('Jobs fetched and saved to scripts/fetched-jobs.json');
    console.log('Now run: node scripts/add-firecrawl-jobs.cjs scripts/fetched-jobs.json');
  } catch (error) {
    console.error('Error fetching jobs:', error);
  }
}

fetchAndAddJobs();
```

Then run:
```bash
node scripts/fetch-and-add-jobs.js
node scripts/add-firecrawl-jobs.cjs scripts/fetched-jobs.json
```

## Manual Process

If you need to add jobs manually:

### Step 1: Prepare the JSON File

Create a file with the following structure:

```json
{
  "job_listings": [
    {
      "source_url": "https://www.myjobmag.co.za/job/...",
      "source_url_citation": "https://www.myjobmag.co.za/job/...",
      "source_domain": "myjobmag.co.za",
      "source_domain_citation": "https://www.myjobmag.co.za/job/...",
      "job_title": "Job Title",
      "job_title_citation": "https://www.myjobmag.co.za/job/...",
      "hiring_organization": {
        "name": "Company Name",
        "name_citation": "https://www.myjobmag.co.za/job/..."
      },
      "date_posted": "2025-12-20",
      "date_posted_citation": "https://www.myjobmag.co.za/job/...",
      "employment_type": "Full Time",
      "employment_type_citation": "https://www.myjobmag.co.za/job/...",
      "location": "Western Cape",
      "location_citation": "https://www.myjobmag.co.za/job/...",
      "description_summary": "Job description...",
      "description_summary_citation": "https://www.myjobmag.co.za/job/..."
    }
  ]
}
```

###  Step 2: Run the Transformation Script

```bash
node scripts/add-firecrawl-jobs.cjs your-jobs-file.json
```

### Step 3: Verify the Results

Check the updated database:

```bash
# Count total jobs
cat database/jobs.json | grep -c '"id"'

# View the last few jobs added
tail -100 database/jobs.json
```

## What the Script Does

The `add-firecrawl-jobs.cjs` script:

1. **Reads** the Firecrawl-formatted JSON file
2. **Transforms** each job to match the application's format:
   - Generates unique IDs
   - Maps employment types (Full Time → full-time, etc.)
   - Extracts skills from job titles and descriptions
   - Determines experience levels (entry-level, mid-level, senior)
   - Adds default requirements and benefits
   - Sets expiration dates (30 days from now)
3. **Merges** with existing jobs in the database
4. **Saves** the updated database back to `database/jobs.json`

## Transformation Details

### Fields Mapped:
- `source_url` → `application_url` and `source_url`
- `source_domain` → `source_website`
- `job_title` → `title`
- `hiring_organization.name` → `company`
- `location` → `location` (with ", South Africa" appended)
- `employment_type` → `job_type` (normalized)
- `description_summary` → `description`
- `date_posted` → `posted_date`

### Fields Generated:
- `id`: Unique identifier based on source URL
- `salary_min`, `salary_max`: Set to 0 (not provided by Firecrawl)
- `currency`: Set to "ZAR"
- `requirements`: Generic list
- `benefits`: Generic list
- `skills_required`: Extracted from job title and description
- `experience_level`: Determined from job title keywords
- `remote_allowed`: Based on location and job type
- `expires_date`: 30 days from current date
- `created_at`, `updated_at`: Current timestamp
- `is_active`: true

## Troubleshooting

### Error: "ReferenceError: require is not defined"
- Make sure the script has `.cjs` extension
- Run with: `node scripts/add-firecrawl-jobs.cjs` not `.js`

### Error: "Cannot find module"
- Make sure you're in the project root directory
- Run: `cd /path/to/jobbyist-beta && node scripts/add-firecrawl-jobs.cjs ...`

### Jobs not showing up on website
- Clear browser cache
- Restart the dev server: `npm run dev`
- Check if jobs are actually in `database/jobs.json`

## Next Steps

After adding the jobs:

1. **Test locally**: Run `npm run dev` and verify jobs appear
2. **Commit changes**: `git add database/jobs.json && git commit -m "Add 50 jobs from myjobmag.co.za"`
3. **Deploy**: Push to trigger deployment

## Notes

- The script preserves all existing jobs
- New jobs are appended to the end of the array
- Each job gets a unique ID to prevent duplicates
- All 50 jobs will be marked as active and available for 30 days
