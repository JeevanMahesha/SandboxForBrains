import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
})
export class UserComponent implements OnInit {
  user: { id: number; name: string };

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.user = {
      id: this.activatedRoute.snapshot.params["id"],
      name: this.activatedRoute.snapshot.params["name"],
    };
    this.activatedRoute.params.subscribe((pathParams: Params) => {
      this.user.id = pathParams["id"];
      this.user.name = pathParams["name"];
    });
  }

  loadTheUser() {
    this.router.navigate(["/users", 10, "latha"]);
  }
}
