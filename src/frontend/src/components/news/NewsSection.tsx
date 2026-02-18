import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Clock, Lock } from 'lucide-react';
import { NewsItemRow } from './NewsItemRow';
import { useRegionNewsData } from '@/hooks/useRegionNews';
import type { Region } from '@/lib/news/regionConfig';
import { formatDistanceToNow } from 'date-fns';
import { isDemoMode } from '@/config/newsDataSource';

interface NewsSectionProps {
  region: Region;
}

export function NewsSection({ region }: NewsSectionProps) {
  const { data, isLoading, error, lastUpdated, isEnabled, israelVerified } = useRegionNewsData(region.id);

  // In demo mode, never show gated state
  const inDemoMode = isDemoMode();
  const isGated = !inDemoMode && !isEnabled && region.id !== 'israel';

  return (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">{region.flag}</span>
            </div>
            <div>
              <CardTitle className="text-xl">{region.name}</CardTitle>
              {lastUpdated && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" />
                  Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        {isGated && (
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription>
              This region will be enabled once Israel news loads successfully.
            </AlertDescription>
          </Alert>
        )}

        {!isGated && isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        )}

        {!isGated && error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error instanceof Error 
                ? error.message 
                : `Failed to load news for ${region.name}. Please try again later.`}
            </AlertDescription>
          </Alert>
        )}

        {!isGated && !isLoading && !error && data && data.length === 0 && (
          <Alert>
            <AlertDescription>
              No news available for {region.name} at the moment.
            </AlertDescription>
          </Alert>
        )}

        {!isGated && !isLoading && !error && data && data.length > 0 && (
          <div className="space-y-4">
            {data.map((item, index) => (
              <NewsItemRow key={index} item={item} index={index} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
