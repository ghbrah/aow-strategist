// src/components/ConsultationForm.tsx
import React, { useState } from 'react';
import { SendHorizontal, Loader2 } from 'lucide-react';

interface ConsultationFormProps {
  onSubmit: (query: string, password: string) => void;
  isLoading: boolean;
}

const ConsultationForm: React.FC<ConsultationFormProps> = ({ onSubmit, isLoading }) => {
  const [query, setQuery] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && password.trim()) {
      onSubmit(query, password);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 px-4 animate-fade-in-up" style={{ animationFillMode: 'both' }}>
      <div className="bg-white dark:bg-jade-900 border border-jade-200 dark:border-jade-700 rounded-lg shadow-xl p-6 md:p-8 relative overflow-hidden transition-all duration-300 hover:shadow-2xl">

        <h2 className="text-xl text-jade-900 dark:text-jade-100 mb-4 serif-title text-center transition-colors">
          Seek Strategic Counsel
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password Input */}
          <div className="relative group">
            <input
              type="password"
              className="w-full p-4 rounded-md border border-jade-300 dark:border-jade-700 bg-jade-50 dark:bg-jade-950 text-jade-900 dark:text-jade-100 focus:outline-none focus:border-imperial-600 focus:ring-1 focus:ring-imperial-600/20 transition-all duration-300"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Question / Query Input */}
          <div className="relative group">
            <textarea
              className="w-full h-32 bg-jade-50 dark:bg-jade-950 text-jade-900 dark:text-jade-100 border border-jade-300 dark:border-jade-800 rounded-md p-4 focus:outline-none focus:border-imperial-600 focus:ring-1 focus:ring-imperial-600/20 transition-all duration-300 resize-none placeholder-jade-400 dark:placeholder-jade-600 shadow-inner group-hover:border-jade-400 dark:group-hover:border-jade-700"
              placeholder="Describe your conflict or challenge..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !query.trim() || !password.trim()}
            className={`w-full py-3 px-6 flex items-center justify-center gap-2 rounded bg-imperial-700 hover:bg-imperial-800 dark:bg-imperial-700 dark:hover:bg-imperial-600 text-white font-semibold tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98] ${isLoading ? 'animate-pulse' : ''}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Consulting the Strategist...</span>
              </>
            ) : (
              <>
                <SendHorizontal className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <span>Seek Counsel</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConsultationForm;
