export function HistoryList({ items, onSelect, onClear }) {
  if (!items?.length) {
    return (
      <div className="rounded-md border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
        No history yet. Translations you run will appear here.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Recent translations</h3>
        <button
          type="button"
          onClick={onClear}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear all
        </button>
      </div>
      <ul className="divide-y divide-gray-200 rounded-md border border-gray-200 bg-white">
        {items.map((item, idx) => (
          <li key={idx} className="p-3">
            <button
              type="button"
              className="w-full text-left"
              onClick={() => onSelect(item)}
            >
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{new Date(item.ts).toLocaleString()}</span>
                <span>
                  {item.source.toUpperCase()} → {item.target.toUpperCase()}
                </span>
              </div>
              <div className="mt-1 line-clamp-1 text-sm text-gray-800">{item.input}</div>
              <div className="line-clamp-1 text-xs text-gray-600">{item.output}</div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
