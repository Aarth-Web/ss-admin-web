import React from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import {
  PronunciationResult,
  ReadingPracticeSettings,
} from "../../types/readAloud";

interface PronunciationFeedbackProps {
  results: PronunciationResult[];
  currentWordIndex: number;
  settings: ReadingPracticeSettings;
}

export const PronunciationFeedback: React.FC<PronunciationFeedbackProps> = ({
  results,
  currentWordIndex,
  settings,
}) => {
  // Get recent results (last 5)
  const recentResults = results.slice(-5).reverse();

  // Get current word result if it exists
  const currentResult = results.find((r) => r.wordIndex === currentWordIndex);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600";
    if (confidence >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.9) return "Excellent";
    if (confidence >= 0.8) return "Good";
    if (confidence >= 0.6) return "Fair";
    return "Needs Practice";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Pronunciation Feedback
      </h3>

      {/* Current Word Feedback */}
      {currentResult && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">
            Current Word Result
          </h4>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {currentResult.isCorrect ? (
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-red-600" />
              )}
              <span className="font-medium">{currentResult.expectedWord}</span>
            </div>
            <span
              className={`text-sm font-medium ${getConfidenceColor(
                currentResult.confidence
              )}`}
            >
              {getConfidenceLabel(currentResult.confidence)}
            </span>
          </div>

          {!currentResult.isCorrect && (
            <div className="text-sm text-gray-600">
              <p>
                You said:{" "}
                <span className="italic">"{currentResult.spokenWord}"</span>
              </p>
              <p>
                Expected:{" "}
                <span className="font-medium">
                  "{currentResult.expectedWord}"
                </span>
              </p>
              {settings.showPhonetics && (
                <p className="text-xs text-gray-500 mt-1">
                  Try focusing on each syllable
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Recent Results */}
      <div>
        <h4 className="font-medium text-gray-800 mb-3">Recent Attempts</h4>
        {recentResults.length > 0 ? (
          <div className="space-y-2">
            {recentResults.map((result, index) => (
              <div
                key={`${result.wordIndex}-${result.timestamp}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {result.isCorrect ? (
                    <CheckCircleIcon className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircleIcon className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm font-medium">
                    {result.expectedWord}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs ${getConfidenceColor(
                      result.confidence
                    )}`}
                  >
                    {(result.confidence * 100).toFixed(0)}%
                  </span>
                  {!result.isCorrect && (
                    <button
                      onClick={() => {
                        // Play pronunciation
                        const utterance = new SpeechSynthesisUtterance(
                          result.expectedWord
                        );
                        utterance.rate = settings.speed;
                        speechSynthesis.speak(utterance);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                      title="Hear correct pronunciation"
                    >
                      <SpeakerWaveIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-4">
            No attempts yet. Start speaking to see feedback here.
          </p>
        )}
      </div>

      {/* Tips Section */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h5 className="font-medium text-blue-800 mb-2">
          💡 Tips for Better Pronunciation
        </h5>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Speak clearly and at a moderate pace</li>
          <li>• Make sure you're in a quiet environment</li>
          <li>• Hold your device close to your mouth</li>
          <li>• Listen to the correct pronunciation first</li>
          {settings.strictMode && (
            <li>• Strict mode is on - pronunciation must be very accurate</li>
          )}
        </ul>
      </div>

      {/* Performance Summary */}
      {results.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h5 className="font-medium text-gray-800 mb-2">Session Stats</h5>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Accuracy</p>
              <p className="font-semibold text-lg">
                {(
                  (results.filter((r) => r.isCorrect).length / results.length) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
            <div>
              <p className="text-gray-600">Words Attempted</p>
              <p className="font-semibold text-lg">{results.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
