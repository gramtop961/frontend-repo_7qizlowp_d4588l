import { Mic, Loader2, History } from 'lucide-react';

export function ControlsBar({
  onTranslate,
  onStartDictation,
  auto,
  onToggleAuto,
  loading,
  disabled,
  onShowHistory,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-gray-200 bg-white p-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onTranslate}
          disabled={disabled || loading}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Translating…</span>
          ) : (
            'Translate'
          )}
        </button>
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={auto} onChange={onToggleAuto} />
          Real-time
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onStartDictation}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          <Mic className="h-4 w-4" /> Speak
        </button>
        <button
          type="button"
          onClick={onShowHistory}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          <History className="h-4 w-4" /> History
        </button>
      </div>
    </div>
  );
}
