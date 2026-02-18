import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Upload, FileText, Volume2, AlertCircle, Info, Send } from 'lucide-react';
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
  const [submitError, setSubmitError] = useState('');

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
      } else if (file.type === 'text/plain') {
        // Read .txt file
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setExtractedText(content || '');
        };
        reader.onerror = () => {
          toast.error('Failed to read text file');
        };
        reader.readAsText(file);
        return;
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
    const infoToUse = (extractedText || manualInfo).trim();
    if (!infoToUse) {
      toast.error('Please upload a document or enter information manually to generate content-based questions');
      return;
    }

    const summary = summarizeExtraction(infoToUse);
    const extractionResult = {
      text: infoToUse,
      summary,
      extractionSuccess: true,
    };
    const generatedQuestions = generateQuestions(extractionResult, manualInfo, 'daf');
    
    if (generatedQuestions.length === 0) {
      toast.error('Could not generate questions from the provided content. Please provide more detailed information.');
      return;
    }
    
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
    setSubmitError('');
    
    if (!currentAnswer.trim()) {
      setSubmitError('Please provide an answer before submitting');
      return;
    }

    stopSpeaking();

    const currentQuestion = questions[currentQuestionIndex];
    const feedback = coachAnswer(currentAnswer, currentQuestion);
    const metrics = computeMetrics(currentAnswer);
    
    // Generate enhanced feedback with logic/clarity metrics
    const enhancedFeedback = `Logic & Clarity: ${metrics.sentenceCount} sentences, ${metrics.fillerCount} fillers detected. ${feedback.correction} | Pronunciation: ${feedback.pronunciation} | Pro Tip: ${feedback.proTip}`;
    
    const record: AnswerRecord = {
      question: currentQuestion,
      answer: currentAnswer,
      feedback: {
        ...feedback,
        correction: enhancedFeedback,
      },
      metrics,
    };
    
    setAnswerRecords((prev) => [...prev, record]);

    // Save to backend if authenticated
    if (identity) {
      addAnalysisMutation.mutate({
        question: currentQuestion.text,
        answer: currentAnswer,
        feedback: enhancedFeedback,
      }, {
        onError: (error: any) => {
          console.error('Failed to save answer analysis:', error);
        }
      });
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setCurrentAnswer('');
      setInterimTranscript('');
      setSubmitError('');
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

    if (identity) {
      toast.success('Interview performance saved to Progress Report');
    } else {
      toast.info('Login required to save interview reports to Progress Report');
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
    setSubmitError('');
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
            Personality Interview
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
                Upload Document
              </CardTitle>
              <CardDescription>
                Upload your resume/PDF, image, or text file, or enter information manually
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload PDF, Image, or Text File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".pdf,image/*,.txt,text/plain"
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
                    {isSpeaking ? 'Speaking...' : 'Hear Question'}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="answer-text">Your Answer</Label>
                  <Textarea
                    id="answer-text"
                    placeholder="Type your answer here or use the microphone below..."
                    value={currentAnswer}
                    onChange={(e) => {
                      setCurrentAnswer(e.target.value);
                      setSubmitError('');
                    }}
                    rows={6}
                    className="resize-none"
                  />
                  {interimTranscript && (
                    <p className="text-sm text-muted-foreground italic">
                      Listening: {interimTranscript}
                    </p>
                  )}
                </div>

                {submitError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleSubmitAnswer}
                  className="w-full"
                  size="lg"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Answer
                </Button>
              </CardContent>
            </Card>

            <BottomMicControl
              isActive={isListening}
              onToggle={toggleListening}
            />
          </div>
        )}

        {/* Report Step */}
        {step === 'report' && sessionReport && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Interview Complete!</CardTitle>
              <CardDescription>
                Your performance analysis and feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-primary/10 rounded-lg border-2 border-primary/20">
                <p className="text-sm font-semibold text-muted-foreground mb-2">Overall Score</p>
                <p className="text-5xl font-bold text-primary">{sessionReport.finalScore}/10</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Body Language & Voice Tone</h3>
                  <p className="text-muted-foreground">{sessionReport.bodyLanguage}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Logical Consistency</h3>
                  <p className="text-muted-foreground">{sessionReport.logicalConsistency}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Areas for Improvement</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{sessionReport.areasOfImprovement}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Question-by-Question Review</h3>
                {answerRecords.map((record, idx) => (
                  <Card key={idx} className="p-4 bg-accent/5">
                    <div className="space-y-2">
                      <p className="font-semibold text-sm">Q{idx + 1}: {record.question.text}</p>
                      <p className="text-sm text-muted-foreground">A: {record.answer}</p>
                      <div className="pt-2 border-t">
                        <p className="text-xs font-semibold text-primary mb-1">Feedback:</p>
                        <p className="text-xs text-muted-foreground">{record.feedback.correction}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleReset} className="flex-1">
                  Start New Interview
                </Button>
                <Button onClick={() => navigate({ to: '/my-progress' })} className="flex-1">
                  View Progress Report
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
