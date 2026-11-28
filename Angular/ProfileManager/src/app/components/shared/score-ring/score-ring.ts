import { booleanAttribute, Component, computed, input } from '@angular/core';
import { NOT_SPECIFIED_LABEL } from '../../../constant/common.const';

/**
 * Circular star-match score; scores run 0–10 so the ring fill is `score * 10`%. Only the coloured
 * band is painted (its centre is masked out), so the hole shows whatever surface the ring sits on
 * (translucent glass card, drawer, login hero) instead of a flat disc.
 */
@Component({
  selector: 'app-score-ring',
  template: `
    @if (score() !== null) {
      <span
        role="img"
        class="relative grid place-items-center rounded-full"
        [attr.aria-label]="'Star match score ' + score() + ' of 10'"
        [attr.aria-describedby]="describedBy()"
        [style.width.px]="size()"
        [style.height.px]="size()"
      >
        <span class="absolute inset-0 rounded-full" [style]="ringStyle()"></span>
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
  /** Id of an element that explains the score; exposed as the ring's accessible description. */
  readonly describedBy = input<string | null>(null);

  protected readonly notSpecified = NOT_SPECIFIED_LABEL;

  /** Band thickness: 10% of the size (min 3px), so larger rings keep their weight. */
  protected readonly thickness = computed(() => Math.max(3, +(this.size() * 0.1).toFixed(1)));

  protected readonly ringStyle = computed(() => {
    const percent = Math.min(Math.max((this.score() ?? 0) * 10, 0), 100);
    const edge = this.thickness();
    // Transparent up to (radius - thickness), opaque from there out; 1px of blend keeps the inner
    // edge as smooth as the old disc's border-radius was.
    const mask = `radial-gradient(circle closest-side, transparent calc(100% - ${edge}px - 0.5px), #000 calc(100% - ${edge}px + 0.5px))`;
    return (
      `background:conic-gradient(var(--score-fill) ${percent}%, var(--score-track) 0);` +
      `-webkit-mask-image:${mask};mask-image:${mask}`
    );
  });
}
