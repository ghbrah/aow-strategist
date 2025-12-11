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
  
  // Theme State: Check localStorage or default to 'dark'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('art_of_war_theme');
      return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
    }
    return 'dark';
  });
  
  // To handle scroll on result
  const resultRef = useRef<HTMLDivElement>(null);

  // Apply theme class to HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('art_of_war_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('art_of_war_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (err) {
        console.error("Failed to parse history:", err);
      }
    }
  }, []);

  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem('art_of_war_history', JSON.stringify(newHistory));
  };

  const handleConsultation = async (query: string) => {
    setLoading(true);
    setError(null);
    setAdvice(null);

    try {
      const result = await getStrategicAdvice(query);
      setAdvice(result);
      
      // Save to history
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        query,
        advice: result,
        timestamp: Date.now(),
      };
      
      // Add new item to the beginning of the list
      const updatedHistory = [newItem, ...history];
      saveHistory(updatedHistory);

      // Smooth scroll to result after a brief delay for rendering
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      // Specific error handling for API Key issues
      if (err.message && (err.message.includes("API Key") || err.message.includes("API_KEY"))) {
        setError("Configuration Error: The Strategist requires a valid API Key. Please check your .env file or Netlify settings.");
      } else {
        setError("The strategist is silent. Please check your internet connection and try again.");
      }
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
    if (window.confirm("Are you sure you wish to burn the archives? This action cannot be undone.")) {
      saveHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-jade-50 dark:bg-jade-950 text-jade-900 dark:text-jade-100 flex flex-col relative selection:bg-imperial-200 dark:selection:bg-imperial-900 selection:text-jade-900 dark:selection:text-white transition-colors duration-300">
      
      {/* Background Ambient Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-imperial-500/10 dark:bg-imperial-600/10 blur-[100px] transition-colors duration-500"></div>
         <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-jade-300/30 dark:bg-jade-800/20 blur-[120px] transition-colors duration-500"></div>
      </div>

      <Header theme={theme} toggleTheme={toggleTheme} />

      <main className="flex-grow flex flex-col items-center w-full relative z-10">
        
        {/* Intro Text */}
        {!advice && !loading && (
          <div className="max-w-2xl mx-auto text-center px-6 mt-8 animate-fade-in-up">
            <h2 className="text-2xl md:text-3xl text-imperial-700 dark:text-imperial-500 serif-title mb-4 transition-colors">
              Know the Enemy, Know Yourself
            </h2>
            <p className="text-jade-800 dark:text-jade-300 leading-relaxed transition-colors font-medium">
              In business, life, and conflict, the principles of victory remain unchanged for thousands of years. 
              Describe your situation below, and receive counsel from the ancient Art of War.
            </p>
          </div>
        )}

        {/* If we have advice, the form is hidden to focus on the result, or we can keep it hidden until reset */}
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
          {advice && (
            <StrategyResult advice={advice} onReset={handleReset} />
          )}
        </div>

        {/* History List - Only show when NOT viewing advice and NOT loading */}
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
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;