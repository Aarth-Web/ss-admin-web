import React from "react";
import { ClockIcon, TrophyIcon } from "@heroicons/react/24/outline";
import { ReadingSession } from "../../types/readAloud";

interface ProgressTrackerProps {
  currentSession: ReadingSession;
  currentWordIndex: number;
  totalWords: number;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  currentSession,
  currentWordIndex,
  totalWords,
}) => {
  const progressPercentage =
    totalWords > 0 ? (currentWordIndex / totalWords) * 100 : 0;

  // Calculate session duration
  const sessionDuration = currentSession.isActive
    ? Math.floor((Date.now() - currentSession.startTime.getTime()) / 1000)
    : currentSession.endTime
    ? Math.floor(
        (currentSession.endTime.getTime() -
          currentSession.startTime.getTime()) /
          1000
      )
    : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const estimatedTimeRemaining = () => {
    if (currentWordIndex === 0) return "--:--";
    const avgTimePerWord = sessionDuration / currentWordIndex;
    const remainingWords = totalWords - currentWordIndex;
    const remainingSeconds = Math.floor(avgTimePerWord * remainingWords);
    return formatTime(remainingSeconds);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Progress</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <ClockIcon className="h-4 w-4" />
            <span>{formatTime(sessionDuration)}</span>
          </div>
          {currentSession.isActive && (
            <div className="flex items-center gap-1">
              <span>ETA: {estimatedTimeRemaining()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Words Completed</span>
          <span>
            {currentWordIndex} / {totalWords}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="text-center text-sm text-gray-600 mt-1">
          {progressPercentage.toFixed(1)}% Complete
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-blue-600 font-semibold text-lg">
            {currentSession.accuracy.toFixed(1)}%
          </div>
          <div className="text-blue-800 text-xs font-medium">Accuracy</div>
        </div>

        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-green-600 font-semibold text-lg">
            {currentSession.wordsPerMinute.toFixed(0)}
          </div>
          <div className="text-green-800 text-xs font-medium">Words/Min</div>
        </div>

        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-purple-600 font-semibold text-lg">
            {currentWordIndex}
          </div>
          <div className="text-purple-800 text-xs font-medium">Current</div>
        </div>

        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-orange-600 font-semibold text-lg">
            {totalWords - currentWordIndex}
          </div>
          <div className="text-orange-800 text-xs font-medium">Remaining</div>
        </div>
      </div>

      {/* Achievement Badges */}
      {currentSession.accuracy >= 90 && currentWordIndex > 10 && (
        <div className="mt-4 flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <TrophyIcon className="h-5 w-5 text-yellow-600" />
          <span className="text-yellow-800 text-sm font-medium">
            Excellent Accuracy! Keep it up! 🎉
          </span>
        </div>
      )}

      {currentSession.wordsPerMinute > 60 && currentWordIndex > 20 && (
        <div className="mt-2 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <TrophyIcon className="h-5 w-5 text-green-600" />
          <span className="text-green-800 text-sm font-medium">
            Great Reading Speed! 🚀
          </span>
        </div>
      )}

      {/* Difficulty Indicator */}
      {currentSession.difficulty && (
        <div className="mt-4 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Difficulty:{" "}
            {currentSession.difficulty.charAt(0).toUpperCase() +
              currentSession.difficulty.slice(1)}
          </span>
        </div>
      )}
    </div>
  );
};
