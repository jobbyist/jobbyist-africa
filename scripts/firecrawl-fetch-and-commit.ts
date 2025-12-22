#!/usr/bin/env node

/**
 * Firecrawl Job Scraper Script
 * Fetches job listings from Firecrawl API, normalizes to Google Jobs Schema,
 * and writes to data/job-listings/YYYY-MM-DD.json
 */

import fetch from 'node-fetch';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Google Jobs Schema Interface
interface JobPosting {
  "@context": "https://schema.org/";
  "@type": "JobPosting";
  title: string;
  description: string;
  identifier: {
    "@type": "PropertyValue";
    name: string;
    value: string;
  };
  datePosted: string;
  validThrough: string;
  employmentType: string;
  hiringOrganization: {
    "@type": "Organization";
    name: string;
    sameAs?: string;
    logo?: string;
  };
  jobLocation: {
    "@type": "Place";
    address: {
      "@type": "PostalAddress";
      streetAddress?: string;
      addressLocality: string;
      addressRegion?: string;
      postalCode?: string;
      addressCountry: string;
    };
  };
  baseSalary?: {
    "@type": "MonetaryAmount";
    currency: string;
    value: {
      "@type": "QuantitativeValue";
      value: number;
      unitText: "YEAR" | "MONTH" | "HOUR";
    };
  };
  jobLocationType?: "TELECOMMUTE";
  applicantLocationRequirements?: {
    "@type": "Country" | "State";
    name: string;
  };
}

// Firecrawl Response Interface
interface FirecrawlJobListing {
  source_url: string;
  source_domain: string;
  job_title: string;
  hiring_organization: {
    name: string;
  };
  date_posted: string;
  employment_type: string;
  location: string;
  description_summary: string;
}

interface FirecrawlResponse {
  job_listings: FirecrawlJobListing[];
}

// Configuration
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const JOB_SOURCES = [
  'https://www.myjobmag.co.za/jobs',
  'https://www.indeed.co.za/jobs',
  'https://www.careers24.com/jobs',
];
const TARGET_JOBS_PER_SOURCE = 10;
const TOTAL_TARGET_JOBS = 30;

/**
 * Normalize employment type to Google Jobs Schema format
 */
function normalizeEmploymentType(type: string): string {
  const normalized = type.toLowerCase();
  
  if (normalized.includes('full')) return 'FULL_TIME';
  if (normalized.includes('part')) return 'PART_TIME';
  if (normalized.includes('contract')) return 'CONTRACTOR';
  if (normalized.includes('temporary')) return 'TEMPORARY';
  if (normalized.includes('intern')) return 'INTERN';
  if (normalized.includes('volunteer')) return 'VOLUNTEER';
  if (normalized.includes('per_diem')) return 'PER_DIEM';
  
  return 'FULL_TIME'; // Default
}

/**
 * Parse location to extract locality, region, and country
 */
function parseLocation(location: string): {
  locality: string;
  region?: string;
  country: string;
} {
  const parts = location.split(',').map(p => p.trim());
  
  // Determine country code
  let country = 'ZA'; // Default to South Africa
  if (location.toLowerCase().includes('nigeria') || location.toLowerCase().includes('lagos') || location.toLowerCase().includes('abuja')) {
    country = 'NG';
  }
  
  if (parts.length >= 2) {
    return {
      locality: parts[0],
      region: parts[1],
      country
    };
  }
  
  return {
    locality: parts[0] || 'Unknown',
    country
  };
}

/**
 * Transform Firecrawl job listing to Google Jobs Schema
 */
function transformToGoogleSchema(job: FirecrawlJobListing, index: number): JobPosting {
  const location = parseLocation(job.location);
  const employmentType = normalizeEmploymentType(job.employment_type);
  
  // Generate unique ID
  const id = `job-${Date.now()}-${index}`;
  
  // Calculate valid through date (30 days from posted date)
  const postedDate = new Date(job.date_posted);
  const validThrough = new Date(postedDate);
  validThrough.setDate(validThrough.getDate() + 30);
  
  const jobPosting: JobPosting = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.job_title,
    description: job.description_summary,
    identifier: {
      "@type": "PropertyValue",
      name: job.hiring_organization.name,
      value: id
    },
    datePosted: postedDate.toISOString(),
    validThrough: validThrough.toISOString(),
    employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: job.hiring_organization.name,
      sameAs: job.source_url
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: location.locality,
        addressRegion: location.region,
        addressCountry: location.country
      }
    }
  };
  
  return jobPosting;
}

/**
 * Fetch jobs from Firecrawl API
 */
async function fetchJobsFromFirecrawl(url: string, count: number): Promise<FirecrawlJobListing[]> {
  if (!FIRECRAWL_API_KEY) {
    throw new Error('FIRECRAWL_API_KEY environment variable is not set');
  }
  
  const prompt = `Gather ${count} of the most recent job listings from ${url} in Nigeria and South Africa. Include jobs across various industries with all necessary data for Google Jobs Schema.`;
  
  try {
    const response = await fetch('https://api.firecrawl.dev/v1/agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`
      },
      body: JSON.stringify({
        prompt,
        schema: {
          type: 'object',
          properties: {
            job_listings: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  source_url: { type: 'string' },
                  source_domain: { type: 'string' },
                  job_title: { type: 'string' },
                  hiring_organization: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' }
                    },
                    required: ['name']
                  },
                  date_posted: { type: 'string' },
                  employment_type: { type: 'string' },
                  location: { type: 'string' },
                  description_summary: { type: 'string' }
                },
                required: ['source_url', 'job_title', 'hiring_organization', 'employment_type', 'location', 'description_summary']
              }
            }
          },
          required: ['job_listings']
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`Firecrawl API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json() as FirecrawlResponse;
    return data.job_listings || [];
  } catch (error) {
    console.error(`Error fetching jobs from ${url}:`, error);
    return [];
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting Firecrawl job scraper...');
  console.log(`Target: ${TOTAL_TARGET_JOBS} jobs from Nigeria/South Africa`);
  
  const allJobs: JobPosting[] = [];
  
  // Fetch jobs from multiple sources
  for (const source of JOB_SOURCES) {
    console.log(`\n📍 Fetching from: ${source}`);
    try {
      const jobs = await fetchJobsFromFirecrawl(source, TARGET_JOBS_PER_SOURCE);
      console.log(`✅ Fetched ${jobs.length} jobs from ${source}`);
      
      // Transform to Google Jobs Schema
      const transformedJobs = jobs.map((job, index) => transformToGoogleSchema(job, index));
      allJobs.push(...transformedJobs);
      
      // Stop if we have enough jobs
      if (allJobs.length >= TOTAL_TARGET_JOBS) {
        break;
      }
    } catch (error) {
      console.error(`❌ Error processing ${source}:`, error);
    }
  }
  
  // Limit to target number
  const finalJobs = allJobs.slice(0, TOTAL_TARGET_JOBS);
  
  console.log(`\n📊 Total jobs collected: ${finalJobs.length}`);
  
  // Generate filename with current date
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
  
  // Ensure directory exists
  const dataDir = join(process.cwd(), 'data', 'job-listings');
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
    console.log(`📁 Created directory: ${dataDir}`);
  }
  
  // Write to file
  const filePath = join(dataDir, `${dateStr}.json`);
  writeFileSync(filePath, JSON.stringify(finalJobs, null, 2), 'utf-8');
  
  console.log(`\n✅ Jobs written to: ${filePath}`);
  console.log('🎉 Scraping complete!');
}

// Execute
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
