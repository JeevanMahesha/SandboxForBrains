import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../Header/header.component';

@Component({
  selector: 'app-performant-angular-applications',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './performant-angular-applications.component.html',
  styleUrls: ['./performant-angular-applications.component.css'],
})
export class PerformantAngularApplicationsComponent {}
