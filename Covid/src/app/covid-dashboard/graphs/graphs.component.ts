import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISelectedCountryDetail } from 'src/app/covid-dashboard/Model/country/country.model';
import { CovidApiService } from 'src/app/covid-dashboard/Services/covid-api.service';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent implements OnInit {
  
  selectedCountryDetails: ISelectedCountryDetail;
  preLoaderDisplay:boolean=true;

  constructor(
    private httpCall: CovidApiService,
    private routeActive: ActivatedRoute
  ) {    
    this.httpCall
      .getCaseDetailByCountry(
        this.routeActive.snapshot.queryParamMap.get("selectedCountry")
      )
      .subscribe((data) => {
        this.selectedCountryDetails = data[data.length - 1];
        httpCall.selectedCountryDetails = data;
      this.preLoaderDisplay=false

      });
  }

  ngOnInit(): void {
    
  }

 
}
