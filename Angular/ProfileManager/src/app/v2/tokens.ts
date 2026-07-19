import { PROFILE_STATUS } from '../constant/common.const';

export interface V2StatusStyle {
  label: string;
  color: string;
  background: string;
  borderColor: string;
}

export const V2_STATUS_STYLES: Record<keyof typeof PROFILE_STATUS, V2StatusStyle> = {
  NEW: {
    label: 'New',
    color: 'var(--v2-s-new-text)',
    background: 'var(--v2-s-new-bg)',
    borderColor: 'var(--v2-s-new-border)',
  },
  CONTACTED: {
    label: 'Contacted',
    color: 'var(--v2-s-contacted-text)',
    background: 'var(--v2-s-contacted-bg)',
    borderColor: 'var(--v2-s-contacted-border)',
  },
  MEETING_SCHEDULED: {
    label: 'Meeting Scheduled',
    color: 'var(--v2-s-meeting-text)',
    background: 'var(--v2-s-meeting-bg)',
    borderColor: 'var(--v2-s-meeting-border)',
  },
  ACCEPTED: {
    label: 'Accepted',
    color: 'var(--v2-s-accepted-text)',
    background: 'var(--v2-s-accepted-bg)',
    borderColor: 'var(--v2-s-accepted-border)',
  },
  ON_HOLD: {
    label: 'On Hold',
    color: 'var(--v2-s-onhold-text)',
    background: 'var(--v2-s-onhold-bg)',
    borderColor: 'var(--v2-s-onhold-border)',
  },
  REJECTED: {
    label: 'Rejected',
    color: 'var(--v2-s-rejected-text)',
    background: 'var(--v2-s-rejected-bg)',
    borderColor: 'var(--v2-s-rejected-border)',
  },
  PROFILE_SHARED: {
    label: 'Profile Shared',
    color: 'var(--v2-s-shared-text)',
    background: 'var(--v2-s-shared-bg)',
    borderColor: 'var(--v2-s-shared-border)',
  },
  NEED_TO_CONTACT: {
    label: 'Need to Contact',
    color: 'var(--v2-s-needcontact-text)',
    background: 'var(--v2-s-needcontact-bg)',
    borderColor: 'var(--v2-s-needcontact-border)',
  },
  SHARE_BY_RM: {
    label: 'Share by RM',
    color: 'var(--v2-s-sharerm-text)',
    background: 'var(--v2-s-sharerm-bg)',
    borderColor: 'var(--v2-s-sharerm-border)',
  },
} as const;

export const V2_STAR_META: Record<number, { label: string; sub: string; colorVar: string }> = {
  9: { label: 'Excellent match', sub: 'Highly compatible star alignment', colorVar: 'var(--v2-star-9)' },
  8: { label: 'Good match', sub: 'Strong compatibility', colorVar: 'var(--v2-star-8)' },
};

export const V2_STATUS_STAT_LIST: Array<{
  key: keyof typeof PROFILE_STATUS;
  shortLabel: string;
}> = [
  { key: 'NEW', shortLabel: 'New' },
  { key: 'CONTACTED', shortLabel: 'Contacted' },
  { key: 'MEETING_SCHEDULED', shortLabel: 'Scheduled' },
  { key: 'ACCEPTED', shortLabel: 'Accepted' },
  { key: 'ON_HOLD', shortLabel: 'On Hold' },
  { key: 'PROFILE_SHARED', shortLabel: 'Shared' },
  { key: 'NEED_TO_CONTACT', shortLabel: 'Need Contact' },
  { key: 'REJECTED', shortLabel: 'Rejected' },
  { key: 'SHARE_BY_RM', shortLabel: 'Share by RM' },
];
