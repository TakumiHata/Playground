'use client';

import { useState, useEffect } from 'react';

type Category = 'length' | 'weight' | 'temperature' | 'time';

interface Unit {
  name: string;
  symbol: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

const units: Record<Category, Unit[]> = {
  length: [
    { name: 'ミリメートル', symbol: 'mm', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: 'センチメートル', symbol: 'cm', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { name: 'メートル', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
    { name: 'キロメートル', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { name: 'インチ', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    { name: 'フィート', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { name: 'ヤード', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    { name: 'マイル', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
  ],
  weight: [
    { name: 'ミリグラム', symbol: 'mg', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
    { name: 'グラム', symbol: 'g', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: 'キログラム', symbol: 'kg', toBase: (v) => v, fromBase: (v) => v },
    { name: 'トン', symbol: 't', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { name: 'オンス', symbol: 'oz', toBase: (v) => v * 0.028349523125, fromBase: (v) => v / 0.028349523125 },
    { name: 'ポンド', symbol: 'lb', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
  ],
  temperature: [
    { name: '摂氏', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
    { name: '華氏', symbol: '°F', toBase: (v) => (v - 32) * 5/9, fromBase: (v) => v * 9/5 + 32 },
    { name: 'ケルビン', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
  time: [
    { name: 'ミリ秒', symbol: 'ms', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: '秒', symbol: 's', toBase: (v) => v, fromBase: (v) => v },
    { name: '分', symbol: 'min', toBase: (v) => v * 60, fromBase: (v) => v / 60 },
    { name: '時間', symbol: 'h', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
    { name: '日', symbol: 'd', toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
  ],
};

const categoryNames: Record<Category, string> = {
  length: '長さ',
  weight: '重さ',
  temperature: '温度',
  time: '時間',
};

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>('length');
  const [fromUnit, setFromUnit] = useState(0);
  const [toUnit, setToUnit] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    setError('');
    const value = parseFloat(inputValue);
    
    if (isNaN(value)) {
      setError('数値を入力してください');
      setResult('');
      return;
    }

    const fromUnitObj = units[category][fromUnit];
    const toUnitObj = units[category][toUnit];

    const baseValue = fromUnitObj.toBase(value);
    const convertedValue = toUnitObj.fromBase(baseValue);

    setResult(convertedValue.toFixed(6).replace(/\.?0+$/, ''));
  };

  useEffect(() => {
    convert();
  }, [category, fromUnit, toUnit, inputValue]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">単位変換アプリ</h1>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          カテゴリ
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="w-full p-2 border rounded"
        >
          {Object.entries(categoryNames).map(([key, name]) => (
            <option key={key} value={key}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            変換元
          </label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            {units[category].map((unit, index) => (
              <option key={index} value={index}>
                {unit.name} ({unit.symbol})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            変換先
          </label>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            {units[category].map((unit, index) => (
              <option key={index} value={index}>
                {unit.name} ({unit.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          値
        </label>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="数値を入力"
          className="w-full p-2 border rounded"
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm mb-4">{error}</div>
      )}

      {result && !error && (
        <div className="text-center">
          <div className="text-gray-600 text-sm mb-1">変換結果</div>
          <div className="text-2xl font-bold">
            {result} {units[category][toUnit].symbol}
          </div>
        </div>
      )}
    </div>
  );
} 