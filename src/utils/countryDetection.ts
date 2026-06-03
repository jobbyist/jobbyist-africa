import southAfricaFlag from '../../regions/southafrica.svg';
import nigeriaFlag from '../../regions/nigeria.svg';
import kenyaFlag from '../../regions/kenya.svg';
import ghanaFlag from '../../regions/ghana.svg';
import egyptFlag from '../../regions/egypt.svg';
import moroccoFlag from '../../regions/morocco.svg';

// Country detection and subdomain mapping
export interface CountryInfo {
  code: string;
  name: string;
  subdomain: string;
  flagSrc?: string;
}

const OTHER_COUNTRY_CODE = 'OTHER';

export const SUPPORTED_COUNTRIES: CountryInfo[] = [
  {
    code: 'ZA',
    name: 'South Africa',
    subdomain: 'za.jobbyist.africa',
    flagSrc: southAfricaFlag,
  },
  {
    code: 'NG',
    name: 'Nigeria',
    subdomain: 'ng.jobbyist.africa',
    flagSrc: nigeriaFlag,
  },
  {
    code: 'KE',
    name: 'Kenya',
    subdomain: 'ke.jobbyist.africa',
    flagSrc: kenyaFlag,
  },
  {
    code: 'GH',
    name: 'Ghana',
    subdomain: 'gh.jobbyist.africa',
    flagSrc: ghanaFlag,
  },
  {
    code: 'EG',
    name: 'Egypt',
    subdomain: 'eg.jobbyist.africa',
    flagSrc: egyptFlag,
  },
  {
    code: 'MA',
    name: 'Morocco',
    subdomain: 'ma.jobbyist.africa',
    flagSrc: moroccoFlag,
  },
  {
    code: OTHER_COUNTRY_CODE,
    name: 'Other Countries',
    subdomain: 'www.jobbyist.africa',
  },
];

const TIMEZONE_COUNTRY_MAP: Record<string, string> = {
  'Africa/Johannesburg': 'ZA',
  'Africa/Lagos': 'NG',
  'Africa/Nairobi': 'KE',
  'Africa/Accra': 'GH',
  'Africa/Cairo': 'EG',
  'Africa/Casablanca': 'MA',
};

const getCountryByCode = (countryCode: string): CountryInfo | undefined =>
  SUPPORTED_COUNTRIES.find((country) => country.code === countryCode);

const getOtherCountry = (): CountryInfo => getCountryByCode(OTHER_COUNTRY_CODE)!;

const getLocaleCountryCodes = (): string[] => {
  const locales = [navigator.language, ...(navigator.languages ?? [])].filter(Boolean);

  return locales
    .map((locale) => locale.split(/[-_]/)[1]?.toUpperCase())
    .filter((countryCode): countryCode is string => Boolean(countryCode));
};

/**
 * Detects user's country based on browser locale and timezone.
 * This is client-side detection and should be supplemented with IP-based detection in production.
 */
export const detectUserCountry = (): CountryInfo => {
  try {
    // Try to detect from browser locale first.
    for (const countryCode of getLocaleCountryCodes()) {
      const country = getCountryByCode(countryCode);
      if (country && country.code !== OTHER_COUNTRY_CODE) {
        return country;
      }
    }

    // Try timezone-based detection as fallback.
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneCountryCode = TIMEZONE_COUNTRY_MAP[timezone];
    if (timezoneCountryCode) {
      return getCountryByCode(timezoneCountryCode) ?? getOtherCountry();
    }

    // Default to "Other Countries".
    return getOtherCountry();
  } catch (error) {
    console.error('Error detecting country:', error);
    return getOtherCountry();
  }
};

/**
 * Gets the full URL for a country subdomain.
 */
export const getCountryUrl = (countryCode: string): string => {
  const country = getCountryByCode(countryCode);
  return country ? `https://${country.subdomain}` : 'https://www.jobbyist.africa';
};

/**
 * Redirects user to their country-specific subdomain.
 */
export const redirectToCountrySubdomain = (countryCode: string): void => {
  const url = getCountryUrl(countryCode);
  window.location.href = url;
};
