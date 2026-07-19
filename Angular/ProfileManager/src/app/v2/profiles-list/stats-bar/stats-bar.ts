import { Component, computed, input } from '@angular/core';
import { PROFILE_STATUS } from '../../../constant/common.const';
import { ProfileDetail } from '../../../models/profile.model';
import { V2_STATUS_STYLES, V2_STATUS_STAT_LIST } from '../../tokens';

@Component({
  selector: 'app-v2-stats-bar',
  templateUrl: './stats-bar.html',
})
export default class V2StatsBar {
  profiles = input<ProfileDetail[]>([]);

  readonly stats = computed(() => {
    const list = this.profiles();
    const counts: Partial<Record<keyof typeof PROFILE_STATUS, number>> = {};
    for (const p of list) {
      if (p.profileStatusId) {
        counts[p.profileStatusId as keyof typeof PROFILE_STATUS] =
          (counts[p.profileStatusId as keyof typeof PROFILE_STATUS] ?? 0) + 1;
      }
    }
    return V2_STATUS_STAT_LIST.map((s) => ({
      ...s,
      count: counts[s.key] ?? 0,
      style: V2_STATUS_STYLES[s.key],
    }));
  });
}
