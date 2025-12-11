// src/App.tsx
import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import StrategyResult from './components/StrategyResult';
import HistoryList from './components/HistoryList';
import { getStrategicAdvice } from './services/geminiService';
import { StrategyAdvice, HistoryItem } from './types';
import { AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<StrategyAdvice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Combined password + query
  const [passwordInput, setPasswordInput] = useState('');
  const [queryInput, setQueryInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const PASSWORD = '$untzu';

  // Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('art_of_war_theme');
      return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
    }
    return 'dark';
  });

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    theme === 'dark' ? root.classList.add('dark') : root.classList.remove('dark');
    localStorage.setItem('art_of_war_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  // Load history
  useEffect(() => {
    const savedHistory = localStorage.getItem('art_of_war_history');
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } 
      catch { console.error("Failed to parse history."); }
    }
  }, []);

  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem('art_of_war_history', JSON.stringify(newHistory));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setError(null);
    setAdvice(null);

    if (passwordInput !== PASSWORD) {
      setFormError("Incorrect password.");
      return;
    }
    if (!queryInput.trim()) {
      setFormError("Please enter your conflict or challenge.");
      return;
    }

    setLoading(true);
    try {
      const result = await getStrategicAdvice(queryInput);
      setAdvice(result);

      const newItem: HistoryItem = {
        id: Date.now().toString(),
        query: queryInput,
        advice: result,
        timestamp: Date.now(),
      };
      saveHistory([newItem, ...history]);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

      setQueryInput('');
      setPasswordInput('');
    } catch (err: any) {
      console.error(err);
      setError("The strategist is silent. Check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAdvice(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setAdvice(item.advice);
    setError(null);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear history? This cannot be undone.")) {
      saveHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-jade-50 dark:bg-jade-950 text-jade-900 dark:text-jade-100 flex flex-col relative selection:bg-imperial-200 dark:selection:bg-imperial-900 selection:text-jade-900 dark:selection:text-white transition-colors duration-300">
      
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main className="flex-grow flex flex-col items-center w-full relative z-10">
        {!advice && (
          <form
            onSubmit={handleSubmit}
            className="max-w-md w-full mt-20 mx-auto p-6 bg-white dark:bg-jade-900 rounded-lg shadow-lg flex flex-col gap-4"
          >
            <h2 className="text-center text-2xl serif-title">Enter Password & Question</h2>

            <input
              type="password"
              className="w-full p-3 rounded border border-jade-300 dark:border-jade-700 bg-jade-50 dark:bg-jade-950 text-jade-900 dark:text-jade-100"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              placeholder="Enter password..."
              disabled={loading}
            />

            <textarea
              className="w-full h-32 bg-jade-50 dark:bg-jade-950 text-jade-900 dark:text-jade-100 border border-jade-300 dark:border-jade-800 rounded-md p-4 focus:outline-none focus:border-imperial-600 focus:ring-1 focus:ring-imperial-600/20 transition-all duration-300 resize-none placeholder-jade-400 dark:placeholder-jade-600 shadow-inner"
              placeholder="Describe your conflict or challenge..."
              value={queryInput}
              onChange={e => setQueryInput(e.target.value)}
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-imperial-700 hover:bg-imperial-800 text-white font-semibold rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Consulting the Strategist...' : 'Seek Counsel'}
            </button>

            {(formError || error) && (
              <div className="mt-2 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded text-red-800 dark:text-red-200 text-center">
                {formError || error}
              </div>
            )}
          </form>
        )}

        <div ref={resultRef} className="w-full mt-6">
          {advice && <StrategyResult advice={advice} onReset={handleReset} />}
        </div>

        {!advice && history.length > 0 && (
          <HistoryList
            history={history}
            onSelect={handleSelectHistory}
            onClear={handleClearHistory}
          />
        )}
      </main>

      <footer className="w-full py-6 text-center text-jade-600 dark:text-jade-500 text-xs uppercase tracking-widest border-t border-jade-200 dark:border-jade-900 relative z-10 transition-colors">
        <p>Inspired by Sun Tzu's Art of War</p>
      </footer>
    </div>
  );
};

export default App;
