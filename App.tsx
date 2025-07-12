import React, { useState, useCallback, ReactNode } from "react";
import { GameState, Scenario, Category, Question } from "./types";
import { SCENARIO_CATEGORIES } from "./constants";
import {
  generateInitialScenario,
  generateNextQuestion,
} from "./services/geminiService";
import { Header } from "./components/Header";
import { LoadingSpinner } from "./components/LoadingSpinner";
import "./styles.css";

// Sub-components defined within App.tsx to keep file count low.

interface WelcomeScreenProps {
  onStart: () => void;
}
const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => (
  <div className="hero-section fade-in max-w-4xl mx-auto">
    <div className="mb-12">
      <h1 className="hero-title mb-6">Welcome to NEMA PrepZone!</h1>
      <p className="hero-subtitle mb-8">
        Master disaster preparedness through AI-powered scenarios. Every
        decision shapes your safety knowledge.
      </p>
      <div className="flex flex-wrap justify-center gap-4 mb-12 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span>Real-world scenarios</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          <span>AI-generated challenges</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
          <span>Expert guidance</span>
        </div>
      </div>
    </div>

    <div className="glass-card p-8 slide-up">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">
        Ready to Begin Your Training?
      </h2>
      <p className="text-gray-300 text-center mb-6">
        Choose from emergency scenarios designed to test and improve your
        disaster preparedness skills.
      </p>
      <div className="text-center">
        <button onClick={onStart} className="btn-primary">
          🚨 Start Emergency Training
        </button>
      </div>
    </div>
  </div>
);

