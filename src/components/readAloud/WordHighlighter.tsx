import React from "react";
import { Word, PronunciationResult } from "../../types/readAloud";

interface WordHighlighterProps {
  text: string;
  currentWordIndex: number;
  words: Word[];
  pronunciationResults: PronunciationResult[];
}

export const WordHighlighter: React.FC<WordHighlighterProps> = ({
  text,
  currentWordIndex,
  words,
  pronunciationResults,
}) => {
  // Create a map of word results for quick lookup
  const resultMap = new Map<number, PronunciationResult>();
  pronunciationResults.forEach((result) => {
    resultMap.set(result.wordIndex, result);
  });

  // Split text into words while preserving punctuation and spacing
  const textParts = text.split(/(\s+|[^\w\s])/);
  let wordIndex = 0;

  const getWordClass = (index: number) => {
    const result = resultMap.get(index);
    const word = words[index];

    let classes = "transition-all duration-300 ";

    // Current word styling
    if (index === currentWordIndex) {
      classes += "bg-blue-200 border-2 border-blue-400 rounded px-1 font-bold ";
    }
    // Completed words styling
    else if (result) {
      if (result.isCorrect) {
        classes += "bg-green-100 text-green-800 rounded px-1 ";
      } else {
        classes += "bg-red-100 text-red-800 rounded px-1 ";
      }
    }
    // Upcoming words
    else if (index > currentWordIndex) {
      classes += "text-gray-400 ";
    }
    // Default styling for words not yet reached
    else {
      classes += "text-gray-700 ";
    }

    // Add hover effect for interactive words
    if (index !== currentWordIndex) {
      classes += "hover:bg-gray-100 cursor-pointer ";
    }

    return classes.trim();
  };

  const handleWordClick = (index: number) => {
    if (index < currentWordIndex) {
      // Show result details for completed words
      const result = resultMap.get(index);
      if (result) {
        alert(
          `Word: ${result.expectedWord}\nYou said: ${
            result.spokenWord
          }\nAccuracy: ${(result.confidence * 100).toFixed(0)}%`
        );
      }
    }
  };

  return (
    <div className="relative">
      {/* Text Display */}
      <div className="text-lg leading-relaxed p-6 bg-gray-50 rounded-lg min-h-32">
        {textParts.map((part, index) => {
          // Check if this part is a word (not whitespace or punctuation)
          const isWord = /^\w+$/.test(part);

          if (isWord) {
            const currentWordClass = getWordClass(wordIndex);
            const currentWordIdx = wordIndex;
            wordIndex++;

            return (
              <span
                key={index}
                className={currentWordClass}
                onClick={() => handleWordClick(currentWordIdx)}
                title={`Word ${currentWordIdx + 1}: ${part}`}
              >
                {part}
              </span>
            );
          } else {
            // Return whitespace or punctuation as-is
            return <span key={index}>{part}</span>;
          }
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-200 border-2 border-blue-400 rounded"></div>
          <span className="text-gray-600">Current Word</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 rounded"></div>
          <span className="text-gray-600">Correct</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 rounded"></div>
          <span className="text-gray-600">Incorrect</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 rounded"></div>
          <span className="text-gray-600">Not Attempted</span>
        </div>
      </div>

      {/* Current Word Focus */}
      <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Current Word</p>
          <p className="text-3xl font-bold text-blue-600">
            {words[currentWordIndex]?.text || "Complete!"}
          </p>
          {words[currentWordIndex] && (
            <p className="text-sm text-gray-500 mt-1">
              Word {currentWordIndex + 1} of {words.length}
            </p>
          )}
        </div>

        {/* Pronunciation attempts indicator */}
        {words[currentWordIndex]?.attempts > 0 && (
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">
              Attempts: {words[currentWordIndex].attempts}
            </p>
          </div>
        )}
      </div>

      {/* Reading Tips */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-1">
          💡 Reading Tips
        </h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Click on completed words to see pronunciation details</li>
          <li>• The current word is highlighted in blue</li>
          <li>• Green words were pronounced correctly</li>
          <li>• Red words need more practice</li>
        </ul>
      </div>

      {/* Progress Indicators */}
      <div className="mt-4 flex justify-between text-xs text-gray-500">
        <span>
          Correct: {pronunciationResults.filter((r) => r.isCorrect).length}
        </span>
        <span>
          Incorrect: {pronunciationResults.filter((r) => !r.isCorrect).length}
        </span>
        <span>Remaining: {words.length - currentWordIndex}</span>
      </div>
    </div>
  );
};
