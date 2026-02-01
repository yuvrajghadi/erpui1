/**
 * Utility functions for formatting values consistently across client and server
 * to prevent hydration mismatches in SSR environments.
 */

/**
 * Format a number with thousands separators in a locale-agnostic way
 * for consistent rendering between server and client
 * 
 * @param value The number to format
 * @param options Additional formatting options
 * @returns Formatted string
 */
export function formatNumber(
  value: number,
  options: {
    decimals?: number;
    prefix?: string;
    suffix?: string;
    compact?: boolean;
    locale?: 'US' | 'IN';
  } = {}
): string {
  // Default options
  const {
    decimals = 0,
    prefix = '',
    suffix = '',
    compact = false,
    locale = 'US' // Use US formatting by default for consistency
  } = options;
  
  // For very large numbers, use compact notation if requested
  if (compact && Math.abs(value) >= 1000000) {
    const million = value / 1000000;
    return `${prefix}${million.toFixed(1)}M${suffix}`;
  }
  
  if (compact && Math.abs(value) >= 1000) {
    const thousand = value / 1000;
    return `${prefix}${thousand.toFixed(1)}K${suffix}`;
  }
  
  // Format with fixed decimal places first
  let formattedValue = value.toFixed(decimals);
  
  // Add thousand separators based on locale
  const parts = formattedValue.split('.');
  if (locale === 'IN') {
    // Indian number system: 1,00,000 (lakh system)
    // For now, we'll use US format to avoid hydration issues
    // and maintain consistency across server/client
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else {
    // US format: 100,000
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
  formattedValue = parts.join('.');
  
  return `${prefix}${formattedValue}${suffix}`;
}

/**
 * Format a currency value in a locale-agnostic way
 * 
 * @param value The number to format
 * @param options Additional formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number,
  options: {
    currency?: string;
    decimals?: number;
    compact?: boolean;
  } = {}
): string {
  const { 
    currency = 'INR',
    decimals = 2,
    compact = false
  } = options;
  
  // Get currency symbol
  let symbol = '₹';
  if (currency === 'USD') symbol = '$';
  if (currency === 'EUR') symbol = '€';
  if (currency === 'GBP') symbol = '£';
  
  return formatNumber(value, {
    prefix: symbol,
    decimals,
    compact
  });
}

/**
 * Format a quantity with unit in a locale-agnostic way
 * 
 * @param value The quantity value
 * @param unit The unit of measurement
 * @param decimals Number of decimal places
 * @returns Formatted quantity string
 */
export function formatQuantity(
  value: number,
  unit: string = '',
  decimals: number = 0
): string {
  const formattedValue = formatNumber(value, { decimals });
  return unit ? `${formattedValue} ${unit}` : formattedValue;
}
