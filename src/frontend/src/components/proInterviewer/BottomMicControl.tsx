import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BottomMicControlProps {
  isListening: boolean;
  onToggle: () => void;
}

export function BottomMicControl({ isListening, onToggle }: BottomMicControlProps) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
      {/* Status Indicator */}
      {isListening && (
        <div className="flex items-center gap-2 bg-background/95 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-green-500 shadow-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-foreground">Recording Active</span>
        </div>
      )}

      {/* Large Mic Button */}
      <Button
        onClick={onToggle}
        size="lg"
        className={`
          w-20 h-20 rounded-full shadow-2xl transition-all duration-300
          ${isListening 
            ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse-slow' 
            : 'bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70'
          }
        `}
      >
        <Mic className={`w-10 h-10 ${isListening ? 'animate-bounce-subtle' : ''}`} />
      </Button>

      {/* Helper Text */}
      {!isListening && (
        <p className="text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
          Tap to speak
        </p>
      )}
    </div>
  );
}
