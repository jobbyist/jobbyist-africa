import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JobListing {
  title: string;
  company: string;
  location: string;
  job_type: string;
  salary_min?: number;
  salary_max?: number;
  currency?: string;
  description: string;
  requirements: string[];
  benefits?: string[];
  skills_required: string[];
  experience_level: string;
  remote_allowed: boolean;
  application_url: string;
  company_logo_url?: string;
  source_website: string;
  source_url: string;
  posted_date?: string;
  expires_date?: string;
  is_active?: boolean;
}

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

// Common skill keywords for extraction
const SKILL_KEYWORDS = [
  'Python', 'Java', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL', 'AWS', 'Azure',
  'Docker', 'Kubernetes', 'Git', 'CI/CD', 'API', 'Microservices', 'Cloud',
  'Project Management', 'Sales', 'Marketing', 'Business Development', 'Strategy',
  'Leadership', 'Communication', 'Negotiation', 'Analysis', 'Planning',
  'Finance', 'Accounting', 'Legal', 'HR', 'Operations', 'Customer Service',
  'Engineering', 'Research', 'Teaching', 'Healthcare', 'Consulting', 'Management'
];

const MAX_SKILLS_PER_JOB = 5;

// Helper functions
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
    if (title.toLowerCase().includes('teacher') || title.toLowerCase().includes('lecturer')) {
      foundSkills.push('Teaching', 'Communication');
    }
  }

  return foundSkills.length > 0 ? foundSkills.slice(0, MAX_SKILLS_PER_JOB) : ['Professional Skills', 'Communication'];
}

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

function transformFirecrawlJob(firecrawlJob: FirecrawlJobListing): JobListing {
  const employmentType = firecrawlJob.employment_type.toLowerCase();
  let jobType = 'full-time';
  
  if (employmentType.includes('full')) jobType = 'full-time';
  else if (employmentType.includes('part')) jobType = 'part-time';
  else if (employmentType.includes('contract')) jobType = 'contract';
  else if (employmentType.includes('freelance')) jobType = 'freelance';
  else if (employmentType.includes('intern')) jobType = 'internship';

  const location = firecrawlJob.location.includes(',') 
    ? firecrawlJob.location 
    : `${firecrawlJob.location}, South Africa`;
  const remoteAllowed = location.toLowerCase().includes('remote') || 
                       employmentType.includes('remote');

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

  const skills = extractSkills(firecrawlJob.job_title, firecrawlJob.description_summary);
  const experienceLevel = determineExperienceLevel(firecrawlJob.job_title);

  const now = new Date().toISOString();
  let postedDate: string;
  try {
    postedDate = new Date(firecrawlJob.date_posted).toISOString();
  } catch {
    console.warn(`Invalid date_posted for job: ${firecrawlJob.job_title}, using current date`);
    postedDate = now;
  }
  
  const expiresDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  return {
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
    posted_date: postedDate,
    expires_date: expiresDate,
    is_active: true
  };
}

