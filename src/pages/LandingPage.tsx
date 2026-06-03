import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, ArrowRight, Globe } from 'lucide-react';
import Footer from '@/components/Footer';
import {
  SUPPORTED_COUNTRIES,
  detectUserCountry,
  getCountryUrl,
  redirectToCountrySubdomain,
  type CountryInfo,
} from '@/utils/countryDetection';

interface CountryFlagProps {
  country: CountryInfo;
  className?: string;
}

const CountryFlag = ({ country, className = 'h-16 w-24' }: CountryFlagProps) => {
  if (!country.flagSrc) {
    return (
      <div className={`${className} flex items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-border`}>
        <Globe className="h-8 w-8" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={country.flagSrc}
      alt={`${country.name} flag`}
      loading="lazy"
      className={`${className} rounded-2xl object-cover shadow-sm ring-1 ring-border bg-background`}
    />
  );
};

const LandingPage = () => {
  const [detectedCountry, setDetectedCountry] = useState<CountryInfo | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Detect user's country on mount
    const country = detectUserCountry();
    setDetectedCountry(country);
  }, []);

  const handleCountrySelect = (countryCode: string) => {
    setIsRedirecting(true);
    redirectToCountrySubdomain(countryCode);
  };

  const handleCountryLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, countryCode: string) => {
    event.preventDefault();
    handleCountrySelect(countryCode);
  };

  const handleAutoRedirect = () => {
    if (detectedCountry) {
      handleCountrySelect(detectedCountry.code);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <img src="/jobbyist26.svg" alt="Jobbyist Logo" style={{ width: '200px', height: 'auto' }} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-14 md:py-24 px-4">
        <div className="container mx-auto text-center max-w-5xl">
          <Badge variant="secondary" className="mb-6 text-base px-4 py-2">
            <Globe className="h-4 w-4 mr-2" />
            Select Your Region
          </Badge>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Welcome to Jobbyist
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Africa's Premier Job Discovery & Career Management Platform. Select your country or region to access job opportunities tailored to your market.
          </p>

          {/* Auto-detected Country Card */}
          {detectedCountry && detectedCountry.code !== 'OTHER' && (
            <Card className="mb-12 max-w-xl mx-auto border-2 border-primary/20 bg-primary/5 p-5 shadow-lg shadow-primary/5 sm:p-6">
              <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                  <CountryFlag country={detectedCountry} className="h-20 w-28 sm:h-16 sm:w-24" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      We detected you're in {detectedCountry.name}
                    </p>
                    <p className="font-semibold text-lg text-foreground">
                      Continue to {detectedCountry.subdomain}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleAutoRedirect}
                  disabled={isRedirecting}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {isRedirecting ? 'Redirecting...' : 'Continue'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          )}

          {/* Country Selection Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Or Select Your Country
            </h2>
            <p className="text-muted-foreground mb-6">
              Choose a dedicated regional portal for local jobs, employers, and career tools.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
              {SUPPORTED_COUNTRIES.filter((country) => country.code !== 'OTHER').map((country) => (
                <a
                  key={country.code}
                  href={getCountryUrl(country.code)}
                  onClick={(event) => handleCountryLinkClick(event, country.code)}
                  className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
                  aria-label={`Visit Jobbyist ${country.name} at ${country.subdomain}`}
                >
                  <Card className="h-full p-6 hover:shadow-xl transition-all hover:-translate-y-1 hover:border-primary/50 bg-background/90">
                    <div className="flex flex-col items-center gap-4">
                      <CountryFlag
                        country={country}
                        className="h-20 w-28 transition-transform group-hover:scale-105"
                      />
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{country.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {country.subdomain}
                        </p>
                      </div>
                      <span className="inline-flex w-full items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                        Visit Site
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    </div>
                  </Card>
                </a>
              ))}
            </div>
          </div>

          {/* Other Countries Option */}
          <Card className="p-6 max-w-md mx-auto border border-dashed bg-background/80">
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Globe className="h-8 w-8" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-lg">Other Countries</h3>
              <p className="text-sm text-muted-foreground text-center">
                Looking for opportunities across all of Africa?
              </p>
              <Button
                variant="outline"
                onClick={() => handleCountrySelect('OTHER')}
                disabled={isRedirecting}
                className="mt-2"
              >
                Browse All Opportunities
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background/50 border-y">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose Jobbyist?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Regional Focus</h3>
                <p className="text-muted-foreground">
                  Job opportunities tailored to your specific country and region
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Verified Companies</h3>
                <p className="text-muted-foreground">
                  Access opportunities from trusted, verified employers
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Easy Access</h3>
                <p className="text-muted-foreground">
                  Quick redirect to your country-specific job portal
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
