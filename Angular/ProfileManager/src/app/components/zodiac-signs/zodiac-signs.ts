import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FlexibleConnectedPositionStrategyOrigin } from '@angular/cdk/overlay';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { ZODIAC_SIGN_LIST } from '../../constant/common.const';
import { ViewportService } from '../../services/viewport.service';

@Component({
  selector: 'app-zodiac-signs',
  imports: [NgTemplateOutlet, HlmBadge, ...HlmPopoverImports, ...HlmSheetImports],
  templateUrl: './zodiac-signs.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZodiacSigns {
  protected readonly viewport = inject(ViewportService);
  readonly togglePopover = input.required<boolean>();
  readonly attachTo = input<FlexibleConnectedPositionStrategyOrigin>();
  readonly zodiacSignsHidden = output<void>();
  zodiacSignsData = Object.entries(ZODIAC_SIGN_LIST).map(([key, value]) => ({
    key,
    ...value,
  }));
}
