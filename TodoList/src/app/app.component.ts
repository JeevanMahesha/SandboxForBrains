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
      alert('Please provide the task input');
      return;
    }
    this.tasks.push({
      id: self.crypto.randomUUID(),
      task: this.newTask!,
    });
    this.newTask = null;
  }

  deleteTask(indexValue: number) {
    this.tasks.splice(indexValue, 1);
  }
}

interface ITask {
  id: string;
  task: string;
}
