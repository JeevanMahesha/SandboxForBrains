import { Component } from '@angular/core';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent {

  userNameList: string[] = []

  userNameControl: string | null = null

  addNewUserName() {
    this.userNameList.push(this.userNameControl!)
    console.log(this.userNameControl);
  }

}
