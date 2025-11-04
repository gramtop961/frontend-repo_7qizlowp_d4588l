import { Copy, Volume2, RotateCcw } from 'lucide-react';

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  readOnly = false,
  onSpeak,
  onCopy,
  onClear,
}) {
  const canClear = !!onClear && !!value;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSpeak}
            className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
          >
            <Volume2 className="h-4 w-4" /> Speak
          </button>
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
          >
            <Copy className="h-4 w-4" /> Copy
          </button>
          {canClear && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4" /> Clear
            </button>
          )}
        </div>
      </div>
      <textarea
        className="min-h-[160px] w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
      />
      <div className="text-right text-xs text-gray-500">{value?.length || 0} characters</div>
    </div>
  );
}
