import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FlexibleConnectedPositionStrategyOrigin } from '@angular/cdk/overlay';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { ZODIAC_SIGN_LIST } from '../../constant/common.const';

@Component({
  selector: 'app-zodiac-signs',
  imports: [HlmBadge, ...HlmPopoverImports],
  templateUrl: './zodiac-signs.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZodiacSigns {
  readonly togglePopover = input.required<boolean>();
  readonly attachTo = input<FlexibleConnectedPositionStrategyOrigin>();
  readonly zodiacSignsHidden = output<void>();
  zodiacSignsData = Object.entries(ZODIAC_SIGN_LIST).map(([key, value]) => ({
    key,
    ...value,
  }));
}
