import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-todo-list',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent {
  constructor() {}
  items = ['Todo-1', 'Todo-2', 'Todo-3'];

  ngOnInit() {}

  addTodo(todo: string): void {
    this.items.push(todo);
  }

  removeTodo(todo: string): void {
    let idx = -1;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i] == todo) {
        idx = i;
      }
    }
    if (idx != -1) {
      this.items.splice(idx, 1);
    }
  }
}
