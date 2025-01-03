import { Injectable } from '@angular/core';
import { TODOS } from './mock-data';
import { Todo } from '../todo.model';

@Injectable()
export class WithOutRxJsService {
  async getTodos() {
    await sleep(1000);
    return TODOS;
  }

  async addTodo(todo: Partial<Todo>) {
    await sleep(1000);
    const newTodo = {
      id: Math.random().toString(36).substr(2, 9),
      ...todo,
    };
    return newTodo;
  }

  async deleteTodo(id: string) {
    await sleep(1000);
  }

  async updateTodo(taskId: string, completed: boolean) {
    {
      await sleep(1000);
    }
  }
}
async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
