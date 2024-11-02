import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { ToSignalComponent } from './to-signal.component';

@Component({
  selector: 'app-rxjs-interop',
  imports: [ToSignalComponent, MatExpansionModule],
  standalone: true,
  templateUrl: './rxjs-interop.component.html',
  styleUrl: './rxjs-interop.component.css',
})
export class RxjsInteropComponent {}
