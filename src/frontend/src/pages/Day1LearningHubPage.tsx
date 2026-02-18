import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, PenTool, BookMarked, Library } from 'lucide-react';
import { day1LessonContent } from '@/lib/course/day1LessonContent';

export default function Day1LearningHubPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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
            60-Day Course: Day 1
          </h1>
          <p className="text-muted-foreground">
            Master the fundamentals of English grammar, vocabulary, and writing
          </p>
        </header>

        {/* Main Content */}
        <main className="space-y-6">
          {/* Grammar Section */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                Grammar: Is/Am/Are
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Is/Am/Are */}
              <div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {day1LessonContent.grammar.isAmAre.title}
                </h3>
                <p className="text-muted-foreground mb-3">
                  {day1LessonContent.grammar.isAmAre.explanation}
                </p>
                <div className="bg-accent/20 p-4 rounded-lg space-y-2">
                  <p className="font-medium text-foreground">Examples:</p>
                  {day1LessonContent.grammar.isAmAre.examples.map((example, idx) => (
                    <p key={idx} className="text-sm text-foreground">
                      • {example}
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vocabulary Section */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Library className="w-6 h-6 text-primary" />
                Vocabulary (10 Words)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {day1LessonContent.vocabulary.words.map((item, idx) => (
                  <div key={idx} className="bg-accent/20 p-4 rounded-lg">
                    <p className="font-semibold text-foreground text-lg mb-1">
                      {idx + 1}. {item.word}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.meaning}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Essay Writing Section */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="w-6 h-6 text-primary" />
                Essay Topic: My Self
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {day1LessonContent.essayWriting.title}
              </h3>
              <p className="text-muted-foreground mb-4">
                {day1LessonContent.essayWriting.introduction}
              </p>
              <div className="bg-accent/20 p-4 rounded-lg space-y-3">
                <p className="font-medium text-foreground">Guide:</p>
                {day1LessonContent.essayWriting.guide.map((line, idx) => (
                  <p key={idx} className="text-sm text-foreground leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              onClick={() => navigate({ to: '/day1-test' })}
              className="px-8"
            >
              Ready for the Test? →
            </Button>
          </div>
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
