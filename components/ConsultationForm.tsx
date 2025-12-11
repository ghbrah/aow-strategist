import React, { useState } from 'react';
import { SendHorizontal, Loader2 } from 'lucide-react';

interface ConsultationFormProps {
  onSubmit: (query: string, password: string) => void;
  isLoading: boolean;
}

const ConsultationForm: React.FC<ConsultationFormProps> = ({ onSubmit, isLoading }) => {
  const [query, setQuery] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setPasswordError('Password is required.');
      return;
    }
    setPasswordError(null);
    if (query.trim()) {
      onSubmit(query, password);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 px-4 animate-fade-in-up">
      <div className="bg-white dark:bg-jade-900 border border-jade-200 dark:border-jade-700 rounded-lg shadow-xl p-6 md:p-8 relative overflow-hidden">
        <h2 className="text-xl text-jade-900 dark:text-jade-100 mb-4 serif-title text-center">
          Describe Your Conflict
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            className="w-full p-3 rounded border border-jade-300 dark:border-jade-700 bg-jade-50 dark:bg-jade-950 text-jade-900 dark:text-jade-100"
            placeholder="Enter password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          {passwordError && <p className="text-red-600">{passwordError}</p>}

          <textarea
            className="w-full h-32 bg-jade-50 dark:bg-jade-950 text-jade-900 dark:text-jade-100 border border-jade-300 dark:border-jade-800 rounded-md p-4 focus:outline-none focus:border-imperial-600 focus:ring-1 focus:ring-imperial-600/20 resize-none placeholder-jade-400 dark:placeholder-jade-600 shadow-inner"
            placeholder="Describe your situation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading || !query.trim() || !password.trim()}
            className={`w-full py-3 flex items-center justify-center gap-2 rounded bg-imperial-700 hover:bg-imperial-800 text-white font-semibold transition-all duration-300 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Consulting the Strategist...</span>
              </>
            ) : (
              <>
                <SendHorizontal className="w-5 h-5" />
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
