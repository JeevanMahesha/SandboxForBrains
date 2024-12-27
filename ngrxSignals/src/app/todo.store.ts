import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Todo } from './todo.model';
import { inject } from '@angular/core';
import { AppService } from './app.service';

export type TodoFilter = 'all' | 'completed' | 'pending';

type TodoState = {
  todos: Todo[];
  isLoading: boolean;
  filter: TodoFilter;
};

const initialState: TodoState = {
  todos: [],
  isLoading: false,
  filter: 'all',
};

export const TodoStore = signalStore(
  withState(initialState),
  withMethods((storeValue, todoService = inject(AppService)) => ({
    async loadTodos() {
      patchState(storeValue, { isLoading: true });
      const todos = await todoService.getTodos();
      patchState(storeValue, { todos, isLoading: false });
    },

    async addTodo(title: string) {
      const newTodo = (await todoService.addTodo({
        title,
        completed: false,
      })) as Todo;
      patchState(storeValue, (currentState) => ({
        todos: [...currentState.todos, newTodo],
      }));
    },

    async deleteTodo(id: string) {
      await todoService.deleteTodo(id);
      patchState(storeValue, (currentState) => ({
        todos: currentState.todos.filter((todo) => todo.id !== id),
      }));
    },

    async updateTodoStatus(id: string, completed: boolean) {
      await todoService.updateTodo(id, completed);
      patchState(storeValue, (currentState) => ({
        todos: currentState.todos.map((todo) =>
          todo.id === id ? { ...todo, completed } : todo
        ),
      }));
    },

    setFilter(filter: TodoFilter) {
      patchState(storeValue, { filter });
    },
  }))
);
