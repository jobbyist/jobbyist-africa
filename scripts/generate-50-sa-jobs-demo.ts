#!/usr/bin/env tsx

/**
 * Generate 50 realistic South African job listings for demonstration
 * This simulates what would be scraped from Firecrawl
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

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

// Sample South African companies
const companies = [
  'Nedbank', 'Standard Bank', 'Absa', 'FNB', 'Capitec Bank', 'Discovery',
  'Old Mutual', 'Sanlam', 'Woolworths', 'Pick n Pay', 'Shoprite', 'Takealot',
  'Mr Price Group', 'TFG', 'Bidvest', 'Imperial Logistics', 'MTN', 'Vodacom',
  'Telkom', 'Cell C', 'Sasol', 'Anglo American', 'Eskom', 'Transnet',
  'SAB Miller', 'Tiger Brands', 'RCL Foods', 'AVI Limited', 'Clicks Group',
  'Dis-Chem', 'Netcare', 'Life Healthcare', 'Mediclinic', 'Liberty Holdings',
  'Momentum', 'Allan Gray', 'Investec', 'PSG Group', 'Remgro', 'Naspers',
  'MultiChoice', 'Media24', 'BCX', 'Dimension Data', 'EOH', 'Altron',
  'Blue Label Telecoms', 'Adapt IT', 'Datacentrix', 'AngloGold Ashanti'
];

// South African locations
const locations = [
  'Johannesburg, Gauteng, South Africa',
  'Cape Town, Western Cape, South Africa',
  'Pretoria, Gauteng, South Africa',
  'Durban, KwaZulu-Natal, South Africa',
  'Port Elizabeth, Eastern Cape, South Africa',
  'Bloemfontein, Free State, South Africa',
  'Sandton, Gauteng, South Africa',
  'Rosebank, Gauteng, South Africa',
  'Centurion, Gauteng, South Africa',
  'Stellenbosch, Western Cape, South Africa'
];

// Job templates
const jobTemplates = [
  {
    title: 'Senior Software Developer',
    skills: ['Python', 'Java', 'React', 'SQL', 'AWS'],
    experience: 'senior',
    description: 'We are seeking a Senior Software Developer to join our innovative tech team. You will be responsible for developing scalable applications and mentoring junior developers.',
    type: 'full-time'
  },
  {
    title: 'Marketing Manager',
    skills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics', 'Social Media'],
    experience: 'mid',
    description: 'Join our dynamic marketing team as a Marketing Manager. Lead digital campaigns and drive brand awareness across African markets.',
    type: 'full-time'
  },
  {
    title: 'Financial Analyst',
    skills: ['Financial Modeling', 'Excel', 'Analysis', 'Reporting', 'Forecasting'],
    experience: 'mid',
    description: 'Looking for a Financial Analyst to analyze financial data, create reports, and support strategic decision-making.',
    type: 'full-time'
  },
  {
    title: 'Sales Representative',
    skills: ['Sales', 'Communication', 'Negotiation', 'CRM', 'Customer Service'],
    experience: 'entry',
    description: 'Exciting opportunity for a Sales Representative to build client relationships and drive revenue growth.',
    type: 'full-time'
  },
  {
    title: 'Data Scientist',
    skills: ['Python', 'Machine Learning', 'Statistics', 'SQL', 'Data Visualization'],
    experience: 'senior',
    description: 'Join our data science team to build predictive models and extract insights from large datasets.',
    type: 'full-time'
  },
  {
    title: 'HR Manager',
    skills: ['HR Management', 'Recruitment', 'Employee Relations', 'Performance Management', 'Training'],
    experience: 'mid',
    description: 'Lead our HR function, managing recruitment, employee development, and organizational culture.',
    type: 'full-time'
  },
  {
    title: 'Project Manager',
    skills: ['Project Management', 'Agile', 'Scrum', 'Leadership', 'Communication'],
    experience: 'mid',
    description: 'Seeking an experienced Project Manager to lead cross-functional teams and deliver projects on time and within budget.',
    type: 'full-time'
  },
  {
    title: 'Accountant',
    skills: ['Accounting', 'IFRS', 'Tax', 'Excel', 'Financial Reporting'],
    experience: 'mid',
    description: 'Join our finance team as an Accountant. Handle financial transactions, prepare reports, and ensure compliance.',
    type: 'full-time'
  },
  {
    title: 'Customer Service Agent',
    skills: ['Customer Service', 'Communication', 'Problem Solving', 'Multitasking', 'Patience'],
    experience: 'entry',
    description: 'Provide excellent customer service, handle inquiries, and resolve issues for our valued customers.',
    type: 'full-time'
  },
  {
    title: 'Business Analyst',
    skills: ['Business Analysis', 'Requirements Gathering', 'Process Improvement', 'SQL', 'Documentation'],
    experience: 'mid',
    description: 'Work with stakeholders to analyze business needs and translate them into technical requirements.',
    type: 'full-time'
  }
];

function generateJobs(count: number): Job[] {
  const jobs: Job[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const template = jobTemplates[i % jobTemplates.length];
    const company = companies[i % companies.length];
    const location = locations[i % locations.length];
    
    const postedDate = new Date(now);
    postedDate.setDate(postedDate.getDate() - Math.floor(Math.random() * 7)); // Within last week
    
    const expiresDate = new Date(postedDate);
    expiresDate.setDate(expiresDate.getDate() + 30);
    
    const job: Job = {
      id: `sa-demo-${Date.now()}-${i}`,
      title: template.title,
      company,
      location,
      job_type: template.type,
      salary_min: Math.floor(300000 + Math.random() * 400000),
      salary_max: Math.floor(600000 + Math.random() * 500000),
      currency: 'ZAR',
      description: template.description,
      requirements: [
        'Relevant qualification and experience as per job description',
        'Strong communication and interpersonal skills',
        'Ability to work independently and as part of a team',
        'Commitment to professional excellence'
      ],
      benefits: [
        'Competitive salary package',
        'Medical aid and retirement fund',
        'Professional development opportunities',
        'Annual performance bonuses',
        'Flexible working arrangements'
      ],
      skills_required: template.skills,
      experience_level: template.experience,
      remote_allowed: Math.random() > 0.6,
      application_url: `https://www.${company.toLowerCase().replace(/\s+/g, '')}.co.za/careers/${template.title.toLowerCase().replace(/\s+/g, '-')}`,
      company_logo_url: '',
      source_website: ['myjobmag.co.za', 'careers24.com', 'pnet.co.za', 'indeed.co.za'][i % 4],
      source_url: `https://www.${['myjobmag.co.za', 'careers24.com', 'pnet.co.za', 'indeed.co.za'][i % 4]}/job/${i + 1000}`,
      is_active: true,
      posted_date: postedDate.toISOString(),
      expires_date: expiresDate.toISOString(),
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    };
    
    jobs.push(job);
  }
  
  return jobs;
}

async function main() {
  console.log('🚀 Generating 50 South African Job Listings (Demo)');
  console.log('=' .repeat(60));
  
  // Generate 50 jobs
  const newJobs = generateJobs(50);
  console.log(`✅ Generated ${newJobs.length} job listings`);
  
  // Load existing jobs
  const dbPath = join(process.cwd(), 'database', 'jobs.json');
  let existingJobs: Job[] = [];
  
  try {
    const existingData = readFileSync(dbPath, 'utf-8');
    existingJobs = JSON.parse(existingData);
    console.log(`📚 Loaded ${existingJobs.length} existing jobs from database`);
  } catch (error) {
    console.warn('⚠️  Could not load existing jobs');
  }
  
  // Add new jobs
  const allJobs = [...existingJobs, ...newJobs];
  writeFileSync(dbPath, JSON.stringify(allJobs, null, 2), 'utf-8');
  
  console.log(`\n✨ Publishing Results:`);
  console.log(`   New jobs added: ${newJobs.length}`);
  console.log(`   Total jobs in database: ${allJobs.length}`);
  console.log(`   Database file: ${dbPath}`);
  
  console.log('');
  console.log('=' .repeat(60));
  console.log('🎉 Job generation and publishing complete!');
  console.log('=' .repeat(60));
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
