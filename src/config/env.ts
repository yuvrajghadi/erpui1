export const isProd = process.env.NODE_ENV === 'production';
export const isDev = !isProd;

type EnvKey = 'NEXT_PUBLIC_API_BASE_URL' | 'NEXT_PUBLIC_DEBUG_LOGS' | 'DEBUG_LOGS';

const getEnvValue = (key: EnvKey) => process.env[key];

const requireEnv = (key: EnvKey, fallback: string) => {
  const value = getEnvValue(key);
  if (!value) {
    // Only log warning in development, use fallback silently in production
    if (isDev) {
      console.warn(`Missing environment variable: ${key}, using fallback: ${fallback}`);
    }
    return fallback;
  }
  return value;
};

// API Base URL with smart defaults
// In production, this should be set via Vercel environment variables
// In development, defaults to localhost
export const apiBaseUrl = requireEnv(
  'NEXT_PUBLIC_API_BASE_URL',
  typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'http://localhost:3000'
);

export const debugLogsEnabled =
  getEnvValue('NEXT_PUBLIC_DEBUG_LOGS') === 'true' ||
  getEnvValue('DEBUG_LOGS') === 'true' ||
  isDev;
