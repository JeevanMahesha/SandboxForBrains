import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Todo App';
  newTask: string | null = '';
  tasks: ITask[] = [];

  addTask() {
    if (!this.newTask) {
      console.log('Please provide the task input');
    }
    this.tasks.push({
      id: self.crypto.randomUUID(),
      task: this.newTask!,
    });
    this.newTask = null;
  }

  deleteTask(taskId: string) {}
}

interface ITask {
  id: string;
  task: string;
}
