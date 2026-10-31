import { booleanAttribute, Component, computed, input } from '@angular/core';
import { NOT_SPECIFIED_LABEL } from '../../../constant/common.const';

/** Circular star-match score; scores run 0–10 so the ring fill is `score * 10`%. */
@Component({
  selector: 'app-score-ring',
  template: `
    @if (score() !== null) {
      <span class="relative grid place-items-center rounded-full" [style]="ringStyle()">
        <span class="bg-background absolute inset-[3px] rounded-full"></span>
        <span class="relative text-xs font-semibold" [style.font-size.px]="size() * 0.3">
          {{ score() }}
        </span>
      </span>
    } @else {
      @if (showEmpty()) {
        <span
          role="img"
          aria-label="Star match score not specified"
          class="border-muted-foreground/40 text-muted-foreground grid place-items-center rounded-full border border-dashed text-sm"
          [style.width.px]="size()"
          [style.height.px]="size()"
        >
          <span aria-hidden="true">-</span>
        </span>
      } @else {
        <span class="text-muted-foreground text-xs">{{ notSpecified }}</span>
      }
    }
  `,
  host: { class: 'inline-flex shrink-0 items-center' },
})
export class ScoreRing {
  readonly score = input<number | null>(null);
  readonly size = input(40);
  /** Card views: render an empty dashed ring instead of "Not specified" text when unscored. */
  readonly showEmpty = input(false, { transform: booleanAttribute });

  protected readonly notSpecified = NOT_SPECIFIED_LABEL;

  protected readonly ringStyle = computed(() => {
    const percent = Math.min(Math.max((this.score() ?? 0) * 10, 0), 100);
    return (
      `width:${this.size()}px;height:${this.size()}px;` +
      `background:conic-gradient(var(--score-fill) ${percent}%, var(--score-track) 0)`
    );
  });
}
