#!/usr/bin/env tsx

/**
 * Script to scrape 50 recent South African job listings using Firecrawl
 * and publish them to database/jobs.json for display on the website
 */

import fetch from 'node-fetch';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Job interface matching database schema
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  salary_min: number;
  salary_max: number;
  currency: string;
  description: string;
  requirements: string[];
  benefits: string[];
  skills_required: string[];
  experience_level: string;
  remote_allowed: boolean;
  application_url: string;
  company_logo_url: string;
  source_website: string;
  source_url: string;
  is_active: boolean;
  posted_date: string;
  expires_date: string;
  created_at: string;
  updated_at: string;
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

// Configuration
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const TARGET_JOBS = 50;

// South African job sites
const SA_JOB_SITES = [
  'https://www.myjobmag.co.za/jobs',
  'https://www.careers24.com/jobs',
  'https://www.pnet.co.za/jobs',
  'https://www.indeed.co.za/jobs',
];

// Common skill keywords for extraction
const SKILL_KEYWORDS = [
  'Python', 'Java', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL', 'AWS', 'Azure',
  'Docker', 'Kubernetes', 'Git', 'CI/CD', 'API', 'Microservices', 'Cloud',
  'Project Management', 'Sales', 'Marketing', 'Business Development', 'Strategy',
  'Leadership', 'Communication', 'Negotiation', 'Analysis', 'Planning',
  'Finance', 'Accounting', 'Legal', 'HR', 'Operations', 'Customer Service',
  'Engineering', 'Research', 'Teaching', 'Healthcare', 'Consulting', 'Management',
  'Data Analysis', 'Excel', 'PowerPoint', 'Presentation', 'Teamwork'
];

const MAX_SKILLS_PER_JOB = 5;

/**
 * Extract skills from title and description
 */
function extractSkills(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const foundSkills = SKILL_KEYWORDS.filter(skill => 
    text.includes(skill.toLowerCase())
  );

  if (foundSkills.length === 0) {
    if (title.toLowerCase().includes('manager')) foundSkills.push('Management', 'Leadership');
    if (title.toLowerCase().includes('developer') || title.toLowerCase().includes('engineer')) {
      foundSkills.push('Problem Solving', 'Technical Skills');
    }
    if (title.toLowerCase().includes('analyst')) foundSkills.push('Data Analysis', 'Research');
    if (title.toLowerCase().includes('sales')) foundSkills.push('Sales', 'Negotiation');
    if (title.toLowerCase().includes('marketing')) foundSkills.push('Marketing', 'Communication');
  }

  return foundSkills.length > 0 ? foundSkills.slice(0, MAX_SKILLS_PER_JOB) : ['Professional Skills', 'Communication'];
}

/**
 * Determine experience level from title
 */
function determineExperienceLevel(title: string): string {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('senior') || titleLower.includes('principal') || 
      titleLower.includes('lead') || titleLower.includes('head') ||
      titleLower.includes('director') || titleLower.includes('executive')) {
    return 'senior';
  }
  
  if (titleLower.includes('junior') || titleLower.includes('intern') || 
      titleLower.includes('graduate') || titleLower.includes('trainee') ||
      titleLower.includes('assistant')) {
    return 'entry';
  }
  
  return 'mid';
}

/**
 * Normalize employment type
 */
function normalizeJobType(employmentType: string): string {
  const normalized = employmentType.toLowerCase();
  
  if (normalized.includes('full')) return 'full-time';
  if (normalized.includes('part')) return 'part-time';
  if (normalized.includes('contract')) return 'contract';
  if (normalized.includes('freelance')) return 'freelance';
  if (normalized.includes('intern')) return 'internship';
  
  return 'full-time';
}

/**
 * Transform Firecrawl job to database format
 */
function transformToJobFormat(firecrawlJob: FirecrawlJobListing, index: number): Job {
  const now = new Date().toISOString();
  const expiresDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  
  let postedDate: string;
  try {
    postedDate = new Date(firecrawlJob.date_posted).toISOString();
  } catch {
    console.warn(`  ⚠️  Invalid date for job: ${firecrawlJob.job_title}, using current date`);
    postedDate = now;
  }

  const location = firecrawlJob.location.includes(',') 
    ? firecrawlJob.location 
    : `${firecrawlJob.location}, South Africa`;
  
  const remoteAllowed = location.toLowerCase().includes('remote') || 
                       firecrawlJob.employment_type.toLowerCase().includes('remote');

  const skills = extractSkills(firecrawlJob.job_title, firecrawlJob.description_summary);
  const experienceLevel = determineExperienceLevel(firecrawlJob.job_title);
  const jobType = normalizeJobType(firecrawlJob.employment_type);

  const requirements = [
    'Relevant qualification and experience as per job description',
    'Strong communication and interpersonal skills',
    'Ability to work independently and as part of a team',
    'Commitment to professional excellence'
  ];

  const benefits = [
    'Competitive salary package',
    'Professional development opportunities',
    'Supportive work environment',
    'Career growth potential'
  ];

  // Generate unique ID
  const id = `fc-sa-${Date.now()}-${index}`;

  return {
    id,
    title: firecrawlJob.job_title,
    company: firecrawlJob.hiring_organization.name,
    location,
    job_type: jobType,
    salary_min: 0,
    salary_max: 0,
    currency: 'ZAR',
    description: firecrawlJob.description_summary,
    requirements,
    benefits,
    skills_required: skills,
    experience_level: experienceLevel,
    remote_allowed: remoteAllowed,
    application_url: firecrawlJob.source_url,
    company_logo_url: '',
    source_website: firecrawlJob.source_domain,
    source_url: firecrawlJob.source_url,
    is_active: true,
    posted_date: postedDate,
    expires_date: expiresDate,
    created_at: now,
    updated_at: now
  };
}

