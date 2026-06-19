import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FlexibleConnectedPositionStrategyOrigin } from '@angular/cdk/overlay';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { MATCHING_STARS } from '../../constant/common.const';
import { ViewportService } from '../../services/viewport.service';

@Component({
  selector: 'app-star-match',
  imports: [NgTemplateOutlet, ...HlmPopoverImports, ...HlmSheetImports],
  templateUrl: './star-match.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarMatch {
  protected readonly viewport = inject(ViewportService);
  readonly togglePopover = input.required<boolean>();
  readonly attachTo = input<FlexibleConnectedPositionStrategyOrigin>();
  readonly starMatchHidden = output<void>();
  starMatchData = Object.entries(MATCHING_STARS).map(([key, value]) => ({
    starName: key,
    score: value as number,
  }));
}
