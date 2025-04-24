'use client';

import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Todo } from '../types';
import { TodoListProps } from '../types/index';

export default function TodoList({ todos, onToggle, onDelete, onReorder }: TodoListProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(result.source.index, result.destination.index);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="todos">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {todos.map((todo, index) => (
              <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="flex items-center p-4 bg-white rounded-lg shadow"
                  >
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => onToggle(todo.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span
                      className={`ml-3 ${
                        todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}
                    >
                      {todo.text}
                    </span>
                    <button
                      onClick={() => onDelete(todo.id)}
                      className="ml-auto text-red-600 hover:text-red-800"
                    >
                      削除
                    </button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
} 