import { FlexibleConnectedPositionStrategyOrigin } from '@angular/cdk/overlay';
import { NgTemplateOutlet } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { BrnDialogState } from '@spartan-ng/brain/dialog';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { STAR_SCORES } from '../../constant/common.const';
import { ViewportService } from '../../services/viewport.service';

interface StarScoreGroup {
  score: number;
  stars: string[];
}

@Component({
  selector: 'app-star-match',
  imports: [NgTemplateOutlet, HlmBadge, ...HlmPopoverImports, ...HlmSheetImports],
  templateUrl: './star-match.html',
})
export class StarMatch {
  protected readonly viewport = inject(ViewportService);
  readonly togglePopover = input.required<BrnDialogState>();
  readonly attachTo = input<FlexibleConnectedPositionStrategyOrigin>();
  readonly starMatchHidden = output<void>();

  /** Stars grouped by their score, highest score first (the stars keep their list order). */
  readonly starGroups: StarScoreGroup[] = [
    ...Object.entries(STAR_SCORES).reduce((groups, [star, score]) => {
      groups.set(score, [...(groups.get(score) ?? []), star]);
      return groups;
    }, new Map<number, string[]>()),
  ]
    .map(([score, stars]) => ({ score, stars }))
    .sort((a, b) => b.score - a.score);
}
