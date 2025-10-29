import { Directive } from '@angular/core';
import { ColorDirective } from './color.directive';
import { FontWtDirective } from './font-class.directive';

@Directive({
  selector: '[appStyle]',
  standalone: true,
  hostDirectives: [
    { directive: ColorDirective, inputs: ['color: myColor'] },
    { directive: FontWtDirective, inputs: ['weight: myClass'] },
  ],
})
export class StyleDirective {}
