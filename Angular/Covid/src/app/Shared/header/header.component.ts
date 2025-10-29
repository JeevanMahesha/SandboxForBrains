import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IGlobal } from "src/app/covid-dashboard/Model/Global/global.model";
import { CovidApiService } from "src/app/covid-dashboard/Services/covid-api.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  todayDate: string;
  globalData: IGlobal;
  searchKeyValue: string;
  showSearch:boolean=false
  @Output() searchKeyValueEmmit: EventEmitter<string> = new EventEmitter();

  constructor(
    private httpCall: CovidApiService,
    private routerActive:ActivatedRoute
    ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.globalData = this.httpCall.allCountrySummery?.Global;
    }, 1000);
    if(this.routerActive.snapshot.queryParamMap.get("selectedCountry")){
      this.showSearch = true
    }
  }

  getSearchValue() {
    if (this.searchKeyValue.length > 0) {
      this.searchKeyValueEmmit.emit(this.searchKeyValue);
    }
  }
}
