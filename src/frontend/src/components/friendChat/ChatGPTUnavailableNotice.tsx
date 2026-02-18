import { Info, Zap } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { usePowerMode } from '@/hooks/usePowerMode';

/**
 * Notice component informing users about the built-in Chat Assistant
 * that provides English practice without requiring external API keys.
 */
export function ChatGPTUnavailableNotice() {
  const { isPowerModeActive } = usePowerMode();

  return (
    <Alert className={isPowerModeActive ? 'border-primary bg-primary/5' : ''}>
      {isPowerModeActive ? (
        <Zap className="h-4 w-4 text-primary" />
      ) : (
        <Info className="h-4 w-4" />
      )}
      <AlertTitle>
        {isPowerModeActive ? 'Power Mode Active' : 'Built-in Chat Assistant'}
      </AlertTitle>
      <AlertDescription>
        {isPowerModeActive ? (
          <>
            Enhanced AI feedback is enabled! You'll receive more detailed corrections, 
            comprehensive suggestions, and structured learning guidance. All processing 
            happens on-device for your privacy.
          </>
        ) : (
          <>
            This assistant runs on-device and helps you practice English with friendly conversation, 
            gentle corrections, and helpful tips. No external API keys needed!
          </>
        )}
      </AlertDescription>
    </Alert>
  );
}
