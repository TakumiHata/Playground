import { Metadata } from 'next';
import TodoApp from '../components/TodoApp';

export const metadata: Metadata = {
  title: 'TODOリスト - AI駆動開発100本ノック Day 1',
  description: 'シンプルなTODOリストアプリケーション',
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <TodoApp />
      </div>
    </main>
  );
} 