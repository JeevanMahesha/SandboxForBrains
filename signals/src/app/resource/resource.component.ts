import { NgClass } from '@angular/common';
import { Component, resource, ResourceStatus, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-resource',
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, NgClass],
  standalone: true,
  templateUrl: './resource.component.html',
})
export class ResourceComponent {
  readonly resourceStatus = ResourceStatus;
  readonly limitDropDownValues = Array.from({ length: 10 }, (_, i) => i + 1);
  readonly selectedLimit = signal(5);
  readonly user = resource<ITodo[], number>({
    request: this.selectedLimit,
    loader: ({ request: limitValue }) =>
      fetch(
        'https://dummyjson.com/todos?limit='.concat(limitValue.toString())
      ).then((res) => res.json().then((data) => data.todos)),
  });
  readonly statusColorCode = {
    0: 'light',
    1: 'danger',
    2: 'warning',
    3: 'info',
    4: 'success',
    5: 'primary',
  };

  addNewTodo() {
    const currentId = this.user.value()!.length;
    const newTodo = this.getRandomTodo(currentId);
    this.user.update((todos) => [...todos!, newTodo]);
  }

  getResourceStatusKey(value: number): string {
    for (const key in ResourceStatus) {
      if (ResourceStatus[key as keyof typeof ResourceStatus] === value) {
        return key;
      }
    }
    return 'No status found';
  }

  private getRandomTodo(currentId: number): ITodo {
    const newTodo: ITodo = {
      id: currentId + 1,
      todo: this.generateRandomTodoTitle(),
      completed: Math.random() > 0.5,
      userId: Math.floor(Math.random() * 100) + 100,
    };
    return newTodo;
  }

  private generateRandomTodoTitle(): string {
    const randomTodos = [
      'Read a new book',
      'Practice JavaScript',
      'Write a blog post',
      'Try a new framework',
      'Work on an open-source project',
      'Explore Angular Signals',
      'Learn RxJS operators',
      'Build a personal portfolio',
      'Contribute to GitHub',
      'Take a break and relax',
    ];
    const randomIndex = Math.floor(Math.random() * randomTodos.length);
    return randomTodos[randomIndex];
  }
}

export interface ITodo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}
