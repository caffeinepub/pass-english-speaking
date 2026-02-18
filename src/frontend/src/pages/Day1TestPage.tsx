import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { generateDay1TestQuestions } from '@/lib/course/dayWiseTestGenerator';
import { scoreEssay } from '@/lib/course/essayScoring';
import { useSubmitTestScore } from '@/hooks/useCourseProgress';
import { ResultEffects } from '@/components/test/ResultEffects';

export default function Day1TestPage() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [essayText, setEssayText] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [essayScore, setEssayScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showShake, setShowShake] = useState(false);

  const submitScoreMutation = useSubmitTestScore();
  const questions = generateDay1TestQuestions();

  const handleAnswerSelect = (questionIndex: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: value,
    }));
  };

  const handleSubmit = () => {
    // Check if all questions are answered
    const unansweredCount = questions.length - Object.keys(answers).length;
    if (unansweredCount > 0) {
      toast.error(`Please answer all questions. ${unansweredCount} questions remaining.`);
      return;
    }

    // Score multiple choice questions (180 marks)
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    // Score essay (20 marks)
    const essayResult = scoreEssay(essayText);
    const essayPoints = essayResult.score;

    const finalScore = correctCount + essayPoints;
    setScore(finalScore);
    setEssayScore(essayPoints);
    setShowResult(true);

    // Trigger effects
    if (finalScore >= 150) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } else if (finalScore < 50) {
      setShowShake(true);
      setTimeout(() => setShowShake(false), 600);
    }

    // Submit to backend
    submitScoreMutation.mutate(BigInt(finalScore), {
      onError: (error: any) => {
        toast.error(error.message || 'Failed to save score');
      },
    });
  };

  const handleTryAgain = () => {
    setAnswers({});
    setEssayText('');
    setShowResult(false);
    setScore(0);
    setEssayScore(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProgress = () => {
    navigate({ to: '/my-progress' });
  };

  if (showResult) {
    const isPassed = score >= 150;
    const isFailed = score < 50;

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <ResultEffects showConfetti={showConfetti} />
        <div className={`container mx-auto px-4 py-8 max-w-2xl ${showShake ? 'animate-shake' : ''}`}>
          <header className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate({ to: '/' })}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </header>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                {isPassed ? (
                  <>
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                    Test Passed
                  </>
                ) : isFailed ? (
                  <>
                    <XCircle className="w-8 h-8 text-red-500" />
                    Test Failed
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-8 h-8 text-orange-500" />
                    Not Passed
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <p className={`text-6xl font-bold mb-4 ${isPassed ? 'text-green-500' : isFailed ? 'text-red-500' : 'text-orange-500'}`}>
                  {score}/200
                </p>
                <div className="text-sm text-muted-foreground mb-4">
                  <p>Multiple Choice: {score - essayScore}/180</p>
                  <p>Essay: {essayScore}/20</p>
                </div>
                <p className="text-lg text-foreground">
                  {isPassed
                    ? 'Success! Day 2 is now unlocked.'
                    : isFailed
                    ? 'Fail! Please review Day 1 stories again.'
                    : 'You need 150/200 to pass. Keep practicing!'}
                </p>
              </div>

              <div className="flex gap-4">
                {!isPassed && (
                  <Button
                    onClick={handleTryAgain}
                    variant="outline"
                    className="flex-1"
                    size="lg"
                  >
                    Try Again
                  </Button>
                )}
                <Button
                  onClick={handleViewProgress}
                  className="flex-1"
                  size="lg"
                >
                  View Progress
                </Button>
              </div>
            </CardContent>
          </Card>

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
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
            Day 1 Test - The 200-Mark Gate
          </h1>
          <p className="text-muted-foreground">
            Score 150/200 or higher to unlock Day 2. Total: {questions.length} questions (180 marks) + Essay (20 marks)
          </p>
        </header>

        <div className="space-y-6">
          {/* Questions List */}
          {questions.map((question, index) => (
            <Card key={index} className="border">
              <CardContent className="pt-6">
                <div className="mb-3">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                    [Topic: {question.topic}]
                  </span>
                </div>
                <p className="text-base font-semibold text-foreground mb-4">
                  {index + 1}. {question.question}
                </p>
                <RadioGroup
                  value={answers[index] || ''}
                  onValueChange={(value) => handleAnswerSelect(index, value)}
                >
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center space-x-3 mb-2">
                      <RadioGroupItem value={option} id={`q${index}-opt${optIndex}`} />
                      <Label
                        htmlFor={`q${index}-opt${optIndex}`}
                        className="text-base cursor-pointer flex-1"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}

          {/* Essay Section */}
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                  [Topic: Essay Writing]
                </span>
              </CardTitle>
              <p className="text-lg font-bold text-foreground mt-2">
                Essay Writing (20 Marks)
              </p>
              <p className="text-sm text-muted-foreground">
                Write an essay on "My Self" (5-10 lines). Introduce yourself, mention your interests, family, and goals.
              </p>
            </CardHeader>
            <CardContent>
              <Textarea
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
                placeholder="Start writing your essay here..."
                className="min-h-[200px] text-base"
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-4 pb-8">
            <Button
              onClick={handleSubmit}
              size="lg"
              className="w-full max-w-md"
              disabled={submitScoreMutation.isPending}
            >
              {submitScoreMutation.isPending ? 'Submitting...' : 'Submit Test'}
            </Button>
          </div>
        </div>

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
