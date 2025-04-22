import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Todo } from '../types';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onDelete,
  onEdit,
  onReorder,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const handleEditStart = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleEditSave = (id: number) => {
    if (editText.trim()) {
      onEdit(id, editText.trim());
      setEditingId(null);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    onReorder(result.source.index, result.destination.index);
  };

  if (todos.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-4">
        TODOがありません
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="todos">
        {(provided) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {todos.map((todo, index) => (
              <Draggable
                key={todo.id}
                draggableId={todo.id.toString()}
                index={index}
              >
                {(provided) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="flex items-center justify-between p-2 bg-white border rounded"
                  >
                    {editingId === todo.id ? (
                      <div className="flex items-center flex-1 mr-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="flex-1 p-1 border rounded mr-2"
                          autoFocus
                        />
                        <button
                          onClick={() => handleEditSave(todo.id)}
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                        >
                          保存
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          キャンセル
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => onToggle(todo.id)}
                            className="mr-2"
                          />
                          <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                            {todo.text}
                          </span>
                        </div>
                        <div>
                          <button
                            onClick={() => handleEditStart(todo)}
                            className="text-blue-500 hover:text-blue-700 mr-2"
                          >
                            編集
                          </button>
                          <button
                            onClick={() => onDelete(todo.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            削除
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}; 