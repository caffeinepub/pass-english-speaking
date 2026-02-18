import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, Info } from 'lucide-react';
import { NewsSection } from '@/components/news/NewsSection';
import { useRegionNews } from '@/hooks/useRegionNews';
import { REGIONS } from '@/lib/news/regionConfig';
import { isDemoMode } from '@/config/newsDataSource';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function NewsPage() {
  const navigate = useNavigate();
  const { refetchAll, isRefetching } = useRegionNews();
  const inDemoMode = isDemoMode();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border pb-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate({ to: '/' })}
                className="flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  News Hub
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Daily English news with text-to-speech
                </p>
              </div>
            </div>
            {!inDemoMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={refetchAll}
                disabled={isRefetching}
                className="flex-shrink-0"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            )}
          </div>
        </header>

        {/* Demo Mode Notice */}
        {inDemoMode && (
          <Alert className="mb-6 border-primary/50 bg-primary/5">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              <strong>Demo Mode:</strong> Displaying placeholder content. Real news integration can be enabled by switching the data source configuration.
            </AlertDescription>
          </Alert>
        )}

        {/* News sections */}
        <main className="space-y-8 pb-8">
          {REGIONS.map((region) => (
            <NewsSection key={region.id} region={region} />
          ))}
        </main>

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
