import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Flame, AlertCircle } from 'lucide-react';
import { useGetCurrentStreak } from '@/hooks/useStreakBadges';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

export function DailyStreakCard() {
  const { identity } = useInternetIdentity();
  const { data: currentStreak = 0, isLoading, error } = useGetCurrentStreak();

  if (!identity) {
    return (
      <Card className="border-2 streak-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" />
            Daily Streak 🔥
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Login to track your daily streak and earn badges!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="border-2 streak-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" />
            Daily Streak 🔥
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-2 streak-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" />
            Daily Streak 🔥
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load streak data. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 streak-card premium-gradient">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
          Daily Streak 🔥
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <div className="text-6xl font-bold streak-number mb-2">
            {currentStreak}
          </div>
          <p className="text-lg text-muted-foreground">
            {currentStreak === 0 && 'Start your streak by completing a test!'}
            {currentStreak === 1 && 'Day streak - Keep going!'}
            {currentStreak > 1 && 'Days streak - Amazing progress!'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
