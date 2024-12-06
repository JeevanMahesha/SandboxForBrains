import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-computed-signal',
    imports: [
        MatSelectModule,
        MatIconModule,
        MatFormFieldModule,
        MatButtonModule,
        FormsModule,
    ],
    template: `
    <div class="container mt-3">
      <div class="d-flex justify-content-evenly">
        <div class="col-md-4">
          <mat-form-field>
            <mat-label>Status </mat-label>
            <button
              matSuffix
              mat-icon-button
              (click)="clearSelectedStatus()"
              aria-label="Clear"
            >
              <mat-icon>close</mat-icon>
            </button>
            <mat-select [(value)]="selectedStatus">
              @for (status of statusList; track status) {
              <mat-option [value]="status">{{ status }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <button type="button" class="btn btn-success" (click)="addNewTask()">
            Add new task
          </button>
        </div>
        <div class="col-md-8">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Task Id</th>
                <th scope="col">Title</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              @for (item of filteredTaskList(); track $index) {
              <tr>
                <th>{{ item.id }}</th>
                <td>{{ item.name }}</td>
                <td>{{ item.completedStatus }}</td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ComputedSignalComponent {
  statusList = ['Todo', 'Pending', 'Completed'];
  selectedStatus = signal<string | null>(null);
  taskList = signal<ITask[]>([
    { id: 1, name: 'Task 1', completedStatus: 'Todo' },
    { id: 2, name: 'Task 2', completedStatus: 'Completed' },
    { id: 3, name: 'Task 3', completedStatus: 'Todo' },
    { id: 4, name: 'Task 4', completedStatus: 'Todo' },
    { id: 5, name: 'Task 5', completedStatus: 'Completed' },
    { id: 6, name: 'Task 6', completedStatus: 'Pending' },
    { id: 7, name: 'Task 7', completedStatus: 'Pending' },
    { id: 8, name: 'Task 8', completedStatus: 'Completed' },
    { id: 9, name: 'Task 9', completedStatus: 'Pending' },
    { id: 10, name: 'Task 10', completedStatus: 'Completed' },
  ]);

  filteredTaskList = computed(() => {
    if (!this.selectedStatus()) {
      return this.taskList();
    }
    return this.taskList().filter(
      (task) => task.completedStatus === this.selectedStatus()
    );
  });

  clearSelectedStatus() {
    this.selectedStatus.update(() => null);
  }

  addNewTask() {
    this.taskList.update((tasks) => [
      ...tasks,
      {
        id: tasks.length + 1,
        name: `Task ${tasks.length + 1}`,
        completedStatus: 'Todo',
      },
    ]);
  }
}

interface ITask {
  id: number;
  name: string;
  completedStatus: 'Todo' | 'Pending' | 'Completed';
}
