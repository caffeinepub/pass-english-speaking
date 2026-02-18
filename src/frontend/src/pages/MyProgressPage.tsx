import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Lock, CheckCircle, Circle } from 'lucide-react';
import { useGetCourseProgress, useGetCompletedDaysCount, useGetUnlockedDaysCount } from '@/hooks/useCourseProgress';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

export default function MyProgressPage() {
  const navigate = useNavigate();
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: completedCount = 0 } = useGetCompletedDaysCount();
  const { data: unlockedCount = 1 } = useGetUnlockedDaysCount();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Please login to view your progress.
            </p>
            <Button onClick={login} className="w-full" disabled={loginStatus === 'logging-in'}>
              {loginStatus === 'logging-in' ? 'Logging in...' : 'Login'}
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: '/' })} className="w-full">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressPercentage = (completedCount / 60) * 100;

  // Generate 60-day grid
  const days = Array.from({ length: 60 }, (_, i) => i + 1);

  const getDayStatus = (day: number): 'completed' | 'unlocked' | 'locked' => {
    if (day <= completedCount) return 'completed';
    if (day <= unlockedCount) return 'unlocked';
    return 'locked';
  };

  const getDayIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-primary" />;
      case 'unlocked':
        return <Circle className="w-5 h-5 text-muted-foreground" />;
      case 'locked':
        return <Lock className="w-4 h-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/' })}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            My Progress
          </h1>
          <p className="text-muted-foreground">
            Track your 60-day English learning journey
          </p>
        </header>

        {/* Progress Overview */}
        <Card className="mb-8 border-2">
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Days Completed</span>
                <span className="font-semibold text-foreground">
                  {completedCount} / 60
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-xs text-muted-foreground text-center">
                {progressPercentage.toFixed(1)}% Complete
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{completedCount}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{unlockedCount}</p>
                <p className="text-sm text-muted-foreground">Unlocked</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 60-Day Calendar Grid */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>60-Day Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-3">
              {days.map((day) => {
                const status = getDayStatus(day);
                return (
                  <div
                    key={day}
                    className={`
                      relative aspect-square rounded-lg border-2 flex flex-col items-center justify-center
                      transition-all duration-200
                      ${
                        status === 'completed'
                          ? 'bg-primary/10 border-primary hover:bg-primary/20'
                          : status === 'unlocked'
                          ? 'bg-accent/50 border-accent hover:bg-accent cursor-pointer'
                          : 'bg-muted border-muted-foreground/20'
                      }
                    `}
                    onClick={() => {
                      if (status === 'unlocked' && day === 1) {
                        navigate({ to: '/day1-learn' });
                      }
                    }}
                  >
                    <div className="absolute top-1 right-1">
                      {getDayIcon(status)}
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        status === 'locked' ? 'text-muted-foreground' : 'text-foreground'
                      }`}
                    >
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t justify-center">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <Circle className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Unlocked</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Locked</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground border-t border-border pt-8 pb-8">
          <p>
            © {new Date().getFullYear()} · Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'pass-english-speaking'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
