import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookmarkPlus, MessageCircleQuestion } from 'lucide-react';

interface ClickableLessonTextProps {
  text: string;
  onSaveWord: (word: string) => void;
  onExplainSentence?: (sentence: string) => void;
}

export function ClickableLessonText({ text, onSaveWord, onExplainSentence }: ClickableLessonTextProps) {
  const [selectedText, setSelectedText] = useState('');

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selected = selection?.toString().trim() || '';
    setSelectedText(selected);
  };

  const handleSaveWord = () => {
    if (selectedText) {
      onSaveWord(selectedText);
      window.getSelection()?.removeAllRanges();
      setSelectedText('');
    }
  };

  const handleExplain = () => {
    if (selectedText && onExplainSentence) {
      onExplainSentence(selectedText);
      window.getSelection()?.removeAllRanges();
      setSelectedText('');
    }
  };

  return (
    <div className="space-y-3">
      <p
        className="text-foreground leading-relaxed select-text cursor-text"
        onMouseUp={handleTextSelection}
        onTouchEnd={handleTextSelection}
      >
        {text}
      </p>
      {selectedText && (
        <div className="flex gap-2 items-center animate-in fade-in slide-in-from-bottom-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleSaveWord}
            className="gap-2"
          >
            <BookmarkPlus className="w-4 h-4" />
            Save to Word Bank
          </Button>
          {onExplainSentence && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleExplain}
              className="gap-2"
            >
              <MessageCircleQuestion className="w-4 h-4" />
              Explain with Teacher AI
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
