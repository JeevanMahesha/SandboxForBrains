import { Component, inject } from '@angular/core';
import { TodoStore } from './todo.store';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent {
  userNameControl: string | null = null
  todoStore = inject(TodoStore)

  constructor() {
    this.todoStore.getTodo()

  }

  addNewUserName() {
    this.todoStore.addTodo({
      userName: this.userNameControl!
    })
  }

}
