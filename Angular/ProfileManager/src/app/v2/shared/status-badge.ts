import { Component, computed, input } from '@angular/core';
import { PROFILE_STATUS } from '../../constant/common.const';
import { V2_STATUS_STYLES } from '../tokens';

@Component({
  selector: 'app-v2-status-badge',
  template: `
    <span
      class="v2-badge"
      [style.color]="style().color"
      [style.background]="style().background"
      [style.border-color]="style().borderColor"
    >
      <span class="v2-badge-dot" [style.background]="style().color"></span>
      {{ style().label }}
    </span>
  `,
  styles: [
    `
      .v2-badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 10px;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 5px;
        border: 1px solid transparent;
        letter-spacing: 0.07em;
        font-family: var(--v2-font-sans);
        white-space: nowrap;
      }
      .v2-badge-dot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        flex-shrink: 0;
      }
    `,
  ],
})
export default class V2StatusBadge {
  statusId = input<keyof typeof PROFILE_STATUS | null>(null);

  style = computed(() => {
    const id = this.statusId();
    if (!id || !(id in V2_STATUS_STYLES)) {
      return { label: '—', color: 'var(--v2-zinc-500)', background: 'rgba(113,113,122,.1)', borderColor: 'rgba(113,113,122,.2)' };
    }
    return V2_STATUS_STYLES[id];
  });
}
