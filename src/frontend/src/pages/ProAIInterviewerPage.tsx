import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Upload, FileText, Volume2, AlertCircle, CheckCircle2, Info } from 'lucide-react';
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
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useAddInterviewAnalysis } from '@/hooks/useInterviewReports';
import { BottomMicControl } from '@/components/proInterviewer/BottomMicControl';
import type { InterviewQuestion, CoachingFeedback, SessionReport, AnswerRecord, AnswerMetrics } from '@/lib/proInterviewer/documentTypes';

type FlowStep = 'upload' | 'review' | 'interview' | 'report';

export default function ProAIInterviewerPage() {
  const navigate = useNavigate();
  const { shouldUseAIMode, connectionError } = useAiMode();
  const { identity } = useInternetIdentity();
  const addAnalysisMutation = useAddInterviewAnalysis();

  const [step, setStep] = useState<FlowStep>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [manualInfo, setManualInfo] = useState('');
  const [imageExtractionFailed, setImageExtractionFailed] = useState(false);
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
    setImageExtractionFailed(false);

    try {
      let text = '';
      if (file.type === 'application/pdf') {
        const result = await extractTextFromPdf(file);
        text = result.text;
      } else if (file.type.startsWith('image/')) {
        const result = await extractTextFromImage(file);
        if (result.success) {
          text = result.text;
        } else {
          setImageExtractionFailed(true);
          toast.info('Could not extract text from image. Please use manual input below.');
        }
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

  const generateFinalReport = async (records: AnswerRecord[]) => {
    const allMetrics = records.map(r => r.metrics);
    const aggregated = aggregateMetrics(allMetrics);
    const report = generateSessionReport(records, aggregated);
    setSessionReport(report);
    setStep('report');

    // Save to backend if authenticated
    if (identity) {
      try {
        // Save each Q&A with feedback
        for (const record of records) {
          const feedbackText = `Correction: ${record.feedback.correction} | Pronunciation: ${record.feedback.pronunciation} | Pro Tip: ${record.feedback.proTip}`;
          await addAnalysisMutation.mutateAsync({
            question: record.question.text,
            answer: record.answer,
            feedback: feedbackText,
          });
        }
        toast.success('Interview performance saved to Progress Report');
      } catch (error: any) {
        toast.error('Failed to save interview report: ' + (error.message || 'Unknown error'));
      }
    }
  };

  const handleReset = () => {
    setStep('upload');
    setUploadedFile(null);
    setExtractedText('');
    setManualInfo('');
    setImageExtractionFailed(false);
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
            Interview Simulator
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

        {/* Not Logged In Notice */}
        {!identity && step === 'upload' && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Login is required to save your interview performance to Progress Report.
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
                Upload your resume/PDF or image, or enter information manually
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

              {imageExtractionFailed && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Text extraction from the image failed. Please type or paste your information in the text box below.
                  </AlertDescription>
                </Alert>
              )}

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
                {questions.length} questions prepared based on your information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <Card key={idx} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary">{idx + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-muted-foreground mb-1">
                          {q.panelist} • {q.category}
                        </p>
                        <p className="text-foreground">{q.text}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleReset} className="flex-1">
                  Start Over
                </Button>
                <Button onClick={handleBeginInterview} className="flex-1">
                  Begin Interview
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Interview Step */}
        {step === 'interview' && (
          <div className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
                  <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="w-32" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-accent/10 rounded-lg border-2 border-accent/20">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">
                    {questions[currentQuestionIndex].panelist} • {questions[currentQuestionIndex].category}
                  </p>
                  <p className="text-lg font-medium text-foreground">
                    {questions[currentQuestionIndex].text}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={speakCurrentQuestion}
                    disabled={isSpeaking}
                    className="flex-1"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    {isSpeaking ? 'Speaking...' : 'Speak Question'}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="answer-input">Your Answer</Label>
                  <Textarea
                    id="answer-input"
                    placeholder="Type your answer or use the microphone below..."
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    rows={6}
                  />
                  {interimTranscript && (
                    <p className="text-sm text-muted-foreground italic">
                      Listening: {interimTranscript}
                    </p>
                  )}
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

            {/* Live Speech Bubble */}
            {isListening && (
              <Card className="border-2 border-primary bg-primary/5 animate-pulse">
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <p className="text-sm font-medium text-primary">Listening...</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Report Step */}
        {step === 'report' && sessionReport && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                Interview Complete
              </CardTitle>
              <CardDescription>
                Your performance analysis and feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-primary/5 rounded-lg border-2 border-primary/20">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Overall Score</p>
                  <p className="text-5xl font-bold text-primary">{sessionReport.finalScore}/10</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Body Language & Tone</h3>
                  <p className="text-sm text-muted-foreground">{sessionReport.bodyLanguage}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Logical Consistency</h3>
                  <p className="text-sm text-muted-foreground">{sessionReport.logicalConsistency}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Areas for Improvement</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{sessionReport.areasOfImprovement}</p>
                </div>
              </div>

              {identity && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Your interview performance has been saved to your Progress Report.
                  </AlertDescription>
                </Alert>
              )}

              {!identity && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Login to save your interview performance to Progress Report.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate({ to: '/my-progress' })} className="flex-1">
                  View Progress
                </Button>
                <Button onClick={handleReset} className="flex-1">
                  New Interview
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bottom Mic Control */}
        {step === 'interview' && (
          <BottomMicControl
            isActive={isListening}
            onToggle={toggleListening}
          />
        )}
      </div>
    </div>
  );
}
