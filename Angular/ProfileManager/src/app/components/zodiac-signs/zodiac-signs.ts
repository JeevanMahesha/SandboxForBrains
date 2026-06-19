import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { BrnDialogContent } from '@spartan-ng/brain/dialog';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { ZODIAC_SIGN_LIST } from '../../constant/common.const';

@Component({
  selector: 'app-zodiac-signs',
  imports: [BrnDialogContent, HlmBadge, ...HlmDialogImports],
  template: `<hlm-dialog [state]="togglePopover() ? 'open' : 'closed'" (closed)="zodiacSignsHidden.emit()">
    <hlm-dialog-content *brnDialogContent class="max-h-[80vh] w-full overflow-y-auto sm:max-w-lg">
      <hlm-dialog-header>
        <h3 hlmDialogTitle>Zodiac Signs</h3>
      </hlm-dialog-header>
      <div class="flex flex-col gap-2">
        @for (item of zodiacSignsData; track item.key) {
          <div class="flex flex-col gap-1 border-b py-2 last:border-b-0">
            <div class="flex items-center justify-between">
              <span class="font-semibold">{{ item.tanglish }}</span>
              <span class="text-muted-foreground text-xs">{{ item.english }}</span>
            </div>
            <div class="flex flex-wrap gap-1">
              @for (star of item.stars; track star) {
                <span hlmBadge variant="secondary">{{ star }}</span>
              }
            </div>
          </div>
        }
      </div>
    </hlm-dialog-content>
  </hlm-dialog>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZodiacSigns {
  readonly togglePopover = input.required<boolean>();
  readonly zodiacSignsHidden = output<void>();
  zodiacSignsData = Object.entries(ZODIAC_SIGN_LIST).map(([key, value]) => ({
    key,
    ...value,
  }));
}
