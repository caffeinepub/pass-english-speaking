import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Upload, FileText, Volume2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { speakText, stopSpeaking } from '@/lib/tts/speakText';
import { extractTextFromPdf } from '@/lib/proInterviewer/extractTextFromPdf';
import { extractTextFromImage } from '@/lib/proInterviewer/extractTextFromImage';
import { summarizeExtraction } from '@/lib/proInterviewer/summarizeExtraction';
import { generateQuestions } from '@/lib/proInterviewer/questionGenerator';
import { coachAnswer } from '@/lib/proInterviewer/coachAnswer';
import { computeMetrics, aggregateMetrics } from '@/lib/proInterviewer/metrics';
import { generateSessionReport } from '@/lib/proInterviewer/sessionReport';
import { useAiMode } from '@/hooks/useAiMode';
import { BottomMicControl } from '@/components/proInterviewer/BottomMicControl';
import type { InterviewQuestion, CoachingFeedback, SessionReport, AnswerRecord, AnswerMetrics } from '@/lib/proInterviewer/documentTypes';

type FlowStep = 'upload' | 'review' | 'interview' | 'report';

export default function ProAIInterviewerPage() {
  const navigate = useNavigate();
  const { shouldUseAIMode, connectionError } = useAiMode();

  const [step, setStep] = useState<FlowStep>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [manualInfo, setManualInfo] = useState('');
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerRecords, setAnswerRecords] = useState<AnswerRecord[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sessionReport, setSessionReport] = useState<SessionReport | null>(null);

  const { isListening, toggle: toggleListening } = useSpeechToText({
    onTranscript: (transcript, isFinal) => {
      if (isFinal) {
        setCurrentAnswer((prev) => {
          const newValue = prev ? `${prev} ${transcript}` : transcript;
          return newValue.trim();
        });
        setInterimTranscript('');
      } else {
        setInterimTranscript(transcript);
      }
    },
    onError: (error) => {
      toast.error(error);
      setInterimTranscript('');
    },
    continuous: true,
    interimResults: true,
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);

    try {
      let text = '';
      if (file.type === 'application/pdf') {
        const result = await extractTextFromPdf(file);
        text = result.text;
      } else if (file.type.startsWith('image/')) {
        const result = await extractTextFromImage(file);
        text = result.success ? result.text : '';
      }

      setExtractedText(text);
      if (!text || text.includes('Could not extract')) {
        toast.info('Could not extract text. Please use manual input.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to process file');
    }
  };

  const handleStartInterview = () => {
    const infoToUse = extractedText || manualInfo;
    if (!infoToUse.trim()) {
      toast.error('Please upload a document or enter information manually');
      return;
    }

    const summary = summarizeExtraction(infoToUse);
    const extractionResult = {
      text: infoToUse,
      summary,
      extractionSuccess: true,
    };
    const generatedQuestions = generateQuestions(extractionResult, manualInfo, 'daf');
    setQuestions(generatedQuestions);
    setStep('review');
  };

  const handleBeginInterview = () => {
    setStep('interview');
    speakCurrentQuestion();
  };

  const speakCurrentQuestion = async () => {
    if (currentQuestionIndex >= questions.length) return;

    const question = questions[currentQuestionIndex];
    const textToSpeak = `${question.panelist}: ${question.text}`;

    try {
      setIsSpeaking(true);
      await speakText(textToSpeak);
      setIsSpeaking(false);
    } catch (error: any) {
      setIsSpeaking(false);
      toast.error(error.message || 'Failed to speak question');
    }
  };

  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim()) {
      toast.error('Please provide an answer');
      return;
    }

    stopSpeaking();

    const currentQuestion = questions[currentQuestionIndex];
    const feedback = coachAnswer(currentAnswer, currentQuestion);
    const metrics = computeMetrics(currentAnswer);
    
    const record: AnswerRecord = {
      question: currentQuestion,
      answer: currentAnswer,
      feedback,
      metrics,
    };
    
    setAnswerRecords((prev) => [...prev, record]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setCurrentAnswer('');
      setInterimTranscript('');
      setTimeout(() => speakCurrentQuestion(), 500);
    } else {
      generateFinalReport([...answerRecords, record]);
    }
  };

  const generateFinalReport = (records: AnswerRecord[]) => {
    const allMetrics = records.map(r => r.metrics);
    const aggregated = aggregateMetrics(allMetrics);
    const report = generateSessionReport(records, aggregated);
    setSessionReport(report);
    setStep('report');
  };

  const handleReset = () => {
    setStep('upload');
    setUploadedFile(null);
    setExtractedText('');
    setManualInfo('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswerRecords([]);
    setCurrentAnswer('');
    setInterimTranscript('');
    setSessionReport(null);
    stopSpeaking();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl pb-32">
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
            UPSC Interview Simulator
          </h1>
          <p className="text-muted-foreground">
            Professional interview practice with voice interaction and critical feedback
          </p>
        </header>

        {/* Connection Error Notice */}
        {connectionError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {connectionError} - Using offline mode with local analysis.
            </AlertDescription>
          </Alert>
        )}

        {/* Upload Step */}
        {step === 'upload' && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-6 h-6 text-primary" />
                Upload Document (Optional)
              </CardTitle>
              <CardDescription>
                Upload your resume/PDF or enter information manually
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload PDF or Image</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileUpload}
                />
                {uploadedFile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span>{uploadedFile.name}</span>
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or enter manually
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="manual-info">Your Information</Label>
                <Textarea
                  id="manual-info"
                  placeholder="Enter your background, experience, education, skills..."
                  value={manualInfo}
                  onChange={(e) => setManualInfo(e.target.value)}
                  rows={6}
                />
              </div>

              <Button
                onClick={handleStartInterview}
                className="w-full"
                size="lg"
              >
                Start Interview Preparation
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Review Step */}
        {step === 'review' && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Interview Questions Ready</CardTitle>
              <CardDescription>
                {questions.length} questions prepared based on your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-accent/20 p-4 rounded-lg space-y-2">
                {questions.slice(0, 3).map((q, idx) => (
                  <p key={idx} className="text-sm text-foreground">
                    {idx + 1}. {q.text}
                  </p>
                ))}
                {questions.length > 3 && (
                  <p className="text-sm text-muted-foreground italic">
                    ...and {questions.length - 3} more questions
                  </p>
                )}
              </div>

              <Alert>
                <Volume2 className="h-4 w-4" />
                <AlertDescription>
                  Questions will be spoken aloud. Use the microphone to answer.
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleBeginInterview}
                className="w-full"
                size="lg"
              >
                Begin Interview
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Interview Step */}
        {step === 'interview' && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>
                Question {currentQuestionIndex + 1} of {questions.length}
              </CardTitle>
              <Progress
                value={((currentQuestionIndex + 1) / questions.length) * 100}
                className="mt-2"
              />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-accent/20 p-6 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  {questions[currentQuestionIndex].panelist}
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {questions[currentQuestionIndex].text}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={speakCurrentQuestion}
                  variant="outline"
                  disabled={isSpeaking}
                  className="gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  {isSpeaking ? 'Speaking...' : 'Speak Question'}
                </Button>
              </div>

              {/* Live Speech Bubble */}
              {(isListening || interimTranscript) && (
                <div className="bg-primary/10 border-2 border-primary/30 rounded-2xl p-4 min-h-[80px] relative">
                  {isListening && !interimTranscript && (
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-1 h-8 bg-primary rounded-full animate-wave" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1 h-8 bg-primary rounded-full animate-wave" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1 h-8 bg-primary rounded-full animate-wave" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <p className="text-sm text-muted-foreground italic">Listening...</p>
                    </div>
                  )}
                  {interimTranscript && (
                    <p className="text-foreground">{interimTranscript}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="answer">Your Answer</Label>
                <Textarea
                  id="answer"
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Your spoken words will appear here..."
                  rows={6}
                  className="resize-none"
                />
              </div>

              <Button
                onClick={handleSubmitAnswer}
                disabled={!currentAnswer.trim()}
                className="w-full"
                size="lg"
              >
                Submit Answer
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Report Step */}
        {step === 'report' && sessionReport && (
          <div className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  Interview Complete
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-6">
                  <p className="text-5xl font-bold text-primary mb-2">
                    {sessionReport.finalScore}/10
                  </p>
                  <p className="text-muted-foreground">Overall Score</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Body Language & Voice Tone
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {sessionReport.bodyLanguage}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Logical Consistency
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {sessionReport.logicalConsistency}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Areas for Improvement
                    </h3>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {sessionReport.areasOfImprovement}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1"
                  >
                    Start New Interview
                  </Button>
                  <Button
                    onClick={() => navigate({ to: '/' })}
                    className="flex-1"
                  >
                    Back to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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

      {/* Fixed Bottom Mic Control - Only visible during interview */}
      {step === 'interview' && (
        <BottomMicControl
          isListening={isListening}
          onToggle={toggleListening}
        />
      )}
    </div>
  );
}
