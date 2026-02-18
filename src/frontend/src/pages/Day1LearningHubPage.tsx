import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, PenTool, Library, HelpCircle } from 'lucide-react';
import { day1LessonContent } from '@/lib/course/day1LessonContent';
import { StoryModeTopicCard } from '@/components/course/StoryModeTopicCard';
import { MyDictionarySection } from '@/components/course/MyDictionarySection';
import { WordSaveDialog } from '@/components/course/WordSaveDialog';
import { TeacherAIPanel } from '@/components/course/TeacherAIPanel';
import { ClickableLessonText } from '@/components/course/ClickableLessonText';

export default function Day1LearningHubPage() {
  const navigate = useNavigate();
  const [wordDialogOpen, setWordDialogOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState('');
  const [teacherAIOpen, setTeacherAIOpen] = useState(false);
  const [teacherAISentence, setTeacherAISentence] = useState('');

  const handleSaveWord = (word: string) => {
    setSelectedWord(word);
    setWordDialogOpen(true);
  };

  const handleExplainSentence = (sentence: string) => {
    setTeacherAISentence(sentence);
    setTeacherAIOpen(true);
  };

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
            Learn English through stories and real-life examples
          </p>
        </header>

        {/* Main Content */}
        <main className="space-y-8">
          {/* My Dictionary Section */}
          <MyDictionarySection />

          {/* Grammar Section - Story Mode */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                Grammar: Is/Am/Are
              </h2>
            </div>
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div>
                    <div className="text-xl font-bold text-foreground">
                      {day1LessonContent.grammar.isAmAre.title}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Short Story */}
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-primary">Short Story</h4>
                  <ClickableLessonText
                    text={day1LessonContent.grammar.isAmAre.storyMode.shortStory}
                    onSaveWord={handleSaveWord}
                    onExplainSentence={handleExplainSentence}
                  />
                </div>

                {/* Real-life Example */}
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-primary">Real-life Example</h4>
                  <ClickableLessonText
                    text={day1LessonContent.grammar.isAmAre.storyMode.realLifeExample}
                    onSaveWord={handleSaveWord}
                    onExplainSentence={handleExplainSentence}
                  />
                </div>

                {/* How to use this word */}
                <div className="space-y-2 bg-accent/20 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-primary">How to use this word</h4>
                  <ClickableLessonText
                    text={day1LessonContent.grammar.isAmAre.storyMode.howToUseThisWord}
                    onSaveWord={handleSaveWord}
                    onExplainSentence={handleExplainSentence}
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Vocabulary Section - Story Mode */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Library className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                Vocabulary (10 Words)
              </h2>
            </div>
            <div className="space-y-6">
              {day1LessonContent.vocabulary.words.map((word, idx) => (
                <Card key={idx} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div>
                        <div className="text-xl font-bold text-foreground">{word.word}</div>
                        <div className="text-sm font-normal text-muted-foreground mt-1">
                          {word.meaning}
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Short Story */}
                    {word.storyMode && (
                      <>
                        <div className="space-y-2">
                          <h4 className="text-lg font-semibold text-primary">Short Story</h4>
                          <ClickableLessonText
                            text={word.storyMode.shortStory}
                            onSaveWord={handleSaveWord}
                            onExplainSentence={handleExplainSentence}
                          />
                        </div>

                        {/* Real-life Example */}
                        <div className="space-y-2">
                          <h4 className="text-lg font-semibold text-primary">Real-life Example</h4>
                          <ClickableLessonText
                            text={word.storyMode.realLifeExample}
                            onSaveWord={handleSaveWord}
                            onExplainSentence={handleExplainSentence}
                          />
                        </div>

                        {/* How to use this word */}
                        <div className="space-y-2 bg-accent/20 p-4 rounded-lg">
                          <h4 className="text-lg font-semibold text-primary">How to use this word</h4>
                          <ClickableLessonText
                            text={word.storyMode.howToUseThisWord}
                            onSaveWord={handleSaveWord}
                            onExplainSentence={handleExplainSentence}
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Essay Writing Section */}
          <section>
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
          </section>

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
        <footer className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} • Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>

      {/* Floating Doubt Solver Button */}
      <Button
        className="fixed bottom-4 left-4 rounded-full w-14 h-14 shadow-lg z-40"
        size="icon"
        onClick={() => setTeacherAIOpen(true)}
      >
        <HelpCircle className="w-6 h-6" />
      </Button>

      {/* Dialogs */}
      <WordSaveDialog
        open={wordDialogOpen}
        onOpenChange={setWordDialogOpen}
        initialWord={selectedWord}
      />

      <TeacherAIPanel
        isOpen={teacherAIOpen}
        onClose={() => setTeacherAIOpen(false)}
        initialSentence={teacherAISentence}
      />
    </div>
  );
}
