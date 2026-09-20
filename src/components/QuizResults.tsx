import React, { useState } from 'react';
import { Question, UserAnswer } from '../types';
import { Trophy, CheckCircle2, XCircle, RotateCcw, Filter, ChevronDown, ChevronUp } from 'lucide-react';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  questions: Question[];
  answers: Record<number, UserAnswer>;
  onRestart: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  score,
  totalQuestions,
  questions,
  answers,
  onRestart,
}) => {
  const [filter, setFilter] = useState<'all' | 'wrong' | 'correct'>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null);

  const percentage = Math.round((score / totalQuestions) * 100);
  const wrongCount = totalQuestions - score;

  const filteredQuestions = questions.filter((q) => {
    const answer = answers[q.id];
    if (filter === 'correct') return answer?.isCorrect;
    if (filter === 'wrong') return !answer?.isCorrect;
    return true;
  });

  const getGradeText = () => {
    if (percentage >= 80) return { title: 'Excellent Performance!', subtitle: 'You have demonstrated superior knowledge for the FPSC Medical Officer test.' };
    if (percentage >= 60) return { title: 'Good Job - Cleared!', subtitle: 'You have cleared the qualifying threshold with solid subject mastery.' };
    if (percentage >= 50) return { title: 'Passed Benchmark', subtitle: 'You met the basic passing benchmark, but further review of high-yield topics is recommended.' };
    return { title: 'Needs More Revision', subtitle: 'Review the rationales below to strengthen your medical concepts before the actual test.' };
  };

  const grade = getGradeText();

  return (
    <div id="quiz-results-container" className="w-full max-w-4xl mx-auto space-y-8">
      {/* Score Card Banner */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm text-center relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-50 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/medicoz-logo.jpg"
              alt="Medicoz Republic"
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-2xl object-contain bg-black border border-slate-200 shadow-sm"
            />
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600">
              <Trophy className="w-8 h-8" />
            </div>
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Medicoz Republic QBANK • Exam Completed
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            {grade.title}
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            {grade.subtitle}
          </p>

          {/* Primary Score Display */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-inner mb-8">
            <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">
              Your Final Score
            </div>
            <div className="text-5xl sm:text-6xl font-black text-white tracking-tight flex items-baseline justify-center gap-2">
              <span>{score}</span>
              <span className="text-2xl sm:text-3xl text-slate-400 font-normal">/ {totalQuestions}</span>
            </div>
            <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              {percentage}% Marks Obtained
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4 text-left mb-8">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60">
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold uppercase">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Correct Answers
              </div>
              <div className="text-2xl font-bold text-emerald-950 mt-1">
                {score} <span className="text-xs font-normal text-emerald-700">/ 100</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60">
              <div className="flex items-center gap-2 text-rose-800 text-xs font-semibold uppercase">
                <XCircle className="w-4 h-4 text-rose-600" />
                Wrong Answers
              </div>
              <div className="text-2xl font-bold text-rose-950 mt-1">
                {wrongCount} <span className="text-xs font-normal text-rose-700">/ 100</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              id="retake-exam-btn"
              onClick={onRestart}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Mock Exam</span>
            </button>
          </div>
        </div>
      </div>

      {/* Question Review Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Detailed Question Review
            </h3>
            <p className="text-xs text-slate-500">
              Examine every question, your selected answer, the correct answer, and medical rationales.
            </p>
          </div>

          {/* Filter options */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
            <button
              id="filter-all-btn"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({questions.length})
            </button>
            <button
              id="filter-wrong-btn"
              onClick={() => setFilter('wrong')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                filter === 'wrong'
                  ? 'bg-rose-500 text-white shadow-xs font-semibold'
                  : 'text-rose-700 hover:text-rose-900'
              }`}
            >
              Wrong ({wrongCount})
            </button>
            <button
              id="filter-correct-btn"
              onClick={() => setFilter('correct')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                filter === 'correct'
                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                  : 'text-emerald-800 hover:text-emerald-950'
              }`}
            >
              Correct ({score})
            </button>
          </div>
        </div>

        {/* List of filtered questions */}
        <div className="divide-y divide-slate-100 mt-4">
          {filteredQuestions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No questions found under this filter.
            </div>
          ) : (
            filteredQuestions.map((q) => {
              const answer = answers[q.id];
              const isCorrect = answer?.isCorrect;
              const isExpanded = expandedQuestionId === q.id;

              return (
                <div key={q.id} className="py-4">
                  <div
                    onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                    className="flex items-start justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                          isCorrect
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {isCorrect ? '✓' : '✗'}
                      </span>
                      <div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Question {q.id}
                        </div>
                        <h4 className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                          {q.question}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                          isCorrect
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {isCorrect ? 'Correct' : 'Wrong'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="mt-4 pl-9 pr-2 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div
                          className={`p-3 rounded-lg border ${
                            isCorrect
                              ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                              : 'bg-rose-50/50 border-rose-200 text-rose-900'
                          }`}
                        >
                          <span className="font-semibold block mb-0.5">Your Choice:</span>
                          <span>
                            Option {answer?.selectedOption || 'None'}:{' '}
                            {q.options.find((o) => o.key === answer?.selectedOption)?.text}
                          </span>
                        </div>

                        <div className="p-3 rounded-lg border bg-emerald-50 border-emerald-200 text-emerald-900">
                          <span className="font-semibold block mb-0.5">Correct Answer:</span>
                          <span>
                            Option {q.correctAnswer}: {q.correctAnswerText}
                          </span>
                        </div>
                      </div>

                      {/* Rationale */}
                      <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                        <span className="font-semibold text-slate-900">Rationale: </span>
                        {q.rationale}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
