import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge as BadgeIcon, Award, Trophy, AlertCircle, Lock } from 'lucide-react';
import { useGetUserBadges } from '@/hooks/useStreakBadges';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import type { Badge } from '@/backend';

const BADGE_MILESTONES = [
  {
    name: 'Bronze Medal',
    day: 10,
    icon: Award,
    description: 'Complete a 10-day streak',
  },
  {
    name: 'Silver Medal',
    day: 30,
    icon: Trophy,
    description: 'Complete a 30-day streak',
  },
  {
    name: 'UPSC Warrior Certificate',
    day: 60,
    icon: BadgeIcon,
    description: 'Complete a 60-day streak',
  },
];

export function BadgeGallery() {
  const { identity } = useInternetIdentity();
  const { data: earnedBadges = [], isLoading, error } = useGetUserBadges();

  if (!identity) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            Badge Gallery
          </CardTitle>
          <CardDescription>
            Earn badges by maintaining your daily streak
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Login to view and earn badges!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            Badge Gallery
          </CardTitle>
          <CardDescription>
            Earn badges by maintaining your daily streak
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            Badge Gallery
          </CardTitle>
          <CardDescription>
            Earn badges by maintaining your daily streak
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load badges. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const hasBadge = (badgeName: string) => {
    return earnedBadges.some((b) => b.name === badgeName);
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          Badge Gallery
        </CardTitle>
        <CardDescription>
          Earn badges by maintaining your daily streak
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BADGE_MILESTONES.map((milestone) => {
            const earned = hasBadge(milestone.name);
            const Icon = milestone.icon;

            return (
              <Card
                key={milestone.name}
                className={`relative overflow-hidden transition-all ${
                  earned
                    ? 'badge-earned border-2'
                    : 'badge-locked border opacity-60'
                }`}
              >
                <CardContent className="p-6 text-center">
                  {!earned && (
                    <div className="absolute top-2 right-2">
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className={`mb-4 flex justify-center ${earned ? 'badge-icon-glow' : ''}`}>
                    <Icon className={`w-16 h-16 ${earned ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <h3 className={`font-bold text-lg mb-2 ${earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {milestone.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {milestone.description}
                  </p>
                  <div className={`text-xs font-semibold ${earned ? 'text-primary' : 'text-muted-foreground'}`}>
                    {earned ? '✓ Earned' : `Day ${milestone.day}`}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
