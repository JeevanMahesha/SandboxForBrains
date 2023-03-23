import { Component, OnInit } from "@angular/core";
import { Router, RouterLink, RouterModule } from "@angular/router";

import { CommonModule, NgFor, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { DataPointService } from "../data-point.service";
import { HttpClientModule } from "@angular/common/http";

@Component({
  selector: "app-list-todos",
  templateUrl: "./list-todos.component.html",
  styleUrls: ["./list-todos.component.css"],
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    CommonModule,
    Ng2SearchPipeModule,
    RouterModule,
    HttpClientModule,
  ],
  providers: [DataPointService],
})
export class ListTodosComponent implements OnInit {
  todosList: any;
  searchKey: any;
  constructor(private APIservice: DataPointService, private router: Router) {}

  ngOnInit(): void {
    if (this.APIservice.listOfTodos) {
      this.todosList = this.APIservice.listOfTodos.slice();
    }
  }

  getData() {
    this.APIservice.getTodos().subscribe((val: any) => {
      this.APIservice.listOfTodos = val.slice();
      this.todosList = this.APIservice.listOfTodos.slice();
    });
  }

  editItem(itemIndex) {
    this.APIservice.editIndex.index = itemIndex;
    this.APIservice.editIndex.showData = true;
    this.router.navigate(["edit"]);
  }
}
