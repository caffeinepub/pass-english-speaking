let currentUtterance: SpeechSynthesisUtterance | null = null;

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function isSpeaking(): boolean {
  if ('speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
}

export async function speakText(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      reject(new Error('Text-to-speech is not supported in your browser.'));
      return;
    }

    // Cancel any ongoing speech
    stopSpeaking();

    // Remove correction brackets for cleaner audio
    const cleanText = text.replace(/\(Correction:.*?\)/g, '').trim();

    if (!cleanText) {
      resolve();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    currentUtterance = utterance;
    
    // Configure voice settings
    utterance.rate = 0.9; // Slightly slower for learning
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';

    // Try to use a natural-sounding voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (voice) =>
        voice.lang.startsWith('en') &&
        (voice.name.includes('Google') ||
          voice.name.includes('Natural') ||
          voice.name.includes('Enhanced'))
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      currentUtterance = null;
      resolve();
    };

    utterance.onerror = (event) => {
      currentUtterance = null;
      if (event.error === 'canceled' || event.error === 'interrupted') {
        resolve(); // User canceled or interrupted, not an error
      } else {
        reject(new Error('Failed to play audio. Please try again.'));
      }
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      currentUtterance = null;
      reject(new Error('Could not start text-to-speech.'));
    }
  });
}
