'use client';

import { useRef, useState } from 'react';

const COLORS = [
  '#000000', '#FF0000', '#00AEEF', '#39B54A', '#FFF200', '#F26522', '#A349A4', '#FFFFFF', '#8C6239', '#808080'
];

export default function DrawingApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState<string>('#000000');
  const [lineWidth, setLineWidth] = useState<number>(4);
  const [isDrawing, setIsDrawing] = useState(false);
  const [eraser, setEraser] = useState(false);
  const [lastPos, setLastPos] = useState<{x: number, y: number} | null>(null);

  // 描画開始
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setIsDrawing(true);
    setLastPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // 描画終了
  const handlePointerUp = () => {
    setIsDrawing(false);
    setLastPos(null);
  };

  // 描画処理
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || !lastPos) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = eraser ? '#FFFFFF' : color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    setLastPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // クリア
  const handleClear = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  // 保存
  const handleSave = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'drawing.png';
      a.click();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">簡易ドローイングアプリ</h1>
      {/* ツールバー */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {/* 色選択 */}
        <div className="flex gap-1">
          {COLORS.map((c) => (
            <button
              key={c}
              className={`w-7 h-7 rounded-full border-2 ${color === c && !eraser ? 'border-blue-500' : 'border-gray-300'}`}
              style={{ background: c }}
              onClick={() => { setColor(c); setEraser(false); }}
              aria-label={`色: ${c}`}
            />
          ))}
        </div>
        {/* 線の太さ */}
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={1}
            max={24}
            value={lineWidth}
            onChange={e => setLineWidth(Number(e.target.value))}
          />
          <span className="w-8 text-center">{lineWidth}</span>
        </div>
        {/* 消しゴム */}
        <button
          className={`px-3 py-1 rounded border ${eraser ? 'bg-blue-200 border-blue-500' : 'bg-white border-gray-300'}`}
          onClick={() => setEraser(e => !e)}
        >
          消しゴム
        </button>
        {/* クリア */}
        <button
          className="px-3 py-1 rounded bg-gray-200 border border-gray-400"
          onClick={handleClear}
        >
          クリア
        </button>
        {/* 保存 */}
        <button
          className="px-3 py-1 rounded bg-green-400 text-white border border-green-600"
          onClick={handleSave}
        >
          保存
        </button>
      </div>
      {/* キャンバス */}
      <div className="bg-white rounded shadow border border-gray-300 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="touch-none cursor-crosshair"
          style={{ display: 'block' }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerMove={handlePointerMove}
        />
      </div>
    </div>
  );
} 