# Google Jobs Schema Implementation - Usage Guide

This document describes how to use the new Google Jobs Schema-compliant job listings system.

## Overview

The system consists of:
1. **Data Storage**: Job listings stored in `data/job-listings/` as dated JSON files
2. **Automation**: Daily scraping via GitHub Actions (`scrape-firecrawl.yml`)
3. **Data Layer**: `lib/jobs.ts` for aggregating and filtering jobs
4. **UI Component**: `src/components/JobBoard.tsx` for displaying jobs

## Data Structure

All job listings follow the Google Jobs Schema format:

```json
{
  "@context": "https://schema.org/",
  "@type": "JobPosting",
  "title": "Software Engineer",
  "description": "Job description...",
  "identifier": {
    "@type": "PropertyValue",
    "name": "Company Name",
    "value": "unique-job-id"
  },
  "datePosted": "2025-12-20T00:00:00.000Z",
  "validThrough": "2026-01-20T00:00:00.000Z",
  "employmentType": "FULL_TIME",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Company Name",
    "sameAs": "https://company.com/careers"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Lagos",
      "addressRegion": "Lagos State",
      "addressCountry": "NG"
    }
  }
}
```

## Using the Library

### Import the library

```typescript
import { 
  getAllJobs, 
  getJobsByCountry, 
  getRecentJobs,
  searchJobs 
} from '@/lib/jobs';
```

### Get all jobs

```typescript
const allJobs = getAllJobs();
console.log(`Total jobs: ${allJobs.length}`);
```

### Filter by country

```typescript
// Get jobs from South Africa
const zaJobs = getJobsByCountry('ZA');

// Get jobs from Nigeria
const ngJobs = getJobsByCountry('NG');
```

### Get recent jobs

```typescript
// Get 10 most recent jobs
const recentJobs = getRecentJobs(10);
```

### Search jobs

```typescript
// Search by keyword
const engineerJobs = searchJobs('engineer');
const marketingJobs = searchJobs('marketing');
```

## Using the JobBoard Component

The `JobBoard` component displays job listings in a responsive grid:

```tsx
import { JobBoard } from '@/components/JobBoard';
import { getAllJobs } from '@/lib/jobs';

function MyPage() {
  const jobs = getAllJobs();
  
  return (
    <div>
      <JobBoard 
        jobs={jobs}
        title="Latest Job Opportunities"
        showFilters={false}
      />
    </div>
  );
}
```

### Component Props

- `jobs: JobPosting[]` - Array of job postings (required)
- `title?: string` - Header title (default: "Latest Job Listings")
- `showFilters?: boolean` - Show filter controls (default: false)

## GitHub Actions Workflow

The workflow runs daily at 6 AM UTC and:
1. Fetches 30 jobs from Nigeria/South Africa using Firecrawl API
2. Normalizes them to Google Jobs Schema
3. Saves to `data/job-listings/YYYY-MM-DD.json`
4. Commits changes to the repository

### Required Secret

Add `FIRECRAWL_API_KEY` to your repository secrets:
1. Go to Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `FIRECRAWL_API_KEY`
4. Value: Your Firecrawl API key

### Manual Trigger

You can manually trigger the workflow:
1. Go to Actions tab
2. Select "Scrape Firecrawl Jobs Daily"
3. Click "Run workflow"

## Script Usage

You can also run the scraper script manually:

```bash
# Set the API key
export FIRECRAWL_API_KEY=your_api_key_here

# Run the scraper
npx tsx scripts/firecrawl-fetch-and-commit.ts
```

## File Structure

```
jobbyist-beta/
├── data/
│   └── job-listings/
│       ├── 2025-12-20.json
│       ├── 2025-12-21.json
│       └── ...
├── lib/
│   └── jobs.ts              # Data aggregation utilities
├── scripts/
│   └── firecrawl-fetch-and-commit.ts  # Scraper script
├── src/
│   └── components/
│       └── JobBoard.tsx     # Display component
└── .github/
    └── workflows/
        └── scrape-firecrawl.yml  # Automation workflow
```

## Benefits

1. **SEO Optimized**: Google Jobs Schema compliance improves search visibility
2. **Automated**: Daily scraping keeps listings fresh
3. **Structured**: Consistent data format across all sources
4. **Flexible**: Easy filtering and searching capabilities
5. **Scalable**: Simple to add more data sources

## Future Enhancements

Possible improvements:
- Add more job sources
- Implement caching for better performance
- Add advanced filtering (salary range, experience level, etc.)
- Create admin interface for manual job management
- Add job expiration cleanup
