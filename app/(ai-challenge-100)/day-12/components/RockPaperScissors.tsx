'use client';

import { useState, useEffect } from 'react';

type Hand = 'rock' | 'paper' | 'scissors';
type Result = 'win' | 'lose' | 'draw';

interface GameStats {
  total: number;
  wins: number;
  losses: number;
  draws: number;
}

const HANDS: { value: Hand; label: string; emoji: string }[] = [
  { value: 'rock', label: 'グー', emoji: '✊' },
  { value: 'scissors', label: 'チョキ', emoji: '✌️' },
  { value: 'paper', label: 'パー', emoji: '✋' },
];

const INITIAL_STATS: GameStats = {
  total: 0,
  wins: 0,
  losses: 0,
  draws: 0,
};

export default function RockPaperScissors() {
  const [playerHand, setPlayerHand] = useState<Hand | null>(null);
  const [computerHand, setComputerHand] = useState<Hand | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [stats, setStats] = useState<GameStats>(INITIAL_STATS);
  const [showResult, setShowResult] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // 勝敗判定ロジック
  const determineWinner = (player: Hand, computer: Hand): Result => {
    if (player === computer) return 'draw';
    
    const winConditions = {
      rock: 'scissors',
      scissors: 'paper',
      paper: 'rock',
    };

    return winConditions[player] === computer ? 'win' : 'lose';
  };

  // コンピュータの手をランダムに生成
  const generateComputerHand = (): Hand => {
    const hands: Hand[] = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * hands.length);
    return hands[randomIndex];
  };

  // プレイヤーの手の選択時の処理
  const handleSelectHand = (hand: Hand) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setPlayerHand(hand);
    setComputerHand(null);
    setShowResult(false);

    // じゃんけんのカウントダウンアニメーション
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setComputerHand(generateComputerHand());
      
      if (count === 10) {
        clearInterval(interval);
        const computer = generateComputerHand();
        setComputerHand(computer);
        const gameResult = determineWinner(hand, computer);
        setResult(gameResult);
        setShowResult(true);
        setIsAnimating(false);
        
        // 統計の更新
        setStats(prev => ({
          total: prev.total + 1,
          wins: prev.wins + (gameResult === 'win' ? 1 : 0),
          losses: prev.losses + (gameResult === 'lose' ? 1 : 0),
          draws: prev.draws + (gameResult === 'draw' ? 1 : 0),
        }));
      }
    }, 100);
  };

  // 結果のテキストを取得
  const getResultText = (): string => {
    if (!result) return '';
    switch (result) {
      case 'win': return 'あなたの勝ち！🎉';
      case 'lose': return 'コンピュータの勝ち！😢';
      case 'draw': return 'あいこ！🤝';
    }
  };

  // 手のラベルを取得
  const getHandLabel = (hand: Hand | null): string => {
    if (!hand) return '？';
    return HANDS.find(h => h.value === hand)?.emoji || '';
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">じゃんけんゲーム</h1>

      {/* ゲーム画面 */}
      <div className="mb-8">
        {/* 対戦表示 */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-gray-600">あなた</p>
            <div className="text-6xl">
              {playerHand ? getHandLabel(playerHand) : '👊'}
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-400">VS</div>
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-gray-600">コンピュータ</p>
            <div className="text-6xl">
              {computerHand ? getHandLabel(computerHand) : '👊'}
            </div>
          </div>
        </div>

        {/* 結果表示 */}
        {showResult && (
          <div className={`text-center p-4 rounded-lg mb-8 text-xl font-bold
            ${result === 'win' ? 'bg-green-100 text-green-700' :
              result === 'lose' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'}`}
          >
            {getResultText()}
          </div>
        )}

        {/* 手の選択ボタン */}
        <div className="grid grid-cols-3 gap-4">
          {HANDS.map((hand) => (
            <button
              key={hand.value}
              onClick={() => handleSelectHand(hand.value)}
              disabled={isAnimating}
              className={`p-4 rounded-lg text-center transition-all
                ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}
                ${playerHand === hand.value ? 'bg-blue-100' : 'bg-white'}`}
            >
              <div className="text-4xl mb-2">{hand.emoji}</div>
              <div className="text-sm font-medium text-gray-600">{hand.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 統計情報 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">戦績</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">総対戦数</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">勝ち</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.wins}
              <span className="text-sm text-gray-400 ml-1">
                ({stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0}%)
              </span>
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">負け</p>
            <p className="text-2xl font-bold text-red-600">
              {stats.losses}
              <span className="text-sm text-gray-400 ml-1">
                ({stats.total > 0 ? Math.round((stats.losses / stats.total) * 100) : 0}%)
              </span>
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">あいこ</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.draws}
              <span className="text-sm text-gray-400 ml-1">
                ({stats.total > 0 ? Math.round((stats.draws / stats.total) * 100) : 0}%)
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 