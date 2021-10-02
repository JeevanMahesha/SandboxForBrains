import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  Chart,
  LinearScale,
  LineController,
  CategoryScale,
  LineElement,
  BarController,
  BarElement,
} from "chart.js";
import { IConfirmData } from "src/app/covid-dashboard/Model/country/country.model";
import { CovidApiService } from "src/app/covid-dashboard/Services/covid-api.service";

@Component({
  selector: "app-bar-graph",
  templateUrl: "./bar-graph.component.html",
  styleUrls: ["./bar-graph.component.css"],
})
export class BarGraphComponent implements OnInit {
  activeCountryData: IConfirmData;

  lineGraph: Chart;

  constructor(
    private httpCall: CovidApiService,
    private routeActive: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.activeCountryData =
    this.httpCall.selectedCountryDetails[
      this.httpCall.selectedCountryDetails.length - 1
    ];
  this.createBarGraph();
  }

  createBarGraph() {
    Chart.register(
      LinearScale,
      LineController,
      CategoryScale,
      LineElement,
      BarController,
      BarElement
    );
    this.lineGraph = new Chart("lineChart", {
      type: "bar",
      data: {
        labels: ["Confirmed", "Deaths", "Recovered", "Active"],
        datasets: [
          {
            label: "COVID DETAILS",
            data: [
              this.activeCountryData?.Confirmed,
              this.activeCountryData?.Deaths,
              this.activeCountryData?.Recovered,
              this.activeCountryData?.Active,
            ],
            backgroundColor: [
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 99, 132, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
              "rgb(54, 162, 235)",
              "rgb(255, 99, 132)",
              "rgb(75, 192, 192)",
              "rgb(255, 159, 64)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
