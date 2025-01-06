import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  roleArray: Array<string> = ['Developer', 'HR', 'Tester', 'Manager']
  userEmail: string
  userPassword: string
  userRole: string
  userStatus: object
  @Input() userDetailsDB: any;
  @Output() userStatusEmit: any = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    // console.log(this.userDetailsDB);
  }

  getEmail(email: string) {
    this.userEmail = email

  }
  getPassword(password: string) {
    this.userPassword = password
  }

  selectRole(role) {
    this.userRole = role

  }

  sendUserDetails($event) {
    if (this.userDetailsDB.userEmail == this.userEmail && this.userDetailsDB.userPassword == this.userPassword) {
      this.userStatus = { 'status': true, 'data': 'Sucess' }
    } else {
      this.userStatus = { 'status': false, 'data': 'Failed' }
    }
    this.userStatusEmit.emit(this.userStatus)
  }


}
