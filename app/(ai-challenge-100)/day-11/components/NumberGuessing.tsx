'use client';

import { useState, useEffect } from 'react';

interface DifficultyLevel {
  name: string;
  min: number;
  max: number;
}

const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  { name: '初級', min: 1, max: 50 },
  { name: '中級', min: 1, max: 100 },
  { name: '上級', min: 1, max: 500 },
  { name: '超級', min: 1, max: 1000 },
];

export default function NumberGuessing() {
  const [targetNumber, setTargetNumber] = useState<number | null>(null);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(DIFFICULTY_LEVELS[0]);
  const [bestScores, setBestScores] = useState<Record<string, number>>({});
  const [showRules, setShowRules] = useState(true);

  // ゲームの初期化
  const initializeGame = () => {
    const randomNumber = Math.floor(
      Math.random() * (selectedDifficulty.max - selectedDifficulty.min + 1)
    ) + selectedDifficulty.min;
    setTargetNumber(randomNumber);
    setGuess('');
    setAttempts(0);
    setFeedback('');
    setGameOver(false);
    setShowRules(false);
  };

  // 難易度変更時の処理
  const handleDifficultyChange = (difficulty: DifficultyLevel) => {
    setSelectedDifficulty(difficulty);
    setShowRules(true);
    setTargetNumber(null);
    setGuess('');
    setAttempts(0);
    setFeedback('');
    setGameOver(false);
  };

  // 予想を処理
  const handleGuess = () => {
    if (!targetNumber || gameOver) return;

    const guessNumber = parseInt(guess);
    if (isNaN(guessNumber)) {
      setFeedback('有効な数字を入力してください');
      return;
    }

    if (guessNumber < selectedDifficulty.min || guessNumber > selectedDifficulty.max) {
      setFeedback(`${selectedDifficulty.min}から${selectedDifficulty.max}までの数字を入力してください`);
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (guessNumber === targetNumber) {
      setFeedback('正解！おめでとうございます！🎉');
      setGameOver(true);
      // ベストスコアの更新
      const currentBest = bestScores[selectedDifficulty.name] || Infinity;
      if (newAttempts < currentBest) {
        setBestScores(prev => ({
          ...prev,
          [selectedDifficulty.name]: newAttempts
        }));
      }
    } else {
      setFeedback(
        guessNumber < targetNumber
          ? 'もっと大きい数字です ⬆️'
          : 'もっと小さい数字です ⬇️'
      );
    }
    setGuess('');
  };

  // キーボードイベントの処理
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGuess();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">数当てゲーム</h1>

      {/* 難易度選択 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">難易度を選択</h2>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTY_LEVELS.map((level) => (
            <button
              key={level.name}
              onClick={() => handleDifficultyChange(level)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors
                ${selectedDifficulty.name === level.name
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {level.name}
            </button>
          ))}
        </div>
      </div>

      {/* ゲームルール */}
      {showRules ? (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">ゲームルール</h2>
          <p className="text-gray-600 mb-4">
            {selectedDifficulty.min}から{selectedDifficulty.max}までの数字の中から、
            コンピュータが選んだ数字を当ててください。
          </p>
          <button
            onClick={initializeGame}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            ゲームを開始
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 入力エリア */}
          <div>
            <div className="flex gap-2">
              <input
                type="number"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`${selectedDifficulty.min}から${selectedDifficulty.max}までの数字`}
                className="flex-1 p-2 border rounded"
                min={selectedDifficulty.min}
                max={selectedDifficulty.max}
                disabled={gameOver}
              />
              <button
                onClick={handleGuess}
                disabled={gameOver}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                予想する
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              予想回数: {attempts}回
            </p>
          </div>

          {/* フィードバック */}
          {feedback && (
            <div className={`p-4 rounded text-center font-medium
              ${feedback.includes('正解')
                ? 'bg-green-100 text-green-700'
                : feedback.includes('大きい') || feedback.includes('小さい')
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'}`}
            >
              {feedback}
            </div>
          )}

          {/* ゲームオーバー時の操作 */}
          {gameOver && (
            <div className="text-center">
              <button
                onClick={initializeGame}
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                もう一度プレイ
              </button>
            </div>
          )}

          {/* ベストスコア */}
          {Object.keys(bestScores).length > 0 && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">ベストスコア</h2>
              <div className="space-y-2">
                {Object.entries(bestScores).map(([difficulty, score]) => (
                  <div key={difficulty} className="flex justify-between">
                    <span className="text-gray-600">{difficulty}:</span>
                    <span className="font-medium">{score}回</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 