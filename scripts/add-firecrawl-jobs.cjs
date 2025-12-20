#!/usr/bin/env node

/**
 * Script to process Firecrawl job data and add it to the jobs database
 * Usage: node scripts/add-firecrawl-jobs.js <input-json-file>
 */

const fs = require('fs');
const path = require('path');

// Constants
const MAX_SKILLS_PER_JOB = 5;
const SKILL_KEYWORDS = [
  'Python', 'Java', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL', 'AWS', 'Azure',
  'Project Management', 'Sales', 'Marketing', 'Business Development', 'Strategy',
  'Leadership', 'Communication', 'Negotiation', 'Analysis', 'Planning',
  'Finance', 'Accounting', 'Legal', 'HR', 'Operations', 'Customer Service',
  'Engineering', 'Research', 'Teaching', 'Healthcare', 'Consulting', 'Management'
];

// Transform Firecrawl job to application format
function transformFirecrawlJob(firecrawlJob, index) {
  // Extract employment type
  const employmentType = firecrawlJob.employment_type.toLowerCase();
  let jobType = 'full-time';
  
  if (employmentType.includes('full')) jobType = 'full-time';
  else if (employmentType.includes('part')) jobType = 'part-time';
  else if (employmentType.includes('contract')) jobType = 'contract';
  else if (employmentType.includes('hybrid')) jobType = 'hybrid';

  // Generate a unique ID based on source URL and randomness
  const urlParts = firecrawlJob.source_url.split('/');
  const slug = urlParts[urlParts.length - 1] || `job-${index}`;
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  const id = `fc-${slug.substring(0, 30)}-${index}-${random}`;

  // Extract location and determine if remote
  const location = `${firecrawlJob.location}, South Africa`;
  const remoteAllowed = jobType === 'hybrid' || location.toLowerCase().includes('remote');

  // Create requirements array from description
  const requirements = [
    'Relevant qualification and experience as per job description',
    'Strong communication and interpersonal skills',
    'Ability to work independently and as part of a team',
    'Commitment to professional excellence'
  ];

  // Create benefits array (generic)
  const benefits = [
    'Competitive salary package',
    'Professional development opportunities',
    'Supportive work environment',
    'Career growth potential'
  ];

  // Extract skills from job title and description
  const skills = extractSkills(firecrawlJob.job_title, firecrawlJob.description_summary);

  // Determine experience level based on job title
  const experienceLevel = determineExperienceLevel(firecrawlJob.job_title);

  const now = new Date().toISOString();
  
  // Parse posted date with error handling
  let postedDate;
  try {
    postedDate = new Date(firecrawlJob.date_posted).toISOString();
  } catch {
    console.warn(`Invalid date_posted for job: ${firecrawlJob.job_title}, using current date`);
    postedDate = now;
  }
  
  const expiresDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days from now

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

// Extract skills from job title and description
function extractSkills(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  const foundSkills = SKILL_KEYWORDS.filter(skill => 
    text.includes(skill.toLowerCase())
  );

  // If no specific skills found, infer from job title
  if (foundSkills.length === 0) {
    if (title.toLowerCase().includes('manager')) foundSkills.push('Management', 'Leadership');
    if (title.toLowerCase().includes('developer') || title.toLowerCase().includes('engineer')) {
      foundSkills.push('Problem Solving', 'Technical Skills');
    }
    if (title.toLowerCase().includes('analyst')) foundSkills.push('Data Analysis', 'Research');
    if (title.toLowerCase().includes('teacher') || title.toLowerCase().includes('lecturer')) {
      foundSkills.push('Teaching', 'Communication');
    }
    if (title.toLowerCase().includes('advisor') || title.toLowerCase().includes('consultant')) {
      foundSkills.push('Consulting', 'Client Relations');
    }
  }

  return foundSkills.length > 0 ? foundSkills.slice(0, MAX_SKILLS_PER_JOB) : ['Professional Skills', 'Communication'];
}

// Determine experience level from job title
function determineExperienceLevel(title) {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('senior') || titleLower.includes('principal') || 
      titleLower.includes('lead') || titleLower.includes('head') ||
      titleLower.includes('director') || titleLower.includes('executive') ||
      titleLower.includes('professor') || titleLower.includes('manager')) {
    return 'senior';
  }
  
  if (titleLower.includes('junior') || titleLower.includes('intern') || 
      titleLower.includes('graduate') || titleLower.includes('trainee') ||
      titleLower.includes('assistant')) {
    return 'entry-level';
  }
  
  return 'mid-level';
}

// Main function
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node scripts/add-firecrawl-jobs.js <input-json-file>');
    process.exit(1);
  }

  const inputFile = args[0];
  const jobsDbPath = path.join(__dirname, '../database/jobs.json');

  console.log(`Reading Firecrawl data from: ${inputFile}`);
  const firecrawlData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

  console.log(`Reading existing jobs database from: ${jobsDbPath}`);
  const existingJobs = JSON.parse(fs.readFileSync(jobsDbPath, 'utf8'));

  console.log(`Found ${existingJobs.length} existing jobs`);
  console.log(`Processing ${firecrawlData.job_listings.length} new jobs from Firecrawl`);

  // Transform Firecrawl jobs
  const newJobs = firecrawlData.job_listings.map((job, index) => 
    transformFirecrawlJob(job, index)
  );

  // Merge with existing jobs
  const allJobs = [...existingJobs, ...newJobs];

  console.log(`Total jobs after merge: ${allJobs.length}`);

  // Write back to jobs.json
  fs.writeFileSync(jobsDbPath, JSON.stringify(allJobs, null, 2), 'utf8');

  console.log(`✓ Successfully added ${newJobs.length} new jobs to the database`);
  console.log(`✓ Database updated: ${jobsDbPath}`);
}

// Run the script
try {
  main();
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
