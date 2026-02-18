import { useState, useRef, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Send, Mic, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ChatMessage } from '@/lib/friendChat/types';
import { generateTutorReply } from '@/lib/friendTutor/generateTutorReply';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { analyzeUserMessage } from '@/lib/friendTutor/analyzeUserMessage';
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

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue.trim(),
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsSending(true);

    // Analyze user message
    const analysis = analyzeUserMessage(userMessage.text);

    // Simulate thinking delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Always use offline tutor reply (AI mode not implemented for network calls)
    const tutorReply = generateTutorReply(userMessage.text, analysis);
      
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
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <header className="shrink-0 bg-card border-b border-border px-4 py-3 shadow-sm">
        <div className="container mx-auto max-w-2xl flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/' })}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-xl">💬</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-foreground truncate">
                AI Friend
              </h1>
              <p className="text-xs text-muted-foreground">
                Your English conversation partner
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <ScrollArea className="flex-1 overflow-y-auto" ref={scrollAreaRef}>
        <div className="container mx-auto max-w-2xl px-4 py-6 space-y-4">
          {/* Connection Error Notice */}
          {connectionError && (
            <Alert variant="destructive" className="mb-4">
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
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-muted text-foreground rounded-bl-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                  {message.text}
                </p>
                <div className="flex items-center justify-between gap-2 mt-1.5">
                  <span className="text-xs opacity-70">{formatTime(message.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="shrink-0 bg-card border-t border-border px-4 py-3 shadow-lg">
        <div className="container mx-auto max-w-2xl flex items-end gap-2">
          <Button
            onClick={toggleListening}
            size="icon"
            variant={isListening ? 'default' : 'outline'}
            className={`rounded-full shrink-0 ${
              isListening ? 'bg-destructive hover:bg-destructive/90 animate-pulse' : ''
            }`}
            disabled={isSending}
          >
            <Mic className="w-4 h-4" />
          </Button>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isSending}
            className="flex-1 rounded-full bg-muted border-0 focus-visible:ring-1 focus-visible:ring-primary"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isSending}
            size="icon"
            className="rounded-full shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
