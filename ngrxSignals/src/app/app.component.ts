import { Component, inject, OnInit } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TodoStore } from './todo.store';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [TodoStore],
  imports: [
    MatInputModule,
    MatButtonToggleModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgStyle,
  ],
})
export class AppComponent implements OnInit {
  title = 'ngrxSignals';
  todoStore = inject(TodoStore);

  async ngOnInit() {
    await this.todoStore.loadTodos();
  }

  addTodo(todoTitle: string): void {
    this.todoStore.addTodo(todoTitle);
  }

  deleteTodo(todoId: string, $event: MouseEvent): void {
    $event.stopPropagation();
    this.todoStore.deleteTodo(todoId);
  }

  toggleTodoStatus(todoId: string, completed: boolean): void {
    this.todoStore.updateTodoStatus(todoId, completed);
  }
}
