import React from 'react';
import { FilterType } from '../types';

interface TodoFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const TodoFilter: React.FC<TodoFilterProps> = ({
  currentFilter,
  onFilterChange,
}) => {
  return (
    <div className="flex justify-center gap-4 my-4">
      <button
        className={`px-4 py-2 rounded ${
          currentFilter === 'all'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
        onClick={() => onFilterChange('all')}
      >
        すべて
      </button>
      <button
        className={`px-4 py-2 rounded ${
          currentFilter === 'active'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
        onClick={() => onFilterChange('active')}
      >
        未完了
      </button>
      <button
        className={`px-4 py-2 rounded ${
          currentFilter === 'completed'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 hover:bg-gray-300'
        }`}
        onClick={() => onFilterChange('completed')}
      >
        完了済み
      </button>
    </div>
  );
}; 