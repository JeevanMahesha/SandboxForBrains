import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';
import { ListboxModule } from 'primeng/listbox';
import { Popover, PopoverModule } from 'primeng/popover';
import { TagModule } from 'primeng/tag';
import { zodiacSignList } from '../../constant/common';

@Component({
  selector: 'app-zodiac-signs',
  imports: [PopoverModule, ListboxModule, TagModule],
  template: `<p-popover #zodiacSigns (onHide)="onZodiacSignsHidden()">
    <p-listbox
      [options]="zodiacSignsData"
      optionLabel="english"
      [listStyle]="{ 'max-height': '350px' }"
      class="w-full border-none"
    >
      <ng-template #item let-item>
        <div class="flex flex-col gap-1 w-full py-2">
          <div class="flex justify-between items-center">
            <span class="font-semibold">{{ item.tanglish }}</span>
            <span class="text-xs text-surface-400">{{ item.english }}</span>
          </div>
          <div class="flex flex-wrap gap-1">
            @for (star of item.stars; track star) {
              <p-tag severity="secondary" [value]="star" [rounded]="true" />
            }
          </div>
        </div>
      </ng-template>
    </p-listbox>
  </p-popover> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZodiacSigns {
  togglePopover = input.required<MouseEvent | null>();
  zodiacSignsHidden = output<void>();
  zodiacSignsElement = viewChild<Popover>('zodiacSigns');
  zodiacSignsData = Object.entries(zodiacSignList).map(([key, value]) => ({
    key,
    ...value,
  }));

  constructor() {
    effect(() => {
      const visible = this.togglePopover();
      const popover = this.zodiacSignsElement();
      if (!popover || !visible) {
        popover?.hide();
        return;
      }
      popover.toggle(visible);
    });
  }

  onZodiacSignsHidden() {
    this.zodiacSignsElement()?.toggle(this.togglePopover());
    this.zodiacSignsHidden.emit();
  }
}
