import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-tdassessment",
  templateUrl: "./tdassessment.component.html",
  styleUrls: ["./tdassessment.component.css"],
})
export class TdassessmentComponent implements OnInit {
  Subscriptions = ["Basic", "Advanced", "Pro"];

  constructor() {}

  ngOnInit(): void {}
}