async function scrapeJobsFromFirecrawl(
  firecrawlApiKey: string, 
  url: string, 
  count: number
): Promise<JobListing[]> {
  const schema = {
    type: "object",
    properties: {
      job_listings: {
        type: "array",
        items: {
          type: "object",
          properties: {
            source_url: { type: "string" },
            source_domain: { type: "string" },
            job_title: { type: "string" },
            hiring_organization: {
              type: "object",
              properties: {
                name: { type: "string" }
              }
            },
            date_posted: { type: "string" },
            employment_type: { type: "string" },
            location: { type: "string" },
            description_summary: { type: "string" }
          }
        }
      }
    }
  };

  const prompt = `Gather ${count} of the most recent job listings from ${url} across various industries with all the necessary data for Google Jobs Schema so I can list them on my aggregated job board site`;

  const response = await fetch('https://api.firecrawl.dev/v1/agent', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${firecrawlApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      schema
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Firecrawl API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  
  if (!result.job_listings || !Array.isArray(result.job_listings)) {
    console.warn('No job listings found in Firecrawl response');
    return [];
  }

  return result.job_listings.map((job: FirecrawlJobListing) => transformFirecrawlJob(job));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body to check if this is a test run
    const body = await req.json().catch(() => ({}));
    const isTestRun = body.test === true;
    const jobCount = isTestRun ? 10 : 50;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body to check if this is a test run
    const body = await req.json().catch(() => ({}));
    const isTestRun = body.test === true;
    const jobCount = isTestRun ? 10 : 50;

    console.log(`Starting job scraper - Test mode: ${isTestRun}, Target count: ${jobCount}`);

    let allJobs: JobListing[] = [];

    // If Firecrawl API key is available, use it to scrape real job sites
    if (firecrawlApiKey) {
      console.log('Using Firecrawl API to scrape job sites');
      
      const jobSites = [
        'https://www.myjobmag.co.za/jobs',
        // Add more sites when not in test mode
        ...(isTestRun ? [] : [
          'https://www.indeed.co.za/jobs',
          'https://www.careers24.com/jobs',
        ])
      ];

      const jobsPerSite = Math.ceil(jobCount / jobSites.length);

      for (const site of jobSites) {
        try {
          console.log(`Scraping ${jobsPerSite} jobs from ${site}...`);
          const scrapedJobs = await scrapeJobsFromFirecrawl(firecrawlApiKey, site, jobsPerSite);
          console.log(`Found ${scrapedJobs.length} jobs from ${site}`);
          allJobs = [...allJobs, ...scrapedJobs];
        } catch (error) {
          console.error(`Error scraping ${site}:`, error);
          // Continue with other sites even if one fails
        }
      }
    } else {
      console.log('Firecrawl API key not available, using fallback mock data');
      
      // Fallback to mock data if Firecrawl is not configured
      const mockJobs: JobListing[] = [
        {
          title: "Senior Software Developer",
          company: "TechCorp SA",
          location: "Cape Town, South Africa",
          job_type: "full-time",
          salary_min: 600000,
          salary_max: 800000,
          currency: 'ZAR',
          description: "We are seeking a Senior Software Developer to join our growing tech team. You will be responsible for developing scalable web applications and mentoring junior developers.",
          requirements: ["5+ years of software development experience", "Strong proficiency in React and Node.js", "Experience with cloud platforms (AWS/Azure)", "Bachelor's degree in Computer Science or related field"],
          benefits: ["Competitive salary", "Health insurance", "Remote work options"],
          skills_required: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
          experience_level: "senior",
          remote_allowed: true,
          application_url: "https://example.com/apply/1",
          source_website: "LinkedIn",
          source_url: "https://linkedin.com/jobs/test-1-" + Date.now(),
          posted_date: new Date().toISOString(),
          expires_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          is_active: true,
        },
        {
          title: "Marketing Manager",
          company: "GrowthHub Africa",
          location: "Johannesburg, South Africa",
          job_type: "full-time",
          salary_min: 450000,
          salary_max: 600000,
          currency: 'ZAR',
          description: "Join our dynamic marketing team as a Marketing Manager. You'll lead digital marketing campaigns and drive brand awareness across African markets.",
          requirements: ["3+ years of marketing experience", "Digital marketing expertise", "Experience with SEO/SEM", "Strong analytical skills"],
          benefits: ["Annual bonus", "Professional development", "Team events"],
          skills_required: ["Digital Marketing", "SEO", "Google Ads", "Analytics", "Content Marketing"],
          experience_level: "mid",
          remote_allowed: false,
          application_url: "https://example.com/apply/2",
          source_website: "Indeed",
          source_url: "https://indeed.co.za/jobs/test-2-" + Date.now(),
          posted_date: new Date().toISOString(),
          expires_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          is_active: true,
        }
      ];

      allJobs = mockJobs.slice(0, jobCount);
    }

    if (allJobs.length === 0) {
      throw new Error('No jobs were scraped from any source');
    }

    console.log(`Total jobs scraped: ${allJobs.length}`);

    // Insert jobs into database with upsert to avoid duplicates
    const { data: insertedJobs, error: insertError } = await supabase
      .from('jobs')
      .upsert(allJobs, { 
        onConflict: 'source_url',
        ignoreDuplicates: true 
      })
      .select();

    if (insertError) {
      console.error('Error inserting jobs:', insertError);
      throw insertError;
    }

    console.log(`Successfully inserted/updated ${insertedJobs?.length || 0} jobs`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully scraped and inserted ${insertedJobs?.length || 0} jobs`,
        jobsScraped: allJobs.length,
        jobsInserted: insertedJobs?.length || 0,
        testMode: isTestRun
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in job-scraper function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});