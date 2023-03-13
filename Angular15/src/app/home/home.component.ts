import { Component } from '@angular/core';
import { HeaderComponent } from '../Header/header.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [HeaderComponent],
})
export class HomeComponent {}
