import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ISelectedCountryDetail } from "../Model/country/country.model";

@Injectable({
  providedIn: "root",
})
export class CovidApiService {
 
  allCountrySummery: any;
  selectedCountryDetails:ISelectedCountryDetail[];

  constructor(private httpService: HttpClient) {}

  getCaseDetailByCountry(country):Observable<any> {
    return this.httpService.get(
      environment.apiUrl + "/dayone/country/" + country
    );
  }
  getAllCountrySummeryDetails() {
    return this.httpService.get(environment.apiUrl + "/summary");
  }
}
