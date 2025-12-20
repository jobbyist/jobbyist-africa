import Firecrawl from '@mendable/firecrawl-js';
import { z } from 'zod';

// Job listing schema matching Google Jobs Schema requirements
export const jobListingSchema = z.object({
  job_listings: z.array(z.object({
    source_url: z.string(),
    source_url_citation: z.string(),
    source_domain: z.string(),
    source_domain_citation: z.string(),
    job_title: z.string(),
    job_title_citation: z.string(),
    hiring_organization: z.object({
      name: z.string(),
      name_citation: z.string()
    }),
    date_posted: z.string(),
    date_posted_citation: z.string(),
    employment_type: z.string(),
    employment_type_citation: z.string(),
    location: z.string(),
    location_citation: z.string(),
    description_summary: z.string(),
    description_summary_citation: z.string()
  }))
});

export type JobListingResult = z.infer<typeof jobListingSchema>;

// Initialize Firecrawl client - will be undefined if API key is not provided
const firecrawl = import.meta.env.VITE_FIRECRAWL_API_KEY 
  ? new Firecrawl({ apiKey: import.meta.env.VITE_FIRECRAWL_API_KEY })
  : null;

export class FirecrawlService {
  private static instance: FirecrawlService;
  
  private constructor() {}
  
  static getInstance(): FirecrawlService {
    if (!FirecrawlService.instance) {
      FirecrawlService.instance = new FirecrawlService();
    }
    return FirecrawlService.instance;
  }
  
  isConfigured(): boolean {
    return !!firecrawl;
  }
  
  /**
   * Gather job listings from a specified URL using Firecrawl agent
   * @param url - The URL to scrape job listings from
   * @param count - Number of job listings to gather (default: 50)
   * @returns Promise with structured job listings data
   */
  async gatherJobListings(
    url: string = 'https://www.myjobmag.co.za/jobs',
    count: number = 50
  ): Promise<JobListingResult> {
    if (!firecrawl) {
      throw new Error('Firecrawl API key not configured. Please add VITE_FIRECRAWL_API_KEY to your environment variables.');
    }
    
    try {
      const result = await firecrawl.agent({
        prompt: `Gather ${count} of the most recent job listings from ${url} across various industries in South Africa with all the necessary data for Google Jobs Schema so I can list them on my aggregated job board site`,
        schema: jobListingSchema,
      });
      
      return result as JobListingResult;
    } catch (error) {
      console.error('Firecrawl API error:', error);
      throw new Error('Failed to gather job listings. Please try again later.');
    }
  }
  
  /**
   * Gather job listings with custom prompt
   * @param prompt - Custom prompt for the agent
   * @returns Promise with structured job listings data
   */
  async gatherJobListingsWithPrompt(prompt: string): Promise<JobListingResult> {
    if (!firecrawl) {
      throw new Error('Firecrawl API key not configured. Please add VITE_FIRECRAWL_API_KEY to your environment variables.');
    }
    
    try {
      const result = await firecrawl.agent({
        prompt,
        schema: jobListingSchema,
      });
      
      return result as JobListingResult;
    } catch (error) {
      console.error('Firecrawl API error:', error);
      throw new Error('Failed to gather job listings. Please try again later.');
    }
  }
}

export const firecrawlService = FirecrawlService.getInstance();
