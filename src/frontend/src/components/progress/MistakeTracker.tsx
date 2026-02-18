import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useMistakeTracker } from '@/hooks/useMistakeTracker';

export function MistakeTracker() {
  const { learned, toImprove, isLoading } = useMistakeTracker();

  if (isLoading) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Mistake Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Mistake Tracker</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* What I Learned Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">What I Learned</h3>
          </div>
          <div className="space-y-2">
            {learned.length === 0 ? (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="py-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Your learning achievements will appear here as you complete lessons and tests.
                  </p>
                </CardContent>
              </Card>
            ) : (
              learned.map((item) => (
                <Card key={item.id} className="bg-primary/5 border-primary/20">
                  <CardContent className="py-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{item.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.category}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* What to Improve Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">What to Improve</h3>
          </div>
          <div className="space-y-2">
            {toImprove.length === 0 ? (
              <Card className="bg-accent/5 border-accent/20">
                <CardContent className="py-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Areas for improvement will be identified here based on your test results and practice sessions.
                  </p>
                </CardContent>
              </Card>
            ) : (
              toImprove.map((item) => (
                <Card key={item.id} className="bg-accent/5 border-accent/20">
                  <CardContent className="py-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{item.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.category}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
