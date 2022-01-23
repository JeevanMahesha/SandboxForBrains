import { Component, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  @ViewChild("form") signUpForm: NgForm;
  defaultQuestion = "pet";
  answer = "";
  genders = ["male", "female"];

  suggestUserName() {
    const suggestedName = "Superuser";
  }

  onSubmit(form: NgForm): void {
    console.log(form);
    // console.log(this.signUpForm);
  }
}
