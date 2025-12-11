// src/components/StrategyResult.tsx
import React from 'react';
import { StrategyAdvice } from '../types';

interface StrategyResultProps {
  advice: StrategyAdvice;
  onReset: () => void;
}

const StrategyResult: React.FC<StrategyResultProps> = ({ advice, onReset }) => {
  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white dark:bg-jade-900 border border-jade-200 dark:border-jade-800 rounded-lg shadow-lg animate-fade-in-up">
      <h2 className="text-2xl md:text-3xl font-serif text-imperial-700 dark:text-imperial-500 mb-4">
        {advice.title}
      </h2>

      <p className="italic text-jade-600 dark:text-jade-400 mb-4">
        "{advice.originalQuote}"
      </p>

      <div className="text-jade-800 dark:text-jade-100 space-y-4 mb-6">
        <p>{advice.interpretation}</p>
      </div>

      {advice.actionableAdvice?.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-imperial-700 dark:text-imperial-400 mb-2">
            Actionable Steps:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-jade-800 dark:text-jade-100">
            {advice.actionableAdvice.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </div>
      )}

      {advice.chineseCharacter && (
        <div className="mb-6 flex items-center gap-4">
          <span className="text-4xl md:text-5xl font-serif">{advice.chineseCharacter}</span>
          {advice.characterExplanation && (
            <p className="text-jade-700 dark:text-jade-300">{advice.characterExplanation}</p>
          )}
        </div>
      )}

      <button
        onClick={onReset}
        className="mt-4 px-6 py-2 bg-imperial-700 hover:bg-imperial-800 dark:bg-imperial-600 dark:hover:bg-imperial-500 text-white rounded shadow"
      >
        Ask Another Question
      </button>
    </div>
  );
};

export default StrategyResult;
