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
    // this will clear all the value in the form controller
    // this.signUpForm.setValue({
    //   userData: {
    //     username: suggestedName,
    //     email: "",
    //   },
    //   secret: "",
    //   questionAnswer: "",
    //   gender: "",
    // });

    // this will overrides the specific value alone
    this.signUpForm.form.patchValue({
      userData: {
        username: suggestedName,
      },
    });
  }

  onSubmit(form: NgForm): void {
    console.log(form);
    // console.log(this.signUpForm);
  }
}
