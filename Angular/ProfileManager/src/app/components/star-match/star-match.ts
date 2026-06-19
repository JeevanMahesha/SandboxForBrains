import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { BrnDialogContent } from '@spartan-ng/brain/dialog';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { MATCHING_STARS } from '../../constant/common.const';

@Component({
  selector: 'app-star-match',
  imports: [BrnDialogContent, ...HlmDialogImports],
  template: `<hlm-dialog [state]="togglePopover() ? 'open' : 'closed'" (closed)="starMatchHidden.emit()">
    <hlm-dialog-content *brnDialogContent class="max-h-[80vh] w-full overflow-y-auto sm:max-w-sm">
      <hlm-dialog-header>
        <h3 hlmDialogTitle>Preferred Star</h3>
      </hlm-dialog-header>
      <ul class="divide-border divide-y">
        @for (star of starMatchData; track $index) {
          <li class="flex items-center justify-between py-3">
            <p class="truncate text-sm font-medium">{{ $index + 1 }}. {{ star.starName }}</p>
            <span class="text-base font-semibold">{{ star.score }}</span>
          </li>
        }
      </ul>
    </hlm-dialog-content>
  </hlm-dialog>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarMatch {
  readonly togglePopover = input.required<boolean>();
  readonly starMatchHidden = output<void>();
  starMatchData = Object.entries(MATCHING_STARS).map(([key, value]) => ({
    starName: key,
    score: value as number,
  }));
}
