import { SwapHorizontal } from 'lucide-react';

const LANGUAGES = [
  { code: 'auto', name: 'Detect language' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
];

export function LanguageSelector({ source, target, onChangeSource, onChangeTarget, onSwap }) {
  return (
    <div className="w-full flex items-center gap-3">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
        <select
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={source}
          onChange={(e) => onChangeSource(e.target.value)}
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>{l.name}</option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onSwap}
        className="mt-6 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        aria-label="Swap languages"
      >
        <SwapHorizontal className="h-5 w-5" />
      </button>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
        <select
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={target}
          onChange={(e) => onChangeTarget(e.target.value)}
        >
          {LANGUAGES.filter((l) => l.code !== 'auto').map((l) => (
            <option key={l.code} value={l.code}>{l.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export const LANGUAGE_OPTIONS = LANGUAGES;
