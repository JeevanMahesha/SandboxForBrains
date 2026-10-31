import { Component, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';
import { PROFILE_STATUS } from '../../../constant/common.const';

type StatusKey = keyof typeof PROFILE_STATUS;

/** Single-select status filter chips (All + every status) bound to the `profileStatus` field. */
@Component({
  selector: 'app-status-chips',
  templateUrl: './status-chips.html',
})
export default class StatusChips {
  readonly profileStatus = input.required<FieldTree<StatusKey | null, string, 'writable'>>();

  protected readonly chipClass =
    'glass text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap outline-none transition-colors focus-visible:ring-[3px]';

  readonly options = Object.entries(PROFILE_STATUS).map(([key, label]) => ({
    key: key as StatusKey,
    label,
  }));

  /** Selecting the active chip (or "All") clears the filter. */
  select(key: StatusKey | null): void {
    const field = this.profileStatus()();
    field.value.set(key === null || field.value() === key ? null : key);
  }
}
