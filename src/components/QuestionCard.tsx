import React from 'react';
import { OptionKey, Question, UserAnswer } from '../types';
import { CheckCircle2, XCircle, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  currentAnswer?: UserAnswer;
  onSelectOption: (optionKey: OptionKey) => void;
  onNext: () => void;
  isLastQuestion: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  currentAnswer,
  onSelectOption,
  onNext,
  isLastQuestion,
}) => {
  const isAnswered = !!currentAnswer;
  const isCorrect = currentAnswer?.isCorrect;

  return (
    <div id={`question-card-${question.id}`} className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Card Top Sub-Header */}
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
            Question {questionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            FPSC Medical Officer Exam
          </span>
        </div>

        <div className="p-6 sm:p-8">
          {/* Question Text */}
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 leading-relaxed mb-6">
            {question.question}
          </h2>

          {/* Options Grid */}
          <div className="space-y-3 mb-6" role="radiogroup" aria-label={`Options for Question ${question.id}`}>
            {question.options.map((option) => {
              const isSelected = currentAnswer?.selectedOption === option.key;
              const isOptionCorrect = option.key === question.correctAnswer;

              let cardStyles =
                'border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-slate-800 bg-white';
              let badgeStyles = 'bg-slate-100 text-slate-700 border-slate-200';

              if (isAnswered) {
                if (isSelected && isOptionCorrect) {
                  // User chose correct
                  cardStyles = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-500';
                  badgeStyles = 'bg-emerald-600 text-white border-emerald-600';
                } else if (isSelected && !isOptionCorrect) {
                  // User chose wrong
                  cardStyles = 'border-rose-400 bg-rose-50/70 text-rose-950 ring-1 ring-rose-400';
                  badgeStyles = 'bg-rose-600 text-white border-rose-600';
                } else if (isOptionCorrect) {
                  // The actual correct answer when user was wrong
                  cardStyles = 'border-emerald-400 bg-emerald-50/40 text-emerald-900 border-dashed';
                  badgeStyles = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                } else {
                  // Other unselected options
                  cardStyles = 'border-slate-200 bg-slate-50/50 text-slate-400 opacity-60';
                  badgeStyles = 'bg-slate-100 text-slate-400 border-slate-200';
                }
              }

              return (
                <button
                  key={option.key}
                  id={`q${question.id}-option-${option.key}`}
                  disabled={isAnswered}
                  onClick={() => onSelectOption(option.key)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-start gap-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${cardStyles}`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg border text-sm font-semibold flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${badgeStyles}`}
                  >
                    {isAnswered && isSelected && isOptionCorrect ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : isAnswered && isSelected && !isOptionCorrect ? (
                      <XCircle className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      option.key
                    )}
                  </span>
                  <div className="flex-1 text-sm sm:text-base font-medium leading-normal pt-0.5">
                    {option.text}
                  </div>
                  {isAnswered && isOptionCorrect && !isSelected && (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex-shrink-0">
                      Correct Answer
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Move Ahead Section */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="pt-2 border-t border-slate-100 space-y-4"
              >
                {/* Result Notification Banner */}
                <div
                  id={`answer-feedback-${question.id}`}
                  className={`p-4 rounded-xl border flex items-start gap-3 ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold">
                        {isCorrect ? 'Correct!' : 'Wrong!'}
                      </span>
                      {!isCorrect && (
                        <span className="text-xs font-medium text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                          Correct: Option {question.correctAnswer}
                        </span>
                      )}
                    </div>
                    {question.rationale && (
                      <p className="text-sm mt-1.5 leading-relaxed text-slate-700">
                        <span className="font-semibold text-slate-900">Rationale: </span>
                        {question.rationale}
                      </p>
                    )}
                  </div>
                </div>

                {/* Move to next question button */}
                <div className="flex justify-end pt-2">
                  <button
                    id="next-question-btn"
                    onClick={onNext}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm sm:text-base rounded-xl shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <span>{isLastQuestion ? 'Finish Exam & View Score' : 'Next Question'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isAnswered && (
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
              <AlertCircle className="w-4 h-4 text-slate-400" />
              <span>Select an option to mark your answer and see instant evaluation.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
