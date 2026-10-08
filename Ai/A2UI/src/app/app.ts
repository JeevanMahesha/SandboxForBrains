import { Component, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export type FilterType = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // State
  todos = signal<Todo[]>([
    { id: '1', title: 'Master Angular Signals', completed: true },
    { id: '2', title: 'Build a premium UI', completed: false },
    { id: '3', title: 'Explore modern web animations', completed: false },
  ]);

  newTodoTitle = signal('');
  filter = signal<FilterType>('all');

  // Computed state
  filteredTodos = computed(() => {
    const currentTodos = this.todos();
    const currentFilter = this.filter();

    switch (currentFilter) {
      case 'active':
        return currentTodos.filter((todo) => !todo.completed);
      case 'completed':
        return currentTodos.filter((todo) => todo.completed);
      case 'all':
      default:
        return currentTodos;
    }
  });

  activeCount = computed(() => {
    return this.todos().filter((todo) => !todo.completed).length;
  });

  constructor() {
    // Optionally load from local storage
    const saved = localStorage.getItem('todos');
    if (saved) {
      try {
        this.todos.set(JSON.parse(saved));
      } catch (e) {}
    }

    // Save to local storage on change
    effect(() => {
      localStorage.setItem('todos', JSON.stringify(this.todos()));
    });
  }

  // Actions
  addTodo() {
    const title = this.newTodoTitle().trim();
    if (title) {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        title,
        completed: false,
      };
      this.todos.update((todos) => [...todos, newTodo]);
      this.newTodoTitle.set('');
    }
  }

  toggleTodo(id: string) {
    this.todos.update((todos) =>
      todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    );
  }

  removeTodo(id: string) {
    this.todos.update((todos) => todos.filter((todo) => todo.id !== id));
  }

  setFilter(filter: FilterType) {
    this.filter.set(filter);
  }

  clearCompleted() {
    this.todos.update((todos) => todos.filter((todo) => !todo.completed));
  }
}
