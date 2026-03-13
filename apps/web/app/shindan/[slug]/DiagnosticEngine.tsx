'use client';

import { useState } from 'react';
import type { DiagnosticConfig } from '@affiliate/shared';

export default function DiagnosticEngine({ config }: { config: DiagnosticConfig }) {
  const [currentId, setCurrentId] = useState(config.startQuestion);
  const [resultKey, setResultKey] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const currentQ = config.questions.find((q) => q.id === currentId);
  const totalQ = config.questions.length;
  const step = history.length + 1;

  const handleSelect = (next: string) => {
    setHistory((h) => [...h, currentId]);
    if (next.startsWith('result:')) {
      setResultKey(next.replace('result:', ''));
    } else {
      setCurrentId(next);
    }
  };

  const handleBack = () => {
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setCurrentId(prev);
    setResultKey(null);
  };

  const handleReset = () => {
    setCurrentId(config.startQuestion);
    setResultKey(null);
    setHistory([]);
  };

  if (resultKey) {
    const result = config.results[resultKey];
    if (!result) return null;
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg mx-auto text-center">
        <div className="text-6xl mb-4">🎯</div>
        <p className="text-sm font-semibold text-indigo-500 uppercase tracking-widest mb-2">
          診断結果
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{result.title}</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">{result.description}</p>
        <a
          href={`/go/${result.offer_id}?utm_source=shindan&utm_medium=organic&utm_campaign=${config.slug}&utm_content=${resultKey}`}
          className="inline-block w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors"
        >
          {result.cta}
        </a>
        <button
          onClick={handleReset}
          className="mt-5 block mx-auto text-sm text-gray-400 hover:text-gray-600 underline"
        >
          もう一度診断する
        </button>
      </div>
    );
  }

  if (!currentQ) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-400">
          質問 {step} / {totalQ}
        </span>
        <div className="w-36 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalQ) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-6">{currentQ.text}</h2>

      <div className="space-y-3">
        {currentQ.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.next)}
            className="w-full text-left p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-colors font-medium text-gray-700"
          >
            {opt.label}
          </button>
        ))}
      </div>

      {history.length > 0 && (
        <button
          onClick={handleBack}
          className="mt-6 text-sm text-gray-400 hover:text-gray-600 underline"
        >
          ← 前に戻る
        </button>
      )}
    </div>
  );
}
