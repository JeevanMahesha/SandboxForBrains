import { Pipe, PipeTransform } from '@angular/core';
import { ProfileDetail } from '../../../models/profile.model';

const STATUS_BORDER_MAP: Partial<Record<string, string>> = {
  NEW: 'border-l-sky-400',
  REJECTED: 'border-l-rose-400',
  CONTACTED: 'border-l-indigo-400',
  MEETING_SCHEDULED: 'border-l-lime-400',
  ACCEPTED: 'border-l-emerald-400',
  ON_HOLD: 'border-l-amber-400',
  PROFILE_SHARED: 'border-l-fuchsia-400',
  SHARE_BY_RM: 'border-l-orange-400',
  NEED_TO_CONTACT: 'border-l-slate-400',
};

@Pipe({ name: 'profileCardClass' })
export class ProfileCardClassPipe implements PipeTransform {
  transform(profile: ProfileDetail, isFirst: boolean): string {
    const base = 'flex flex-col gap-3 border-l-4 p-4 transition-colors';
    const borderTop = isFirst ? '' : 'border-t';
    const statusBorder = STATUS_BORDER_MAP[profile.profileStatusId ?? ''] ?? 'border-l-border';
    return [base, borderTop, statusBorder].filter(Boolean).join(' ');
  }
}
