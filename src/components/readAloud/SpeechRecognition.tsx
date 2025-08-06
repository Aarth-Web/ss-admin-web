import React, { useState, useEffect, useRef } from "react";
import { MicrophoneIcon, StopIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/Button";
import {
  SpeechRecognitionResult,
  ReadingPracticeSettings,
} from "../../types/readAloud";

interface SpeechRecognitionProps {
  expectedWord: string;
  onResult: (
    spokenWord: string,
    expectedWord: string,
    confidence: number
  ) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
  settings: ReadingPracticeSettings;
}

// Extend the Window interface to include webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const SpeechRecognition: React.FC<SpeechRecognitionProps> = ({
  expectedWord,
  onResult,
  isListening,
  setIsListening,
  settings,
}) => {
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser");
      return;
    }

    // Initialize speech recognition
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onstart = () => {
      setError(null);
      setTranscript("");
    };

    recognitionRef.current.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      const confidence = event.results[current][0].confidence;

      setTranscript(transcript);

      if (event.results[current].isFinal) {
        handleFinalResult(transcript, confidence);
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleFinalResult = (spokenWord: string, confidence: number) => {
    // Clean up the spoken word (remove punctuation, convert to lowercase)
    const cleanSpokenWord = spokenWord.toLowerCase().replace(/[^\w]/g, "");
    const cleanExpectedWord = expectedWord.toLowerCase().replace(/[^\w]/g, "");

    // Calculate similarity
    const similarity = calculateSimilarity(cleanSpokenWord, cleanExpectedWord);
    const finalConfidence = Math.max(confidence, similarity);

    onResult(cleanSpokenWord, cleanExpectedWord, finalConfidence);
    setTranscript("");
  };

  const calculateSimilarity = (word1: string, word2: string): number => {
    // Simple Levenshtein distance based similarity
    const maxLength = Math.max(word1.length, word2.length);
    if (maxLength === 0) return 1.0;

    const distance = levenshteinDistance(word1, word2);
    return 1 - distance / maxLength;
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      setError("Speech recognition not available");
      return;
    }

    try {
      recognitionRef.current.start();
      setIsListening(true);
      setError(null);

      // Set a timeout to stop listening after 10 seconds
      timeoutRef.current = setTimeout(() => {
        stopListening();
      }, 10000);
    } catch (err) {
      setError("Failed to start speech recognition");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600 text-sm mb-2">{error}</p>
        <p className="text-gray-500 text-xs">
          Please ensure your browser supports speech recognition and microphone
          access is allowed.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={isListening ? stopListening : startListening}
        className={`flex items-center gap-2 px-6 py-3 ${
          isListening
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {isListening ? (
          <>
            <StopIcon className="h-5 w-5" />
            Stop Recording
          </>
        ) : (
          <>
            <MicrophoneIcon className="h-5 w-5" />
            Start Recording
          </>
        )}
      </Button>

      {isListening && (
        <div className="text-center">
          <div className="animate-pulse text-red-600 text-sm mb-1">
            🔴 Recording...
          </div>
          {transcript && (
            <p className="text-gray-600 text-sm italic">"{transcript}"</p>
          )}
        </div>
      )}

      <p className="text-xs text-gray-500 text-center max-w-xs">
        Click the microphone and say the word clearly. The system will compare
        your pronunciation.
      </p>
    </div>
  );
};
