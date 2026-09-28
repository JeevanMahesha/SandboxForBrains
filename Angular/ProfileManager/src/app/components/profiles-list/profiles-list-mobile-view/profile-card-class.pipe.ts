import { Pipe, PipeTransform } from '@angular/core';
import { PROFILE_STATUS_STYLES } from '../../../constant/common.const';
import { ProfileDetail } from '../../../models/profile.model';

@Pipe({ name: 'profileCardClass' })
export class ProfileCardClassPipe implements PipeTransform {
  transform(profile: ProfileDetail, isFirst: boolean): string {
    const base = 'flex flex-col gap-3 border-l-4 p-4 transition-colors';
    const borderTop = isFirst ? '' : 'border-t';
    const statusBorder =
      PROFILE_STATUS_STYLES[profile.profileStatusId as keyof typeof PROFILE_STATUS_STYLES]
        ?.border ?? 'border-l-border';
    return [base, borderTop, statusBorder].filter(Boolean).join(' ');
  }
}
