import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, takeUntil } from 'rxjs';
import { injectDestroy } from 'ngxtension/inject-destroy';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inject-destroy',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inject-destroy.component.html',
  styleUrls: ['./inject-destroy.component.css'],
})
export default class InjectDestroyComponent {
  private destroy$ = injectDestroy();
  constructor() {
    interval(1000).pipe(takeUntil(this.destroy$)).subscribe(console.log);
  }
}
