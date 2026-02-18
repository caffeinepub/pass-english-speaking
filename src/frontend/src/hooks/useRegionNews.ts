import { useQueryClient } from '@tanstack/react-query';
import { useRegionNews as useRegionNewsQuery } from './useQueries';
import { parseNewsFromGNews } from '@/lib/news/parseNews';
import { useState, useEffect } from 'react';
import { useActor } from './useActor';
import { isDemoMode } from '@/config/newsDataSource';
import { getDemoNewsForRegion } from '@/lib/news/demoNewsData';

type RegionId = 'israel' | 'dubai' | 'india' | 'westbengal';

// Map UI region IDs to backend region IDs
const BACKEND_REGION_MAP: Record<RegionId, string> = {
  israel: 'israel',
  dubai: 'uae',
  india: 'india',
  westbengal: 'west_bengal',
};

interface NewsItem {
  headline: string;
  preview: string;
}

const LAST_UPDATED_KEY = 'news_last_updated';

function getLastUpdated(regionId: RegionId): Date | null {
  try {
    const stored = localStorage.getItem(`${LAST_UPDATED_KEY}_${regionId}`);
    return stored ? new Date(stored) : null;
  } catch {
    return null;
  }
}

function setLastUpdated(regionId: RegionId, date: Date) {
  try {
    localStorage.setItem(`${LAST_UPDATED_KEY}_${regionId}`, date.toISOString());
  } catch {
    // Ignore storage errors
  }
}

export function useRegionNewsData(regionId: RegionId) {
  const [lastUpdated, setLastUpdatedState] = useState<Date | null>(() => getLastUpdated(regionId));

  // In demo mode, bypass all verification and enable all regions
  const inDemoMode = isDemoMode();

  // All regions are always enabled (no gating)
  const shouldEnable = true;

  const backendRegionId = BACKEND_REGION_MAP[regionId];
  const query = useRegionNewsQuery(backendRegionId, shouldEnable);

  // In demo mode, use demo data; otherwise parse backend data
  let parsedData: NewsItem[] = [];
  let parseError: Error | null = null;

  if (inDemoMode) {
    // Use demo data directly
    parsedData = getDemoNewsForRegion(regionId);
  } else {
    // Parse backend data if available
    if (query.data && query.data.trim() !== '') {
      const result = parseNewsFromGNews(query.data);
      parsedData = result.parsedData;
      parseError = result.error;
    } else {
      // Empty response means no data available for this region
      parsedData = [];
      parseError = null;
    }
  }

  // Update last updated timestamp when data changes
  useEffect(() => {
    if (inDemoMode) {
      // In demo mode, set a static timestamp
      const demoDate = new Date('2026-02-17T12:00:00Z');
      setLastUpdatedState(demoDate);
    } else if (query.data && query.data.trim() !== '' && query.dataUpdatedAt) {
      const updatedDate = new Date(query.dataUpdatedAt);
      setLastUpdated(regionId, updatedDate);
      setLastUpdatedState(updatedDate);
    }
  }, [query.data, query.dataUpdatedAt, regionId, inDemoMode]);

  // Combine query error with parse error (not applicable in demo mode)
  const combinedError = inDemoMode ? null : (query.error || parseError);

  return {
    data: parsedData,
    isLoading: inDemoMode ? false : query.isLoading,
    error: combinedError,
    lastUpdated,
    isEnabled: shouldEnable,
  };
}

export function useRegionNews() {
  const queryClient = useQueryClient();
  const { actor } = useActor();
  const [isRefetching, setIsRefetching] = useState(false);

  const refetchAll = async () => {
    // In demo mode, skip backend refresh
    if (isDemoMode()) {
      return;
    }

    if (!actor) return;
    
    setIsRefetching(true);
    try {
      // Refresh India news (the only region with backend support currently)
      await actor.forceRefreshIndiaNews();
      
      // Invalidate and refetch all news queries
      await queryClient.invalidateQueries({ queryKey: ['news'] });
      await queryClient.refetchQueries({ queryKey: ['news'] });
    } finally {
      setIsRefetching(false);
    }
  };

  return {
    refetchAll,
    isRefetching,
  };
}
