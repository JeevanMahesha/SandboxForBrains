import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllCountryComponent } from './all-country/all-country.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { BarGraphComponent } from './graphs/bar-graph/bar-graph.component';
import { GraphsComponent } from './graphs/graphs.component';
import { PieChartComponent } from './graphs/pie-chart/pie-chart.component';
import { CovidDashboardRoutingModule } from './covid-dashboard-routing.module';
import { HttpClientModule } from "@angular/common/http";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { CovidDashboardComponent } from './covid-dashboard.component';
import { SharedModule } from '../Shared/shared.module';

@NgModule({
  declarations: [
    AllCountryComponent,
    BarGraphComponent,
    GraphsComponent,
    PieChartComponent,
    CovidDashboardComponent,
  ],
  imports: [
    CommonModule,
    NgxSkeletonLoaderModule.forRoot(),
    MatCardModule,
    CovidDashboardRoutingModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    SharedModule
    
  ],
  exports:[CovidDashboardComponent]
})
export class CovidDashboardModule { }
