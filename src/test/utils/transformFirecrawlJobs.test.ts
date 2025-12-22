import { describe, it, expect } from 'vitest';
import { transformFirecrawlJob, transformFirecrawlJobs } from '@/utils/transformFirecrawlJobs';
import type { JobListingResult } from '@/lib/firecrawl';

const mockFirecrawlJob = {
  source_url: 'https://www.myjobmag.co.za/jobs/software-developer-123',
  source_url_citation: '[1]',
  source_domain: 'myjobmag.co.za',
  source_domain_citation: '[1]',
  job_title: 'Senior Software Developer',
  job_title_citation: '[1]',
  hiring_organization: {
    name: 'Tech Corp SA',
    name_citation: '[1]'
  },
  date_posted: '2024-01-15T00:00:00Z',
  date_posted_citation: '[1]',
  employment_type: 'Full Time',
  employment_type_citation: '[1]',
  location: 'Cape Town, South Africa',
  location_citation: '[1]',
  description_summary: 'We are seeking a talented Senior Software Developer with experience in React and Node.js to join our growing team.',
  description_summary_citation: '[1]'
};

const mockFirecrawlResult: JobListingResult = {
  job_listings: [mockFirecrawlJob]
};

describe('transformFirecrawlJob', () => {
  it('transforms a Firecrawl job to application format', () => {
    const result = transformFirecrawlJob(mockFirecrawlJob, 0);
    
    expect(result.title).toBe('Senior Software Developer');
    expect(result.company).toBe('Tech Corp SA');
    expect(result.location).toBe('Cape Town, South Africa');
    expect(result.job_type).toBe('full-time');
    expect(result.source_website).toBe('myjobmag.co.za');
    expect(result.source_url).toBe('https://www.myjobmag.co.za/jobs/software-developer-123');
  });

  it('generates a unique ID for each job', () => {
    const result1 = transformFirecrawlJob(mockFirecrawlJob, 0);
    const result2 = transformFirecrawlJob(mockFirecrawlJob, 1);
    
    expect(result1.id).toBeDefined();
    expect(result2.id).toBeDefined();
    expect(result1.id).not.toBe(result2.id);
  });

  it('extracts skills from job title and description', () => {
    const result = transformFirecrawlJob(mockFirecrawlJob, 0);
    
    expect(result.skills_required.length).toBeGreaterThan(0);
    // Should extract React and Node.js from description
    expect(result.skills_required).toContain('React');
  });

  it('determines experience level correctly', () => {
    const result = transformFirecrawlJob(mockFirecrawlJob, 0);
    
    expect(result.experience_level).toBe('senior');
  });

  it('handles different employment types', () => {
    const partTimeJob = { 
      ...mockFirecrawlJob, 
      employment_type: 'Part Time' 
    };
    const contractJob = { 
      ...mockFirecrawlJob, 
      employment_type: 'Contract' 
    };
    
    const result1 = transformFirecrawlJob(partTimeJob, 0);
    const result2 = transformFirecrawlJob(contractJob, 0);
    
    expect(result1.job_type).toBe('part-time');
    expect(result2.job_type).toBe('contract');
  });

  it('sets remote_allowed correctly', () => {
    const remoteJob = { 
      ...mockFirecrawlJob, 
      location: 'Remote' 
    };
    const result = transformFirecrawlJob(remoteJob, 0);
    
    expect(result.remote_allowed).toBe(true);
  });

  it('includes required fields for Google Jobs Schema', () => {
    const result = transformFirecrawlJob(mockFirecrawlJob, 0);
    
    expect(result.posted_date).toBeDefined();
    expect(result.expires_date).toBeDefined();
    expect(result.is_active).toBe(true);
    expect(result.currency).toBe('ZAR');
  });

  it('creates default requirements and benefits', () => {
    const result = transformFirecrawlJob(mockFirecrawlJob, 0);
    
    expect(result.requirements).toBeDefined();
    expect(result.requirements.length).toBeGreaterThan(0);
    expect(result.benefits).toBeDefined();
    expect(result.benefits.length).toBeGreaterThan(0);
  });

  it('handles invalid date_posted gracefully', () => {
    const jobWithInvalidDate = {
      ...mockFirecrawlJob,
      date_posted: 'invalid-date'
    };
    
    const result = transformFirecrawlJob(jobWithInvalidDate, 0);
    
    // Should use current date as fallback
    expect(result.posted_date).toBeDefined();
    expect(() => new Date(result.posted_date)).not.toThrow();
  });
});

