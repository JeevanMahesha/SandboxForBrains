import { Component, computed, input } from '@angular/core';
import { NOT_SPECIFIED_LABEL } from '../../../constant/common.const';

/** Circular star-match score; scores run 0–10 so the ring fill is `score * 10`%. */
@Component({
  selector: 'app-score-ring',
  template: `
    @if (score() !== null) {
      <span class="relative grid place-items-center rounded-full" [style]="ringStyle()">
        <span class="bg-card absolute inset-[3px] rounded-full backdrop-blur-sm"></span>
        <span class="relative text-xs font-semibold" [style.font-size.px]="size() * 0.3">
          {{ score() }}
        </span>
      </span>
    } @else {
      <span class="text-muted-foreground text-xs">{{ notSpecified }}</span>
    }
  `,
  host: { class: 'inline-flex shrink-0 items-center' },
})
export class ScoreRing {
  readonly score = input<number | null>(null);
  readonly size = input(40);

  protected readonly notSpecified = NOT_SPECIFIED_LABEL;

  protected readonly ringStyle = computed(() => {
    const percent = Math.min(Math.max((this.score() ?? 0) * 10, 0), 100);
    return (
      `width:${this.size()}px;height:${this.size()}px;` +
      `background:conic-gradient(var(--score-fill) ${percent}%, var(--score-track) 0)`
    );
  });
}
