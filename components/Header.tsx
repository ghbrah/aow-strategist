import React from 'react';
import { Scroll, Wind, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="w-full py-6 md:py-8 flex flex-col items-center justify-center border-b border-jade-200 dark:border-jade-800 bg-jade-50/80 dark:bg-jade-950/50 backdrop-blur-sm sticky top-0 z-20 transition-colors duration-300">
      
      <button 
        onClick={toggleTheme}
        className="absolute right-4 top-4 md:right-8 md:top-8 p-2 rounded-full text-jade-600 hover:text-imperial-600 hover:bg-jade-200 dark:hover:bg-jade-800 transition-all"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="flex items-center gap-3 mb-2">
        <Scroll className="w-8 h-8 text-imperial-600" />
        <h1 className="text-3xl md:text-4xl font-bold tracking-wider text-jade-900 dark:text-imperial-500 serif-title transition-colors">
          THE ART OF WAR
        </h1>
        <Wind className="w-8 h-8 text-imperial-600" />
      </div>
      <p className="text-jade-600 dark:text-jade-400 text-sm tracking-widest uppercase mt-2 font-medium">
        Strategic Counsel for Modern Conflict
      </p>
    </header>
  );
};

export default Header;