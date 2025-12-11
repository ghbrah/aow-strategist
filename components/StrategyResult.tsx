// src/components/StrategyResult.tsx
import React from 'react';
import { StrategyAdvice } from '../types';
import { X } from 'lucide-react';

interface StrategyResultProps {
  advice: StrategyAdvice;
  onReset: () => void;
}

const StrategyResult: React.FC<StrategyResultProps> = ({ advice, onReset }) => {
  return (
    <div className="w-full max-w-3xl mx-auto mt-8 p-6 bg-white dark:bg-jade-900 rounded-lg shadow-lg flex flex-col gap-6 transition-all">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-semibold serif-title text-jade-900 dark:text-jade-100">
          {advice.title}
        </h2>
        <button
          onClick={onReset}
          className="text-jade-500 dark:text-jade-400 hover:text-imperial-700 dark:hover:text-imperial-500 transition-colors"
          aria-label="Reset"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {advice.originalQuote && (
        <blockquote className="border-l-4 border-imperial-600 dark:border-imperial-500 pl-4 italic text-jade-800 dark:text-jade-200">
          {advice.originalQuote}
        </blockquote>
      )}

      {advice.interpretation && (
        <section>
          <h3 className="text-xl font-semibold text-jade-900 dark:text-jade-100 mb-2">Interpretation</h3>
          <p className="text-jade-800 dark:text-jade-200 whitespace-pre-line">{advice.interpretation}</p>
        </section>
      )}

      {advice.actionableAdvice && advice.actionableAdvice.length > 0 && (
        <section>
          <h3 className="text-xl font-semibold text-jade-900 dark:text-jade-100 mb-2">Actionable Advice</h3>
          <ul className="list-disc list-inside space-y-1 text-jade-800 dark:text-jade-200">
            {advice.actionableAdvice.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {advice.chineseCharacter && (
        <section>
          <h3 className="text-xl font-semibold text-jade-900 dark:text-jade-100 mb-2">Key Character</h3>
          <div className="flex items-center gap-4">
            <span className="text-4xl">{advice.chineseCharacter}</span>
            {advice.characterExplanation && (
              <p className="text-jade-800 dark:text-jade-200">{advice.characterExplanation}</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default StrategyResult;
