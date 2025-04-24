'use client';

import { useState } from 'react';
import { useMemo } from './hooks/useMemo';
import { SortType } from './types';

export default function MemoPage() {
  const { memos, addMemo, editMemo, deleteMemo, searchMemos, sortMemos } = useMemo();
  const [searchQuery, setSearchQuery] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newMemoText, setNewMemoText] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingText, setEditingText] = useState('');

  const displayedMemos = searchQuery ? searchMemos(searchQuery) : memos;

  const handleAddMemo = () => {
    if (newTitle.trim() && newMemoText.trim()) {
      addMemo(newTitle.trim(), newMemoText.trim());
      setNewTitle('');
      setNewMemoText('');
    }
  };

  const handleEditStart = (id: number, title: string, text: string) => {
    setEditingId(id);
    setEditingTitle(title);
    setEditingText(text);
  };

  const handleEditSave = (id: number) => {
    if (editingTitle.trim() && editingText.trim()) {
      editMemo(id, editingTitle.trim(), editingText.trim());
      setEditingId(null);
      setEditingTitle('');
      setEditingText('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">メモ帳</h1>

      {/* 検索とソート */}
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="メモを検索..."
          className="flex-1 p-2 border rounded"
        />
        <select
          onChange={(e) => sortMemos(e.target.value as SortType)}
          className="p-2 border rounded"
          defaultValue="updatedAt"
        >
          <option value="updatedAt">更新日時順</option>
          <option value="createdAt">作成日時順</option>
        </select>
      </div>

      {/* 新規メモ作成フォーム */}
      <div className="mb-6 p-4 border rounded bg-white shadow-sm">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="タイトルを入力..."
          className="w-full p-2 border rounded mb-2"
        />
        <textarea
          value={newMemoText}
          onChange={(e) => setNewMemoText(e.target.value)}
          placeholder="メモを入力..."
          className="w-full p-2 border rounded min-h-[100px] resize-none mb-2"
        />
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {newMemoText.length}文字
          </span>
          <button
            onClick={handleAddMemo}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            追加
          </button>
        </div>
      </div>

      {/* メモ一覧 */}
      <div className="space-y-4">
        {displayedMemos.map((memo) => (
          <div key={memo.id} className="p-4 border rounded bg-white shadow-sm">
            {editingId === memo.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <textarea
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="w-full p-2 border rounded min-h-[100px] resize-none"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {editingText.length}文字
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditSave(memo.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold">{memo.title}</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditStart(memo.id, memo.title, memo.text)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => deleteMemo(memo.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      削除
                    </button>
                  </div>
                </div>
                <p className="whitespace-pre-wrap mb-2">{memo.text}</p>
                <div className="text-right text-sm text-gray-500">
                  <div>{memo.text.length}文字</div>
                  <div>作成: {new Date(memo.createdAt).toLocaleString()}</div>
                  <div>更新: {new Date(memo.updatedAt).toLocaleString()}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 