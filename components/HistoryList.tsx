import React from 'react';
import { HistoryItem } from '../types';
import { History, Clock, ChevronRight, Trash2, ScrollText } from 'lucide-react';

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 px-4 animate-fade-in pb-12">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-jade-600 dark:text-jade-400 uppercase tracking-widest text-xs font-bold flex items-center gap-2">
          <History className="w-4 h-4" />
          Campaign Archives
        </h3>
        <button
          onClick={onClear}
          className="text-jade-500 hover:text-red-500 dark:text-jade-600 dark:hover:text-red-400 text-xs uppercase tracking-wider flex items-center gap-1 transition-colors duration-300 hover:scale-105"
          title="Clear all history"
        >
          <Trash2 className="w-3 h-3" />
          Burn Archives
        </button>
      </div>

      <div className="space-y-3">
        {history.map((item, index) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="w-full bg-white dark:bg-jade-900/50 hover:bg-jade-50 dark:hover:bg-jade-800 border border-jade-200 dark:border-jade-800 hover:border-imperial-200 dark:hover:border-imperial-800/40 rounded-lg p-4 transition-all duration-300 ease-out group text-left flex items-start gap-4 shadow-sm hover:shadow-lg hover:-translate-y-1 animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
          >
            <div className="bg-jade-50 dark:bg-jade-950 p-2 rounded-md border border-jade-200 dark:border-jade-800 group-hover:border-imperial-200 dark:group-hover:border-imperial-800/30 transition-colors duration-300 hidden sm:block">
               <ScrollText className="w-5 h-5 text-imperial-600 dark:text-imperial-600" />
            </div>
            
            <div className="flex-grow min-w-0">
              <h4 className="text-jade-900 dark:text-jade-200 font-serif font-medium truncate group-hover:text-imperial-600 dark:group-hover:text-imperial-500 transition-colors duration-300">
                {item.advice.title}
              </h4>
              <p className="text-jade-600 dark:text-jade-400 text-sm truncate mt-1 italic">
                "{item.query}"
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-jade-400 dark:text-jade-600">
                <Clock className="w-3 h-3" />
                <span>{new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>

            <div className="self-center opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 text-imperial-600 dark:text-imperial-500">
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;