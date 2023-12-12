import { Component, Input, OnInit } from '@angular/core';
import { IAllCountryData } from 'src/app/covid-dashboard/Model/country/country.model';
import { CovidApiService } from 'src/app/covid-dashboard/Services/covid-api.service';

@Component({
  selector: 'app-all-country-test',
  templateUrl: './all-country.component.html',
  styleUrls: ['./all-country.component.css']
})
export class AllCountryComponent implements OnInit {
  allCounterDetails: IAllCountryData[];
  temp: number[] = [1, 1, 1, 1, 1, 1, 1, 1];
  preLoaderDisplay: boolean = true;
  @Input() searchValue:string;

  constructor(private httpCall: CovidApiService) {
    this.getData();
  }

  ngOnInit(): void {}

  private getData() {
    this.httpCall.getAllCountrySummeryDetails().subscribe((data) => {
      this.httpCall.allCountrySummery = data;
      this.allCounterDetails = this.httpCall.allCountrySummery?.Countries;
    this.preLoader();
    });
  }

  private preLoader() {
    if (this.allCounterDetails) {
      this.preLoaderDisplay = false;
    }
  }

}
