import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  SpeakerWaveIcon,
  MicrophoneIcon,
  StopIcon,
  PlayIcon,
  ArrowLeftIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../components/ui/Button";

// Simplified types for continuous reading
interface ContinuousReadingSession {
  id: string;
  text: string;
  words: string[];
  isActive: boolean;
  currentWordIndex: number;
  correctWords: number;
  totalWords: number;
  startTime: Date;
}

// Predefined texts for students
const PRACTICE_TEXTS = [
  {
    id: "1",
    title: "The Magic Garden 🌸",
    content:
      "Once upon a time, there was a beautiful garden where flowers could talk. The roses would whisper secrets to the wind, and the sunflowers would dance in the morning light.",
    level: "Easy",
  },
  {
    id: "2",
    title: "My Best Friend 👫",
    content:
      "My best friend loves to play soccer with me every afternoon. We run around the playground and laugh together. Sometimes we share our lunch and tell funny jokes.",
    level: "Easy",
  },
  {
    id: "3",
    title: "The Clever Fox 🦊",
    content:
      "A clever fox lived in the deep forest near a sparkling river. Every morning, the fox would search for fresh berries and chase butterflies through the tall grass.",
    level: "Medium",
  },
  {
    id: "4",
    title: "Space Adventure 🚀",
    content:
      "The astronaut floated weightlessly through the space station, gazing at Earth through the enormous window. The planet looked like a beautiful blue marble spinning slowly in the darkness.",
    level: "Medium",
  },
];

