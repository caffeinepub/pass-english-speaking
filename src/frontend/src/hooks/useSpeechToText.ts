import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * IMPORTANT: This hook provides browser-only speech recognition.
 * It must NOT forward audio or transcripts to any external services.
 * All processing happens locally using the Web Speech API.
 */

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

interface UseSpeechToTextOptions {
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export function useSpeechToText(options: UseSpeechToTextOptions = {}) {
  const {
    onTranscript,
    onError,
    lang = 'en-US',
    continuous = false,
    interimResults = true,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = lang;

      recognition.addEventListener('result', (event: Event) => {
        const e = event as SpeechRecognitionEvent;
        const results = e.results;
        const lastResult = results[results.length - 1];
        const transcript = lastResult[0].transcript;
        const isFinal = lastResult.isFinal;

        // Transcript is processed locally only - no network forwarding
        if (onTranscript) {
          onTranscript(transcript, isFinal);
        }
      });

      recognition.addEventListener('error', (event: Event) => {
        const e = event as SpeechRecognitionErrorEvent;
        let errorMessage = 'Speech recognition error occurred.';

        switch (e.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = 'No microphone found. Please check your device.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please allow microphone access in your browser settings.';
            setPermissionDenied(true);
            break;
          case 'network':
            errorMessage = 'Network error occurred. Please check your connection.';
            break;
          case 'aborted':
            errorMessage = 'Speech recognition was stopped.';
            break;
          default:
            errorMessage = `Speech recognition error: ${e.error}`;
        }

        setIsListening(false);
        if (onError) {
          onError(errorMessage);
        }
      });

      recognition.addEventListener('end', () => {
        setIsListening(false);
      });

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [lang, continuous, interimResults, onTranscript, onError]);

  const start = useCallback(() => {
    if (!isSupported) {
      if (onError) {
        onError('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      }
      return;
    }

    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setPermissionDenied(false);
      } catch (error) {
        if (onError) {
          onError('Failed to start speech recognition. Please try again.');
        }
      }
    }
  }, [isSupported, isListening, onError]);

  const stop = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const toggle = useCallback(() => {
    if (isListening) {
      stop();
    } else {
      start();
    }
  }, [isListening, start, stop]);

  return {
    isListening,
    isSupported,
    permissionDenied,
    start,
    stop,
    toggle,
  };
}
