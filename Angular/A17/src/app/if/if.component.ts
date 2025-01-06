import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-if',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './if.component.html',
  styleUrls: ['./if.component.css'],
})
export class IfComponent {
  userDetail = {
    isHuman: true,
    isBot: false,
  };
}
