import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  filter,
  from,
  mergeMap,
  of,
  throwError,
} from 'rxjs';
import { ITask } from './common.model';

@Injectable()
export class TaskService {
  private tasksList$ = new BehaviorSubject<ITask[]>([
    {
      id: '1',
      title: 'Complete Project Proposal',
      description:
        'Draft and finalize project proposal document for client review.',
      dueDate: new Date('2024-07-05'),
      priority: 'high',
      taskStatus: 'todo',
    },
    {
      id: '2',
      title: 'Review Code Changes',
      description:
        'Review and provide feedback on recent code changes in the development branch.',
      dueDate: new Date('2024-07-10'),
      priority: 'medium',
      taskStatus: 'todo',
    },
    {
      id: '3',
      title: 'Prepare Presentation Slides',
      description:
        'Create slides for the upcoming team presentation on project milestones.',
      dueDate: new Date('2024-07-15'),
      priority: 'low',
      taskStatus: 'todo',
    },
  ]);
  // Force an error scenario by triggering the error manually
  private insertionCount = 0;

  /**
   * The function creates a new task and returns a message indicating success or failure.
   * @param task - The `createNewTask` function takes a partial `ITask` object as a parameter. This
   * object represents a task that is being created. The function attempts to add this task to a list of
   * tasks and returns an observable string message indicating whether the task creation was successful
   * or not.
   * @returns The `createNewTask` method returns an Observable<string> containing a message indicating
   * whether the task creation was successful or failed. If the `insertionCount` is greater than 0, an
   * error is thrown with the message 'Manually triggered error'. Otherwise, the task is added to the
   * `tasksList$` BehaviorSubject and a success message 'Task Created Successfully' is returned. If an
   * error
   */
  createNewTask(task: Partial<ITask>): Observable<string> {
    try {
      if (this.insertionCount > 0) {
        this.insertionCount = 0;
        throw new Error('Manually triggered error');
      }
      this.insertionCount++;
      const taskValue = this.tasksList$.getValue();
      taskValue.push(task as ITask);
      this.tasksList$.next(taskValue);
      return this.getReturnMessage('Task Created Successfully', 'Success');
    } catch (error) {
      return this.getReturnMessage('Task Creation Failed', 'Error');
    }
  }

  /**
   * The function `updateTask` updates a task in a list and returns a message indicating success or
   * failure.
   * @param task - The `updateTask` function you provided is used to update a task in a list of tasks. It
   * takes a partial task object as a parameter, which means it only updates the properties that are
   * provided in the `task` object.
   * @returns The `updateTask` method returns an Observable of type string. The method attempts to update
   * a task in the tasksList$ BehaviorSubject by finding the task with a matching id and replacing it
   * with the updated task. If the update is successful, it returns a success message 'Task Updated
   * Successfully'. If an error occurs during the update process, it returns an error message 'Task
   * Update Failed'.
   */
  updateTask(task: Partial<ITask>): Observable<string> {
    try {
      const taskValue = this.tasksList$.getValue();
      const taskIndex = taskValue.findIndex(
        (eachTask) => eachTask.id === task.id
      );
      if (taskIndex > -1) {
        taskValue[taskIndex] = task as ITask;
        this.tasksList$.next([...taskValue]);
      }
      return this.getReturnMessage('Task Updated Successfully', 'Success');
    } catch (error) {
      return this.getReturnMessage('Task Update Failed', 'Error');
    }
  }

  getTaskValue(): Observable<ITask[]> {
    return this.tasksList$.asObservable();
  }

  /**
   * The function `getSpecificTask` retrieves a specific task by its ID from a list of tasks.
   * @param {string} taskId - The `taskId` parameter in the `getSpecificTask` function is a string that
   * represents the unique identifier of the task that you want to retrieve. This function returns an
   * Observable of type `ITask`, which is the interface representing the structure of a task object.
   * @returns An Observable of type ITask is being returned.
   */
  getSpecificTask(taskId: string): Observable<ITask> {
    return this.getTaskValue().pipe(
      mergeMap(from),
      filter((task) => task.id === taskId)
    );
  }

  /**
   * The `deleteTask` function removes a task from a list based on its ID.
   * @param {string} taskId - The `taskId` parameter in the `deleteTask` method is a string that
   * represents the unique identifier of the task that needs to be deleted from the tasks list.
   */
  deleteTask(taskId: string): void {
    const taskValue = this.tasksList$.getValue();
    const taskIndex = taskValue.findIndex((eachTask) => eachTask.id === taskId);
    if (taskIndex > -1) {
      taskValue.splice(taskIndex, 1);
      this.tasksList$.next([...taskValue]);
    }
  }

  getTaskRawValue(): ITask[] {
    return this.tasksList$.getValue();
  }

  /**
   * The function `updateTaskStatus` updates the status of a task in a tasks list based on the provided
   * task ID.
   * @param {string} taskId - The `taskId` parameter is a string that represents the unique identifier of
   * the task that needs to be updated.
   * @param {string} taskStatus - The `updateTaskStatus` function takes two parameters:
   */
  updateTaskStatus(taskId: string, taskStatus: string): void {
    const taskValue = this.tasksList$.getValue();
    const taskIndex = taskValue.findIndex((eachTask) => eachTask.id === taskId);
    if (taskIndex > -1) {
      taskValue[taskIndex].taskStatus = taskStatus;
      this.tasksList$.next([...taskValue]);
    }
  }

  private getReturnMessage(
    messageValue: string,
    status: 'Success' | 'Error'
  ): Observable<string> {
    return status === 'Success'
      ? of(messageValue)
      : throwError(() => new Error(messageValue));
  }
}
