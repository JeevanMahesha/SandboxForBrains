import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: true,
    imports: [FormsModule]
})
export class LoginComponent implements OnInit {

  @ViewChild('loginForm') loginForm :ElementRef

  userEmail:string = 'test@test.com'
  userPassword:string = 'Test@123'
  message:string
  constructor(
    private router:Router
  ) { }

  ngOnInit(): void {

  }

  loginUser(){
   if(this.userEmail ==='test@test.com' && this.userPassword ==="Test@123"){
    console.log('Success');
    this.router.navigate(['list']);
   }else{
    this.message = 'Failed';
   }
  }
}


