import { Component } from "@angular/core";
import {
  UntypedFormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { DataPointService } from "../data-point.service";
import { RouterLink, RouterModule } from "@angular/router";
import { NgIf } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

@Component({
  selector: "app-create",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.css"],
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
  ],
  providers: [DataPointService],
})
export class CreateComponent {
  newData = this.reactiveForm.group({
    userId: ["", Validators.required],
    title: ["", Validators.required],
    body: ["", Validators.required],
  });
  eachItem: any;
  constructor(
    private reactiveForm: UntypedFormBuilder,
    private postCall: DataPointService
  ) {}
  submitNewData() {
    // console.log(this.newData.value);
    this.postCall.createTodos(this.newData.value).subscribe((res) => {
      console.log(res);
      this.eachItem = res;
    });
  }
}
