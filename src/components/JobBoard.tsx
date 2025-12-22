/**
 * JobBoard Component
 * Displays aggregated job listings from data/job-listings
 */

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Building2, Calendar, ExternalLink } from 'lucide-react';

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

interface JobBoardProps {
  jobs: JobPosting[];
  title?: string;
  showFilters?: boolean;
}

/**
 * Format employment type for display
 */
function formatEmploymentType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Format location for display
 */
function formatLocation(address: JobPosting['jobLocation']['address']): string {
  const parts = [
    address.addressLocality,
    address.addressRegion,
    address.addressCountry === 'ZA' ? 'South Africa' : 'Nigeria'
  ].filter(Boolean);
  
  return parts.join(', ');
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Format salary for display
 */
function formatSalary(baseSalary?: JobPosting['baseSalary']): string | null {
  if (!baseSalary) return null;
  
  const { currency, value } = baseSalary;
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  });
  
  return `${formatter.format(value.value)} / ${value.unitText.toLowerCase()}`;
}

/**
 * JobBoard Component
 * Displays a list of job postings in Google Jobs Schema format
 */
export const JobBoard = ({ jobs, title = "Latest Job Listings", showFilters = false }: JobBoardProps) => {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-muted-foreground text-lg">No job listings available at the moment.</p>
        <p className="text-muted-foreground text-sm mt-2">Check back soon for new opportunities!</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Badge variant="secondary" className="text-sm">
          {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'}
        </Badge>
      </div>

      {/* Job Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <Card key={job.identifier.value} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="space-y-2">
              {/* Company Logo and Name */}
              <div className="flex items-start gap-3">
                {job.hiringOrganization.logo && (
                  <img
                    src={job.hiringOrganization.logo}
                    alt={`${job.hiringOrganization.name} logo`}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {job.title}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {job.hiringOrganization.name}
                  </p>
                </div>
              </div>

              {/* Employment Type Badge */}
              <Badge variant="outline" className="w-fit">
                {formatEmploymentType(job.employmentType)}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-3">
                {job.description}
              </p>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="line-clamp-1">
                  {formatLocation(job.jobLocation.address)}
                </span>
                {job.jobLocationType === "TELECOMMUTE" && (
                  <Badge variant="secondary" className="text-xs">Remote</Badge>
                )}
              </div>

              {/* Salary */}
              {job.baseSalary && (
                <div className="text-sm font-medium text-primary">
                  {formatSalary(job.baseSalary)}
                </div>
              )}

              {/* Posted Date */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>Posted {formatDate(job.datePosted)}</span>
              </div>

              {/* Apply Button */}
              <Button 
                className="w-full mt-4" 
                variant="default"
                asChild
              >
                <a
                  href={job.hiringOrganization.sameAs || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  Apply Now
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="pt-6 border-t">
        <p className="text-center text-sm text-muted-foreground">
          Showing {jobs.length} job {jobs.length === 1 ? 'listing' : 'listings'} from Nigeria and South Africa
        </p>
      </div>
    </div>
  );
};

export default JobBoard;
