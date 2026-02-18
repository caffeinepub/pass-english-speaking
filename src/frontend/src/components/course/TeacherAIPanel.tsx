import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send } from 'lucide-react';
import { explainSentenceLocally } from '@/lib/teacherAI/explainSentenceLocally';

interface Message {
  role: 'user' | 'teacher';
  text: string;
}

interface TeacherAIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  initialSentence?: string;
}

export function TeacherAIPanel({ isOpen, onClose, initialSentence = '' }: TeacherAIPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(initialSentence);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', text: input.trim() };
    const explanation = explainSentenceLocally(input.trim());
    const teacherMessage: Message = { role: 'teacher', text: explanation };

    setMessages((prev) => [...prev, userMessage, teacherMessage]);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md">
      <Card className="border-2 shadow-2xl">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Teacher AI 🎓</CardTitle>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <ScrollArea className="h-[300px] pr-3">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm py-8">
                Ask me to explain any sentence or word from your lesson!
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-8'
                        : 'bg-accent mr-8'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type or paste a sentence to explain..."
              rows={2}
              className="resize-none"
            />
            <Button onClick={handleSend} disabled={!input.trim()} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
