'use client';

import { useState, useEffect, useMemo } from 'react';

interface TextStats {
  charCount: number;
  wordCount: number;
  lineCount: number;
  paragraphCount: number;
  alphaCount: number;
  numericCount: number;
  spaceCount: number;
  symbolCount: number;
  topWords: Array<{ word: string; count: number }>;
}

export default function TextAnalyzer() {
  const [text, setText] = useState('');
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [stats, setStats] = useState<TextStats>({
    charCount: 0,
    wordCount: 0,
    lineCount: 0,
    paragraphCount: 0,
    alphaCount: 0,
    numericCount: 0,
    spaceCount: 0,
    symbolCount: 0,
    topWords: [],
  });

  const analyzeText = (inputText: string): TextStats => {
    // 文字数（空白含む）
    const charCount = inputText.length;

    // 単語数
    const words = inputText.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    // 行数
    const lines = inputText.split('\n');
    const lineCount = lines.filter(line => line.trim().length > 0).length;

    // 段落数
    const paragraphs = inputText.split('\n\n');
    const paragraphCount = paragraphs.filter(para => para.trim().length > 0).length;

    // 文字種別のカウント
    const alphaCount = (inputText.match(/[a-zA-Zａ-ｚＡ-Ｚぁ-んァ-ン一-龯]/g) || []).length;
    const numericCount = (inputText.match(/[0-9０-９]/g) || []).length;
    const spaceCount = (inputText.match(/\s/g) || []).length;
    const symbolCount = (inputText.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?！＠＃＄％＾＆＊（）＿＋－＝［］｛｝；'："＼｜，．＜＞／？]/g) || []).length;

    // 頻出単語の分析
    const wordFrequency: { [key: string]: number } = {};
    words.forEach(word => {
      const normalizedWord = word.toLowerCase().replace(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?！＠＃＄％＾＆＊（）＿＋－＝［］｛｝；'："＼｜，．＜＞／？]/g, '');
      if (normalizedWord.length > 0) {
        wordFrequency[normalizedWord] = (wordFrequency[normalizedWord] || 0) + 1;
      }
    });

    const topWords = Object.entries(wordFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));

    return {
      charCount,
      wordCount,
      lineCount,
      paragraphCount,
      alphaCount,
      numericCount,
      spaceCount,
      symbolCount,
      topWords,
    };
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    if (autoUpdate) {
      setStats(analyzeText(newText));
    }
  };

  const handleAnalyze = () => {
    setStats(analyzeText(text));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">テキスト統計アプリ</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 入力エリア */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              テキストを入力
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoUpdate}
                  onChange={(e) => setAutoUpdate(e.target.checked)}
                  className="rounded text-blue-500"
                />
                <span className="text-sm text-gray-600">リアルタイム更新</span>
              </label>
              {!autoUpdate && (
                <button
                  onClick={handleAnalyze}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  分析
                </button>
              )}
            </div>
          </div>
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="ここにテキストを入力してください..."
            className="w-full h-[500px] p-4 border rounded font-mono text-sm"
          />
        </div>

        {/* 統計情報表示エリア */}
        <div className="space-y-6">
          {/* 基本統計 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">基本統計</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">文字数（空白含む）</p>
                <p className="text-2xl font-bold">{stats.charCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">単語数</p>
                <p className="text-2xl font-bold">{stats.wordCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">行数</p>
                <p className="text-2xl font-bold">{stats.lineCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">段落数</p>
                <p className="text-2xl font-bold">{stats.paragraphCount}</p>
              </div>
            </div>
          </div>

          {/* 文字種別統計 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">文字種別統計</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">英数字・かな漢字</p>
                <p className="text-2xl font-bold">{stats.alphaCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">数字</p>
                <p className="text-2xl font-bold">{stats.numericCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">空白文字</p>
                <p className="text-2xl font-bold">{stats.spaceCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">記号</p>
                <p className="text-2xl font-bold">{stats.symbolCount}</p>
              </div>
            </div>
          </div>

          {/* 頻出単語 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">頻出単語トップ10</h2>
            {stats.topWords.length > 0 ? (
              <div className="space-y-2">
                {stats.topWords.map((item, index) => (
                  <div
                    key={item.word}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex items-center">
                      <span className="w-8 text-gray-500">{index + 1}.</span>
                      <span className="font-mono">{item.word}</span>
                    </div>
                    <span className="text-gray-600">{item.count}回</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">単語がありません</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 