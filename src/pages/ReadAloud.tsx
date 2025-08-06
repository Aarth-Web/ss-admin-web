import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MicrophoneIcon,
  StopIcon,
  ArrowLeftIcon,
  BookOpenIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../components/ui/Button";
import api from "../services/api";

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
  // URL param for paragraph
  const [searchParams] = useSearchParams();
  const paragraphId = searchParams.get("id");
  const [loadingParagraph, setLoadingParagraph] = useState(false);
  const [paragraphError, setParagraphError] = useState<string | null>(null);
  const [paragraphTitle, setParagraphTitle] = useState<string>("");

  const [session, setSession] = useState<ContinuousReadingSession | null>(null);
  const [selectedText, setSelectedText] = useState("");
  const [customText, setCustomText] = useState("");
  const [isReading, setIsReading] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  // Game flow: microphone test
  const [micTested, setMicTested] = useState(false);
  const [micReady, setMicReady] = useState(false);

  // Speech recognition and synthesis refs
  const recognitionRef = useRef<any>(null);
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debug function for Indian students
  const addDebugInfo = (message: string) => {
    console.log("🎤 ReadAloud Debug:", message);
    setDebugInfo((prev) => [
      ...prev.slice(-4),
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const handleSpeechResult = useCallback(
    (event: any) => {
      if (!session) return;

      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript.toLowerCase();
      const confidence = event.results[current][0].confidence || 0.5;

      addDebugInfo(
        `Heard: "${transcript}" (confidence: ${confidence.toFixed(2)})`
      );
      setCurrentTranscript(transcript);

      if (event.results[current].isFinal) {
        addDebugInfo(`Final result: "${transcript}"`);
        processSpokenText(transcript);
      }
    },
    [session]
  );

  const handleSpeechError = useCallback(
    (event: any) => {
      console.error("Speech recognition error:", event.error);
      addDebugInfo(`Error: ${event.error}`);

      // Common error messages for Indian students
      let errorMessage = "Having trouble hearing you. ";
      switch (event.error) {
        case "not-allowed":
          errorMessage = "Please allow microphone access in your browser.";
          break;
        case "no-speech":
          errorMessage = "No speech detected. Please speak louder!";
          break;
        case "network":
          errorMessage = "Network issue. Check your internet connection.";
          break;
        case "audio-capture":
          errorMessage = "Microphone not found. Please check your device.";
          break;
        default:
          errorMessage += "Please speak clearly and try again!";
      }

      setFeedbackMessage(errorMessage);
      setShowFeedback(true);

      // Try to restart recognition after a brief pause
      setTimeout(() => {
        if (isReading && recognitionRef.current) {
          try {
            addDebugInfo("Restarting recognition after error...");
            recognitionRef.current.start();
          } catch (error) {
            console.error("Failed to restart recognition:", error);
            addDebugInfo("Failed to restart recognition");
          }
        }
      }, 2000);
    },
    [isReading]
  );

  const handleSpeechEnd = useCallback(() => {
    addDebugInfo("Speech recognition ended");
    // Auto-restart recognition if we're still in reading mode
    if (isReading && session?.isActive) {
      setTimeout(() => {
        if (recognitionRef.current && isReading) {
          try {
            addDebugInfo("Auto-restarting recognition...");
            recognitionRef.current.start();
          } catch (error) {
            console.error("Failed to restart recognition:", error);
            addDebugInfo("Failed to auto-restart recognition");
          }
        }
      }, 500); // Increased delay for stability
    }
  }, [isReading, session?.isActive]);

  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      speechSynthesis.current = window.speechSynthesis;
    }

    // Check for speech recognition support
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setRecognitionSupported(false);
      addDebugInfo("Speech recognition not supported in this browser");
      return;
    }

    // Initialize speech recognition with Indian English support
    try {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      // Support for Indian English
      recognitionRef.current.lang = "en-IN"; // Changed from en-US to en-IN
      recognitionRef.current.maxAlternatives = 3; // Get multiple alternatives
      recognitionRef.current.serviceURI = undefined; // Use default service

      recognitionRef.current.onstart = () => {
        addDebugInfo("Speech recognition started successfully");
      };

      recognitionRef.current.onresult = handleSpeechResult;
      recognitionRef.current.onerror = handleSpeechError;
      recognitionRef.current.onend = handleSpeechEnd;

      addDebugInfo(
        "Speech recognition initialized with Indian English (en-IN)"
      );
    } catch (error) {
      console.error("Failed to initialize speech recognition:", error);
      setRecognitionSupported(false);
      addDebugInfo(`Failed to initialize: ${error}`);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      const timeoutId = processingTimeoutRef.current;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [handleSpeechResult, handleSpeechError, handleSpeechEnd]);

  const checkMicrophone = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          addDebugInfo("🎉 Microphone is ready!");
          setMicReady(true);
        })
        .catch((err) => {
          addDebugInfo(`❌ Microphone error: ${err.message}`);
          setMicReady(false);
        })
        .finally(() => setMicTested(true));
    } else {
      addDebugInfo("⚠️ getUserMedia not supported");
      setMicReady(false);
      setMicTested(true);
    }
  };

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
    if (!session) {
      addDebugInfo("No session found");
      return;
    }

    if (!recognitionRef.current) {
      addDebugInfo("Speech recognition not available");
      setFeedbackMessage(
        "❌ Speech recognition is not available. Please use Chrome or Edge browser and ensure you're on HTTPS or localhost."
      );
      setShowFeedback(true);
      return;
    }

    // Check if we're using HTTPS or localhost
    const isSecure =
      window.location.protocol === "https:" ||
      window.location.hostname === "localhost";
    if (!isSecure) {
      addDebugInfo(
        "Insecure connection detected - speech recognition may not work"
      );
      setFeedbackMessage(
        "⚠️ Speech recognition requires a secure connection (HTTPS). It may not work on HTTP."
      );
      setShowFeedback(true);
      // Don't return here - let them try anyway
    }

    addDebugInfo("Starting reading session...");
    setIsReading(true);
    setCurrentTranscript("");
    setFeedbackMessage("🎤 Listening... Start reading the paragraph!");
    setShowFeedback(true);

    try {
      // Stop any existing recognition first
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore error if already stopped
      }

      // Wait a bit then start
      setTimeout(() => {
        try {
          recognitionRef.current.start();
          addDebugInfo("Speech recognition started successfully ✅");
        } catch (error: any) {
          console.error("Speech recognition start error:", error);
          addDebugInfo(`Start error: ${error.message}`);

          let errorMessage = "❌ Error starting microphone: ";
          if (error.message.includes("already started")) {
            addDebugInfo("Recognition already running, continuing...");
            errorMessage = "✅ Microphone is already active and listening!";
          } else if (error.message.includes("not-allowed")) {
            errorMessage +=
              "Permission denied. Please allow microphone access and refresh the page.";
          } else if (error.message.includes("no-speech")) {
            errorMessage +=
              "No speech detected. Try speaking louder or closer to the microphone.";
          } else {
            errorMessage += `${error.message}. Please refresh and try again.`;
          }

          setFeedbackMessage(errorMessage);
          if (!error.message.includes("already started")) {
            setIsReading(false);
          }
        }
      }, 100);
    } catch (error: any) {
      console.error("Speech recognition error:", error);
      addDebugInfo(`Recognition error: ${error.message}`);
      setFeedbackMessage(
        "❌ Sorry, speech recognition failed to start. Please check your microphone permissions and refresh the page."
      );
      setIsReading(false);
    }
  };

  const stopReading = () => {
    addDebugInfo("Stopping reading session");
    setIsReading(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
    }
  };

  const processSpokenText = (spokenText: string) => {
    if (!session) return;

    const spokenWords = spokenText
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 0);
    const sessionWords = session.words;

    addDebugInfo(`Processing: "${spokenText}" -> [${spokenWords.join(", ")}]`);
    addDebugInfo(
      `Current position: "${
        sessionWords[session.currentWordIndex]
      }" (position ${session.currentWordIndex + 1}/${sessionWords.length})`
    );

    // New stricter approach: Check sequential pronunciation from current position
    const matchResult = findSequentialMatch(
      spokenWords,
      sessionWords,
      session.currentWordIndex
    );

    addDebugInfo(`Match result: ${JSON.stringify(matchResult)}`);

    if (matchResult.wordsMatched > 0) {
      // Good match found - update progress based on consecutive correct words only
      const newCorrectWords = session.correctWords + matchResult.wordsMatched;
      const newCurrentIndex =
        session.currentWordIndex + matchResult.wordsMatched;

      const updatedSession = {
        ...session,
        currentWordIndex: newCurrentIndex,
        correctWords: newCorrectWords,
      };

      setSession(updatedSession);
      addDebugInfo(
        `Progress updated: ${matchResult.wordsMatched} consecutive word(s) completed`
      );

      // Check if completed
      if (newCurrentIndex >= sessionWords.length) {
        addDebugInfo("Session completed!");
        completeSession(updatedSession);
        return;
      }

      // Provide feedback based on accuracy
      if (matchResult.accuracy >= 0.8) {
        setFeedbackMessage("Excellent! Keep reading...");
      } else if (matchResult.accuracy >= 0.6) {
        setFeedbackMessage("Good! Try to pronounce more clearly...");
      } else {
        setFeedbackMessage("Keep going, but focus on clarity...");
      }
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2000);
    } else {
      // No good consecutive match - user made errors
      addDebugInfo(
        `No consecutive match found. Expected: "${
          sessionWords[session.currentWordIndex]
        }"`
      );
      handlePronunciationError(
        spokenWords,
        sessionWords,
        session.currentWordIndex
      );
    }
  };

  // New strict sequential matching function
  const findSequentialMatch = (
    spokenWords: string[],
    sessionWords: string[],
    startIndex: number
  ): { wordsMatched: number; accuracy: number } => {
    if (spokenWords.length === 0 || startIndex >= sessionWords.length) {
      return { wordsMatched: 0, accuracy: 0 };
    }

    addDebugInfo(`Checking sequential match from position ${startIndex}`);

    let consecutiveMatches = 0;
    let totalSimilarity = 0;
    let spokenIndex = 0;

    // Check consecutive words starting from current position
    for (
      let sessionIndex = startIndex;
      sessionIndex < sessionWords.length && spokenIndex < spokenWords.length;
      sessionIndex++
    ) {
      const targetWord = sessionWords[sessionIndex];
      const spokenWord = spokenWords[spokenIndex];

      addDebugInfo(`Comparing: "${spokenWord}" vs "${targetWord}"`);

      if (isWordMatch(spokenWord, targetWord)) {
        // Calculate similarity for this word
        const similarity = getWordSimilarity(spokenWord, targetWord);
        totalSimilarity += similarity;
        consecutiveMatches++;
        spokenIndex++;

        addDebugInfo(
          `✓ Match found: "${spokenWord}" ≈ "${targetWord}" (similarity: ${similarity.toFixed(
            2
          )})`
        );
      } else {
        // No match - stop checking (require consecutive accuracy)
        addDebugInfo(`✗ No match: "${spokenWord}" vs "${targetWord}"`);
        break;
      }
    }

    const accuracy =
      consecutiveMatches > 0 ? totalSimilarity / consecutiveMatches : 0;

    // Require at least 70% accuracy for acceptance and minimum one word
    const minAccuracy = 0.7;
    const acceptableMatches = accuracy >= minAccuracy ? consecutiveMatches : 0;

    addDebugInfo(
      `Sequential result: ${acceptableMatches} words matched with ${(
        accuracy * 100
      ).toFixed(1)}% accuracy`
    );

    return {
      wordsMatched: acceptableMatches,
      accuracy: accuracy,
    };
  };

  // Helper function to get word similarity score
  const getWordSimilarity = (spoken: string, target: string): number => {
    const cleanSpoken = spoken.toLowerCase().trim();
    const cleanTarget = target.toLowerCase().trim();

    // Exact match gets perfect score
    if (cleanSpoken === cleanTarget) return 1.0;

    // Check Indian English variations
    const variations = getIndianEnglishVariations(cleanTarget);
    if (variations.some((variation) => cleanSpoken === variation)) {
      return 0.9; // High score for acceptable variations
    }

    // Fuzzy match using Levenshtein distance
    return calculateSimilarity(cleanSpoken, cleanTarget);
  };

  const isWordMatch = (spoken: string, target: string): boolean => {
    // Clean both words (remove extra spaces, convert to lowercase)
    const cleanSpoken = spoken.toLowerCase().trim();
    const cleanTarget = target.toLowerCase().trim();

    // Exact match
    if (cleanSpoken === cleanTarget) return true;

    // Handle common Indian English pronunciation variations
    const variations = getIndianEnglishVariations(cleanTarget);
    if (variations.some((variation) => cleanSpoken === variation)) {
      return true;
    }

    // Fuzzy match with stricter threshold - increased from 0.6 to 0.75
    const similarity = calculateSimilarity(cleanSpoken, cleanTarget);
    return similarity > 0.75; // More strict threshold
  };

  // Handle common Indian English pronunciation patterns
  const getIndianEnglishVariations = (word: string): string[] => {
    const variations = [word];

    // Common Indian English pronunciation patterns
    const patterns = [
      // W/V confusion (common in Indian English)
      { from: /^w/, to: "v" },
      { from: /w/g, to: "v" },

      // TH sounds often pronounced as T or D
      { from: /th/g, to: "t" },
      { from: /th/g, to: "d" },

      // R sounds (sometimes silent or rolled)
      { from: /r$/g, to: "" }, // Silent R at end
      { from: /er$/g, to: "a" }, // 'er' -> 'a' sound

      // Short/long vowel variations
      { from: /a/g, to: "aa" },
      { from: /i/g, to: "ee" },
      { from: /o/g, to: "oo" },

      // Silent letters (common in Indian pronunciation)
      { from: /h/g, to: "" }, // Silent H
      { from: /(?<!s)t$/g, to: "" }, // Silent T at end (not in 'st')

      // Z/J confusion
      { from: /z/g, to: "j" },
      { from: /j/g, to: "z" },
    ];

    // Apply each pattern to create variations
    patterns.forEach((pattern) => {
      const variation = word.replace(pattern.from, pattern.to);
      if (variation !== word && !variations.includes(variation)) {
        variations.push(variation);
      }
    });

    return variations;
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

    // Find which words were mispronounced
    const errorDetails = [];
    for (let i = 0; i < Math.min(spokenWords.length, 3); i++) {
      const sessionIdx = currentIndex + i;
      if (sessionIdx < sessionWords.length) {
        const expectedWord = sessionWords[sessionIdx];
        const spokenWord = spokenWords[i];

        if (!isWordMatch(spokenWord, expectedWord)) {
          errorDetails.push({
            spoken: spokenWord,
            expected: expectedWord,
            position: sessionIdx + 1,
          });
        }
      }
    }

    // Stop the user and provide specific correction
    stopReading();

    let errorMessage: string;
    if (errorDetails.length === 1) {
      const error = errorDetails[0];
      errorMessage = `Hey Buddy, I heard "${error.spoken}" but the correct word is "${error.expected}". Let's say it together: "${error.expected}."`;
    } else if (errorDetails.length > 1) {
      errorMessage = `Oops, a few words need some practice. Let's focus on the word "${expectedWord}". Repeat after me: "${expectedWord}".`;
    } else {
      errorMessage = `Let's practice the word "${expectedWord}". Please say it again with me: "${expectedWord}".`;
    }
    setFeedbackMessage(errorMessage);
    setShowFeedback(true);

    // Play correct pronunciation
    setTimeout(() => {
      playCorrectPronunciation(errorMessage);
    }, 500);

    // Resume reading after correction
    setTimeout(() => {
      setFeedbackMessage(`Now try again from "${expectedWord}"...`);
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
      <div className="text-base sm:text-lg lg:text-xl leading-relaxed sm:leading-relaxed lg:leading-loose p-4 sm:p-6 bg-blue-50 rounded-lg">
        {words.map((part, index) => {
          const isWord = /^\w+$/.test(part);

          if (isWord) {
            const currentWordIdx = wordIndex;
            wordIndex++;

            let className =
              "transition-all duration-300 px-1 py-0.5 rounded-sm ";

            if (currentWordIdx < session.currentWordIndex) {
              className += "bg-green-200 text-green-800 "; // Completed words
            } else if (currentWordIdx === session.currentWordIndex) {
              className +=
                "bg-yellow-200 text-yellow-800 border-2 border-yellow-400 shadow-sm "; // Current word
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

  useEffect(() => {
    // On ID routes, fetch paragraph once microphone is ready
    if (paragraphId && micTested && !session && !loadingParagraph) {
      setLoadingParagraph(true);
      setParagraphError(null);
      api
        .get(`/reading-paragraphs/public/${paragraphId}`)
        .then((res) => {
          const data = res.data;
          setParagraphTitle(data.title || "");
          startNewSession(data.content);
        })
        .catch((err) => {
          console.error("Error fetching paragraph:", err);
          setParagraphError(err.message);
        })
        .finally(() => setLoadingParagraph(false));
    }
  }, [paragraphId, micTested]);

  // Render logic...
  if (!session) {
    // If ID provided, skip static selection
    if (paragraphId) {
      // Mic test screen (legacy)
      if (!micTested) {
        return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Let's make sure your microphone is ready!
            </h2>
            <Button
              onClick={checkMicrophone}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3"
            >
              {micReady ? "Microphone Ready ✅" : "Check Microphone 🎤"}
            </Button>
            {micTested && !micReady && (
              <p className="mt-2 text-red-600">
                Please allow microphone access and try again.
              </p>
            )}
          </div>
        );
      }
      // Loading paragraph
      if (loadingParagraph) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="spinner mb-2"></div>
              <p>Loading "{paragraphTitle || "paragraph"}"...</p>
            </div>
          </div>
        );
      }
      // Error fetching paragraph
      if (paragraphError) {
        return (
          <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h2 className="text-xl font-semibold mb-2">
              Unable to load paragraph
            </h2>
            <p className="text-red-600 mb-4">{paragraphError}</p>
            <Button
              onClick={() => setParagraphError(null)}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2"
            >
              Try Again
            </Button>
          </div>
        );
      }
      // Once session is created by effect, fall through to reading UI
    }
    // Static text selection screen
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-4 px-3 sm:py-8 sm:px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="flex items-center gap-2 text-sm sm:text-base self-start"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <BookOpenIcon className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Reading Practice
              </h1>
            </div>
          </div>

          <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
            {/* Predefined Texts */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                📚 Choose a Story to Read
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {PRACTICE_TEXTS.map((text) => (
                  <div
                    key={text.id}
                    className="border-2 border-gray-200 rounded-lg p-3 sm:p-4 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => startNewSession(text.content)}
                  >
                    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                        {text.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full self-start xs:self-auto ${
                          text.level === "Easy"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {text.level}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-3 sm:line-clamp-2 leading-relaxed">
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
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                ✏️ Write Your Own Text
              </h2>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type or paste any text you want to practice reading..."
                className="w-full h-32 sm:h-40 p-3 sm:p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
              />
              <Button
                onClick={() => startNewSession(customText)}
                disabled={!customText.trim()}
                className="mt-3 sm:mt-4 w-full bg-purple-600 hover:bg-purple-700 py-3 text-sm sm:text-base"
              >
                Start Reading Practice
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Before reading session UI, check micTested
  if (!micTested) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Let's make sure your microphone is ready!
        </h2>
        <Button
          onClick={checkMicrophone}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3"
        >
          {micReady ? "Microphone Ready ✅" : "Check Microphone 🎤"}
        </Button>
        {micTested && !micReady && (
          <p className="mt-2 text-red-600">
            Please allow microphone access and try again.
          </p>
        )}
      </div>
    );
  }

  // Reading session screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-4 px-3 sm:py-8 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Button
            onClick={resetSession}
            variant="outline"
            className="flex items-center gap-2 text-sm sm:text-base self-start"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="hidden xs:inline">Choose Different Text</span>
            <span className="xs:hidden">Back</span>
          </Button>

          <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-4 w-full sm:w-auto">
            <div className="text-base sm:text-lg font-semibold text-gray-700">
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
        <div className="mb-4 sm:mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
            <div
              className="bg-blue-600 h-2 sm:h-3 rounded-full transition-all duration-300"
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
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
            <p className="text-yellow-800 font-medium text-center text-sm sm:text-base">
              {feedbackMessage}
            </p>
          </div>
        )}

        {/* Current Transcript - Show what the system is hearing */}
        {isReading && currentTranscript && (
          <div className="mt-3 sm:mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              🎤 I can hear:{" "}
              <span className="font-medium break-words">
                "{currentTranscript}"
              </span>
            </p>
          </div>
        )}

        {/* Debug Panel for Indian students - helps troubleshoot issues */}
        {debugInfo.length > 0 && (
          <div className="mt-3 sm:mt-4 p-3 bg-gray-100 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700">
                🔧 System Status (for troubleshooting)
              </h4>
              <button
                onClick={() => setDebugInfo([])}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            </div>
            <div className="text-xs text-gray-600 space-y-1 max-h-16 sm:max-h-20 overflow-y-auto">
              {debugInfo.map((info, index) => (
                <div key={index} className="break-words">
                  {info}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recognition not supported warning */}
        {!recognitionSupported && (
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-100 border border-red-300 rounded-lg">
            <div className="flex items-start gap-2 mb-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <h4 className="font-medium text-red-800 text-sm sm:text-base">
                Speech Recognition Not Supported
              </h4>
            </div>
            <p className="text-red-700 text-sm mb-2">
              Your browser doesn't support speech recognition. For the best
              experience:
            </p>
            <ul className="text-red-700 text-sm space-y-1">
              <li>
                • Use <strong>Google Chrome</strong> or{" "}
                <strong>Microsoft Edge</strong>
              </li>
              <li>• Make sure you have a microphone connected</li>
              <li>• Allow microphone access when prompted</li>
              <li>• Check your internet connection</li>
            </ul>
          </div>
        )}

        {/* Controls */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          {!isReading ? (
            <Button
              onClick={startReading}
              disabled={!recognitionSupported}
              className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 text-base sm:text-lg font-medium flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <MicrophoneIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              {recognitionSupported
                ? "Start Reading 📖"
                : "Microphone Not Available"}
            </Button>
          ) : (
            <Button
              onClick={stopReading}
              className="bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 py-3 text-base sm:text-lg font-medium flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <StopIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              Stop
            </Button>
          )}
        </div>

        {/* Instructions for Indian students */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-100 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2 text-sm sm:text-base">
            📖 How to use (for Indian students):
          </h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Click "Start Reading" and read word by word clearly</li>
            <li>
              • You must pronounce each word correctly in sequence to progress
            </li>
            <li>
              • The system understands Indian English accent - speak naturally!
            </li>
            <li>
              • If you mispronounce words, I'll help you learn the correct
              pronunciation
            </li>
            <li>• Green words show completed, yellow shows current position</li>
            <li>
              • Focus on clarity and accuracy - each word must be pronounced
              well!
            </li>
          </ul>

          <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-600">
            <strong>💡 New Feature:</strong> The app now requires accurate
            pronunciation of each word in sequence. If you mispronounce 3 out of
            4 words, you'll need to retry those words. This helps improve your
            pronunciation skills!
          </div>
        </div>

        {/* Session Complete */}
        {!session.isActive && (
          <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-green-100 border border-green-300 rounded-lg text-center">
            <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-2">
              🎉 Great Job!
            </h3>
            <p className="text-green-700 text-sm sm:text-base">
              You completed the reading practice!
              <br />
              Final Score:{" "}
              {((session.correctWords / session.totalWords) * 100).toFixed(0)}%
              accuracy
            </p>
            <Button
              onClick={resetSession}
              className="mt-3 sm:mt-4 bg-green-600 hover:bg-green-700 w-full sm:w-auto"
            >
              Try Another Text
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
