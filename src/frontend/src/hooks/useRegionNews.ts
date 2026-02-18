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
const ISRAEL_VERIFIED_KEY = 'news_israel_verified';

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

function getIsraelVerified(): boolean {
  try {
    const stored = localStorage.getItem(ISRAEL_VERIFIED_KEY);
    return stored === 'true';
  } catch {
    return false;
  }
}

function setIsraelVerified(verified: boolean) {
  try {
    localStorage.setItem(ISRAEL_VERIFIED_KEY, verified.toString());
  } catch {
    // Ignore storage errors
  }
}

export function useRegionNewsData(regionId: RegionId) {
  const [lastUpdated, setLastUpdatedState] = useState<Date | null>(() => getLastUpdated(regionId));
  const [israelVerified, setIsraelVerifiedState] = useState<boolean>(() => getIsraelVerified());

  // In demo mode, bypass Israel verification and enable all regions
  const inDemoMode = isDemoMode();

  // Determine if this region should be enabled
  const isIsrael = regionId === 'israel';
  const shouldEnable = inDemoMode || isIsrael || israelVerified;

  const backendRegionId = BACKEND_REGION_MAP[regionId];
  const query = useRegionNewsQuery(backendRegionId, shouldEnable);

  // In demo mode, use demo data; otherwise parse backend data
  let parsedData: NewsItem[] = [];
  let parseError: Error | null = null;

  if (inDemoMode) {
    // Use demo data directly
    parsedData = getDemoNewsForRegion(regionId);
  } else {
    // Parse backend data
    const parseResult = query.data 
      ? parseNewsFromGNews(query.data) 
      : { parsedData: [], error: null };
    parsedData = parseResult.parsedData;
    parseError = parseResult.error;
  }

  // Update last updated timestamp when data changes
  useEffect(() => {
    if (inDemoMode) {
      // In demo mode, set a static timestamp
      const demoDate = new Date('2026-02-17T12:00:00Z');
      setLastUpdatedState(demoDate);
    } else if (query.data && query.dataUpdatedAt) {
      const updatedDate = new Date(query.dataUpdatedAt);
      setLastUpdated(regionId, updatedDate);
      setLastUpdatedState(updatedDate);
    }
  }, [query.data, query.dataUpdatedAt, regionId, inDemoMode]);

  // Verify Israel success: if Israel has data with at least one item and no errors
  useEffect(() => {
    if (!inDemoMode && isIsrael && parsedData && parsedData.length > 0 && !parseError && !query.error) {
      if (!israelVerified) {
        setIsraelVerified(true);
        setIsraelVerifiedState(true);
      }
    }
  }, [isIsrael, parsedData, parseError, query.error, israelVerified, inDemoMode]);

  // Combine query error with parse error (not applicable in demo mode)
  const combinedError = inDemoMode ? null : (query.error || parseError);

  return {
    data: parsedData,
    isLoading: inDemoMode ? false : query.isLoading,
    error: combinedError,
    lastUpdated,
    isEnabled: shouldEnable,
    israelVerified: inDemoMode ? true : israelVerified,
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
      // Force refresh all regions on the backend
      // Pass empty string for apiKey as backend uses integrations
      const regions = ['israel', 'uae', 'india', 'west_bengal'];
      await Promise.all(
        regions.map(region => actor.forceRefreshNews(region, ''))
      );
      
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