interface CategorySelectionScreenProps {
  onSelect: (category: Category) => void;
  onBack: () => void;
}
const CategorySelectionScreen: React.FC<CategorySelectionScreenProps> = ({
  onSelect,
  onBack,
}) => {
  const categoryIcons = {
    "Urban Fire Safety": "🔥",
    "Flood Response": "🌊",
    "Road Traffic Accident": "🚗",
    "Marketplace Stampede": "👥",
  };

  return (
    <div className="w-full max-w-6xl mx-auto fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gradient mb-4">
          Choose Your Emergency Scenario
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Select a critical situation to test your emergency response skills.
          Each scenario is powered by AI to provide realistic challenges.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {SCENARIO_CATEGORIES.map((cat, index) => (
          <div
            key={cat.id}
            onClick={() => onSelect(cat)}
            className="category-card slide-in-left"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="category-icon">
              {categoryIcons[cat.title as keyof typeof categoryIcons] || "⚠️"}
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{cat.title}</h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              {cat.description}
            </p>
            <div className="flex items-center text-teal-400 font-medium">
              <span>Start Training</span>
              <svg
                className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button onClick={onBack} className="btn-secondary">
          ← Back to Welcome
        </button>
      </div>
    </div>
  );
};

interface MissionBriefingScreenProps {
  scenario: Scenario;
  categoryTitle: string;
  onStartMission: () => void;
}
const MissionBriefingScreen: React.FC<MissionBriefingScreenProps> = ({
  scenario,
  categoryTitle,
  onStartMission,
}) => (
  <div className="w-full max-w-6xl mx-auto fade-in">
    <div className="text-center mb-8">
      <h2 className="text-4xl font-bold text-gradient mb-2">
        Mission Briefing
      </h2>
      <h3 className="text-2xl font-semibold text-teal-400 mb-4">
        {categoryTitle}
      </h3>
      <div className="flex items-center justify-center gap-2 text-gray-400">
        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
        <span>Emergency Scenario Active</span>
      </div>
    </div>

    <div className="grid lg:grid-cols-2 gap-8 items-center">
      <div className="mission-image slide-up">
        <img
          src={`data:image/jpeg;base64,${scenario.imageB64}`}
          alt="Mission Briefing"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="glass-card p-8 slide-in-left">
        <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-3 h-3 bg-orange-400 rounded-full"></span>
          Situation Overview
        </h4>
        <p className="text-lg text-gray-200 mb-8 leading-relaxed">
          {scenario.briefing}
        </p>

        <div className="border-t border-gray-600 pt-6">
          <div className="flex items-center gap-4 mb-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>AI-Generated</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>Interactive</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              <span>Educational</span>
            </div>
          </div>

          <button onClick={onStartMission} className="btn-primary w-full">
            🎯 Begin Emergency Response
          </button>
        </div>
      </div>
    </div>
  </div>
);

interface GameScreenProps {
  scenario: Scenario;
  categoryTitle: string;
  onNextQuestion: (context: string) => void;
  onEndGame: () => void;
}
const GameScreen: React.FC<GameScreenProps> = ({
  scenario,
  categoryTitle,
  onNextQuestion,
  onEndGame,
}) => {
  const [userChoice, setUserChoice] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isLoadingNext, setIsLoadingNext] = useState<boolean>(false);

  const { questionData } = scenario;
  const isCorrect = userChoice === questionData.correctChoiceIndex;

  const handleAnswerClick = (index: number) => {
    if (showFeedback) return;
    setUserChoice(index);
    setShowFeedback(true);
  };

  const handleNext = async () => {
    if (userChoice === null) return;
    setIsLoadingNext(true);
    const context = `Previous question: "${questionData.question}". My choice was: "${questionData.choices[userChoice]}". This was ${isCorrect ? "correct" : "incorrect"}. The feedback I received was: "${questionData.feedback[userChoice]}".`;
    await onNextQuestion(context);
    setUserChoice(null);
    setShowFeedback(false);
    setIsLoadingNext(false);
  };

  const getButtonClass = (index: number) => {
    if (!showFeedback) {
      return "answer-btn";
    }
    if (index === questionData.correctChoiceIndex) {
      return "answer-btn correct";
    }
    if (index === userChoice) {
      return "answer-btn incorrect";
    }
    return "answer-btn disabled";
  };

  return (
    <div className="w-full max-w-6xl mx-auto fade-in">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold text-gradient mb-2">
          {categoryTitle}
        </h2>
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          <span>Emergency Response in Progress</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mission-image mb-6 slide-up">
            <img
              src={`data:image/jpeg;base64,${scenario.imageB64}`}
              alt="Scenario"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="glass-card p-6 slide-in-left">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></span>
              Critical Decision Required
            </h3>
            <p className="text-lg text-gray-200 leading-relaxed">
              {questionData.question}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {questionData.choices.map((choice, index) => (
              <button
                key={index}
                disabled={showFeedback}
                onClick={() => handleAnswerClick(index)}
                className={getButtonClass(index)}
              >
                <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-600 rounded-full text-white font-bold mr-3 text-sm">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{choice}</span>
              </button>
            ))}
          </div>

          {showFeedback && userChoice !== null && (
            <div
              className={`feedback-card ${isCorrect ? "feedback-correct" : "feedback-incorrect"} fade-in`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCorrect ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  <span className="text-white text-lg">
                    {isCorrect ? "✓" : "✗"}
                  </span>
                </div>
                <h4 className="font-bold text-lg">
                  {isCorrect ? "Excellent Decision!" : "Let's Learn from This"}
                </h4>
              </div>
              <p className="text-gray-200 mb-4 leading-relaxed">
                {questionData.feedback[userChoice]}
              </p>
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={isLoadingNext}
                  className="btn-primary flex items-center gap-2"
                >
                  {isLoadingNext ? (
                    <>
                      <div className="loading-spinner w-4 h-4"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <span>Next Challenge</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => {
            console.log("End Mission button clicked");
            onEndGame();
          }}
          className="btn-secondary"
          style={{ pointerEvents: "auto", position: "relative", zIndex: 10 }}
        >
          🚪 End Mission & Return to Safety
        </button>
      </div>
    </div>
  );
};

interface LoadingScreenProps {
  message: string;
}
const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => (
  <div className="loading-container fade-in">
    <div className="glass-card p-12 text-center">
      <div className="loading-spinner mx-auto mb-6"></div>
      <h3 className="text-2xl font-bold text-white mb-4">
        Preparing Your Mission
      </h3>
      <p className="text-lg text-gray-300 mb-6">{message}</p>
      <div className="flex justify-center gap-2">
        <div
          className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  </div>
);

interface ErrorScreenProps {
  message: string;
  onRetry: () => void;
}
const ErrorScreen: React.FC<ErrorScreenProps> = ({ message, onRetry }) => (
  <div className="glass-card p-8 text-center border-2 border-red-500 fade-in">
    <div className="mb-6">
      <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">⚠️</span>
      </div>
      <h2 className="text-3xl font-bold text-red-400 mb-4">
        Mission Interrupted
      </h2>
      <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto">{message}</p>
    </div>

    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button onClick={onRetry} className="btn-primary">
        🔄 Retry Mission
      </button>
      <button onClick={onRetry} className="btn-secondary">
        🏠 Return to Safety
      </button>
    </div>
  </div>
);

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.WELCOME);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => setGameState(GameState.CATEGORY_SELECTION);

  const handleGoHome = () => {
    console.log("handleGoHome called - returning to welcome screen");
    setGameState(GameState.WELCOME);
    setCurrentScenario(null);
    setSelectedCategory(null);
    setError(null);
  };

  const handleSelectCategory = useCallback(async (category: Category) => {
    setSelectedCategory(category);
    setGameState(GameState.LOADING);
    setLoadingMessage("Generating your mission...");
    setError(null);
    try {
      const scenario = await generateInitialScenario(
        category.title,
        category.promptDetail,
      );
      setCurrentScenario(scenario);
      setGameState(GameState.MISSION_BRIEFING);
    } catch (e) {
      const err = e as Error;
      setError(
        err.message || "An unknown error occurred while creating the scenario.",
      );
      setGameState(GameState.ERROR);
    }
  }, []);

  const handleStartMission = () => {
    setGameState(GameState.GAME);
  };

  const handleNextQuestion = useCallback(
    async (context: string) => {
      if (!selectedCategory) return;
      try {
        const nextQuestionData = await generateNextQuestion(
          selectedCategory.title,
          context,
        );
        setCurrentScenario((prev) => {
          if (!prev) return null;
          return { ...prev, questionData: nextQuestionData };
        });
      } catch (e) {
        const err = e as Error;
        setError(err.message || "Failed to load the next question.");
        setGameState(GameState.ERROR);
      }
    },
    [selectedCategory],
  );

  const renderContent = (): ReactNode => {
    switch (gameState) {
      case GameState.WELCOME:
        return <WelcomeScreen onStart={handleStart} />;
      case GameState.CATEGORY_SELECTION:
        return (
          <CategorySelectionScreen
            onSelect={handleSelectCategory}
            onBack={handleGoHome}
          />
        );
      case GameState.LOADING:
        return <LoadingScreen message={loadingMessage} />;
      case GameState.MISSION_BRIEFING:
        if (currentScenario && selectedCategory) {
          return (
            <MissionBriefingScreen
              scenario={currentScenario}
              categoryTitle={selectedCategory.title}
              onStartMission={handleStartMission}
            />
          );
        }
        return (
          <ErrorScreen
            message="Briefing data is missing."
            onRetry={handleGoHome}
          />
        );
      case GameState.GAME:
        if (currentScenario && selectedCategory) {
          return (
            <GameScreen
              scenario={currentScenario}
              categoryTitle={selectedCategory.title}
              onNextQuestion={handleNextQuestion}
              onEndGame={handleGoHome}
            />
          );
        }
        return (
          <ErrorScreen
            message="Scenario data is missing."
            onRetry={handleGoHome}
          />
        );
      case GameState.ERROR:
        return (
          <ErrorScreen
            message={error || "An unknown error occurred."}
            onRetry={handleGoHome}
          />
        );
      default:
        return <WelcomeScreen onStart={handleStart} />;
    }
  };

  return (
    <div className="min-h-screen animated-bg text-gray-100 font-sans">
      <Header />
      <main
        className="max-width-container container-padding flex items-center justify-center"
        style={{ minHeight: "calc(100vh - 120px)" }}
      >
        {renderContent()}
      </main>
    </div>
  );
}
