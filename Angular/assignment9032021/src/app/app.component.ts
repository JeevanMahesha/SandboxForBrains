import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'assignmentLogin';
  userDetails: object = {
    'userEmail': 'test@gmail.com',
    'userPassword': '123'
  }
  userStatus: any

  getUserDetails(value) {
    this.userStatus = value
  }

}
