import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-total',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './total.component.html',
  styleUrls: ['./total.component.css'],
})
export class TotalComponent {}
