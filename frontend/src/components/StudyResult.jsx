import { useState } from "react";

const LETTERS = ["A", "B", "C", "D", "E"];

function QuizInteractive({ quiz }) {
  const [selected, setSelected] = useState(Array(quiz.length).fill(null));
  const [answered, setAnswered] = useState(Array(quiz.length).fill(false));

  function handleSelect(qIdx, value) {
    if (answered[qIdx]) return;
    const newSelected = [...selected];
    newSelected[qIdx] = value;
    setSelected(newSelected);

    const newAnswered = [...answered];
    newAnswered[qIdx] = true;
    setAnswered(newAnswered);
  }

  return (
    <ol className="mb-6 flex flex-col gap-6">
      {quiz.map((q, i) => {
        // Find correct answer text if only a letter is supplied
        const correctLetter = typeof q.correct === "string" && q.correct.length === 1
          ? q.correct.toUpperCase()
          : null;
        const correctOption =
          correctLetter
            ? q.options[LETTERS.indexOf(correctLetter)]
            : q.correct;

        const isAnswered = answered[i];

        return (
          <li key={i} className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow p-4">
            <div className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-100">
              <span className="mr-2 bg-blue-200 text-blue-800 px-2 py-1 rounded text-sm font-bold">Q{i+1}</span>
              {q.question}
            </div>
            <div className="flex flex-col gap-2">
              {q.options?.map((opt, j) => {
                const isSelected = selected[i] === opt;
                const isCorrect = opt === correctOption;
                let btnClass = "flex items-center gap-3 px-4 py-2 rounded-lg border text-base font-medium transition duration-150 w-full focus:outline-none";

                // Initial un-answered state
                if (!isAnswered) {
                  btnClass += " bg-white text-gray-900 border-gray-300 hover:bg-blue-50 hover:border-blue-400";
                  if (isSelected) btnClass += " ring-2 ring-blue-400";
                } else {
                  // Answered state
                  if (isSelected && isCorrect) {
                    btnClass += " bg-green-600 border-green-900 text-white ring-2 ring-green-200";
                  } else if (isSelected && !isCorrect) {
                    btnClass += " bg-red-600 border-red-900 text-white ring-2 ring-red-200";
                  } else {
                    btnClass += " bg-gray-200 text-gray-500 border-gray-200";
                  }
                }

                btnClass += " min-h-[44px]";

                return (
                  <button
                    key={j}
                    className={btnClass}
                    disabled={isAnswered}
                    onClick={() => handleSelect(i, opt)}
                  >
                    <span className={`font-bold w-6 text-center rounded ${isAnswered && isSelected && isCorrect ? 'bg-green-400 text-white' : isAnswered && isSelected && !isCorrect ? 'bg-red-400 text-white' : 'bg-gray-200 text-gray-700'}`}>
                      {LETTERS[j]}.
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
            {isAnswered && (
              <div className="mt-3 text-base">
                {selected[i] === correctOption
                  ? <span className="text-green-700 font-bold">✅ Correct!</span>
                  : <span className="text-red-600 font-bold">❌ Wrong. Correct answer: <b>{correctOption}</b></span>
                }
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default function StudyResult({ result }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      {/* SUMMARY */}
      <h2 className="text-xl font-semibold mb-2">Summary</h2>
      <ul className="list-disc ml-6 mb-4">
        {result.summary?.map((point, i) => <li key={i}>{point}</li>)}
      </ul>

      {/* QUIZ */}
      <h2 className="text-xl font-semibold mb-2">Quiz</h2>
      {result.quiz?.length ? (
        <QuizInteractive quiz={result.quiz} />
      ) : (
        <p>No quiz generated.</p>
      )}

      {/* STUDY TIP */}
      <h2 className="text-xl font-semibold mb-2">Study Tip</h2>
      <div className="mb-4 italic">{result.studyTip}</div>

      {/* MATH MODE */}
      {result.mathQuant && (
        <>
          <h2 className="text-xl font-semibold mb-2">Math/Quantitative</h2>
          <div className="mb-4">
            <strong>Question:</strong> {result.mathQuant.question} <br />
            <strong>Answer:</strong> {result.mathQuant.answer} <br />
            <strong>Explanation:</strong> {result.mathQuant.explanation}
          </div>
        </>
      )}
    </div>
  );
}