export const ReadAloud: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<ContinuousReadingSession | null>(null);
  const [selectedText, setSelectedText] = useState("");
  const [customText, setCustomText] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  // Speech recognition and synthesis refs
  const recognitionRef = useRef<any>(null);
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      speechSynthesis.current = window.speechSynthesis;
    }

    // Initialize speech recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = handleSpeechResult;
      recognitionRef.current.onerror = handleSpeechError;
      recognitionRef.current.onend = handleSpeechEnd;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, []);

  const startNewSession = (text: string) => {
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 0);

    const newSession: ContinuousReadingSession = {
      id: Date.now().toString(),
      text,
      words,
      isActive: true,
      currentWordIndex: 0,
      correctWords: 0,
      totalWords: words.length,
      startTime: new Date(),
    };

    setSession(newSession);
    setSelectedText(text);
    setCurrentTranscript("");
    setFeedbackMessage("");
    setShowFeedback(false);
  };

  const startReading = () => {
    if (!session || !recognitionRef.current) return;

    setIsReading(true);
    setCurrentTranscript("");
    setFeedbackMessage("Click the microphone and start reading the paragraph!");
    setShowFeedback(true);

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error("Speech recognition error:", error);
      setFeedbackMessage(
        "Sorry, speech recognition is not available on this device."
      );
    }
  };

  const stopReading = () => {
    setIsReading(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
    }
  };

  const handleSpeechResult = (event: any) => {
    if (!session) return;

    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript.toLowerCase();

    setCurrentTranscript(transcript);

    if (event.results[current].isFinal) {
      processSpokenText(transcript);
    }
  };

  const handleSpeechError = (event: any) => {
    console.error("Speech recognition error:", event.error);
    setFeedbackMessage("Having trouble hearing you. Please speak clearly!");

    // Try to restart recognition after a brief pause
    setTimeout(() => {
      if (isReading && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.error("Failed to restart recognition:", error);
        }
      }
    }, 1000);
  };

  const handleSpeechEnd = () => {
    // Auto-restart recognition if we're still in reading mode
    if (isReading && session?.isActive) {
      setTimeout(() => {
        if (recognitionRef.current && isReading) {
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.error("Failed to restart recognition:", error);
          }
        }
      }, 100);
    }
  };

  const processSpokenText = (spokenText: string) => {
    if (!session) return;

    const spokenWords = spokenText
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 0);
    const sessionWords = session.words;

    // Find where the user is in the text
    let matchIndex = findBestMatch(
      spokenWords,
      sessionWords,
      session.currentWordIndex
    );

    if (matchIndex >= 0) {
      // Good match found - update progress
      const newCorrectWords =
        session.correctWords + (matchIndex - session.currentWordIndex + 1);
      const updatedSession = {
        ...session,
        currentWordIndex: matchIndex + 1,
        correctWords: newCorrectWords,
      };

      setSession(updatedSession);

      // Check if completed
      if (matchIndex + 1 >= sessionWords.length) {
        completeSession(updatedSession);
        return;
      }

      setFeedbackMessage("Great! Keep reading...");
      setShowFeedback(true);

      // Hide feedback after 2 seconds
      setTimeout(() => setShowFeedback(false), 2000);
    } else {
      // No good match - user made an error
      handlePronunciationError(
        spokenWords,
        sessionWords,
        session.currentWordIndex
      );
    }
  };

  const findBestMatch = (
    spokenWords: string[],
    sessionWords: string[],
    startIndex: number
  ): number => {
    // Look for the spoken words in the session text starting from current position
    const searchWindow = Math.min(10, sessionWords.length - startIndex); // Look ahead up to 10 words

    for (let i = 0; i < searchWindow; i++) {
      const targetIndex = startIndex + i;
      if (targetIndex >= sessionWords.length) break;

      // Check if any spoken word matches the target word (fuzzy matching)
      for (const spokenWord of spokenWords) {
        if (isWordMatch(spokenWord, sessionWords[targetIndex])) {
          return targetIndex;
        }
      }
    }

    return -1;
  };

  const isWordMatch = (spoken: string, target: string): boolean => {
    // Exact match
    if (spoken === target) return true;

    // Fuzzy match for similar sounding words
    const similarity = calculateSimilarity(spoken, target);
    return similarity > 0.7; // 70% similarity threshold
  };

  const calculateSimilarity = (word1: string, word2: string): number => {
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

  const handlePronunciationError = (
    spokenWords: string[],
    sessionWords: string[],
    currentIndex: number
  ) => {
    if (currentIndex >= sessionWords.length) return;

    const expectedWord = sessionWords[currentIndex];

    // Stop the user and provide correction
    stopReading();

    setFeedbackMessage(
      `Stop! The word "${expectedWord}" is pronounced differently. Listen carefully:`
    );
    setShowFeedback(true);

    // Play correct pronunciation
    setTimeout(() => {
      playCorrectPronunciation(expectedWord);
    }, 500);

    // Resume reading after correction
    setTimeout(() => {
      setFeedbackMessage(`Now continue reading from "${expectedWord}"...`);
      setTimeout(() => {
        setShowFeedback(false);
        startReading();
      }, 1000);
    }, 3000);
  };

  const playCorrectPronunciation = (word: string) => {
    if (speechSynthesis.current) {
      speechSynthesis.current.cancel();

      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8; // Slower for clear pronunciation
      utterance.pitch = 1;
      utterance.volume = 1;

      speechSynthesis.current.speak(utterance);
    }
  };

  const completeSession = (completedSession: ContinuousReadingSession) => {
    stopReading();

    const accuracy =
      (completedSession.correctWords / completedSession.totalWords) * 100;
    const duration = (Date.now() - completedSession.startTime.getTime()) / 1000;

    setSession({ ...completedSession, isActive: false });
    setFeedbackMessage(
      `🎉 Excellent! You completed the paragraph with ${accuracy.toFixed(
        0
      )}% accuracy in ${Math.round(duration)} seconds!`
    );
    setShowFeedback(true);
  };

  const resetSession = () => {
    stopReading();
    setSession(null);
    setSelectedText("");
    setCurrentTranscript("");
    setFeedbackMessage("");
    setShowFeedback(false);
  };

  const renderTextWithHighlight = () => {
    if (!session || !selectedText) return null;

    const words = selectedText.split(/(\s+|[^\w\s])/);
    let wordIndex = 0;

    return (
      <div className="text-xl leading-relaxed p-6 bg-blue-50 rounded-lg">
        {words.map((part, index) => {
          const isWord = /^\w+$/.test(part);

          if (isWord) {
            const currentWordIdx = wordIndex;
            wordIndex++;

            let className = "transition-all duration-300 ";

            if (currentWordIdx < session.currentWordIndex) {
              className += "bg-green-200 text-green-800 "; // Completed words
            } else if (currentWordIdx === session.currentWordIndex) {
              className +=
                "bg-yellow-200 text-yellow-800 border-2 border-yellow-400 "; // Current word
            } else {
              className += "text-gray-700 "; // Upcoming words
            }

            return (
              <span key={index} className={className}>
                {part}
              </span>
            );
          } else {
            return <span key={index}>{part}</span>;
          }
        })}
      </div>
    );
  };

  if (!session) {
    // Text selection screen
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <BookOpenIcon className="h-8 w-8 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Reading Practice
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Predefined Texts */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                📚 Choose a Story to Read
              </h2>
              <div className="space-y-4">
                {PRACTICE_TEXTS.map((text) => (
                  <div
                    key={text.id}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => startNewSession(text.content)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {text.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          text.level === "Easy"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {text.level}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {text.content}
                    </p>
                    <button className="mt-2 text-purple-600 hover:text-purple-800 font-medium text-sm">
                      Start Reading →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Text */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                ✏️ Write Your Own Text
              </h2>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type or paste any text you want to practice reading..."
                className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Button
                onClick={() => startNewSession(customText)}
                disabled={!customText.trim()}
                className="mt-4 w-full bg-purple-600 hover:bg-purple-700"
              >
                Start Reading Practice
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Reading session screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={resetSession}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Choose Different Text
          </Button>

          <div className="flex items-center gap-4">
            <div className="text-lg font-semibold text-gray-700">
              Progress: {session.currentWordIndex}/{session.totalWords} words
            </div>
            {session.isActive && (
              <div className="text-sm text-gray-600">
                Accuracy:{" "}
                {(
                  (session.correctWords /
                    Math.max(session.currentWordIndex, 1)) *
                  100
                ).toFixed(0)}
                %
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{
                width: `${
                  (session.currentWordIndex / session.totalWords) * 100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Text Display */}
        {renderTextWithHighlight()}

        {/* Feedback Message */}
        {showFeedback && (
          <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
            <p className="text-yellow-800 font-medium text-center">
              {feedbackMessage}
            </p>
          </div>
        )}

        {/* Current Transcript */}
        {isReading && currentTranscript && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-gray-700 text-sm">
              You're saying:{" "}
              <span className="font-medium">"{currentTranscript}"</span>
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="mt-8 flex justify-center">
          {!isReading ? (
            <Button
              onClick={startReading}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-medium flex items-center gap-2"
            >
              <MicrophoneIcon className="h-6 w-6" />
              Start Reading
            </Button>
          ) : (
            <Button
              onClick={stopReading}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-medium flex items-center gap-2"
            >
              <StopIcon className="h-6 w-6" />
              Stop Reading
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-100 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">📖 How to use:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>
              • Click "Start Reading" and read the whole paragraph out loud
            </li>
            <li>• If you pronounce a word wrong, I'll stop you and help</li>
            <li>• Listen to the correct pronunciation and continue reading</li>
            <li>• Green words are correct, yellow is your current position</li>
          </ul>
        </div>

        {/* Session Complete */}
        {!session.isActive && (
          <div className="mt-6 p-6 bg-green-100 border border-green-300 rounded-lg text-center">
            <h3 className="text-xl font-bold text-green-800 mb-2">
              🎉 Great Job!
            </h3>
            <p className="text-green-700">
              You completed the reading practice!
              <br />
              Final Score:{" "}
              {((session.correctWords / session.totalWords) * 100).toFixed(0)}%
              accuracy
            </p>
            <Button
              onClick={resetSession}
              className="mt-4 bg-green-600 hover:bg-green-700"
            >
              Try Another Text
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
