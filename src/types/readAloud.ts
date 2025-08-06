export interface Word {
  id: number;
  text: string;
  isCorrect: boolean | null;
  attempts: number;
  timeSpent: number;
  phonetic?: string;
}

export interface PronunciationResult {
  wordIndex: number;
  expectedWord: string;
  spokenWord: string;
  isCorrect: boolean;
  confidence: number;
  timestamp: number;
  attempts?: number;
}

export interface ReadingSession {
  id: string;
  text: string;
  words: Word[];
  startTime: Date;
  endTime?: Date;
  currentWordIndex: number;
  isActive: boolean;
  accuracy: number;
  wordsPerMinute: number;
  totalMistakes?: number;
  difficulty?: "easy" | "medium" | "hard";
}

export interface ReadingPracticeSettings {
  speed: number; // Speech synthesis speed (0.1 - 2.0)
  autoCorrect: boolean; // Automatically play correct pronunciation on mistake
  strictMode: boolean; // Require exact pronunciation match
  showPhonetics: boolean; // Display phonetic spelling
  highlightErrors: boolean; // Highlight mispronounced words
  pauseOnError: boolean; // Pause session on pronunciation error
  minimumConfidence: number; // Minimum confidence threshold (0-1)
}

export interface PredefinedText {
  id: string;
  title: string;
  content: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  estimatedTime: number; // in minutes
  wordCount: number;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface PronunciationAnalysis {
  word: string;
  phonemes: string[];
  correctPhonemes: string[];
  accuracy: number;
  errors: {
    position: number;
    expected: string;
    actual: string;
  }[];
}
