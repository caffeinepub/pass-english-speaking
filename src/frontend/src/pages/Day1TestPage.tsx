import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { day1TestQuestions } from '@/lib/course/day1TestQuestions';
import { useSubmitTestScore } from '@/hooks/useCourseProgress';
import { ResultEffects } from '@/components/test/ResultEffects';

export default function Day1TestPage() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showShake, setShowShake] = useState(false);

  const submitScoreMutation = useSubmitTestScore();

  const currentQuestion = day1TestQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / day1TestQuestions.length) * 100;

  const handleAnswerSelect = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: value,
    }));
  };

  const handleNext = () => {
    if (!answers[currentQuestionIndex]) {
      toast.error('Please select an answer');
      return;
    }

    if (currentQuestionIndex < day1TestQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    day1TestQuestions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = correctCount;
    setScore(finalScore);
    setShowResult(true);

    // Trigger effects
    if (finalScore === 200) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } else {
      setShowShake(true);
      setTimeout(() => setShowShake(false), 600);
    }

    // Submit to backend - convert to bigint
    submitScoreMutation.mutate(BigInt(finalScore), {
      onError: (error: any) => {
        toast.error(error.message || 'Failed to save score');
      },
    });
  };

  const handleTryAgain = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResult(false);
    setScore(0);
  };

  const handleViewProgress = () => {
    navigate({ to: '/my-progress' });
  };

  if (showResult) {
    const isPerfect = score === 200;

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
                {isPerfect ? (
                  <>
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                    Perfect Score!
                  </>
                ) : (
                  <>
                    <XCircle className="w-8 h-8 text-red-500" />
                    Test Failed
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <p className={`text-6xl font-bold mb-4 ${isPerfect ? 'text-green-500' : 'text-red-500'}`}>
                  {score}/200
                </p>
                <p className="text-lg text-muted-foreground">
                  {isPerfect
                    ? '🎉 Congratulations! Day 2 is now unlocked!'
                    : '❌ Failed! You need 200/200. Go back to Button 3 and study again!'}
                </p>
              </div>

              <div className="flex gap-4">
                {!isPerfect && (
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
      <div className="container mx-auto px-4 py-8 max-w-2xl">
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
            Answer all 200 questions correctly to unlock Day 2
          </p>
        </header>

        <Card className="border-2 mb-6">
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <CardTitle className="text-lg">
                Question {currentQuestionIndex + 1} of {day1TestQuestions.length}
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-accent/20 p-6 rounded-lg">
              <p className="text-lg font-semibold text-foreground mb-4">
                {currentQuestion.question}
              </p>
              <RadioGroup
                value={answers[currentQuestionIndex] || ''}
                onValueChange={handleAnswerSelect}
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 mb-3">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label
                      htmlFor={`option-${index}`}
                      className="text-base cursor-pointer flex-1"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                className="flex-1"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={!answers[currentQuestionIndex]}
                className="flex-1"
              >
                {currentQuestionIndex === day1TestQuestions.length - 1 ? 'Submit Test' : 'Next'}
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
