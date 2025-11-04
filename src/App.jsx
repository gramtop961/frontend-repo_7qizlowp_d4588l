import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LanguageSelector } from './components/LanguageSelector.jsx';
import { TextArea } from './components/TextArea.jsx';
import { ControlsBar } from './components/ControlsBar.jsx';
import { HistoryList } from './components/HistoryList.jsx';

// Simple debounce
function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const STORAGE_KEY = 'translator_history_v1';

export default function App() {
  const [source, setSource] = useState('auto');
  const [target, setTarget] = useState('en');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [auto, setAuto] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const debouncedInput = useDebouncedValue(input, 500);
  const controllerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 50)));
  }, [history]);

  const speak = useCallback((text, langCode) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    // Try to pick a matching voice
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find((v) => v.lang?.toLowerCase().startsWith(langCode));
    if (match) utterance.voice = match;
    utterance.lang = match?.lang || langCode;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  const doTranslate = useCallback(async (q, src, tgt) => {
    if (!q?.trim()) {
      setOutput('');
      return;
    }
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);
    setError('');

    const payload = {
      q,
      source: src === 'auto' ? 'auto' : src,
      target: tgt,
      format: 'text',
    };

    const endpoints = [
      'https://libretranslate.com/translate',
      'https://translate.argosopentech.com/translate',
    ];

    let translated = '';
    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        translated = data?.translatedText || '';
        if (translated) break;
      } catch (e) {
        // try next endpoint
        translated = '';
      }
    }

    if (!translated) {
      setError('Online translation is unavailable right now. Please try again or use manual input.');
      setLoading(false);
      return;
    }

    setOutput(translated);
    setLoading(false);
    setHistory((h) => [
      { input: q, output: translated, source: src, target: tgt, ts: Date.now() },
      ...h,
    ].slice(0, 50));
  }, []);

  useEffect(() => {
    if (auto && debouncedInput) {
      doTranslate(debouncedInput, source, target);
    } else if (auto && !debouncedInput) {
      setOutput('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInput, auto, source, target]);

  const handleSwap = () => {
    setSource(target === 'auto' ? 'en' : target);
    setTarget(source === 'auto' ? 'en' : source);
    setInput(output);
    setOutput(input);
  };

  const startDictation = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    const rec = new SR();
    rec.lang = source === 'auto' ? 'en-US' : `${source}-${source.toUpperCase()}`;
    rec.interimResults = true;
    rec.continuous = false;

    let finalText = '';
    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += transcript + ' ';
        else interim += transcript;
      }
      setInput((finalText + interim).trim());
    };
    rec.onerror = () => rec.stop();
    rec.onend = () => {
      if (auto) doTranslate(finalText.trim(), source, target);
    };
    rec.start();
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
  };

  const loadHistoryItem = (item) => {
    setSource(item.source);
    setTarget(item.target);
    setInput(item.input);
    setOutput(item.output);
    setShowHistory(false);
  };

  const clearHistory = () => setHistory([]);

  const canTranslate = useMemo(() => input.trim().length > 0, [input]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Real-Time Translator</h1>
            <p className="text-sm text-gray-600">Any ↔ Any. Type, speak, or paste — get instant translations.</p>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-[1fr]">
          <LanguageSelector
            source={source}
            target={target}
            onChangeSource={setSource}
            onChangeTarget={setTarget}
            onSwap={handleSwap}
          />

          <ControlsBar
            onTranslate={() => doTranslate(input, source, target)}
            onStartDictation={startDictation}
            auto={auto}
            onToggleAuto={() => setAuto((v) => !v)}
            loading={loading}
            disabled={!canTranslate}
            onShowHistory={() => setShowHistory((v) => !v)}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <TextArea
              label="Input"
              value={input}
              onChange={(v) => {
                setInput(v);
                setError('');
              }}
              placeholder="Type or dictate text here…"
              onSpeak={() => speak(input, source === 'auto' ? 'en' : source)}
              onCopy={() => copyToClipboard(input)}
              onClear={() => setInput('')}
            />

            <div>
              <TextArea
                label="Output"
                value={loading ? 'Translating…' : output}
                onChange={null}
                placeholder="Translation will appear here"
                readOnly
                onSpeak={() => speak(output, target)}
                onCopy={() => copyToClipboard(output)}
              />
              {error && (
                <div className="mt-2 rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</div>
              )}
            </div>
          </div>

          {showHistory && (
            <HistoryList items={history} onSelect={loadHistoryItem} onClear={clearHistory} />
          )}
        </div>
      </div>
    </div>
  );
}
