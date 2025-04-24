'use client';

import { useState, useEffect, useCallback } from 'react';
import { Memo, UseMemoReturn, SortType } from '../types';

export function useMemo(): UseMemoReturn {
  const [memos, setMemos] = useState<Memo[]>([]);

  // 初期データの読み込み
  useEffect(() => {
    const savedMemos = localStorage.getItem('memos');
    if (savedMemos) {
      setMemos(JSON.parse(savedMemos));
    }
  }, []);

  // メモの追加
  const addMemo = useCallback((title: string, text: string) => {
    const now = Date.now();
    const newMemo: Memo = {
      id: now,
      title,
      text,
      createdAt: now,
      updatedAt: now,
    };
    setMemos((prevMemos) => {
      const updatedMemos = [...prevMemos, newMemo];
      localStorage.setItem('memos', JSON.stringify(updatedMemos));
      return updatedMemos;
    });
  }, []);

  // メモの編集
  const editMemo = useCallback((id: number, title: string, text: string) => {
    setMemos((prevMemos) => {
      const updatedMemos = prevMemos.map((memo) =>
        memo.id === id
          ? { ...memo, title, text, updatedAt: Date.now() }
          : memo
      );
      localStorage.setItem('memos', JSON.stringify(updatedMemos));
      return updatedMemos;
    });
  }, []);

  // メモの削除
  const deleteMemo = useCallback((id: number) => {
    setMemos((prevMemos) => {
      const updatedMemos = prevMemos.filter((memo) => memo.id !== id);
      localStorage.setItem('memos', JSON.stringify(updatedMemos));
      return updatedMemos;
    });
  }, []);

  // メモの検索
  const searchMemos = useCallback((query: string) => {
    if (!query.trim()) return memos;
    const lowerQuery = query.toLowerCase();
    return memos.filter(
      (memo) =>
        (memo.title?.toLowerCase() || '').includes(lowerQuery) ||
        (memo.text?.toLowerCase() || '').includes(lowerQuery)
    );
  }, [memos]);

  // メモのソート
  const sortMemos = useCallback((sortBy: SortType) => {
    setMemos((prevMemos) => {
      const sortedMemos = [...prevMemos].sort((a, b) => b[sortBy] - a[sortBy]);
      return sortedMemos;
    });
  }, []);

  return {
    memos,
    addMemo,
    editMemo,
    deleteMemo,
    searchMemos,
    sortMemos,
  };
} 