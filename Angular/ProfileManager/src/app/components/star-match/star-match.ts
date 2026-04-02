import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';
import { Popover, PopoverModule } from 'primeng/popover';
import { MATCHING_STARS } from '../../constant/common.const';

@Component({
  selector: 'app-star-match',
  imports: [PopoverModule],
  template: `<p-popover #starMatching (onHide)="onStarMatchHidden()">
    @for (star of starMatchData; track $index) {
      <ul class="max-w-md divide-y divide-default">
        <li class="pb-3 sm:pb-4">
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-heading truncate">
                {{ $index + 1 }}. {{ star.starName }}
              </p>
            </div>
            <div class="inline-flex items-center text-base font-semibold text-heading">
              {{ star.score }}
            </div>
          </div>
        </li>
      </ul>
    }
  </p-popover> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarMatch {
  togglePopover = input.required<MouseEvent | null>();
  starMatchHidden = output<void>();
  starMatchingElement = viewChild<Popover>('starMatching');
  starMatchData = Object.entries(MATCHING_STARS).map(([key, value]) => ({
    starName: key,
    score: value as number,
  }));

  constructor() {
    effect(() => {
      const visible = this.togglePopover();
      const popover = this.starMatchingElement();
      if (!popover || !visible) {
        popover?.hide();
        return;
      }
      popover.toggle(visible);
    });
  }

  onStarMatchHidden() {
    this.starMatchingElement()?.toggle(this.togglePopover());
    this.starMatchHidden.emit();
  }
}
