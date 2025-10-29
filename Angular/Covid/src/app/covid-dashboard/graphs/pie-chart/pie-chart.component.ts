import { Component, OnInit } from "@angular/core";
import {
  Chart,
  PieController,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { ISelectedCountryDetail } from "src/app/covid-dashboard/Model/country/country.model";
import { CovidApiService } from "src/app/covid-dashboard/Services/covid-api.service";

@Component({
  selector: "app-pie-chart",
  templateUrl: "./pie-chart.component.html",
  styleUrls: ["./pie-chart.component.css"],
})
export class PieChartComponent implements OnInit {
  selectedCountryDetails: ISelectedCountryDetail[];
  graphChartArray: ISelectedCountryDetail[] = new Array();
  dateArrayUI: string[];

  constructor(private httpCall: CovidApiService) {}

  ngOnInit(): void {
    this.selectedCountryDetails = this.httpCall.selectedCountryDetails;
    this.filterDataForGraph();
  }

  filterDataForGraph() {
    this.dateArrayUI = this.getThreeMonthDate().sort();
    this.selectedCountryDetails?.forEach((element) => {
      let date = element.Date.split("T")[0];
      if (this.dateArrayUI.includes(date)) {
        element.Date = element.Date.split("T")[0];
        this.graphChartArray.push(element);
      }
    });
    this.dataForGraph();
  }

 private getThreeMonthDate() {
    let dateArray = [];
    let todayDate = new Date();
    todayDate.setDate(todayDate.getDate() - 1);
    dateArray.push(todayDate.toISOString().split("T")[0]);
    for (let index = 1; index <= 2; index++) {
      todayDate.setMonth(todayDate.getMonth() - index);
      dateArray.push(todayDate.toISOString().split("T")[0]);
    }
    return dateArray;
  }

  dataForGraph() {
    let graphCount = 1;
    this.graphChartArray.forEach((element) => {
      let graphDataValues = {
        type: "pie",
        data: {
          labels: ["Confirmed", "Deaths", "Recovered", "Active"],
          datasets: [
            {
              label: "My First Dataset",
              data: [
                element.Confirmed,
                element.Deaths,
                element.Recovered,
                element.Active,
              ],
              backgroundColor: [
                "rgb(54, 162, 235)",
                "rgb(255, 99, 132)",
                "rgba(75, 192, 192, 0.9)",
                "rgb(255, 205, 86)",
              ],
              hoverOffset: 4,
            },
          ],
        },
      };
      this.createDoughnutChart(graphCount, graphDataValues);
      graphCount += 1;
    });
  }

  createDoughnutChart(graphCount, graphValue) {
    Chart.register(PieController, ArcElement, Title, Tooltip, Filler, Legend);
    new Chart("month-" + graphCount, graphValue);
  }
}
