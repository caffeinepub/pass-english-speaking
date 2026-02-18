import { useUSNews } from '@/hooks/useUSNews';
import { parseNewsFromGNews } from '@/lib/news/parseNews';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Newspaper } from 'lucide-react';
import { NewsItemRow } from './NewsItemRow';

export function TopUSHeadlinesSection() {
  const query = useUSNews();

  // Parse the news data
  const { parsedData, error: parseError } = query.data
    ? parseNewsFromGNews(query.data)
    : { parsedData: [], error: null };

  // Combine query error with parse error
  const error = query.error || parseError;

  // Loading state
  if (query.isLoading) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-primary" />
            Top US Headlines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="border-2 border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-primary" />
            Top US Headlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load news headlines. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (parsedData.length === 0) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-primary" />
            Top US Headlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              No news available at the moment.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Success state with data
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-primary" />
          Top US Headlines
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {parsedData.slice(0, 10).map((item, index) => (
          <NewsItemRow key={index} item={item} index={index} />
        ))}
      </CardContent>
    </Card>
  );
}
