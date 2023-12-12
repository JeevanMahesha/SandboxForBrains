import { Component, OnInit } from '@angular/core';
import { APIcallsService } from '../apicalls.service';

@Component({
  selector: 'app-posthttpcall',
  templateUrl: './posthttpcall.component.html',
  styleUrls: ['./posthttpcall.component.css']
})
export class PosthttpcallComponent implements OnInit {

  title:string
  body:string
  userId:string
  resultData:any
  constructor(private apicall:APIcallsService) { }

  ngOnInit(): void {
  }

  callPOSTAPI(){

    this.apicall.postAPIcall({
      'title': this.title,
      'body': this.body,
      'userId': this.userId
    }).subscribe(val=>{
      this.resultData = val
    })

  }

}