/**
 * Fetch jobs from Firecrawl API
 */
async function fetchJobsFromFirecrawl(url: string, count: number): Promise<FirecrawlJobListing[]> {
  if (!FIRECRAWL_API_KEY) {
    throw new Error('FIRECRAWL_API_KEY environment variable is not set');
  }
  
  const prompt = `Gather ${count} of the most recent job listings from ${url} in South Africa. Include jobs across various industries (technology, finance, sales, marketing, engineering, healthcare, education, retail, hospitality, etc.) with all necessary data for Google Jobs Schema.`;
  
  const schema = {
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
  };

  try {
    console.log(`  📍 Fetching from: ${url}`);
    
    const response = await fetch('https://api.firecrawl.dev/v1/agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`
      },
      body: JSON.stringify({
        prompt,
        schema
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Firecrawl API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.job_listings || !Array.isArray(data.job_listings)) {
      console.warn(`  ⚠️  No job listings found from ${url}`);
      return [];
    }
    
    console.log(`  ✅ Fetched ${data.job_listings.length} jobs`);
    return data.job_listings;
  } catch (error) {
    console.error(`  ❌ Error fetching from ${url}:`, error);
    return [];
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting South African Job Scraper');
  console.log('=' .repeat(60));
  console.log(`📊 Target: ${TARGET_JOBS} recent jobs from South Africa`);
  console.log(`🌍 Sources: ${SA_JOB_SITES.length} job sites`);
  console.log('=' .repeat(60));
  console.log('');

  const allJobs: Job[] = [];
  const jobsPerSite = Math.ceil(TARGET_JOBS / SA_JOB_SITES.length);

  // Fetch jobs from each site
  for (let i = 0; i < SA_JOB_SITES.length; i++) {
    const site = SA_JOB_SITES[i];
    console.log(`\n[${i + 1}/${SA_JOB_SITES.length}] 🔍 Scraping ${site}...`);
    try {
      const firecrawlJobs = await fetchJobsFromFirecrawl(site, jobsPerSite);
      
      // Transform to database format
      const transformedJobs = firecrawlJobs.map((job, index) => 
        transformToJobFormat(job, allJobs.length + index)
      );
      
      allJobs.push(...transformedJobs);
      
      // Stop if we have enough jobs
      if (allJobs.length >= TARGET_JOBS) {
        console.log(`\n✅ Reached target of ${TARGET_JOBS} jobs`);
        break;
      }
    } catch (error) {
      console.error(`  ❌ Error scraping ${site}:`, error);
    }
  }

  // Limit to exactly TARGET_JOBS
  const finalJobs = allJobs.slice(0, TARGET_JOBS);

  console.log('');
  console.log('=' .repeat(60));
  console.log(`📊 Scraping Summary:`);
  console.log(`   Total jobs scraped: ${finalJobs.length}`);
  console.log('=' .repeat(60));

  if (finalJobs.length === 0) {
    console.error('\n❌ No jobs were scraped. Exiting without updating database.');
    process.exit(1);
  }

  // Load existing jobs
  const dbPath = join(process.cwd(), 'database', 'jobs.json');
  let existingJobs: Job[] = [];
  
  try {
    const existingData = readFileSync(dbPath, 'utf-8');
    existingJobs = JSON.parse(existingData);
    console.log(`\n📚 Loaded ${existingJobs.length} existing jobs from database`);
  } catch (error) {
    console.warn('⚠️  Could not load existing jobs, will create new database');
  }

  // Filter out duplicates based on source_url
  const existingUrls = new Set(existingJobs.map(job => job.source_url));
  const newJobs = finalJobs.filter(job => !existingUrls.has(job.source_url));

  console.log(`\n✨ Publishing Results:`);
  console.log(`   New jobs to add: ${newJobs.length}`);
  console.log(`   Duplicates skipped: ${finalJobs.length - newJobs.length}`);

  // Merge and save
  const allJobsToSave = [...existingJobs, ...newJobs];
  writeFileSync(dbPath, JSON.stringify(allJobsToSave, null, 2), 'utf-8');

  console.log(`\n✅ Successfully updated database!`);
  console.log(`   Total jobs in database: ${allJobsToSave.length}`);
  console.log(`   Database file: ${dbPath}`);
  
  console.log('');
  console.log('=' .repeat(60));
  console.log('🎉 Job scraping and publishing complete!');
  console.log('=' .repeat(60));
}

// Execute
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
