import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobById } from '@/utils/loadJobs';
import { injectJobSchema } from '@/utils/google-jobs-schema';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MapPin, Building2, Clock, DollarSign, ExternalLink, ArrowLeft } from 'lucide-react';
import { FloatingHomeButton } from '@/components/FloatingHomeButton';

const CANONICAL_BASE = 'https://jobbyist.africa';
const SCHEMA_SCRIPT_ID = 'job-detail-ld-json';

/** Truncate text at a word boundary and append ellipsis if needed. */
function truncateAtWordBoundary(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + '…';
}

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const job = id ? getJobById(id) : undefined;
  const [logoError, setLogoError] = useState(false);

  // Inject / clean up a single JobPosting JSON-LD script — no duplicates on re-render
  useEffect(() => {
    if (!job) return;
    const cleanup = injectJobSchema(job, SCHEMA_SCRIPT_ID);
    return cleanup;
  }, [job]);

  // Manage document title and meta description
  useEffect(() => {
    const prevTitle = document.title;
    if (job) {
      document.title = `${job.title} at ${job.company} | Jobbyist`;
    }
    return () => {
      document.title = prevTitle;
    };
  }, [job]);

  // Manage meta description
  useEffect(() => {
    if (!job) return;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const created = !meta;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    const prev = meta.content;
    meta.content = truncateAtWordBoundary(job.description, 160);
    return () => {
      if (created && meta) {
        meta.remove();
      } else if (meta) {
        meta.content = prev;
      }
    };
  }, [job]);

  // Update canonical link element
  useEffect(() => {
    if (!job) return;
    const canonicalUrl = `${CANONICAL_BASE}/jobs/${job.id}`;
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const created = !link;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonicalUrl;
    return () => {
      if (created && link) link.remove();
    };
  }, [job]);

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Job not found</h1>
          <p className="text-muted-foreground mb-4">
            This job listing may have been removed or the link may be incorrect.
          </p>
          <Link to="/jobs">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatSalary = (min?: number, max?: number, currency = 'ZAR') => {
    if (!min && !max) return null;
    const formatter = new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}`;
    return formatter.format(min || max || 0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleApply = () => {
    if (!job.application_url) return;
    window.open(job.application_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back navigation */}
        <div className="mb-6">
          <Link to="/jobs">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3">
              {job.company_logo_url && !logoError && (
                <img
                  src={job.company_logo_url}
                  alt={`${job.company} logo`}
                  className="h-16 w-16 object-contain rounded"
                  onError={() => setLogoError(true)}
                />
              )}
              <h1 className="text-3xl font-bold text-foreground">{job.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">{job.company}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Posted {formatDate(job.posted_date || job.created_at)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{job.job_type}</Badge>
                <Badge variant="outline">{job.experience_level}</Badge>
                {job.remote_allowed && <Badge variant="outline">Remote OK</Badge>}
              </div>

              {formatSalary(job.salary_min, job.salary_max, job.currency) && (
                <div className="flex items-center gap-1 text-green-600 font-medium">
                  <DollarSign className="h-4 w-4" />
                  <span>{formatSalary(job.salary_min, job.salary_max, job.currency)}</span>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Apply button */}
            {job.application_url && (
              <Button
                className="w-full sm:w-auto"
                onClick={handleApply}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Apply Now
              </Button>
            )}

            {/* Job description */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Job Description</h2>
              <p className="text-muted-foreground whitespace-pre-line">{job.description}</p>
            </section>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">Requirements</h2>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {job.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">Benefits</h2>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {job.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Skills */}
            {job.skills_required && job.skills_required.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">Skills Required</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills_required.map((skill, i) => (
                    <Badge key={i} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </section>
            )}

            {/* Expiry notice */}
            {job.expires_date && (
              <p className="text-sm text-muted-foreground">
                Application deadline: {formatDate(job.expires_date)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <FloatingHomeButton />
    </div>
  );
};

export default JobDetail;
