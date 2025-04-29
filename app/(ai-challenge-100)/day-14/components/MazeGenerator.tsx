'use client';

import { useState, useEffect } from 'react';

interface MazeConfig {
  width: number;
  height: number;
  complexity: number; // 0-1の値で迷路の複雑さを制御
}

type Cell = {
  isWall: boolean;
  visited: boolean;
};

export default function MazeGenerator() {
  const [config, setConfig] = useState<MazeConfig>({
    width: 15,
    height: 15,
    complexity: 0.5,
  });
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // 迷路を初期化
  const initializeMaze = () => {
    const newMaze: Cell[][] = Array(config.height).fill(null).map(() =>
      Array(config.width).fill(null).map(() => ({
        isWall: true,
        visited: false,
      }))
    );
    return newMaze;
  };

  // 迷路を生成（深さ優先探索法）
  const generateMaze = () => {
    setIsGenerating(true);
    const newMaze = initializeMaze();

    // スタート地点
    const startY = 1;
    const startX = 1;
    newMaze[startY][startX].isWall = false;
    newMaze[startY][startX].visited = true;

    // DFSで迷路生成
    const stack: [number, number][] = [[startY, startX]];
    const directions = [
      [0, 2], [2, 0], [0, -2], [-2, 0]
    ];
    while (stack.length > 0) {
      const [y, x] = stack[stack.length - 1];
      // シャッフルしてランダム性を調整
      const shuffled = directions
        .map(dir => ({ dir, sort: Math.random() + config.complexity }))
        .sort((a, b) => a.sort - b.sort)
        .map(obj => obj.dir);
      let moved = false;
      for (const [dy, dx] of shuffled) {
        const ny = y + dy;
        const nx = x + dx;
        if (
          ny > 0 && ny < config.height - 1 &&
          nx > 0 && nx < config.width - 1 &&
          newMaze[ny][nx].isWall
        ) {
          // 間の壁を壊す
          newMaze[y + dy / 2][x + dx / 2].isWall = false;
          newMaze[ny][nx].isWall = false;
          newMaze[ny][nx].visited = true;
          stack.push([ny, nx]);
          moved = true;
          break;
        }
      }
      if (!moved) {
        stack.pop();
      }
    }

    // 外周を壁にする
    for (let y = 0; y < config.height; y++) {
      newMaze[y][0].isWall = true;
      newMaze[y][config.width - 1].isWall = true;
    }
    for (let x = 0; x < config.width; x++) {
      newMaze[0][x].isWall = true;
      newMaze[config.height - 1][x].isWall = true;
    }

    // 入り口と出口を作成
    newMaze[1][0].isWall = false; // 入り口
    newMaze[config.height - 2][config.width - 1].isWall = false; // 出口

    setMaze(newMaze);
    setIsGenerating(false);
  };

  // 迷路生成
  useEffect(() => {
    generateMaze();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">迷路生成</h1>

      {/* 設定パネル */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="space-y-4">
          {/* サイズ設定 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              迷路のサイズ（{config.width}x{config.height}）
            </label>
            <input
              type="range"
              min="5"
              max="31"
              step="2"
              value={config.width}
              onChange={(e) => {
                const size = parseInt(e.target.value);
                setConfig(prev => ({ ...prev, width: size, height: size }));
              }}
              className="w-full"
            />
          </div>

          {/* 複雑さ設定 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              複雑さ（{Math.round(config.complexity * 100)}%）
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={config.complexity * 100}
              onChange={(e) => {
                setConfig(prev => ({
                  ...prev,
                  complexity: parseInt(e.target.value) / 100
                }));
              }}
              className="w-full"
            />
          </div>

          {/* 再生成ボタン */}
          <button
            onClick={generateMaze}
            disabled={isGenerating}
            className={`w-full py-2 rounded-lg text-white font-medium
              ${isGenerating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {isGenerating ? '生成中...' : '迷路を再生成'}
          </button>
        </div>
      </div>

      {/* 迷路表示 */}
      <div className="bg-white p-6 rounded-lg shadow-sm overflow-auto">
        <div
          className="grid gap-0 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${config.width}, minmax(0, 1fr))`,
            width: 'fit-content'
          }}
        >
          {maze.map((row, y) =>
            row.map((cell, x) => {
              // 入り口・出口の色分け
              const isEntrance = y === 1 && x === 0;
              const isExit = y === config.height - 2 && x === config.width - 1;
              return (
                <div
                  key={`${y}-${x}`}
                  className={`w-6 h-6 border-none
                    ${isEntrance ? 'bg-green-400' : isExit ? 'bg-red-400' : cell.isWall ? 'bg-gray-800' : 'bg-white'}`}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
} 