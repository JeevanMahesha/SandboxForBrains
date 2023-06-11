import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'signals';

  users: { name: string; age: number }[] = [
    { name: 'John Doe', age: 30 },
    { name: 'Jane Smith', age: 25 },
    { name: 'Michael Johnson', age: 35 },
    { name: 'Emily Davis', age: 28 },
    { name: 'Daniel Brown', age: 32 },
    { name: 'Sophia Wilson', age: 27 },
    { name: 'David Thompson', age: 31 },
    { name: 'Olivia Clark', age: 26 },
    { name: 'William Allen', age: 29 },
    { name: 'Emma Turner', age: 33 },
  ];
}
