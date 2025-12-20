# Firecrawl API Integration

This document explains how to use the Firecrawl API integration for job scraping in the Jobbyist platform.

## Overview

The Firecrawl integration allows you to automatically gather job listings from various job boards using an AI agent. The service is configured to extract data in a format compatible with Google Jobs Schema.

## Setup

### 1. Install Dependencies

The `@mendable/firecrawl-js` package is already included in `package.json`. Install it by running:

```bash
npm install
```

### 2. Configure API Key

Add your Firecrawl API key to your `.env` file:

```env
VITE_FIRECRAWL_API_KEY=your_firecrawl_api_key_here
```

## Usage

### Basic Example

```typescript
import { firecrawlService } from '@/lib/firecrawl';

// Gather 50 job listings from myjobmag.co.za (default)
const result = await firecrawlService.gatherJobListings();

console.log(result.job_listings);
```

### Custom URL and Count

```typescript
import { firecrawlService } from '@/lib/firecrawl';

// Gather 100 job listings from a custom URL
const result = await firecrawlService.gatherJobListings(
  'https://example.com/jobs',
  100
);

console.log(result.job_listings);
```

### Custom Prompt

```typescript
import { firecrawlService } from '@/lib/firecrawl';

// Use a custom prompt for more specific requirements
const result = await firecrawlService.gatherJobListingsWithPrompt(
  "Gather the 30 most recent software engineering jobs from https://example.com/jobs in Cape Town, South Africa"
);

console.log(result.job_listings);
```

## Data Structure

Each job listing returned contains the following fields:

```typescript
{
  source_url: string;              // URL of the job posting
  source_url_citation: string;     // Citation for the URL
  source_domain: string;           // Domain of the source
  source_domain_citation: string;  // Citation for the domain
  job_title: string;               // Title of the job
  job_title_citation: string;      // Citation for the title
  hiring_organization: {
    name: string;                  // Company name
    name_citation: string;         // Citation for company name
  };
  date_posted: string;             // When the job was posted
  date_posted_citation: string;    // Citation for date
  employment_type: string;         // Full-time, Part-time, Contract, etc.
  employment_type_citation: string;// Citation for employment type
  location: string;                // Job location
  location_citation: string;       // Citation for location
  description_summary: string;     // Brief job description
  description_summary_citation: string; // Citation for description
}
```

## Example: Integrating with Job Management

```typescript
import { firecrawlService } from '@/lib/firecrawl';
import { supabase } from '@/integrations/supabase/client';

async function scrapeAndStoreJobs() {
  try {
    // Check if Firecrawl is configured
    if (!firecrawlService.isConfigured()) {
      console.error('Firecrawl API key not configured');
      return;
    }

    // Gather job listings
    const result = await firecrawlService.gatherJobListings(
      'https://www.myjobmag.co.za/jobs',
      50
    );

    // Transform and store in your database
    for (const job of result.job_listings) {
      // Transform Firecrawl data to your internal format
      const jobData = {
        title: job.job_title,
        company: job.hiring_organization.name,
        location: job.location,
        job_type: job.employment_type,
        description: job.description_summary,
        source_url: job.source_url,
        source_website: job.source_domain,
        posted_date: job.date_posted,
        // Add other required fields...
      };

      // Insert into database
      const { error } = await supabase
        .from('jobs')
        .insert(jobData);

      if (error) {
        console.error('Error inserting job:', error);
      }
    }

    console.log(`Successfully scraped and stored ${result.job_listings.length} jobs`);
  } catch (error) {
    console.error('Error scraping jobs:', error);
  }
}
```

## Error Handling

The service will throw errors in the following cases:

1. **API Key Not Configured**: If `VITE_FIRECRAWL_API_KEY` is not set
2. **API Request Failed**: If the Firecrawl API request fails

Always wrap calls in try-catch blocks:

```typescript
try {
  const result = await firecrawlService.gatherJobListings();
  // Process result...
} catch (error) {
  console.error('Failed to gather job listings:', error);
  // Handle error appropriately
}
```

## Configuration Check

Before using the service, check if it's properly configured:

```typescript
import { firecrawlService } from '@/lib/firecrawl';

if (firecrawlService.isConfigured()) {
  // Safe to use the service
  const result = await firecrawlService.gatherJobListings();
} else {
  console.warn('Firecrawl service not configured');
}
```

## Notes

- The Firecrawl agent uses AI to intelligently extract job listings from web pages
- Results are automatically structured according to the defined schema
- Citations are provided for data provenance and verification
- Rate limits may apply depending on your Firecrawl API plan
- The service works best with well-structured job listing pages

## Support

For issues with the Firecrawl API itself, visit:
- [Firecrawl Documentation](https://docs.firecrawl.dev/)
- [Firecrawl GitHub](https://github.com/mendableai/firecrawl)

For issues with this integration, contact the Jobbyist development team.
