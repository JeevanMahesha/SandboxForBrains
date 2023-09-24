import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css'],
})
export class AddressComponent implements OnInit {
  private readonly parentControl = inject(ControlContainer);

  get getAddressFormControlGroup() {
    return this.parentControl.control as FormGroup;
  }

  ngOnInit() {
    this.getAddressFormControlGroup.addControl(
      'address',
      new FormGroup({
        country: new FormControl<string | null>('Jeevan'),
        state: new FormControl<string | null>('Jeevan'),
      })
    );
    console.log(this.getAddressFormControlGroup);
  }
}
