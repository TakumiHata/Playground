'use client';

import { useState, useEffect } from 'react';

interface DiceConfig {
  faces: number;
  count: number;
}

interface RollResult {
  values: number[];
  total: number;
  timestamp: number;
}

const DICE_TYPES = [
  { faces: 4, label: 'D4' },
  { faces: 6, label: 'D6' },
  { faces: 8, label: 'D8' },
  { faces: 10, label: 'D10' },
  { faces: 12, label: 'D12' },
  { faces: 20, label: 'D20' },
  { faces: 100, label: 'D100' },
];

export default function DiceSimulator() {
  const [selectedDice, setSelectedDice] = useState<DiceConfig>({
    faces: 6,
    count: 1,
  });
  const [isRolling, setIsRolling] = useState(false);
  const [results, setResults] = useState<RollResult[]>([]);
  const [animationValues, setAnimationValues] = useState<number[]>([]);

  // サイコロを振る
  const rollDice = () => {
    if (isRolling) return;

    setIsRolling(true);
    const finalValues: number[] = [];
    
    // 最終的な値を事前に決定
    for (let i = 0; i < selectedDice.count; i++) {
      finalValues.push(Math.floor(Math.random() * selectedDice.faces) + 1);
    }

    // アニメーション
    let count = 0;
    const animationInterval = setInterval(() => {
      count++;
      const animatedValues = Array(selectedDice.count).fill(0).map(() => 
        Math.floor(Math.random() * selectedDice.faces) + 1
      );
      setAnimationValues(animatedValues);

      if (count >= 10) {
        clearInterval(animationInterval);
        setAnimationValues(finalValues);
        setIsRolling(false);

        // 結果を保存
        const total = finalValues.reduce((sum, val) => sum + val, 0);
        setResults(prev => [{
          values: finalValues,
          total,
          timestamp: Date.now(),
        }, ...prev].slice(0, 10)); // 最新10件のみ保持
      }
    }, 100);
  };

  // サイコロの面数を変更
  const handleFacesChange = (faces: number) => {
    setSelectedDice(prev => ({ ...prev, faces }));
    setAnimationValues([]);
  };

  // サイコロの個数を変更
  const handleCountChange = (count: number) => {
    setSelectedDice(prev => ({ ...prev, count }));
    setAnimationValues([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">サイコロシミュレーター</h1>

      {/* 設定エリア */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="space-y-4">
          {/* サイコロタイプ選択 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              サイコロの種類
            </label>
            <div className="flex flex-wrap gap-2">
              {DICE_TYPES.map((dice) => (
                <button
                  key={dice.faces}
                  onClick={() => handleFacesChange(dice.faces)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors
                    ${selectedDice.faces === dice.faces
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {dice.label}
                </button>
              ))}
            </div>
          </div>

          {/* サイコロの個数選択 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              サイコロの個数
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="10"
                value={selectedDice.count}
                onChange={(e) => handleCountChange(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-lg font-medium w-8 text-center">
                {selectedDice.count}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* サイコロを振るボタン */}
      <div className="text-center mb-8">
        <button
          onClick={rollDice}
          disabled={isRolling}
          className={`px-8 py-3 rounded-lg text-white font-medium text-lg transition-all
            ${isRolling
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 transform hover:scale-105'}`}
        >
          {isRolling ? '振っています...' : 'サイコロを振る！'}
        </button>
      </div>

      {/* 現在の出目表示 */}
      {animationValues.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap gap-4 justify-center mb-4">
            {animationValues.map((value, index) => (
              <div
                key={index}
                className={`w-16 h-16 flex items-center justify-center rounded-lg text-2xl font-bold
                  ${isRolling ? 'bg-yellow-100' : 'bg-blue-100'}`}
                style={{
                  transform: isRolling ? `rotate(${Math.random() * 360}deg)` : 'none',
                  transition: 'transform 0.1s'
                }}
              >
                {value}
              </div>
            ))}
          </div>
          {!isRolling && animationValues.length > 0 && (
            <div className="text-center text-xl font-bold text-gray-700">
              合計: {animationValues.reduce((sum, val) => sum + val, 0)}
            </div>
          )}
        </div>
      )}

      {/* 履歴表示 */}
      {results.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">履歴</h2>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={result.timestamp}
                className="p-4 bg-gray-50 rounded flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">#{results.length - index}:</span>
                  <div className="flex gap-2">
                    {result.values.map((value, i) => (
                      <span
                        key={i}
                        className="inline-block px-2 py-1 bg-blue-100 rounded text-sm"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="font-medium">
                  合計: {result.total}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 