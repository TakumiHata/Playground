export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export type FilterType = 'all' | 'active' | 'completed';

export interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onReorder: (todos: Todo[]) => void;
} 