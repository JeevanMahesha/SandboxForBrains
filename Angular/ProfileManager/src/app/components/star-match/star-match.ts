import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FlexibleConnectedPositionStrategyOrigin } from '@angular/cdk/overlay';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { MATCHING_STARS } from '../../constant/common.const';

@Component({
  selector: 'app-star-match',
  imports: [...HlmPopoverImports],
  template: `<hlm-popover
    [state]="togglePopover() ? 'open' : 'closed'"
    [attachTo]="attachTo()"
    align="end"
    [sideOffset]="4"
    (closed)="starMatchHidden.emit()"
  >
    <hlm-popover-content
      *hlmPopoverPortal="let ctx"
      class="max-h-[80vh] w-72 max-w-[calc(100vw-2rem)] overflow-y-auto"
    >
      <hlm-popover-header>
        <h3 hlmPopoverTitle>Preferred Star</h3>
      </hlm-popover-header>
      <ul class="divide-border divide-y">
        @for (star of starMatchData; track $index) {
          <li class="flex items-center justify-between py-3">
            <p class="truncate text-sm font-medium">{{ $index + 1 }}. {{ star.starName }}</p>
            <span class="text-base font-semibold">{{ star.score }}</span>
          </li>
        }
      </ul>
    </hlm-popover-content>
  </hlm-popover>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarMatch {
  readonly togglePopover = input.required<boolean>();
  readonly attachTo = input<FlexibleConnectedPositionStrategyOrigin>();
  readonly starMatchHidden = output<void>();
  starMatchData = Object.entries(MATCHING_STARS).map(([key, value]) => ({
    starName: key,
    score: value as number,
  }));
}
