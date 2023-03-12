import { Directive, Input } from '@angular/core';
import { FontClassDirective } from './font-class.directive';
import { ColorDirective } from './color.directive';

@Directive({
  selector: '[appStyle]',
  standalone: true,
  hostDirectives: [
    { directive: ColorDirective, inputs: ['color: myColor'] },
    { directive: FontClassDirective, inputs: ['fontClass: myClass'] },
  ],
})
export class StyleDirective {}
