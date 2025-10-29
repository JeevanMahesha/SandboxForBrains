import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { ToSignalComponent } from './to-signal.component';
import { ToObservableComponent } from './to-observable.component';
import { RxResourceComponent } from './rx-resource.component';

@Component({
  selector: 'app-rxjs-interop',
  imports: [
    ToSignalComponent,
    ToObservableComponent,
    RxResourceComponent,
    MatExpansionModule,
  ],
  templateUrl: './rxjs-interop.component.html',
  styleUrl: './rxjs-interop.component.css',
})
export class RxjsInteropComponent {}
