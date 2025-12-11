// src/components/StrategyResult.tsx
import React from 'react';
import { StrategyAdvice } from '../types';

interface StrategyResultProps {
  advice: StrategyAdvice;
  onReset: () => void;
}

const StrategyResult: React.FC<StrategyResultProps> = ({ advice, onReset }) => {
  return (
    <div className="max-w-3xl w-full mx-auto mt-6 p-6 bg-white dark:bg-jade-900 rounded-lg shadow-lg overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold serif-title">{advice.title}</h2>
        <button
          onClick={onReset}
          className="py-1 px-3 bg-imperial-700 hover:bg-imperial-800 text-white rounded text-sm"
        >
          Reset
        </button>
      </div>

      <p className="italic mb-4">{advice.originalQuote}</p>

      <div className="mb-4 whitespace-pre-wrap">{advice.interpretation}</div>

      {advice.actionableAdvice && advice.actionableAdvice.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Actionable Advice:</h3>
          <ul className="list-disc list-inside space-y-1">
            {advice.actionableAdvice.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {advice.chineseCharacter && (
        <div className="mb-2">
          <span className="text-3xl font-bold">{advice.chineseCharacter}</span>
          {advice.characterExplanation && (
            <p className="inline ml-2">{advice.characterExplanation}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StrategyResult;
