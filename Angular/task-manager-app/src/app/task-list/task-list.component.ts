import { AsyncPipe, DatePipe, NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable, map, merge, startWith } from 'rxjs';
import { GetValuePipe } from '../Pipes/get-value.pipe';
import { ITask, priorityLevels, taskStatus } from '../common.model';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { TaskService } from '../task.service';
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    MatButtonModule,
    GetValuePipe,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    DatePipe,
    NgClass,
    AsyncPipe,
    NgIf,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export default class TaskListComponent {
  readonly dialog = inject(MatDialog);
  readonly taskService = inject(TaskService);
  readonly priorityList = priorityLevels;
  readonly taskStatusList = taskStatus;
  filterByStatus = new FormControl<string | null>(null);
  filterByPriority = new FormControl<string | null>(null);
  tasks$: Observable<ITask[]> = merge(
    this.filterByPriority.valueChanges,
    this.filterByStatus.valueChanges
  ).pipe(
    startWith(''),
    map(() => ({
      priority: this.filterByPriority.value,
      taskStatus: this.filterByStatus.value,
    })),
    map((filter) => {
      if (!filter.priority && !filter.taskStatus) {
        return this.taskService.getTaskRawValue();
      } else {
        return this.taskService
          .getTaskRawValue()
          .filter((task) => {
            if (filter.priority) {
              return task.priority === filter.priority;
            }
            return true;
          })
          .filter((task) => {
            if (filter.taskStatus) {
              return task.taskStatus === filter.taskStatus;
            }
            return true;
          });
      }
    })
  );

  createTask(id?: string): void {
    this.dialog.open(CreateTaskComponent, {
      width: '500px',
      disableClose: true,
      data: {
        taskId: id,
      },
    });
  }

  editTask(taskId: string | null): void {
    if (!taskId) {
      return;
    }
    this.createTask(taskId);
  }

  deleteTask(taskId: string | null): void {
    if (!taskId) {
      return;
    }
    this.taskService.deleteTask(taskId);
  }

  updateStatus(taskId: string | null, $event: MatButtonToggleChange) {
    if (!taskId) {
      return;
    }
    this.taskService.updateTaskStatus(taskId, $event.value);
  }
}
