import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { speakText, stopSpeaking, isSpeaking } from '@/lib/tts/speakText';
import { toast } from 'sonner';

interface NewsItem {
  headline: string;
  preview: string;
}

interface NewsItemRowProps {
  item: NewsItem;
  index: number;
}

export function NewsItemRow({ item, index }: NewsItemRowProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayTTS = async () => {
    if (isPlaying || isSpeaking()) {
      stopSpeaking();
      setIsPlaying(false);
      return;
    }

    try {
      setIsPlaying(true);
      const textToSpeak = `${item.headline}. ${item.preview}`;
      await speakText(textToSpeak);
      setIsPlaying(false);
    } catch (error: any) {
      setIsPlaying(false);
      toast.error(error.message || 'Failed to play audio');
    }
  };

  return (
    <div className="group flex gap-3">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground leading-snug mb-1 group-hover:text-primary transition-colors">
          {item.headline}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-2">
          {item.preview}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePlayTTS}
          className="h-7 px-2 text-xs gap-1.5"
        >
          {isPlaying ? (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              Stop
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              Read Aloud
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
