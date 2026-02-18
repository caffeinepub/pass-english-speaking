import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';

interface BottomMicControlProps {
  isActive: boolean;
  onToggle: () => void;
}

export function BottomMicControl({ isActive, onToggle }: BottomMicControlProps) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex flex-col items-center gap-2">
        <Button
          onClick={onToggle}
          size="lg"
          className={`w-20 h-20 rounded-full shadow-2xl transition-all duration-300 relative ${
            isActive
              ? 'bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 animate-pulse'
              : 'bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'
          }`}
        >
          <div className="relative">
            {isActive ? (
              <MicOff className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </div>
          {isActive && (
            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" />
          )}
        </Button>
        <p className="text-xs font-medium text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
          {isActive ? 'Recording...' : 'Tap to speak'}
        </p>
      </div>
    </div>
  );
}
