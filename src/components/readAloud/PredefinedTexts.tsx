import React from "react";
import { PredefinedText } from "../../types/readAloud";

interface PredefinedTextsProps {
  onTextSelect: (text: string) => void;
}

const PREDEFINED_TEXTS: PredefinedText[] = [
  {
    id: "1",
    title: "The Rainbow",
    content:
      "The rainbow is a beautiful sight that appears in the sky after rain. It has seven colors: red, orange, yellow, green, blue, indigo, and violet. Children love to look for rainbows in the sky.",
    difficulty: "easy",
    category: "Nature",
    estimatedTime: 2,
    wordCount: 38,
  },
  {
    id: "2",
    title: "The Solar System",
    content:
      "Our solar system consists of the Sun and eight planets. Mercury is the closest planet to the Sun, while Neptune is the farthest. Earth is the third planet from the Sun and the only known planet with life.",
    difficulty: "easy",
    category: "Science",
    estimatedTime: 3,
    wordCount: 45,
  },
  {
    id: "3",
    title: "The Library Adventure",
    content:
      "Emma walked through the tall wooden doors of the ancient library. The musty smell of old books filled her nostrils as she gazed at the towering shelves that reached toward the vaulted ceiling. Somewhere among these thousands of volumes lay the answer to her mysterious question.",
    difficulty: "medium",
    category: "Fiction",
    estimatedTime: 4,
    wordCount: 52,
  },
  {
    id: "4",
    title: "Photosynthesis Process",
    content:
      "Photosynthesis is the fundamental biological process by which green plants and certain bacteria convert light energy, typically from the sun, into chemical energy stored in glucose molecules. This process involves the absorption of carbon dioxide from the atmosphere and water from the soil, utilizing chlorophyll as the primary catalyst.",
    difficulty: "hard",
    category: "Science",
    estimatedTime: 5,
    wordCount: 58,
  },
  {
    id: "5",
    title: "The Butterfly Garden",
    content:
      "In the corner of the school yard, Mrs. Johnson created a special butterfly garden. She planted colorful flowers like marigolds, zinnias, and sunflowers. Soon, butterflies began to visit the garden every day.",
    difficulty: "easy",
    category: "Nature",
    estimatedTime: 3,
    wordCount: 41,
  },
  {
    id: "6",
    title: "The Innovation Revolution",
    content:
      "The technological revolution has fundamentally transformed contemporary society, introducing unprecedented innovations that have revolutionized communication methodologies, enhanced educational accessibility, and streamlined commercial transactions through sophisticated digital platforms and artificial intelligence algorithms.",
    difficulty: "hard",
    category: "Technology",
    estimatedTime: 6,
    wordCount: 34,
  },
  {
    id: "7",
    title: "Making Pancakes",
    content:
      "To make delicious pancakes, you need flour, eggs, milk, and a little sugar. Mix all ingredients in a bowl until smooth. Heat a pan and pour the batter. Cook until bubbles form, then flip and cook the other side.",
    difficulty: "medium",
    category: "Cooking",
    estimatedTime: 3,
    wordCount: 45,
  },
  {
    id: "8",
    title: "The Ocean Depths",
    content:
      "The ocean is home to many amazing creatures. Dolphins swim gracefully through the water, while colorful fish dart between coral reefs. Deep below, whales sing their ancient songs.",
    difficulty: "easy",
    category: "Nature",
    estimatedTime: 2,
    wordCount: 36,
  },
];

export const PredefinedTexts: React.FC<PredefinedTextsProps> = ({
  onTextSelect,
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Nature":
        return "🌿";
      case "Science":
        return "🔬";
      case "Fiction":
        return "📚";
      case "Technology":
        return "💻";
      case "Cooking":
        return "🍳";
      default:
        return "📖";
    }
  };

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {PREDEFINED_TEXTS.map((text) => (
        <div
          key={text.id}
          className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
          onClick={() => onTextSelect(text.content)}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getCategoryIcon(text.category)}</span>
              <h3 className="font-semibold text-gray-900">{text.title}</h3>
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(
                text.difficulty
              )}`}
            >
              {text.difficulty}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {text.content}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>{text.category}</span>
              <span>{text.wordCount} words</span>
              <span>~{text.estimatedTime} min</span>
            </div>
            <button className="text-blue-600 hover:text-blue-800 font-medium">
              Select →
            </button>
          </div>
        </div>
      ))}

      {/* Add More Texts Button */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <div className="text-gray-400 mb-2">
          <svg
            className="mx-auto h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <p className="text-gray-600 text-sm">
          Want more practice texts?
          <br />
          Use the custom text input on the right!
        </p>
      </div>
    </div>
  );
};
