import { afterRenderEffect, Component, ElementRef, input, signal, viewChild } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { PROFILE_STATUS } from '../../../constant/common.const';

type StatusKey = keyof typeof PROFILE_STATUS;

const MASK_BOTH =
  'max-lg:[mask-image:linear-gradient(to_right,transparent,#000_20px,#000_calc(100%-20px),transparent)]';
const MASK_END = 'max-lg:[mask-image:linear-gradient(to_right,#000_calc(100%-20px),transparent)]';
const MASK_START = 'max-lg:[mask-image:linear-gradient(to_right,transparent,#000_20px)]';

/**
 * Single-select status filter chips (All + every status) bound to the `profileStatus` field.
 * With `scrollable`, below `lg` the chips become one horizontally scrolling row (hidden
 * scrollbar, edge fade, selected chip kept in view); at `lg` and up they wrap as before.
 */
@Component({
  selector: 'app-status-chips',
  templateUrl: './status-chips.html',
  host: { '(window:resize)': 'updateEdges()' },
})
export default class StatusChips {
  readonly profileStatus = input.required<FieldTree<StatusKey | null, string, 'writable'>>();
  readonly scrollable = input(false);

  private readonly group = viewChild.required<ElementRef<HTMLElement>>('group');
  private readonly atStart = signal(true);
  private readonly atEnd = signal(true);

  protected readonly chipClass =
    'glass text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 shrink-0 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap outline-none transition-colors focus-visible:ring-[3px] max-md:min-h-11';

  readonly options = Object.entries(PROFILE_STATUS).map(([key, label]) => ({
    key: key as StatusKey,
    label,
  }));

  protected groupClass(): string {
    if (!this.scrollable()) return 'flex flex-wrap gap-1.5';
    const start = this.atStart();
    const end = this.atEnd();
    const mask = start && end ? '' : start ? MASK_END : end ? MASK_START : MASK_BOTH;
    return `relative flex gap-1.5 max-lg:-mx-1 max-lg:flex-nowrap max-lg:overflow-x-auto max-lg:px-1 max-lg:py-1 max-lg:[scrollbar-width:none] max-lg:[&::-webkit-scrollbar]:hidden lg:flex-wrap ${mask}`;
  }

  constructor() {
    afterRenderEffect(() => {
      this.profileStatus()().value();
      if (this.scrollable()) this.scrollSelectedIntoView();
    });
  }

  /** Selecting the active chip (or "All") clears the filter. */
  select(key: StatusKey | null): void {
    const field = this.profileStatus()();
    field.value.set(key === null || field.value() === key ? null : key);
  }

  updateEdges(): void {
    const el = this.group().nativeElement;
    this.atStart.set(el.scrollLeft <= 1);
    this.atEnd.set(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }

  private scrollSelectedIntoView(): void {
    const el = this.group().nativeElement;
    const pressed = el.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (pressed && el.scrollWidth > el.clientWidth) {
      const target = pressed.offsetLeft - (el.clientWidth - pressed.offsetWidth) / 2;
      el.scrollTo({ left: Math.max(0, target), behavior: 'auto' });
    }
    this.updateEdges();
  }
}
