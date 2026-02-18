/**
 * Centralized configuration for news data source.
 * Toggle between 'demo' and 'backend' modes.
 * 
 * Set to 'demo' to use placeholder data without backend calls.
 * Set to 'backend' to fetch real news from the backend API.
 */

export type NewsDataSource = 'demo' | 'backend';

// Change this constant to switch between demo and backend data
export const NEWS_DATA_SOURCE: NewsDataSource = 'demo';

export function isDemoMode(): boolean {
  return NEWS_DATA_SOURCE === 'demo';
}
