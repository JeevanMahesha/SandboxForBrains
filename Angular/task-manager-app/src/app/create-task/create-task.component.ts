import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ITaskFrom } from './create-task.forms';
import { TaskService } from '../task.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { priorityLevels, taskStatus } from '../common.model';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss',
})
export class CreateTaskComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<CreateTaskComponent>);
  readonly toastrService = inject(ToastrService);
  readonly matDialogData =
    inject<Record<'taskId', string | null>>(MAT_DIALOG_DATA);
  readonly taskService = inject(TaskService);
  taskForm: FormGroup<ITaskFrom>;
  priorityLevels = priorityLevels;
  taskStatus = taskStatus;
  actionButtonLabel = this.matDialogData.taskId ? 'Update' : 'Create';

  constructor() {
    const fb = inject(FormBuilder);
    this.taskForm = fb.group({
      id: fb.control<string | null>(crypto.randomUUID(), Validators.required),
      title: fb.control<string | null>(null, Validators.required),
      description: fb.control<string | null>(null, Validators.required),
      priority: fb.control<string | null>(null, Validators.required),
      taskStatus: fb.control<string | null>(null, Validators.required),
      dueDate: fb.control<Date | null>(null, Validators.required),
    });
  }

  ngOnInit(): void {
    if (this.matDialogData.taskId) {
      this.taskService
        .getSpecificTask(this.matDialogData.taskId)
        .subscribe(this.taskForm.patchValue.bind(this.taskForm));
    }
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      return;
    }
    let taskCreationObservable$: Observable<string>;
    if (this.matDialogData.taskId) {
      taskCreationObservable$ = this.taskService.updateTask(
        this.taskForm.value
      );
    } else {
      taskCreationObservable$ = this.taskService.createNewTask(
        this.taskForm.value
      );
    }
    taskCreationObservable$.subscribe({
      next: (message) => {
        this.toastrService.success(message), this.dialogRef.close();
      },
      error: this.toastrService.error.bind(this.toastrService),
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
