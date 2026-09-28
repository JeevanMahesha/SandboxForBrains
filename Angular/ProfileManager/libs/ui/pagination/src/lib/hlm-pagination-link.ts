import type { BooleanInput } from '@angular/cdk/coercion';
import { Directive, ElementRef, booleanAttribute, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { buttonVariants, type ButtonVariants } from '@spartan-ng/helm/button';
import { classes } from '@spartan-ng/helm/utils';

@Directive({
  selector: '[hlmPaginationLink]',
  hostDirectives: [
    {
      directive: RouterLink,
      inputs: [
        'target',
        'queryParams',
        'fragment',
        'queryParamsHandling',
        'state',
        'info',
        'relativeTo',
        'preserveFragment',
        'skipLocationChange',
        'replaceUrl',
        'routerLink: link',
      ],
    },
  ],
  host: {
    'data-slot': 'pagination-link',
    '[attr.data-active]': 'isActive() ? "true" : null',
    '[attr.aria-current]': 'isActive() ? "page" : null',
    // When there's no routerLink, the anchor has no href and is otherwise
    // invisible to keyboard/assistive tech (not focusable, no role). Give it
    // button semantics so the click-driven pagination controls are reachable.
    '[attr.role]': 'link() === undefined ? "button" : null',
    '[attr.tabindex]': 'link() === undefined ? 0 : null',
    '(keydown.enter)': 'activateViaKeyboard($event)',
    '(keydown.space)': 'activateViaKeyboard($event)',
  },
})
export class HlmPaginationLink {
  private readonly _elementRef = inject(ElementRef<HTMLElement>);

  /** Whether the link is active (i.e., the current page). */
  public readonly isActive = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
  /** The size of the button. */
  public readonly size = input<ButtonVariants['size']>('icon');
  /** The link to navigate to the page. */
  public readonly link = input<RouterLink['routerLink']>();

  protected activateViaKeyboard(event: Event): void {
    if (this.link() !== undefined) {
      // Native anchor with an href already handles keyboard activation.
      return;
    }
    event.preventDefault();
    this._elementRef.nativeElement.click();
  }

  constructor() {
    classes(() => [
      '',
      buttonVariants({
        variant: this.isActive() ? 'outline' : 'ghost',
        size: this.size(),
      }),
      this.link() === undefined && 'cursor-pointer',
    ]);
  }
}
