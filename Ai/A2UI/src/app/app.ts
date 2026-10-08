import { Component, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CopilotChat, registerFrontendTool, connectAgentContext } from '@copilotkit/angular';
import { z } from 'zod';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export type FilterType = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, CopilotChat],
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
    const saved = localStorage.getItem('todos');
    if (saved) {
      try {
        this.todos.set(JSON.parse(saved));
      } catch (e) {}
    }

    effect(() => {
      localStorage.setItem('todos', JSON.stringify(this.todos()));
    });

    connectAgentContext(() => ({
      description: 'Current todo list',
      value: JSON.stringify(this.todos()),
    }));

    registerFrontendTool<{ title: string }>({
      name: 'addTodo',
      description: 'Add a new todo item to the list',
      parameters: z.object({ title: z.string().describe('The title of the todo item') }),
      handler: async ({ title }) => {
        this.todos.update(todos => [...todos, { id: crypto.randomUUID(), title, completed: false }]);
        return `Added todo: "${title}"`;
      },
    });

    registerFrontendTool<{ id: string }>({
      name: 'removeTodo',
      description: 'Remove a todo item by its id',
      parameters: z.object({ id: z.string().describe('The id of the todo to remove') }),
      handler: async ({ id }) => {
        this.todos.update(todos => todos.filter(t => t.id !== id));
        return `Removed todo ${id}`;
      },
    });

    registerFrontendTool<{ id: string }>({
      name: 'toggleTodo',
      description: 'Toggle the completed state of a todo item by its id',
      parameters: z.object({ id: z.string().describe('The id of the todo to toggle') }),
      handler: async ({ id }) => {
        this.todos.update(todos => todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
        return `Toggled todo ${id}`;
      },
    });

    registerFrontendTool<Record<string, never>>({
      name: 'clearCompleted',
      description: 'Remove all completed todo items',
      parameters: z.object({}),
      handler: async () => {
        this.todos.update(todos => todos.filter(t => !t.completed));
        return 'Cleared completed todos';
      },
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
