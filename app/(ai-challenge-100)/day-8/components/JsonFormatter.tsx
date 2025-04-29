'use client';

import { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';

export default function JsonFormatter() {
  const [inputJson, setInputJson] = useState('');
  const [formattedJson, setFormattedJson] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    try {
      if (!inputJson.trim()) {
        setError('JSONを入力してください');
        setFormattedJson('');
        return;
      }

      // JSONをパースして整形
      const parsedJson = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsedJson, null, 2);
      setFormattedJson(formatted);
      setError('');
    } catch (err) {
      setError('無効なJSONフォーマットです');
      setFormattedJson('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputJson(e.target.value);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!formattedJson) return;
    
    try {
      await navigator.clipboard.writeText(formattedJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('クリップボードへのコピーに失敗しました');
    }
  };

  const handleSave = () => {
    if (!formattedJson) return;

    try {
      const blob = new Blob([formattedJson], { type: 'application/json' });
      saveAs(blob, 'formatted.json');
    } catch (err) {
      setError('ファイルの保存に失敗しました');
    }
  };

  const handlePrettify = () => {
    formatJson();
    setCopied(false);
  };

  // シンタックスハイライトのためのクラス名を生成
  const getHighlightedJson = () => {
    if (!formattedJson) return '';

    return formattedJson
      .split('\n')
      .map(line => {
        // キーと値を分離
        const parts = line.split(/^(\s*)"(.+?)":\s/);
        if (parts.length > 3) {
          const [, indent, key, value] = parts;
          return `${indent}<span class="text-blue-600">"${key}"</span>: ${
            value.includes('"') 
              ? `<span class="text-green-600">${value}</span>`
              : `<span class="text-amber-600">${value}</span>`
          }`;
        }
        // 配列やオブジェクトの括弧
        return line.replace(/[{}\[\]]/g, match => 
          `<span class="text-purple-600">${match}</span>`
        );
      })
      .join('\n');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">JSONフォーマッター</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 入力エリア */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              JSONを入力
            </label>
            <button
              onClick={handlePrettify}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              整形
            </button>
          </div>
          <textarea
            value={inputJson}
            onChange={handleInputChange}
            placeholder="ここにJSONを入力してください..."
            className="w-full h-[500px] p-4 border rounded font-mono text-sm"
            spellCheck={false}
          />
        </div>

        {/* 出力エリア */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              整形されたJSON
            </label>
            <div className="space-x-2">
              <button
                onClick={handleCopy}
                disabled={!formattedJson}
                className={`px-4 py-2 ${
                  copied 
                    ? 'bg-green-500'
                    : 'bg-gray-500 hover:bg-gray-600'
                } text-white rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {copied ? 'コピーしました！' : 'コピー'}
              </button>
              <button
                onClick={handleSave}
                disabled={!formattedJson}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                保存
              </button>
            </div>
          </div>
          {error ? (
            <div className="p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          ) : formattedJson ? (
            <pre
              className="w-full h-[500px] p-4 border rounded overflow-auto bg-gray-50 font-mono text-sm"
              dangerouslySetInnerHTML={{
                __html: getHighlightedJson()
              }}
            />
          ) : (
            <div className="w-full h-[500px] p-4 border rounded bg-gray-50 text-gray-400 flex items-center justify-center">
              整形されたJSONがここに表示されます
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 