import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { DataPointService } from "../data-point.service";

@Component({
  selector: "app-edit-todos",
  templateUrl: "./edit-todos.component.html",
  styleUrls: ["./edit-todos.component.css"],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
  ],
  providers: [DataPointService],
})
export class EditTodosComponent implements OnInit {
  data: any;
  newEditData: any;
  dataSave: boolean = false;
  constructor(
    private dataPoint: DataPointService,
    private router: Router,
    private reactiveForm: UntypedFormBuilder
  ) {
    this.data = this.dataPoint.editIndex;
    console.log(this.dataPoint, this.data);
  }

  ngOnInit(): void {
    if (!this.dataPoint.editIndex.showData) {
      setTimeout(() => {
        this.router.navigate(["list"]);
      }, 5000);
    } else {
      this.newEditData = this.reactiveForm.group(
        this.dataPoint.listOfTodos[this.data?.index]
      );
    }
  }

  saveEdit() {
    this.dataPoint.listOfTodos[this.data.index] = JSON.parse(
      JSON.stringify(this.newEditData.value)
    );
    this.dataSave = true;
    setTimeout(() => {
      this.router.navigate(["list"]);
    }, 3000);
  }
}
