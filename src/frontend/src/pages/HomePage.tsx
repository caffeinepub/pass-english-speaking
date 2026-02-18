import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Newspaper, BookOpen, Mic, GraduationCap } from 'lucide-react';
import { TopUSHeadlinesSection } from '@/components/news/TopUSHeadlinesSection';

export default function HomePage() {
  const navigate = useNavigate();

  const buttons = [
    {
      id: 'news',
      label: 'News',
      icon: Newspaper,
      description: 'Read daily news from around the world',
      onClick: () => navigate({ to: '/news' }),
    },
    {
      id: 'vocabulary',
      label: 'Vocabulary',
      icon: BookOpen,
      description: 'Learn new words and phrases',
      onClick: () => navigate({ to: '/coming-soon/$feature', params: { feature: 'vocabulary' } }),
    },
    {
      id: 'speaking',
      label: 'Speaking Practice',
      icon: Mic,
      description: 'Practice your pronunciation',
      onClick: () => navigate({ to: '/coming-soon/$feature', params: { feature: 'speaking' } }),
    },
    {
      id: 'lessons',
      label: 'Lessons',
      icon: GraduationCap,
      description: 'Structured learning paths',
      onClick: () => navigate({ to: '/coming-soon/$feature', params: { feature: 'lessons' } }),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <header className="text-center mb-12 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
            Pass English Speaking
          </h1>
          <p className="text-lg text-muted-foreground">
            Your journey to English fluency starts here
          </p>
        </header>

        {/* US Headlines Section */}
        <section className="mb-8">
          <TopUSHeadlinesSection />
        </section>

        {/* Main buttons grid */}
        <main className="space-y-4">
          {buttons.map((button) => {
            const Icon = button.icon;
            return (
              <Card
                key={button.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer border-2"
                onClick={button.onClick}
              >
                <Button
                  variant="ghost"
                  className="w-full h-auto p-6 flex items-center justify-start gap-4 text-left hover:bg-accent/50"
                  asChild
                >
                  <div>
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-semibold text-foreground mb-1">
                        {button.label}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {button.description}
                      </p>
                    </div>
                  </div>
                </Button>
              </Card>
            );
          })}
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground pb-8">
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
