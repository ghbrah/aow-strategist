// src/components/ConsultationForm.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';

interface ConsultationFormProps {
  password: string;
  query: string;
  onPasswordChange: (value: string) => void;
  onQueryChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  passwordError?: string | null;
  error?: string | null;
}

const ConsultationForm: React.FC<ConsultationFormProps> = ({
  password,
  query,
  onPasswordChange,
  onQueryChange,
  onSubmit,
  isLoading,
  passwordError,
  error,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="max-w-md w-full mt-20 mx-auto p-6 bg-white dark:bg-jade-900 rounded-lg shadow-lg flex flex-col gap-4"
    >
      <h2 className="text-center text-2xl serif-title">Consult the Strategist</h2>

      <input
        type="password"
        className="w-full p-3 rounded border border-jade-300 dark:border-jade-700 bg-jade-50 dark:bg-jade-950 text-jade-900 dark:text-jade-100"
        value={password}
        onChange={e => onPasswordChange(e.target.value)}
        placeholder="Enter password..."
      />
      {passwordError && <p className="text-red-600 text-center">{passwordError}</p>}

      <textarea
        className="w-full h-32 p-4 rounded border border-jade-300 dark:border-jade-700 bg-jade-50 dark:bg-jade-950 text-jade-900 dark:text-jade-100 resize-none"
        value={query}
        onChange={e => onQueryChange(e.target.value)}
        placeholder="Describe your conflict or challenge..."
      />
      {error && (
        <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded text-red-800 dark:text-red-200 text-center">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-imperial-700 hover:bg-imperial-800 text-white font-semibold rounded disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
            Consulting the Strategist...
          </>
        ) : (
          <>Seek Counsel</>
        )}
      </button>
    </form>
  );
};

export default ConsultationForm;
