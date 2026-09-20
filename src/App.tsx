import { useState, useEffect, useMemo } from 'react';
import { mockQuestions } from './data/questions';
import { OptionKey, UserAnswer } from './types';
import { Header } from './components/Header';
import { QuestionCard } from './components/QuestionCard';
import { QuizResults } from './components/QuizResults';
import { LayoutGrid, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';

const STORAGE_KEY = 'fpsc_mock_test_1_state';

export default function App() {
  const totalQuestions = mockQuestions.length;

  // Initialize state with localStorage if available
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return typeof parsed.currentIndex === 'number' ? parsed.currentIndex : 0;
      }
    } catch {
      // Ignore fallback
    }
    return 0;
  });

  const [answers, setAnswers] = useState<Record<number, UserAnswer>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.answers || {};
      }
    } catch {
      // Ignore fallback
    }
    return {};
  });

  const [isCompleted, setIsCompleted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Boolean(parsed.isCompleted);
      }
    } catch {
      // Ignore fallback
    }
    return false;
  });

  const [showQuestionPalette, setShowQuestionPalette] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ currentIndex, answers, isCompleted })
      );
    } catch {
      // Ignore storage errors
    }
  }, [currentIndex, answers, isCompleted]);

  // Derived score
  const score = useMemo(() => {
    return Object.values(answers).filter((ans) => ans.isCorrect).length;
  }, [answers]);

  const currentQuestion = mockQuestions[currentIndex];
  const currentAnswer = answers[currentQuestion?.id];

  const handleSelectOption = (optionKey: OptionKey) => {
    if (currentAnswer) return; // Prevent changing after marked

    const isCorrect = optionKey === currentQuestion.correctAnswer;
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOption: optionKey,
      isCorrect,
    };

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: newAnswer,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsCompleted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRestart = () => {
    if (window.confirm('Are you sure you want to restart the mock exam? Your answers will be cleared.')) {
      setAnswers({});
      setCurrentIndex(0);
      setIsCompleted(false);
      localStorage.removeItem(STORAGE_KEY);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Keyboard navigation for power users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompleted) return;

      const key = e.key.toUpperCase();
      if (!currentAnswer && (key === 'A' || key === 'B' || key === 'C' || key === 'D')) {
        handleSelectOption(key as OptionKey);
      } else if (currentAnswer && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentAnswer, isCompleted, currentIndex]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* Top Navigation & Progress Header */}
      <Header
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        score={score}
        onReset={handleRestart}
        isCompleted={isCompleted}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 flex flex-col">
        {!isCompleted ? (
          <div className="space-y-6 flex-1 flex flex-col">
            {/* Action Bar / Navigation Controls */}
            <div className="flex items-center justify-between gap-2">
              <button
                id="prev-question-btn"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {/* Question Palette Toggle Button */}
              <button
                id="toggle-palette-btn"
                onClick={() => setShowQuestionPalette((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                  showQuestionPalette
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Questions ({Object.keys(answers).length}/100)</span>
              </button>

              <button
                id="skip-or-next-top-btn"
                onClick={handleNext}
                disabled={!currentAnswer && currentIndex === totalQuestions - 1}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
              >
                <span>{currentIndex === totalQuestions - 1 ? 'Finish' : 'Next'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Expandable Question Grid Palette */}
            {showQuestionPalette && (
              <div
                id="question-palette-panel"
                className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="flex items-center justify-between mb-3 text-xs text-slate-600">
                  <div className="font-semibold text-slate-900">Question Matrix</div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Correct
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Wrong
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block" /> Unanswered
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-20 gap-1.5 max-h-56 overflow-y-auto p-1">
                  {mockQuestions.map((q, idx) => {
                    const ans = answers[q.id];
                    const isCurrent = idx === currentIndex;
                    let cellColor = 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200';

                    if (ans) {
                      cellColor = ans.isCorrect
                        ? 'bg-emerald-500 text-white border-emerald-600 font-semibold'
                        : 'bg-rose-500 text-white border-rose-600 font-semibold';
                    }

                    return (
                      <button
                        key={q.id}
                        id={`palette-btn-q${q.id}`}
                        onClick={() => {
                          setCurrentIndex(idx);
                          setShowQuestionPalette(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-7 h-7 text-xs rounded-lg border flex items-center justify-center transition-all ${cellColor} ${
                          isCurrent ? 'ring-2 ring-blue-500 ring-offset-1 font-bold' : ''
                        }`}
                        title={`Question ${q.id}${ans ? (ans.isCorrect ? ' (Correct)' : ' (Wrong)') : ''}`}
                      >
                        {q.id}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Active Question Card */}
            <QuestionCard
              question={currentQuestion}
              questionIndex={currentIndex}
              totalQuestions={totalQuestions}
              currentAnswer={currentAnswer}
              onSelectOption={handleSelectOption}
              onNext={handleNext}
              isLastQuestion={currentIndex === totalQuestions - 1}
            />

            {/* Live Progress Summary Footer */}
            <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3 border border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2 mt-auto">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Correct: {score}
                </span>
                <span className="flex items-center gap-1.5 text-rose-700 font-medium">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  Wrong: {Object.values(answers).filter((a) => !a.isCorrect).length}
                </span>
                <span className="text-slate-400">
                  Remaining: {totalQuestions - Object.keys(answers).length}
                </span>
              </div>
              <div className="text-slate-400">
                Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-700 font-mono">A</kbd> <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-700 font-mono">B</kbd> <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-700 font-mono">C</kbd> <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-700 font-mono">D</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-700 font-mono">Enter</kbd>
              </div>
            </div>
          </div>
        ) : (
          <QuizResults
            score={score}
            totalQuestions={totalQuestions}
            questions={mockQuestions}
            answers={answers}
            onRestart={handleRestart}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500">
        FPSC Medical Officer - Mock Exam 1 • Medicoz Republic QBANK Preparation Suite
      </footer>
    </div>
  );
}
