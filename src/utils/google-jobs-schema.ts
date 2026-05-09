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
  validThrough?: string;
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

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  currency: string;
  description: string;
  skills_required?: string[];
  application_url: string;
  company_logo_url?: string;
  salary_min?: number;
  created_at: string;
  posted_date?: string;
  expires_date?: string;
  remote_allowed?: boolean;
}

/** Resolve an ISO-8601 country code from a location string. */
function resolveCountryCode(locationPart: string | undefined): string {
  if (!locationPart) return 'ZA';
  const upper = locationPart.toUpperCase();
  if (upper.includes('SOUTH AFRICA') || upper === 'ZA') return 'ZA';
  if (upper.includes('NIGERIA') || upper === 'NG') return 'NG';
  if (upper.includes('KENYA') || upper === 'KE') return 'KE';
  if (upper.includes('GHANA') || upper === 'GH') return 'GH';
  // Default to ZA for unknown African locations
  return 'ZA';
}

export function generateJobSchema(job: Job): JobPosting {
  const parts = job.location.split(', ');
  const city = parts[0] || job.location;
  const region = parts.length >= 3 ? parts[1] : undefined;
  const countryRaw = parts.length >= 3 ? parts[2] : parts[1];

  const schema: JobPosting = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    identifier: {
      "@type": "PropertyValue",
      name: job.company,
      value: job.id
    },
    datePosted: job.posted_date || job.created_at,
    employmentType: job.job_type.toUpperCase().replace(/-/g, '_'),
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
      ...(job.application_url ? { sameAs: job.application_url } : {}),
      ...(job.company_logo_url ? { logo: job.company_logo_url } : {})
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: city,
        ...(region ? { addressRegion: region } : {}),
        addressCountry: resolveCountryCode(countryRaw)
      }
    }
  };

  // Only include validThrough when a valid expiry date is present
  if (job.expires_date) {
    const expiry = new Date(job.expires_date);
    if (!isNaN(expiry.getTime())) {
      schema.validThrough = job.expires_date;
    }
  }

  // Only include baseSalary when salary data is available
  if (job.salary_min && job.salary_min > 0) {
    schema.baseSalary = {
      "@type": "MonetaryAmount",
      currency: job.currency || 'ZAR',
      value: {
        "@type": "QuantitativeValue",
        value: job.salary_min,
        unitText: "YEAR"
      }
    };
  }

  // Mark remote jobs using Google's TELECOMMUTE type
  if (job.remote_allowed) {
    schema.jobLocationType = "TELECOMMUTE";
  }

  return schema;
}

/**
 * Inject a single JobPosting JSON-LD script into <head>.
 * Returns a cleanup function that removes the script element.
 * Passing a `scriptId` prevents duplicate scripts on re-render.
 */
export function injectJobSchema(job: Job, scriptId: string): () => void {
  // Remove any previously injected script with the same id
  const existing = document.getElementById(scriptId);
  if (existing) existing.remove();

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = scriptId;
  script.text = JSON.stringify(generateJobSchema(job));
  document.head.appendChild(script);

  return () => {
    const el = document.getElementById(scriptId);
    if (el) el.remove();
  };
}