// Country detection and subdomain mapping
export interface CountryInfo {
  code: string;
  name: string;
  subdomain: string;
  flag: string;
}

export const SUPPORTED_COUNTRIES: CountryInfo[] = [
  {
    code: 'ZA',
    name: 'South Africa',
    subdomain: 'za.jobbyist.africa',
    flag: '🇿🇦'
  },
  {
    code: 'NG',
    name: 'Nigeria',
    subdomain: 'ng.jobbyist.africa',
    flag: '🇳🇬'
  },
  {
    code: 'KE',
    name: 'Kenya',
    subdomain: 'ke.jobbyist.africa',
    flag: '🇰🇪'
  },
  {
    code: 'GH',
    name: 'Ghana',
    subdomain: 'gh.jobbyist.africa',
    flag: '🇬🇭'
  },
  {
    code: 'OTHER',
    name: 'Other Countries',
    subdomain: 'www.jobbyist.africa',
    flag: '🌍'
  }
];

/**
 * Detects user's country based on browser locale and timezone
 * This is a client-side detection and should be supplemented with IP-based detection in production
 */
export const detectUserCountry = (): CountryInfo => {
  try {
    // Try to detect from browser locale
    const locale = navigator.language || 'en-US';
    const countryCode = locale.split('-')[1]?.toUpperCase();
    
    // Check if detected country is in our supported list
    const country = SUPPORTED_COUNTRIES.find(c => c.code === countryCode);
    if (country) {
      return country;
    }
    
    // Try timezone-based detection as fallback
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone.includes('Africa/Johannesburg') || timezone.includes('Africa/Lagos')) {
      if (timezone.includes('Johannesburg')) {
        return SUPPORTED_COUNTRIES.find(c => c.code === 'ZA')!;
      }
      return SUPPORTED_COUNTRIES.find(c => c.code === 'NG')!;
    }
    
    // Default to "Other Countries"
    return SUPPORTED_COUNTRIES.find(c => c.code === 'OTHER')!;
  } catch (error) {
    console.error('Error detecting country:', error);
    return SUPPORTED_COUNTRIES.find(c => c.code === 'OTHER')!;
  }
};

/**
 * Gets the full URL for a country subdomain
 */
export const getCountryUrl = (countryCode: string): string => {
  const country = SUPPORTED_COUNTRIES.find(c => c.code === countryCode);
  return country ? `https://${country.subdomain}` : 'https://www.jobbyist.africa';
};

/**
 * Redirects user to their country-specific subdomain
 */
export const redirectToCountrySubdomain = (countryCode: string): void => {
  const url = getCountryUrl(countryCode);
  window.location.href = url;
};
