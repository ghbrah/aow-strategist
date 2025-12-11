// src/App.tsx
import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import ConsultationForm from './components/ConsultationForm';
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

  // Password & query input combined
  const [passwordInput, setPasswordInput] = useState('');
  const [queryInput, setQueryInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
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

  // Handle submission (password + query)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAdvice(null);

    if (passwordInput !== PASSWORD) {
      setPasswordError("Incorrect password.");
      return;
    }
    setPasswordError(null);

    if (!queryInput.trim()) {
      setError("Please enter a query describing your conflict.");
      return;
    }

    setLoading(true);

    try {
      const result = await getStrategicAdvice(queryInput, passwordInput);
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
    setQueryInput('');
    setPasswordInput('');
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
        {/* Password + query form */}
        {!advice && (
          <form
            onSubmit={handleSubmit}
            className="max-w-md w-full mt-20 mx-auto p-6 bg-white dark:bg-jade-900 rounded-lg shadow-lg flex flex-col gap-4"
          >
            <h2 className="text-center text-2xl serif-title">Consult the Strategist</h2>

            <input
              type="password"
              className="w-full p-3 rounded border border-jade-300 dark:border-jade-700 bg-jade-50 dark:bg-jade-950 text-jade-900 dark:text-jade-100"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              placeholder="Enter password..."
            />

            <textarea
              className="w-full h-32 p-4 rounded border border-jade-300 dark:border-jade-700 bg-jade-50 dark:bg-jade-950 text-jade-900 dark:text-jade-100 resize-none"
              value={queryInput}
              onChange={e => setQueryInput(e.target.value)}
              placeholder="Describe your conflict or challenge..."
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-imperial-700 hover:bg-imperial-800 text-white font-semibold rounded disabled:opacity-50"
            >
              {loading ? "Consulting the Strategist..." : "Seek Counsel"}
            </button>

            {passwordError && <p className="text-red-600 text-center">{passwordError}</p>}
            {error && (
              <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded text-red-800 dark:text-red-200 text-center">
                {error}
              </div>
            )}
          </form>
        )}

        <div ref={resultRef} className="w-full mt-6">
          {advice && <StrategyResult advice={advice} onReset={handleReset} />}
        </div>

        {!advice && !loading && history.length > 0 && (
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
