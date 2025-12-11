import React, { useState, useRef, useEffect } from 'react';
import ConsultationForm from './components/ConsultationForm';
import { getStrategicAdvice } from './services/geminiService';
import { StrategyAdvice, HistoryItem } from './types';
import { AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<StrategyAdvice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const [unlocked, setUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('art_of_war_history');
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } 
      catch (err) { console.error(err); }
    }
  }, []);

  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem('art_of_war_history', JSON.stringify(newHistory));
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  // ---- Password Form Handler ----
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '$untzu') {
      setUnlocked(true);
      setError(null);
    } else {
      setError('Incorrect password.');
    }
  };

  // ---- Consultation Form Handler ----
  const handleConsultation = async (query: string) => {
    setLoading(true);
    setError(null);
    setAdvice(null);

    try {
      const result = await getStrategicAdvice(query);
      setAdvice(result);

      const newItem: HistoryItem = {
        id: Date.now().toString(),
        query,
        advice: result,
        timestamp: Date.now(),
      };
      saveHistory([newItem, ...history]);

      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);

    } catch (err: any) {
      console.error(err);
      if (err.message && (err.message.includes("API Key") || err.message.includes("API_KEY"))) {
        setError("Configuration Error: Missing API Key. Check your Netlify environment variables.");
      } else {
        setError("The strategist is silent. Check your internet connection.");
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-jade-50 dark:bg-jade-950 text-jade-900 dark:text-jade-100 flex flex-col items-center p-4">
      
      <header className="w-full max-w-2xl text-center mb-6">
        <h1 className="text-3xl font-serif mb-2">Art of War Strategist</h1>
        <button onClick={toggleTheme} className="px-4 py-1 border rounded mb-2">
          Toggle {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </header>

      {!unlocked ? (
        <form onSubmit={handlePasswordSubmit} className="max-w-md w-full bg-white dark:bg-jade-900 p-6 rounded shadow-md space-y-4">
          <h2 className="text-xl font-serif text-center">Enter Password</h2>
          <input
            type="password"
            placeholder="Enter password..."
            className="w-full p-3 rounded border border-jade-300 dark:border-jade-700 bg-jade-50 dark:bg-jade-950 text-jade-900 dark:text-jade-100"
            value={passwordInput}
            onChange={e => setPasswordInput(e.target.value)}
          />
          <button type="submit" className="w-full py-2 bg-imperial-700 hover:bg-imperial-800 text-white rounded">Unlock</button>
          {error && <p className="text-red-600 text-center">{error}</p>}
        </form>
      ) : (
        <>
          <ConsultationForm onSubmit={handleConsultation} isLoading={loading} />

          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded max-w-md text-center">
              {error}
            </div>
          )}

          {advice && (
            <div ref={resultRef} className="mt-6 max-w-2xl w-full bg-white dark:bg-jade-900 p-6 rounded shadow-md">
              <h2 className="text-2xl font-serif mb-2">{advice.title}</h2>
              <p className="italic mb-2">"{advice.originalQuote}"</p>
              <p className="mb-2">{advice.interpretation}</p>
              <ul className="list-disc pl-5 mb-2">
                {advice.actionableAdvice.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
              {advice.chineseCharacter && <p className="text-xl font-bold">{advice.chineseCharacter} – {advice.characterExplanation}</p>}
              <button onClick={() => setAdvice(null)} className="mt-4 px-4 py-2 bg-imperial-700 hover:bg-imperial-800 text-white rounded">Reset</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
