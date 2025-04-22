import React, { useState, useMemo } from 'react';
import { TodoList } from './TodoList';
import { TodoFilter } from './TodoFilter';
import { useTodo } from '../hooks/useTodo';
import { FilterType } from '../types';

export const TodoApp: React.FC = () => {
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, reorderTodos } = useTodo();

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo.trim());
      setNewTodo('');
    }
  };

  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const completedTodoCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">TODOリスト</h1>
      <div className="text-sm text-gray-600 mb-4">
        <span>未完了: {activeTodoCount}件</span>
        <span className="mx-2">|</span>
        <span>完了済み: {completedTodoCount}件</span>
      </div>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="新しいTODOを入力"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          追加
        </button>
      </form>
      <TodoFilter currentFilter={filter} onFilterChange={setFilter} />
      <TodoList
        todos={filteredTodos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        onEdit={editTodo}
        onReorder={reorderTodos}
      />
    </div>
  );
}; 