import React from "react";
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { ReadingPracticeSettings } from "../../types/readAloud";

interface ReadingPracticeSettingsProps {
  settings: ReadingPracticeSettings;
  onSettingsChange: (settings: ReadingPracticeSettings) => void;
  onClose: () => void;
}

export const ReadingPracticeSettingsComponent: React.FC<
  ReadingPracticeSettingsProps
> = ({ settings, onSettingsChange, onClose }) => {
  const handleSettingChange = (
    key: keyof ReadingPracticeSettings,
    value: any
  ) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <AdjustmentsHorizontalIcon className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Practice Settings
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Speech Speed */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Speech Speed: {settings.speed}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={settings.speed}
            onChange={(e) =>
              handleSettingChange("speed", parseFloat(e.target.value))
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Slow (0.5x)</span>
            <span>Normal (1x)</span>
            <span>Fast (2x)</span>
          </div>
        </div>

        {/* Minimum Confidence */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pronunciation Accuracy Threshold:{" "}
            {(settings.minimumConfidence * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            min="0.5"
            max="0.95"
            step="0.05"
            value={settings.minimumConfidence}
            onChange={(e) =>
              handleSettingChange(
                "minimumConfidence",
                parseFloat(e.target.value)
              )
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Lenient (50%)</span>
            <span>Moderate (75%)</span>
            <span>Strict (95%)</span>
          </div>
        </div>

        {/* Toggle Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Auto-Correct
              </label>
              <p className="text-xs text-gray-500">
                Play correct pronunciation on mistakes
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoCorrect}
                onChange={(e) =>
                  handleSettingChange("autoCorrect", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Strict Mode
              </label>
              <p className="text-xs text-gray-500">
                Require exact pronunciation match
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.strictMode}
                onChange={(e) =>
                  handleSettingChange("strictMode", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Show Phonetics
              </label>
              <p className="text-xs text-gray-500">
                Display phonetic spelling hints
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showPhonetics}
                onChange={(e) =>
                  handleSettingChange("showPhonetics", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Highlight Errors
              </label>
              <p className="text-xs text-gray-500">
                Highlight mispronounced words in red
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.highlightErrors}
                onChange={(e) =>
                  handleSettingChange("highlightErrors", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Pause on Error
              </label>
              <p className="text-xs text-gray-500">
                Pause session when pronunciation is incorrect
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.pauseOnError}
                onChange={(e) =>
                  handleSettingChange("pauseOnError", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Preset Configurations */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Quick Presets
          </h4>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() =>
                onSettingsChange({
                  speed: 0.8,
                  autoCorrect: true,
                  strictMode: false,
                  showPhonetics: true,
                  highlightErrors: true,
                  pauseOnError: false,
                  minimumConfidence: 0.6,
                })
              }
              className="p-2 text-xs bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              Beginner
            </button>
            <button
              onClick={() =>
                onSettingsChange({
                  speed: 1.0,
                  autoCorrect: true,
                  strictMode: false,
                  showPhonetics: false,
                  highlightErrors: true,
                  pauseOnError: false,
                  minimumConfidence: 0.75,
                })
              }
              className="p-2 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Intermediate
            </button>
            <button
              onClick={() =>
                onSettingsChange({
                  speed: 1.2,
                  autoCorrect: false,
                  strictMode: true,
                  showPhonetics: false,
                  highlightErrors: true,
                  pauseOnError: true,
                  minimumConfidence: 0.9,
                })
              }
              className="p-2 text-xs bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            >
              Advanced
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
