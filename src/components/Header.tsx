import React from 'react';
import { Award, BookOpen, RotateCcw } from 'lucide-react';

interface HeaderProps {
  currentIndex: number;
  totalQuestions: number;
  score: number;
  onReset: () => void;
  isCompleted: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentIndex,
  totalQuestions,
  score,
  onReset,
  isCompleted,
}) => {
  const progressPercent = Math.round(((currentIndex + (isCompleted ? 1 : 0)) / totalQuestions) * 100);

  return (
    <header id="quiz-header" className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/medicoz-logo.jpg"
              alt="Medicoz Republic Logo"
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-xl object-contain bg-black border border-slate-700 shadow-sm flex-shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  FPSC Medical Officer
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-medium">
                  Mock Exam 1
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Medicoz Republic QBANK • 100 MCQs
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <Award className="w-4 h-4 text-amber-400" />
              <div className="text-xs">
                <span className="text-slate-400">Score: </span>
                <span className="font-bold text-white text-sm">{score}</span>
                <span className="text-slate-400 text-xs"> / {totalQuestions}</span>
              </div>
            </div>

            <button
              id="header-restart-btn"
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
              title="Restart Quiz"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restart</span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {!isCompleted && (
          <div className="mt-3">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span>Question {currentIndex + 1} of {totalQuestions}</span>
              <span>{progressPercent}% completed</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(1, progressPercent))}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
