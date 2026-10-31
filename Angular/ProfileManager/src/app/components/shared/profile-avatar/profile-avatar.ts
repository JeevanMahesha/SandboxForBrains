import { Component, computed, input } from '@angular/core';

/** Gradient tile showing the first letters of a profile name. */
@Component({
  selector: 'app-profile-avatar',
  template: `{{ initials() }}`,
  host: {
    class:
      'bg-gradient-brand text-primary-foreground inline-grid shrink-0 place-items-center font-semibold',
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
    '[style.border-radius.px]': 'size() * 0.3',
    '[style.font-size.px]': 'size() * 0.36',
    '[attr.aria-hidden]': 'true',
  },
})
export class ProfileAvatar {
  readonly name = input('');
  readonly size = input(40);

  protected readonly initials = computed(() =>
    this.name()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]!.toUpperCase())
      .join(''),
  );
}
