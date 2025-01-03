import { NgStyle } from '@angular/common';
import { Component, effect, inject, viewChild } from '@angular/core';
import {
  MatButtonToggleChange,
  MatButtonToggleGroup,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TodoFilter, TodoWithOutRxjsStore } from './todo.with-out-rxjs.store';
import { WithOutRxJsService } from './with-out-rx-js.service';

@Component({
  selector: 'app-with-out-rx-js',
  imports: [
    MatInputModule,
    MatButtonToggleModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgStyle,
  ],
  providers: [TodoWithOutRxjsStore, WithOutRxJsService],
  templateUrl: './with-out-rx-js.component.html',
  styleUrl: './with-out-rx-js.component.css',
})
export class WithOutRxJsComponent {
  todoStore = inject(TodoWithOutRxjsStore);
  filter = viewChild.required(MatButtonToggleGroup);

  constructor() {
    effect(() => {
      setTimeout(() => {
        this.filter().value = this.todoStore.filter();
      }, 1000);
    });
  }

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

  filterStatus(filterEvent: MatButtonToggleChange): void {
    const filter = filterEvent.value as TodoFilter;
    this.todoStore.setFilter(filter);
  }
}
