import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Calendar, Trophy, TrendingUp, AlertCircle, MessageSquare } from 'lucide-react';
import { useGetCompletedDaysCount, useGetUnlockedDaysCount } from '@/hooks/useCourseProgress';
import { useGetInterviewReports } from '@/hooks/useInterviewReports';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { MistakeTracker } from '@/components/progress/MistakeTracker';
import { DailyStreakCard } from '@/components/progress/DailyStreakCard';
import { BadgeGallery } from '@/components/progress/BadgeGallery';
import { formatDistanceToNow } from 'date-fns';

export default function MyProgressPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  
  const { data: completedDays = 0, isLoading: loadingCompleted } = useGetCompletedDaysCount();
  const { data: unlockedDays = 1, isLoading: loadingUnlocked } = useGetUnlockedDaysCount();
  const { data: interviewReports = [], isLoading: loadingReports, error: reportsError } = useGetInterviewReports();

  const totalDays = 60;
  const progressPercentage = (Number(completedDays) / totalDays) * 100;

  const isLoading = loadingCompleted || loadingUnlocked;

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
          <h1 className="text-4xl font-bold text-foreground mb-2">My Progress</h1>
          <p className="text-muted-foreground">
            Track your 60-day English learning journey
          </p>
        </header>

        {/* Streak and Badges Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DailyStreakCard />
          <div className="lg:col-span-2">
            <BadgeGallery />
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Completed Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <p className="text-4xl font-bold text-primary">{Number(completedDays)}</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Unlocked Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <p className="text-4xl font-bold text-primary">{Number(unlockedDays)}</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-20" />
              ) : (
                <p className="text-4xl font-bold text-primary">{progressPercentage.toFixed(0)}%</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="border-2 mb-8">
          <CardHeader>
            <CardTitle>60-Day Journey</CardTitle>
            <CardDescription>
              {Number(completedDays)} of {totalDays} days completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercentage} className="h-3" />
          </CardContent>
        </Card>

        {/* Mistake Tracker */}
        <div className="mb-8">
          <MistakeTracker />
        </div>

        {/* Interview Reports Section */}
        <Card className="border-2 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Interview Reports
            </CardTitle>
            <CardDescription>
              Your saved Personality Interview performance analyses with logic and clarity metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!identity && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Login to view your saved interview reports.
                </AlertDescription>
              </Alert>
            )}

            {identity && loadingReports && (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            )}

            {identity && reportsError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load interview reports. Please try again later.
                </AlertDescription>
              </Alert>
            )}

            {identity && !loadingReports && !reportsError && interviewReports.length === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No interview reports yet. Complete a Personality Interview session to see your performance analysis here.
                </AlertDescription>
              </Alert>
            )}

            {identity && !loadingReports && !reportsError && interviewReports.length > 0 && (
              <div className="space-y-4">
                {interviewReports.slice(-10).reverse().map((report, idx) => (
                  <Card key={idx} className="p-4 bg-accent/5">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {formatDistanceToNow(Number(report.timestamp) / 1_000_000, { addSuffix: true })}
                        </p>
                        <p className="font-semibold text-sm mb-2">Q: {report.question}</p>
                        <p className="text-sm text-muted-foreground mb-2">A: {report.answer}</p>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-xs font-semibold text-primary mb-1">Analysis & Feedback:</p>
                        <p className="text-xs text-muted-foreground whitespace-pre-wrap">{report.feedback}</p>
                      </div>
                    </div>
                  </Card>
                ))}
                {interviewReports.length > 10 && (
                  <p className="text-xs text-center text-muted-foreground">
                    Showing most recent 10 of {interviewReports.length} reports
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 60-Day Calendar Grid */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>60-Day Calendar</CardTitle>
            <CardDescription>Your daily progress at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-2">
              {Array.from({ length: totalDays }, (_, i) => {
                const day = i + 1;
                const isCompleted = day <= Number(completedDays);
                const isUnlocked = day <= Number(unlockedDays);
                const isCurrent = day === Number(unlockedDays) && !isCompleted;

                return (
                  <div
                    key={day}
                    className={`
                      aspect-square rounded-lg flex items-center justify-center text-sm font-semibold
                      transition-all duration-200
                      ${
                        isCompleted
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : isCurrent
                          ? 'bg-accent text-accent-foreground border-2 border-primary'
                          : isUnlocked
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-muted/30 text-muted-foreground/30'
                      }
                    `}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary" />
                <span className="text-muted-foreground">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-accent border-2 border-primary" />
                <span className="text-muted-foreground">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-muted" />
                <span className="text-muted-foreground">Unlocked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-muted/30" />
                <span className="text-muted-foreground">Locked</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
