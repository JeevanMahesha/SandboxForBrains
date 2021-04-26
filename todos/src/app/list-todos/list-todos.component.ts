import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { DataPointService } from '../data-point.service';

@Component({
  selector: 'app-list-todos',
  templateUrl: './list-todos.component.html',
  styleUrls: ['./list-todos.component.css']
})
export class ListTodosComponent implements OnInit {

  todosList:any
  searchKey:any 
  constructor(
    private APIservice:DataPointService,
    private router:Router
  ) { }

  ngOnInit(): void {
    if(this.APIservice.listOfTodos){
      this.todosList = this.APIservice.listOfTodos.slice()
    }
  }

  getData(){
    this.APIservice.getTodos().subscribe((val:any) =>{
      this.APIservice.listOfTodos = val.slice()
      this.todosList = this.APIservice.listOfTodos.slice()
    })
  }

  editItem(itemIndex){
    this.APIservice.editIndex.index = itemIndex
    this.APIservice.editIndex.showData = true
    this.router.navigate(["edit"])
  }
 

}
