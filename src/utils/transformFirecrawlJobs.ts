import { JobListingResult } from '@/lib/firecrawl';
import { Job } from '@/utils/loadJobs';

// Constants
const MAX_SKILLS_PER_JOB = 5;

// Common skill keywords for extraction
const SKILL_KEYWORDS = [
  // Technical skills
  'Python', 'Java', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL', 'AWS', 'Azure',
  'Docker', 'Kubernetes', 'Git', 'CI/CD', 'API', 'Microservices', 'Cloud',
  // Business skills
  'Project Management', 'Sales', 'Marketing', 'Business Development', 'Strategy',
  'Leadership', 'Communication', 'Negotiation', 'Analysis', 'Planning',
  // Domain skills
  'Finance', 'Accounting', 'Legal', 'HR', 'Operations', 'Customer Service',
  'Engineering', 'Research', 'Teaching', 'Healthcare', 'Consulting'
];

/**
 * Transform Firecrawl job listing to application job format
 */
export function transformFirecrawlJob(firecrawlJob: JobListingResult['job_listings'][0], index: number): Job {
  // Extract employment type
  const jobType = firecrawlJob.employment_type.toLowerCase().includes('full')
    ? 'full-time'
    : firecrawlJob.employment_type.toLowerCase().includes('part')
    ? 'part-time'
    : firecrawlJob.employment_type.toLowerCase().includes('contract')
    ? 'contract'
    : firecrawlJob.employment_type.toLowerCase().includes('hybrid')
    ? 'hybrid'
    : 'full-time';

  // Generate a unique ID based on source URL and timestamp
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  const id = `scraped-${index}-${timestamp}-${random}`;

  // Extract location and determine if remote
  const location = firecrawlJob.location;
  const remoteAllowed = jobType === 'hybrid' || location.toLowerCase().includes('remote');

  // Create requirements array from description
  const requirements = [
    'Relevant qualification and experience as per job description',
    'Strong communication and interpersonal skills',
    'Ability to work independently and as part of a team'
  ];

  // Create benefits array (generic)
  const benefits = [
    'Competitive salary package',
    'Professional development opportunities',
    'Supportive work environment'
  ];

  // Extract skills from job title and description
  const skills = extractSkills(firecrawlJob.job_title, firecrawlJob.description_summary);

  // Determine experience level based on job title
  const experienceLevel = determineExperienceLevel(firecrawlJob.job_title);

  const now = new Date().toISOString();
  
  // Parse posted date with error handling
  let postedDate: string;
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
    salary_min: 0, // Not provided by Firecrawl
    salary_max: 0, // Not provided by Firecrawl
    currency: 'ZAR', // Default to ZAR for South African jobs
    description: firecrawlJob.description_summary,
    requirements,
    benefits,
    skills_required: skills,
    experience_level: experienceLevel,
    remote_allowed: remoteAllowed,
    application_url: firecrawlJob.source_url,
    company_logo_url: '', // Not provided by Firecrawl
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
 * Extract skills from job title and description
 */
function extractSkills(title: string, description: string): string[] {
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
  }

  return foundSkills.length > 0 ? foundSkills.slice(0, MAX_SKILLS_PER_JOB) : ['Professional Skills', 'Communication'];
}

/**
 * Determine experience level from job title
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
    return 'entry-level';
  }
  
  if (titleLower.includes('professor') || titleLower.includes('associate professor')) {
    return 'senior';
  }
  
  return 'mid-level';
}

/**
 * Transform an array of Firecrawl jobs to application format
 */
export function transformFirecrawlJobs(firecrawlResult: JobListingResult): Job[] {
  return firecrawlResult.job_listings.map((job, index) => 
    transformFirecrawlJob(job, index)
  );
}
