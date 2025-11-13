import { useState } from 'react';
import StudyForm from './components/StudyForm';
import StudyResult from './components/StudyResult';

export default function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStudy = async (topic, mode) => {
    setLoading(true);
    setError('');
    try {
      const url = `${import.meta.env.VITE_API_URL}/study?topic=${encodeURIComponent(topic)}&mode=${mode}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setResults((prev) => [{ topic, mode, ...data }, ...prev]);
      } else {
        setError(data.error || 'Server error');
      }
    } catch (e) {
      setError('Failed to fetch results.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative">
      {/* Branding */}
      <header className="w-full py-5 flex justify-center">
        <a href="#" className="text-3xl font-bold text-blue-800 dark:text-blue-300 hover:underline">Smart Study Assistant</a>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-2 pb-36">
        {error && (
          <div className="text-red-600 my-4 text-center font-medium">{error}</div>
        )}
        {loading && (
          <div className="animate-pulse text-blue-600 my-4 text-center">Loading...</div>
        )}
        {results.length === 0 && !loading && (
          <div className="text-center mt-12 text-lg text-gray-500 dark:text-gray-400">
            Enter a study topic below to get started!
          </div>
        )}
        <div className="flex flex-col gap-8 mt-4">
          {/* Show each QA pair like a chat (newest below, so .reverse for newest on bottom) */}
          {[...results].reverse().map((res, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              {/* Topic/question message bubble */}
              <div className="self-start bg-blue-100 text-blue-900 px-5 py-2 rounded-full font-medium mb-1 shadow-sm max-w-max">
                Topic: <span className="font-bold">{res.topic}</span>
                {res.mode === 'math' && (
                  <span className="ml-2 text-blue-600 text-xs bg-blue-200 px-2 py-1 rounded-full font-semibold">Math Mode</span>
                )}
              </div>
              <StudyResult result={res} />
            </div>
          ))}
        </div>
      </main>

      {/* Sticky Search Bar At Bottom */}
      <footer className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-10">
        <div className="max-w-2xl mx-auto w-full px-2 py-3">
          <StudyForm onSubmit={handleStudy} loading={loading} />
        </div>
      </footer>
    </div>
  );
}
