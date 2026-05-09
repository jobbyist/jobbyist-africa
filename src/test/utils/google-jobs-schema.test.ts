import { describe, it, expect } from 'vitest';
import { generateJobSchema } from '@/utils/google-jobs-schema';

const baseJob = {
  id: 'job-001',
  title: 'Software Engineer',
  company: 'Acme Corp',
  location: 'Cape Town, Western Cape, South Africa',
  job_type: 'full-time',
  currency: 'ZAR',
  description: 'Build great software.',
  application_url: 'https://acme.co.za/apply',
  created_at: '2024-01-15T00:00:00Z',
  posted_date: '2024-01-15T00:00:00Z',
  expires_date: '2024-03-15T00:00:00Z',
  remote_allowed: false,
  salary_min: 600000,
  company_logo_url: 'https://acme.co.za/logo.png',
};

describe('generateJobSchema', () => {
  it('returns a valid JobPosting object with all required fields', () => {
    const schema = generateJobSchema(baseJob);
    expect(schema['@context']).toBe('https://schema.org/');
    expect(schema['@type']).toBe('JobPosting');
    expect(schema.title).toBe('Software Engineer');
    expect(schema.description).toBe('Build great software.');
    expect(schema.datePosted).toBe('2024-01-15T00:00:00Z');
    expect(schema.employmentType).toBe('FULL_TIME');
  });

  it('populates hiringOrganization correctly', () => {
    const schema = generateJobSchema(baseJob);
    expect(schema.hiringOrganization.name).toBe('Acme Corp');
    expect(schema.hiringOrganization.sameAs).toBe('https://acme.co.za/apply');
    expect(schema.hiringOrganization.logo).toBe('https://acme.co.za/logo.png');
  });

  it('resolves South Africa country code to ZA', () => {
    const schema = generateJobSchema(baseJob);
    expect(schema.jobLocation.address.addressCountry).toBe('ZA');
  });

  it('resolves Nigeria country code to NG', () => {
    const schema = generateJobSchema({
      ...baseJob,
      location: 'Lagos, Lagos State, Nigeria',
    });
    expect(schema.jobLocation.address.addressCountry).toBe('NG');
  });

  it('includes addressRegion when location has three parts', () => {
    const schema = generateJobSchema(baseJob);
    expect(schema.jobLocation.address.addressLocality).toBe('Cape Town');
    expect(schema.jobLocation.address.addressRegion).toBe('Western Cape');
  });

  it('handles two-part location without addressRegion', () => {
    const schema = generateJobSchema({
      ...baseJob,
      location: 'Lagos, Nigeria',
    });
    expect(schema.jobLocation.address.addressLocality).toBe('Lagos');
    expect(schema.jobLocation.address.addressRegion).toBeUndefined();
    expect(schema.jobLocation.address.addressCountry).toBe('NG');
  });

  it('includes validThrough when expires_date is a valid ISO date', () => {
    const schema = generateJobSchema(baseJob);
    expect(schema.validThrough).toBe('2024-03-15T00:00:00Z');
  });

  it('omits validThrough when expires_date is missing', () => {
    const schema = generateJobSchema({ ...baseJob, expires_date: undefined });
    expect(schema.validThrough).toBeUndefined();
  });

  it('omits validThrough when expires_date is an invalid date string', () => {
    const schema = generateJobSchema({ ...baseJob, expires_date: 'not-a-date' });
    expect(schema.validThrough).toBeUndefined();
  });

  it('includes baseSalary when salary_min is provided', () => {
    const schema = generateJobSchema(baseJob);
    expect(schema.baseSalary).toBeDefined();
    expect(schema.baseSalary!.currency).toBe('ZAR');
    expect(schema.baseSalary!.value.value).toBe(600000);
    expect(schema.baseSalary!.value.unitText).toBe('YEAR');
  });

  it('omits baseSalary when salary_min is missing', () => {
    const schema = generateJobSchema({ ...baseJob, salary_min: undefined });
    expect(schema.baseSalary).toBeUndefined();
  });

  it('omits baseSalary when salary_min is zero', () => {
    const schema = generateJobSchema({ ...baseJob, salary_min: 0 });
    expect(schema.baseSalary).toBeUndefined();
  });

  it('omits logo from hiringOrganization when company_logo_url is missing', () => {
    const schema = generateJobSchema({ ...baseJob, company_logo_url: undefined });
    expect(schema.hiringOrganization.logo).toBeUndefined();
  });

  it('sets jobLocationType to TELECOMMUTE for remote jobs', () => {
    const schema = generateJobSchema({ ...baseJob, remote_allowed: true });
    expect(schema.jobLocationType).toBe('TELECOMMUTE');
  });

  it('omits jobLocationType for non-remote jobs', () => {
    const schema = generateJobSchema({ ...baseJob, remote_allowed: false });
    expect(schema.jobLocationType).toBeUndefined();
  });

  it('normalises employment type hyphens to underscores', () => {
    const schema = generateJobSchema({ ...baseJob, job_type: 'part-time' });
    expect(schema.employmentType).toBe('PART_TIME');
  });

  it('falls back to created_at when posted_date is missing', () => {
    const schema = generateJobSchema({ ...baseJob, posted_date: undefined });
    expect(schema.datePosted).toBe('2024-01-15T00:00:00Z');
  });

  it('sets identifier with company name and job id', () => {
    const schema = generateJobSchema(baseJob);
    expect(schema.identifier['@type']).toBe('PropertyValue');
    expect(schema.identifier.name).toBe('Acme Corp');
    expect(schema.identifier.value).toBe('job-001');
  });
});
