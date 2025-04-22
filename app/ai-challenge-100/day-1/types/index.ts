export type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export type FilterType = 'all' | 'active' | 'completed';

export type TodoListProps = {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
};

export type TodoFilterProps = {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}; 