import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { ToSignalComponent } from './to-signal.component';
import { ToObservableComponent } from './to-observable.component';

@Component({
  selector: 'app-rxjs-interop',
  imports: [ToSignalComponent, ToObservableComponent, MatExpansionModule],
  templateUrl: './rxjs-interop.component.html',
  styleUrl: './rxjs-interop.component.css',
})
export class RxjsInteropComponent {}
