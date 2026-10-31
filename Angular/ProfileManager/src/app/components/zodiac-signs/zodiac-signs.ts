import { FlexibleConnectedPositionStrategyOrigin } from '@angular/cdk/overlay';
import { NgTemplateOutlet } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
  lucideZodiacAquarius,
  lucideZodiacAries,
  lucideZodiacCancer,
  lucideZodiacCapricorn,
  lucideZodiacGemini,
  lucideZodiacLeo,
  lucideZodiacLibra,
  lucideZodiacPisces,
  lucideZodiacSagittarius,
  lucideZodiacScorpio,
  lucideZodiacTaurus,
  lucideZodiacVirgo,
} from '@ng-icons/lucide';
import { BrnDialogState } from '@spartan-ng/brain/dialog';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { ZODIAC_LIST, ZodiacKey } from '../../constant/common.const';
import { ZodiacColorPipe } from '../../pipes/zodiac-color.pipe';
import { ZodiacIconPipe } from '../../pipes/zodiac-icon.pipe';
import { ZodiacLabelPipe } from '../../pipes/zodiac-label.pipe';
import { ViewportService } from '../../services/viewport.service';

@Component({
  selector: 'app-zodiac-signs',
  imports: [
    NgTemplateOutlet,
    HlmBadge,
    ZodiacColorPipe,
    ZodiacIconPipe,
    ZodiacLabelPipe,
    ...HlmIconImports,
    ...HlmPopoverImports,
    ...HlmSheetImports,
  ],
  templateUrl: './zodiac-signs.html',
  providers: [
    provideIcons({
      lucideZodiacAquarius,
      lucideZodiacAries,
      lucideZodiacCancer,
      lucideZodiacCapricorn,
      lucideZodiacGemini,
      lucideZodiacLeo,
      lucideZodiacLibra,
      lucideZodiacPisces,
      lucideZodiacSagittarius,
      lucideZodiacScorpio,
      lucideZodiacTaurus,
      lucideZodiacVirgo,
    }),
  ],
})
export class ZodiacSigns {
  protected readonly viewport = inject(ViewportService);
  readonly togglePopover = input.required<BrnDialogState>();
  readonly attachTo = input<FlexibleConnectedPositionStrategyOrigin>();
  readonly zodiacSignsHidden = output<void>();
  zodiacSignsData = Object.entries(ZODIAC_LIST).map(([key, value]) => ({
    key: key as ZodiacKey,
    ...value,
  }));
}
