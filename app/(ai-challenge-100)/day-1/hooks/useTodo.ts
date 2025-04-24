'use client';

import { useState, useEffect, useCallback } from 'react';
import { Todo } from '../types';

export function useTodo() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  const addTodo = useCallback((text: string) => {
    const newTodo: Todo = {
      id: Number(Date.now().toString()),
      text,
      completed: false,
    };
    setTodos(prevTodos => {
      const updatedTodos = [...prevTodos, newTodo];
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
      return updatedTodos;
    });
  }, []);

  const toggleTodo = useCallback((id: number) => {
    setTodos(prevTodos => {
      const updatedTodos = prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
      return updatedTodos;
    });
  }, []);

  const deleteTodo = useCallback((id: number) => {
    setTodos(prevTodos => {
      const updatedTodos = prevTodos.filter(todo => todo.id !== id);
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
      return updatedTodos;
    });
  }, []);

  const editTodo = useCallback((id: number, newText: string) => {
    setTodos(prevTodos => {
      const updatedTodos = prevTodos.map(todo =>
        todo.id === id ? { ...todo, text: newText } : todo
      );
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
      return updatedTodos;
    });
  }, []);

  const reorderTodos = useCallback((fromIndex: number, toIndex: number) => {
    setTodos((prevTodos) => {
      const items = Array.from(prevTodos);
      const [reorderedItem] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, reorderedItem);
      localStorage.setItem('todos', JSON.stringify(items));
      return items;
    });
  }, []);

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    reorderTodos,
  };
} 