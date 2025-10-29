import { Injectable } from '@angular/core';
import { ITodo } from './todo.model';
import { of } from 'rxjs';

@Injectable()
export class TodoService {

  todoList: ITodo[] = [{
    userName: 'G1'
  },
  {
    userName: 'R1'
  }]

  getTodo() {
    return of(this.todoList)
  }

  addNewUserTodo(userName: string) {
    this.todoList.push({ userName })
    return this.getTodo()
  }

}
