import { Pipe, PipeTransform } from '@angular/core';
import { PROFILE_STATUS_STYLES } from '../../constant/common.const';
import { ProfileDetail } from '../../models/profile.model';

/** Classes for the absolutely positioned, status-coloured top edge of a profile card, derived from its status. */
@Pipe({ name: 'profileStatusEdge' })
export class ProfileStatusEdgePipe implements PipeTransform {
  transform(profile: ProfileDetail): string {
    const colour =
      PROFILE_STATUS_STYLES[profile.profileStatusId as keyof typeof PROFILE_STATUS_STYLES]?.dot ??
      'bg-border';
    return `absolute inset-x-0 top-0 h-[3px] ${colour}`;
  }
}
