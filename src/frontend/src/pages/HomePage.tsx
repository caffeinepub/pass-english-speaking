import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Settings, Newspaper, MessageCircle, BookOpen, Trophy, TrendingUp, Briefcase } from 'lucide-react';
import { TopUSHeadlinesSection } from '@/components/news/TopUSHeadlinesSection';

export default function HomePage() {
  const navigate = useNavigate();

  const buttons = [
    {
      id: 'news',
      label: 'News Hub',
      icon: Newspaper,
      description: 'Display daily English news with text-to-speech',
      onClick: () => navigate({ to: '/news' }),
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'ai-friend',
      label: 'AI Friend',
      icon: MessageCircle,
      description: 'Voice/text chat interface for casual English conversation',
      onClick: () => navigate({ to: '/chat-with-friend' }),
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      id: '60-day-course',
      label: '60-Day Course',
      icon: BookOpen,
      description: 'The Daily Classroom - Grammar, Vocabulary, and Essay Topics',
      onClick: () => navigate({ to: '/day1-learn' }),
      gradient: 'from-orange-500 to-amber-500',
    },
    {
      id: '200-mark-gate',
      label: 'The 200-Mark Gate',
      icon: Trophy,
      description: 'Daily test with 180 questions + Essay - Score 150/200 to unlock next day',
      onClick: () => navigate({ to: '/day1-test' }),
      gradient: 'from-red-500 to-pink-500',
    },
    {
      id: 'my-progress',
      label: 'My Progress',
      icon: TrendingUp,
      description: 'Dashboard showing 60-day calendar and completed milestones',
      onClick: () => navigate({ to: '/my-progress' }),
      gradient: 'from-teal-500 to-cyan-500',
    },
    {
      id: 'interview',
      label: 'Interview',
      icon: Briefcase,
      description: 'Professional AI-powered interview simulator with voice interaction',
      onClick: () => navigate({ to: '/pro-ai-interviewer' }),
      gradient: 'from-purple-500 to-fuchsia-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="mb-12 text-center relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/settings' })}
            className="absolute right-0 top-0 rounded-full glass-button neon-icon"
          >
            <Settings className="w-5 h-5 text-cyan-400" />
          </Button>
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight neon-text">
            Pass English Speaking
          </h1>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto">
            Master English in 60 days with AI-powered learning, daily tests, and real-world practice
          </p>
        </header>

        {/* Main Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {buttons.map((button) => {
            const IconComponent = button.icon;
            return (
              <Card
                key={button.id}
                onClick={button.onClick}
                className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 glass-card neon-border"
              >
                <div className={`h-full p-6 bg-gradient-to-br ${button.gradient} transition-all duration-300`}>
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 neon-glow">
                      <IconComponent className="w-8 h-8 text-white neon-icon" />
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      {button.label}
                    </h3>
                    <p className="text-sm text-white/90 leading-relaxed">
                      {button.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* US Headlines Section */}
        <div className="glass-card rounded-2xl shadow-lg p-6 neon-border">
          <TopUSHeadlinesSection />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-purple-300 border-t border-purple-400/30 pt-8 pb-8">
          <p>
            © {new Date().getFullYear()} · Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'pass-english-speaking'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline font-semibold neon-text"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
