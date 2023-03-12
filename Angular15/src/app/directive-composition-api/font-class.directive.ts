import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appFont]',
  standalone: true,
})
export class FontClassDirective implements OnChanges {
  @Input() fontClass!: string;
  constructor(private element: ElementRef, private renderer: Renderer2) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fontClass']) {
      this.renderer.addClass(this.element.nativeElement, 'h2');
    }
  }
}
