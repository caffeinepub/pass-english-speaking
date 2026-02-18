import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { TopUSHeadlinesSection } from '@/components/news/TopUSHeadlinesSection';

export default function HomePage() {
  const navigate = useNavigate();

  const buttons = [
    {
      id: 'news',
      label: 'News Hub',
      emoji: '📰',
      description: 'Display daily English news with text-to-speech',
      onClick: () => navigate({ to: '/news' }),
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'hover:from-blue-600 hover:to-blue-700',
    },
    {
      id: 'ai-friend',
      label: 'AI Friend',
      emoji: '🤖',
      description: 'Voice/text chat interface for casual English conversation',
      onClick: () => navigate({ to: '/chat-with-friend' }),
      gradient: 'from-emerald-500 to-emerald-600',
      hoverGradient: 'hover:from-emerald-600 hover:to-emerald-700',
    },
    {
      id: '60-day-course',
      label: '60-Day Course',
      emoji: '📚',
      description: 'The Daily Classroom - Grammar, Vocabulary, and Essay Topics',
      onClick: () => navigate({ to: '/day1-learn' }),
      gradient: 'from-orange-500 to-orange-600',
      hoverGradient: 'hover:from-orange-600 hover:to-orange-700',
    },
    {
      id: '200-mark-gate',
      label: 'The 200-Mark Gate',
      emoji: '🏆',
      description: 'Daily test with 200 questions - Score 200/200 to unlock Day 2',
      onClick: () => navigate({ to: '/day1-test' }),
      gradient: 'from-red-600 to-red-700',
      hoverGradient: 'hover:from-red-700 hover:to-red-800',
    },
    {
      id: 'my-progress',
      label: 'My Progress',
      emoji: '📈',
      description: 'Dashboard showing 60-day calendar and completed milestones',
      onClick: () => navigate({ to: '/my-progress' }),
      gradient: 'from-teal-500 to-teal-600',
      hoverGradient: 'hover:from-teal-600 hover:to-teal-700',
    },
    {
      id: 'upsc-interview',
      label: 'UPSC Interview',
      emoji: '🏛️',
      description: 'Professional AI-powered interview simulator with voice interaction',
      onClick: () => navigate({ to: '/pro-ai-interviewer' }),
      gradient: 'from-purple-600 to-amber-500',
      hoverGradient: 'hover:from-purple-700 hover:to-amber-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="mb-12 text-center relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/settings' })}
            className="absolute right-0 top-0 rounded-full"
          >
            <Settings className="w-5 h-5" />
          </Button>
          <h1 className="text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            Pass English Speaking
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Master English in 60 days with AI-powered learning, daily tests, and real-world practice
          </p>
        </header>

        {/* Main Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {buttons.map((button) => (
            <Card
              key={button.id}
              onClick={button.onClick}
              className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 backdrop-blur-md bg-white/70"
            >
              <div className={`h-full p-6 bg-gradient-to-br ${button.gradient} ${button.hoverGradient} transition-all duration-300`}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
                    {button.emoji}
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
          ))}
        </div>

        {/* US Headlines Section */}
        <div className="backdrop-blur-md bg-white/70 rounded-2xl shadow-lg p-6">
          <TopUSHeadlinesSection />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-700 border-t border-gray-300 pt-8 pb-8">
          <p>
            © {new Date().getFullYear()} · Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'pass-english-speaking'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline font-semibold"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
