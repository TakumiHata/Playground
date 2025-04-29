'use client';

import { useState } from 'react';

type Mode = 'encode' | 'decode';

export default function UrlConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('encode');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    if (!input.trim()) {
      setError('テキストを入力してください');
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        // エンコード処理
        const encoded = encodeURIComponent(input);
        setOutput(encoded);
      } else {
        // デコード処理
        const decoded = decodeURIComponent(input);
        setOutput(decoded);
      }
      setError('');
    } catch (err) {
      setError(mode === 'encode' 
        ? 'エンコードに失敗しました' 
        : 'デコードに失敗しました。無効なURLエンコード文字列です');
      setOutput('');
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('クリップボードへのコピーに失敗しました');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setCopied(false);
    setError('');
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setOutput('');
    setError('');
    setCopied(false);
  };

  const handleSwap = () => {
    if (!output) return;
    setInput(output);
    setOutput('');
    setCopied(false);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">URLエンコーダ/デコーダ</h1>

      {/* モード切り替えタブ */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => handleModeChange('encode')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
            ${mode === 'encode'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'}`}
        >
          エンコード
        </button>
        <button
          onClick={() => handleModeChange('decode')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
            ${mode === 'decode'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'}`}
        >
          デコード
        </button>
      </div>

      <div className="space-y-6">
        {/* 入力エリア */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {mode === 'encode' ? '変換するテキスト' : 'デコードするURL'}
          </label>
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder={mode === 'encode' 
              ? 'エンコードするテキストを入力...' 
              : 'デコードするURLエンコード文字列を入力...'}
            className="w-full h-32 p-4 border rounded font-mono text-sm"
          />
        </div>

        {/* アクションボタン */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleConvert}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
          >
            {mode === 'encode' ? 'エンコード' : 'デコード'}
          </button>
          {output && (
            <button
              onClick={handleSwap}
              className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm font-medium"
            >
              結果を入力に使用
            </button>
          )}
        </div>

        {/* エラーメッセージ */}
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        {/* 出力エリア */}
        {output && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                変換結果
              </label>
              <button
                onClick={handleCopy}
                className={`px-4 py-1 text-sm font-medium rounded
                  ${copied
                    ? 'bg-green-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'}`}
              >
                {copied ? 'コピーしました！' : 'コピー'}
              </button>
            </div>
            <div className="p-4 bg-gray-50 rounded border font-mono text-sm break-all">
              {output}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 