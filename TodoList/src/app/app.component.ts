import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Todo App';
  newTask: string = '';
  tasks: string[] = [];

  addTask() {}

  deleteTask(task: string) {}
}