describe('transformFirecrawlJobs', () => {
  it('transforms an array of Firecrawl jobs', () => {
    const multipleJobs: JobListingResult = {
      job_listings: [
        mockFirecrawlJob,
        { ...mockFirecrawlJob, job_title: 'Junior Developer' },
        { ...mockFirecrawlJob, job_title: 'Marketing Manager' }
      ]
    };
    
    const result = transformFirecrawlJobs(multipleJobs);
    
    expect(result.length).toBe(3);
    expect(result[0].title).toBe('Senior Software Developer');
    expect(result[1].title).toBe('Junior Developer');
    expect(result[2].title).toBe('Marketing Manager');
  });

  it('returns empty array for empty input', () => {
    const emptyResult: JobListingResult = {
      job_listings: []
    };
    
    const result = transformFirecrawlJobs(emptyResult);
    
    expect(result).toEqual([]);
  });

  it('assigns unique IDs to each job', () => {
    const multipleJobs: JobListingResult = {
      job_listings: [mockFirecrawlJob, mockFirecrawlJob, mockFirecrawlJob]
    };
    
    const result = transformFirecrawlJobs(multipleJobs);
    const ids = result.map(job => job.id);
    const uniqueIds = new Set(ids);
    
    expect(uniqueIds.size).toBe(3);
  });
});

describe('Experience Level Detection', () => {
  const testCases = [
    { title: 'Senior Software Engineer', expected: 'senior' },
    { title: 'Lead Developer', expected: 'senior' },
    { title: 'Director of Engineering', expected: 'senior' },
    { title: 'Junior Developer', expected: 'entry-level' },
    { title: 'Intern - Software Development', expected: 'entry-level' },
    { title: 'Graduate Trainee', expected: 'entry-level' },
    { title: 'Software Developer', expected: 'mid-level' },
    { title: 'Marketing Specialist', expected: 'mid-level' }
  ];

  testCases.forEach(({ title, expected }) => {
    it(`detects "${expected}" for "${title}"`, () => {
      const job = { ...mockFirecrawlJob, job_title: title };
      const result = transformFirecrawlJob(job, 0);
      
      expect(result.experience_level).toBe(expected);
    });
  });
});

describe('Skill Extraction', () => {
  it('extracts technical skills from description', () => {
    const jobWithSkills = {
      ...mockFirecrawlJob,
      description_summary: 'We need someone skilled in Python, Java, and AWS cloud services.'
    };
    
    const result = transformFirecrawlJob(jobWithSkills, 0);
    
    expect(result.skills_required).toContain('Python');
    expect(result.skills_required).toContain('Java');
    expect(result.skills_required).toContain('AWS');
  });

  it('infers skills from job title when not in description', () => {
    const managerJob = {
      ...mockFirecrawlJob,
      job_title: 'Project Manager',
      description_summary: 'Manage projects effectively.'
    };
    
    const result = transformFirecrawlJob(managerJob, 0);
    
    expect(result.skills_required).toContain('Management');
  });

  it('limits skills to maximum count', () => {
    const jobWithManySkills = {
      ...mockFirecrawlJob,
      description_summary: 'Skills: Python, Java, JavaScript, TypeScript, React, Node.js, SQL, AWS, Azure, Docker'
    };
    
    const result = transformFirecrawlJob(jobWithManySkills, 0);
    
    expect(result.skills_required.length).toBeLessThanOrEqual(5);
  });

  it('provides default skills when none found', () => {
    const jobWithNoSkills = {
      ...mockFirecrawlJob,
      job_title: 'Generic Position',
      description_summary: 'A great opportunity.'
    };
    
    const result = transformFirecrawlJob(jobWithNoSkills, 0);
    
    expect(result.skills_required.length).toBeGreaterThan(0);
    expect(result.skills_required).toContain('Professional Skills');
  });
});
