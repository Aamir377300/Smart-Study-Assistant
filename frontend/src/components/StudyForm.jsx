import { useState } from 'react';

export default function StudyForm({ onSubmit, loading }) {
  const [topic, setTopic] = useState('');
  const [mathMode, setMathMode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onSubmit(topic.trim(), mathMode ? 'math' : 'standard');
    setTopic(""); // clear after search
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-center gap-4 w-full"
    >
      <input
        type="text"
        placeholder="Type your study topic..."
        className="flex-1 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-base transition"
        value={topic}
        onChange={e => setTopic(e.target.value)}
        disabled={loading}
        autoFocus
      />

      <label className="flex items-center justify-center gap-2 font-medium">
        <input
          type="checkbox"
          checked={mathMode}
          onChange={e => setMathMode(e.target.checked)}
          disabled={loading}
          className="accent-blue-600 h-5 w-5"
        />
        <span className="select-none text-gray-900 dark:text-gray-200">Math Mode</span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-full shadow transition hover:bg-blue-700 disabled:opacity-70"
      >
        {loading ? (
          <span className="flex items-center gap-1">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="white" strokeWidth="4"></circle></svg>
            Thinking...
          </span>
        ) : "Study!"}
      </button>
    </form>
  );
}
