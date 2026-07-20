import { Component, computed, input } from '@angular/core';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { PROFILE_STATUS } from '../../constant/common.const';
import { V2_STATUS_STYLES } from '../tokens';

@Component({
  selector: 'app-v2-status-badge',
  imports: [HlmBadge],
  template: `
    <span
      hlmBadge
      variant="outline"
      [style.color]="style().color"
      [style.background]="style().background"
      [style.border-color]="style().borderColor"
    >
      <span class="size-1.5 shrink-0 rounded-full" [style.background]="style().color"></span>
      {{ style().label }}
    </span>
  `,
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
