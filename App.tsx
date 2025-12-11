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
  
  const resultRef = useRef<HTMLDivElement>(null);

  // Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('art_of_war_theme');
      return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
    }
    return 'dark';
  });

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

  // Handle consultation
  const handleConsultation = async (query: string, password: string) => {
    setLoading(true);
    setError(null);
    setAdvice(null);

    try {
      const result = await getStrategicAdvice(query, password); // pass password dynamically
      setAdvice(result);

      const newItem: HistoryItem = {
        id: Date.now().toString(),
        query,
        advice: result,
        timestamp: Date.now(),
      };

      saveHistory([newItem, ...history]);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "The strategist is silent. Check your internet connection and try again.");
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
          <ConsultationForm onSubmit={handleConsultation} isLoading={loading} />
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg flex items-center gap-3 text-red-800 dark:text-red-200 max-w-lg animate-fade-in mx-4">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div ref={resultRef} className="w-full">
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
