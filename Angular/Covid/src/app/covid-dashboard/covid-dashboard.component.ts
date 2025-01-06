import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-covid-dashboard',
  templateUrl: './covid-dashboard.component.html',
  styleUrls: ['./covid-dashboard.component.css']
})
export class CovidDashboardComponent implements OnInit {
  @Input() searchKeyValue:string;


  constructor() { }

  ngOnInit(): void {
  }

  getSearchKeyValue(value){
    this.searchKeyValue = value
  }


}
