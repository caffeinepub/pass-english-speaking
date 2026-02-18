import { useState, useRef, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Send, Mic, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ChatMessage } from '@/lib/friendChat/types';
import { generateTutorReply, type PersonalityMode } from '@/lib/friendTutor/generateTutorReply';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { analyzeUserMessage } from '@/lib/friendTutor/analyzeUserMessage';
import { detectAndCorrect } from '@/lib/friendTutor/detectAndCorrect';
import { useAiMode } from '@/hooks/useAiMode';

export default function FriendChatPage() {
  const navigate = useNavigate();
  const { shouldUseAIMode, connectionError } = useAiMode();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'tutor',
      text: 'Hi! I\'m your AI Friend. Let\'s practice English together! How are you today?',
      createdAt: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [personalityMode, setPersonalityMode] = useState<PersonalityMode>('friend');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Speech-to-text hook - browser-only, no network forwarding
  const { isListening, toggle: toggleListening } = useSpeechToText({
    onTranscript: (transcript, isFinal) => {
      if (isFinal) {
        // Append final transcript to input
        setInputValue((prev) => {
          const newValue = prev ? `${prev} ${transcript}` : transcript;
          return newValue.trim();
        });
      }
    },
    onError: (error) => {
      toast.error(error);
    },
    continuous: false,
    interimResults: true,
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return;

    const userText = inputValue.trim();

    // Detect grammar correction - returns corrected text or null if no mistakes
    const correctedText = detectAndCorrect(userText);
    const grammarCorrection = correctedText || undefined;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      createdAt: new Date(),
      grammarCorrection,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsSending(true);

    // Analyze user message
    const analysis = analyzeUserMessage(userMessage.text);

    // Simulate thinking delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Always use offline tutor reply (AI mode not implemented for network calls)
    const tutorReply = generateTutorReply(userMessage.text, analysis, personalityMode);
      
    const tutorMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'tutor',
      text: tutorReply,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, tutorMessage]);
    setIsSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="shrink-0 glass-card border-b border-purple-400/30 px-4 py-3 shadow-lg">
        <div className="container mx-auto max-w-2xl flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/' })}
            className="shrink-0 glass-button"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Button>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shrink-0 neon-glow">
              <span className="text-xl">💬</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-white truncate neon-text">
                AI Friend
              </h1>
              <p className="text-xs text-purple-200">
                Your English conversation partner
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Personality Mode Switcher */}
      <div className="shrink-0 glass-card border-b border-purple-400/30 px-4 py-3">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-sm text-purple-200 font-medium">Mode:</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={personalityMode === 'friend' ? 'default' : 'outline'}
                onClick={() => setPersonalityMode('friend')}
                className={personalityMode === 'friend' ? 'neon-button' : 'glass-button'}
              >
                😊 Friend
              </Button>
              <Button
                size="sm"
                variant={personalityMode === 'teacher' ? 'default' : 'outline'}
                onClick={() => setPersonalityMode('teacher')}
                className={personalityMode === 'teacher' ? 'neon-button' : 'glass-button'}
              >
                👨‍🏫 Teacher
              </Button>
              <Button
                size="sm"
                variant={personalityMode === 'ai' ? 'default' : 'outline'}
                onClick={() => setPersonalityMode('ai')}
                className={personalityMode === 'ai' ? 'neon-button' : 'glass-button'}
              >
                🤖 AI
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 overflow-y-auto" ref={scrollAreaRef}>
        <div className="container mx-auto max-w-2xl px-4 py-6 space-y-4">
          {/* Connection Error Notice */}
          {connectionError && (
            <Alert variant="destructive" className="mb-4 glass-card border-red-400/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {connectionError} - Using offline mode with pre-set lessons.
              </AlertDescription>
            </Alert>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  message.role === 'user'
                    ? 'glass-card-user neon-border-cyan rounded-br-sm'
                    : 'glass-card-tutor neon-border-purple rounded-bl-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words leading-relaxed text-white">
                  {message.text}
                </p>
                {/* Grammar Correction for User Messages */}
                {message.role === 'user' && message.grammarCorrection && message.grammarCorrection !== message.text && (
                  <div className="mt-2 pt-2 border-t border-cyan-400/30">
                    <p className="text-xs text-cyan-300 font-medium mb-1">✏️ Correct version:</p>
                    <p className="text-xs text-cyan-100 italic">{message.grammarCorrection}</p>
                  </div>
                )}
                <div className="flex items-center justify-between gap-2 mt-1.5">
                  <span className="text-xs opacity-60 text-purple-200">
                    {formatTime(message.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="shrink-0 glass-card border-t border-purple-400/30 px-4 py-4 shadow-lg">
        <div className="container mx-auto max-w-2xl flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleListening}
            disabled={isSending}
            className={`shrink-0 ${isListening ? 'neon-button-active' : 'glass-button'}`}
          >
            <Mic className={`w-5 h-5 ${isListening ? 'text-red-400 animate-pulse' : 'text-white'}`} />
          </Button>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isSending}
            className="flex-1 glass-input"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isSending}
            size="icon"
            className="shrink-0 neon-button"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
