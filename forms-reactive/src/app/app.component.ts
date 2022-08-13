import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  genders = ["male", "female"];

  signUpForm: FormGroup;

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      userName: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      gender: new FormControl(this.genders[0]),
    });
  }

  onSubmit(): void {
    console.log(this.signUpForm);
  }

  checkFormControlIsValid(controlName: string): boolean {
    return (
      !this.signUpForm.get(controlName).valid &&
      this.signUpForm.get(controlName).touched
    );
  }
}
