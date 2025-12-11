import React, { useState } from 'react';
import { StrategyAdvice } from '../types';
import { Quote, ShieldCheck, Feather, Languages, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface StrategyResultProps {
  advice: StrategyAdvice;
  onReset: () => void;
}

const StrategyResult: React.FC<StrategyResultProps> = ({ advice, onReset }) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = advice.actionableAdvice
      .map((step, index) => `${index + 1}. ${step}`)
      .join('\n');
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 md:mt-8 px-4 pb-20">
      <div className="bg-[#e8efe9] text-jade-900 rounded-lg shadow-2xl overflow-hidden relative animate-fade-in border border-jade-200/50">
        
        {/* Paper Texture Overlay effect */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/aged-paper.png")` }}>
        </div>

        {/* Top Banner */}
        <div className="bg-jade-900 text-imperial-400 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold serif-title uppercase tracking-wider leading-tight">
              {advice.title}
            </h2>
            <div className="h-1 w-12 bg-imperial-600 mt-2 md:mt-3"></div>
          </div>
          {advice.chineseCharacter && (
            <div className="text-5xl md:text-6xl text-jade-700/50 chinese-char font-bold select-none self-end md:self-auto leading-none">
              {advice.chineseCharacter}
            </div>
          )}
        </div>

        <div className="p-5 md:p-8 space-y-6 md:space-y-8">
          
          {/* The Quote */}
          <div className="relative pl-6 md:pl-8 border-l-4 border-imperial-700/30 italic opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
             <Quote className="absolute -left-2.5 md:-left-3 -top-2 md:-top-3 w-5 h-5 md:w-6 md:h-6 text-imperial-700 fill-current bg-[#e8efe9] p-1 rounded-full" />
            <p className="text-lg md:text-xl font-serif text-jade-900 leading-relaxed">
              "{advice.originalQuote}"
            </p>
            <p className="text-right text-xs md:text-sm text-jade-600 mt-2 font-semibold uppercase tracking-widest">
              — Sun Tzu
            </p>
          </div>

          <hr className="border-jade-300 opacity-0 animate-fade-in" style={{ animationDelay: '450ms', animationFillMode: 'both' }} />

          {/* Interpretation */}
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '550ms', animationFillMode: 'both' }}>
            <h3 className="flex items-center gap-2 text-base md:text-lg font-bold text-jade-900 uppercase tracking-wide mb-2 md:mb-3">
              <Feather className="w-4 h-4 md:w-5 md:h-5 text-imperial-700" />
              Strategic Insight
            </h3>
            <p className="text-sm md:text-base text-jade-800 leading-7 whitespace-pre-line">
              {advice.interpretation}
            </p>
          </div>

          {/* Actionable Advice */}
          <div className="bg-jade-100/30 rounded p-4 md:p-6 border border-jade-200/50 opacity-0 animate-fade-in-up" style={{ animationDelay: '700ms', animationFillMode: 'both' }}>
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="flex items-center gap-2 text-base md:text-lg font-bold text-jade-900 uppercase tracking-wide">
                <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-green-700" />
                Orders of Battle
              </h3>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-jade-600 hover:text-jade-900 transition-colors p-1.5 rounded-md hover:bg-jade-200/50 focus:outline-none focus:ring-1 focus:ring-jade-400"
                title="Copy orders to clipboard"
                aria-label="Copy advice to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-700" />
                    <span className="text-green-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <ul className="space-y-3 md:space-y-4">
              {advice.actionableAdvice.map((step, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-3 opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${850 + (index * 150)}ms`, animationFillMode: 'both' }}
                >
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-jade-800 text-imperial-400 text-xs font-bold mt-0.5 shadow-sm">
                    {index + 1}
                  </span>
                  <span className="text-sm md:text-base text-jade-900 leading-snug">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Character Explanation Toggle */}
          {advice.chineseCharacter && advice.characterExplanation && (
            <div className="flex justify-center pt-2 opacity-0 animate-fade-in" style={{ animationDelay: '1200ms', animationFillMode: 'both' }}>
              <button 
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center gap-2 text-jade-600 hover:text-imperial-700 transition-all duration-300 text-xs md:text-sm font-semibold uppercase tracking-widest py-2 px-4 border border-transparent hover:border-jade-300 rounded-full hover:bg-jade-200/50 hover:shadow-sm"
              >
                {showExplanation ? 'Hide Glyph Meaning' : 'Show Glyph Meaning'}
                {showExplanation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          )}

          {/* Character Explanation Content */}
          {showExplanation && advice.chineseCharacter && advice.characterExplanation && (
            <div className="bg-jade-900/5 rounded p-4 md:p-6 border border-jade-300/60 animate-fade-in-up origin-top">
               <h3 className="flex items-center gap-2 text-base md:text-lg font-bold text-jade-900 uppercase tracking-wide mb-2 md:mb-3">
                 <Languages className="w-4 h-4 md:w-5 md:h-5 text-jade-700" />
                 The Glyph: {advice.chineseCharacter}
               </h3>
               <p className="text-sm md:text-base text-jade-800 italic border-l-2 border-jade-400 pl-4 leading-relaxed">
                 {advice.characterExplanation}
               </p>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-jade-50 p-4 flex justify-center border-t border-jade-200">
          <button 
            onClick={onReset}
            className="text-jade-600 hover:text-jade-900 text-xs md:text-sm font-semibold uppercase tracking-wider transition-all duration-300 py-2 hover:scale-105"
          >
            Consult Another Matter
          </button>
        </div>
      </div>
    </div>
  );
};

export default StrategyResult;