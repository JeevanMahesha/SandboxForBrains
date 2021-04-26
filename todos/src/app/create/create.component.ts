import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataPointService } from '../data-point.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  newData = this.reactiveForm.group({
    'userId':['',Validators.required],
    'title':['',Validators.required],
    'body':['',Validators.required]
  })
  eachItem:any
  constructor(
    private reactiveForm:FormBuilder,
    private postCall:DataPointService
    ) { }

  ngOnInit(): void {
  }

  submitNewData(){
    // console.log(this.newData.value);
    this.postCall.createTodos(this.newData.value).subscribe(res=>{
      console.log(res);
      this.eachItem = res
    })
    
  }

}
