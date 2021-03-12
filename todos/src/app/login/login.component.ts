import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('loginForm') loginForm :ElementRef

  userEmail:string
  userPassword:string
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


