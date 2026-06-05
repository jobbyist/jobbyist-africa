import { Button } from '@/components/ui/button';
import { Facebook, Linkedin } from 'lucide-react';
import { SUPPORTED_COUNTRIES, getCountryUrl } from '@/utils/countryDetection';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const regionLinks = SUPPORTED_COUNTRIES.filter((country) => country.code !== 'OTHER');

  const communityLinks = [
    { label: 'Follow on Facebook', href: 'https://facebook.com/@JobbyistZA/' },
    { label: 'Connect on LinkedIn', href: 'https://www.linkedin.com/company/jobbyist/' },
    { label: 'Follow on Twitter/X', href: 'https://twitter.com/JobbyistZA' },
    { label: 'Whatsapp Channel', href: 'https://whatsapp.com/channel/0029VbD9BMXD8SE7HzhEEr24' },
    { label: 'Contact Support', href: 'mailto:support@jobbyist.africa' },
    { label: 'Review on Google', href: 'https://google.com' },
  ];

  const quickLinks = [
    { label: 'Founding Members', href: 'https://jobbyist.africa/founding-members' },
    { label: 'Whitepaper 2026/27', href: 'https://jobbyist.africa/whitepaper' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
    { label: 'Data Protection', href: '/data-protection' },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/@JobbyistZA/', label: 'Facebook' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/jobbyist/', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src="/jobbyist26.svg" alt="Jobbyist Logo" style={{ width: '200px', height: 'auto' }} />
            </div>
            <p className="text-muted-foreground mb-3 max-w-md">
              Africa's leading job platform connecting top talent with premier employers across South Africa, Nigeria, Kenya, Ghana, Egypt, Morocco, and beyond.
            </p>
            <p className="text-muted-foreground text-sm mb-6 max-w-md">
              Jobbyist is a subsidiary of Gravitas Industries Pty Ltd, a private company registered in South Africa under registration number 2024/596436/07.
            </p>

            {/* Contact Icons */}
            <div className="flex gap-4 mb-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Button
                    key={social.label}
                    variant="outline"
                    size="sm"
                    className="w-10 h-10 p-0"
                    asChild
                  >
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Footer Link Sections */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Regions</h4>
            <ul className="space-y-2">
              {regionLinks.map((country) => (
                <li key={country.code}>
                  <a
                    href={getCountryUrl(country.code)}
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={`Visit Jobbyist ${country.name}`}
                  >
                    {country.flagSrc && (
                      <img
                        src={country.flagSrc}
                        alt=""
                        loading="lazy"
                        className="h-4 w-6 rounded-sm object-cover ring-1 ring-border"
                      />
                    )}
                    <span>{country.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Community</h4>
            <ul className="space-y-2">
              {communityLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* App Store Section */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
            <div className="text-center md:text-left">
              <h4 className="font-semibold text-foreground mb-2">Get Early Access To The Mobile App</h4>
              <p className="text-sm text-muted-foreground">
                Stay connected with job opportunities on the go
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* App Store Badge */}
              <a
                href="#"
                className="inline-flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg hover:opacity-80 transition-opacity"
                aria-label="Coming to the App Store"
              >
                <div className="flex items-center justify-center w-8 h-8">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </a>

              {/* Google Play Badge */}
              <a
                href="#"
                className="inline-flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg hover:opacity-80 transition-opacity"
                aria-label="Coming to Google Play"
              >
                <div className="flex items-center justify-center w-8 h-8">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-xs">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © {currentYear} Jobbyist. All rights reserved.
            </p>
            <p className="text-muted-foreground text-sm">
              Made with ❤️ for African job seekers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
