import { Component, resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-resource',
  imports: [MatFormFieldModule, MatSelectModule, FormsModule],
  standalone: true,
  templateUrl: './resource.component.html',
  styleUrl: './resource.component.css',
})
export class ResourceComponent {
  limitDropDownValues = Array.from({ length: 10 }, (_, i) => i + 1);
  selectedLimit = signal(5);
  user = resource<ITodo[], number>({
    request: this.selectedLimit,
    loader: ({ request: limitValue }) =>
      fetch(
        'https://dummyjson.com/todos?limit='.concat(limitValue.toString())
      ).then((res) => res.json().then((data) => data.todos)),
  });
}

export interface ITodo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}
