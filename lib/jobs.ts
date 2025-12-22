/**
 * Job Listings Data Aggregation
 * Aggregates all job listings from data/job-listings directory
 */

import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Google Jobs Schema Interface
export interface JobPosting {
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

/**
 * Get all job listings from data/job-listings directory
 * @returns Array of all job postings in Google Jobs Schema format
 */
export function getAllJobs(): JobPosting[] {
  const dataDir = join(process.cwd(), 'data', 'job-listings');
  
  // Check if directory exists
  if (!existsSync(dataDir)) {
    console.warn('Job listings directory does not exist:', dataDir);
    return [];
  }
  
  const allJobs: JobPosting[] = [];
  
  try {
    // Read all JSON files from directory
    const files = readdirSync(dataDir)
      .filter(file => file.endsWith('.json'))
      .sort()
      .reverse(); // Most recent first
    
    console.log(`Found ${files.length} job listing file(s)`);
    
    for (const file of files) {
      const filePath = join(dataDir, file);
      
      try {
        const fileContent = readFileSync(filePath, 'utf-8');
        const jobs = JSON.parse(fileContent) as JobPosting[];
        
        // Validate that jobs is an array
        if (Array.isArray(jobs)) {
          allJobs.push(...jobs);
        } else {
          console.warn(`Invalid format in ${file}: expected array`);
        }
      } catch (error) {
        console.error(`Error reading ${file}:`, error);
      }
    }
    
    console.log(`Loaded ${allJobs.length} total job listings`);
  } catch (error) {
    console.error('Error reading job listings directory:', error);
  }
  
  return allJobs;
}

/**
 * Get job listings filtered by country
 * @param country - Country code (e.g., 'ZA', 'NG')
 * @returns Array of job postings for specified country
 */
export function getJobsByCountry(country: string): JobPosting[] {
  const allJobs = getAllJobs();
  return allJobs.filter(job => 
    job.jobLocation.address.addressCountry === country
  );
}

/**
 * Get job listings filtered by date range
 * @param startDate - Start date (ISO string or Date)
 * @param endDate - End date (ISO string or Date)
 * @returns Array of job postings within date range
 */
export function getJobsByDateRange(startDate: string | Date, endDate: string | Date): JobPosting[] {
  const allJobs = getAllJobs();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return allJobs.filter(job => {
    const postedDate = new Date(job.datePosted);
    return postedDate >= start && postedDate <= end;
  });
}

/**
 * Get the most recent job listings
 * @param limit - Maximum number of jobs to return
 * @returns Array of most recent job postings
 */
export function getRecentJobs(limit: number = 10): JobPosting[] {
  const allJobs = getAllJobs();
  
  // Sort by date posted (most recent first)
  return allJobs
    .sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime())
    .slice(0, limit);
}

/**
 * Search jobs by keyword in title or description
 * @param keyword - Search keyword
 * @returns Array of matching job postings
 */
export function searchJobs(keyword: string): JobPosting[] {
  const allJobs = getAllJobs();
  const searchTerm = keyword.toLowerCase();
  
  return allJobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm) ||
    job.description.toLowerCase().includes(searchTerm) ||
    job.hiringOrganization.name.toLowerCase().includes(searchTerm)
  );
}

/**
 * Get unique companies from all job listings
 * @returns Array of unique company names
 */
export function getUniqueCompanies(): string[] {
  const allJobs = getAllJobs();
  const companies = new Set(allJobs.map(job => job.hiringOrganization.name));
  return Array.from(companies).sort();
}

/**
 * Get unique locations from all job listings
 * @returns Array of unique locations
 */
export function getUniqueLocations(): Array<{ locality: string; region?: string; country: string }> {
  const allJobs = getAllJobs();
  const locationsMap = new Map<string, { locality: string; region?: string; country: string }>();
  
  allJobs.forEach(job => {
    const address = job.jobLocation.address;
    const key = `${address.addressLocality}-${address.addressRegion || ''}-${address.addressCountry}`;
    
    if (!locationsMap.has(key)) {
      locationsMap.set(key, {
        locality: address.addressLocality,
        region: address.addressRegion,
        country: address.addressCountry
      });
    }
  });
  
  return Array.from(locationsMap.values());
}

export default {
  getAllJobs,
  getJobsByCountry,
  getJobsByDateRange,
  getRecentJobs,
  searchJobs,
  getUniqueCompanies,
  getUniqueLocations
};
