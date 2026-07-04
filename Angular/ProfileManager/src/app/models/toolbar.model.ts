import { PROFILE_STATUS } from '../constant/common.const';
import { TOOLBAR_ACTIONS } from '../constant/toolbar.const';

export type ToolbarAction = keyof typeof TOOLBAR_ACTIONS;

export interface SortOption {
  viewOrderCheck: boolean;
  searchQuery: string;
  profileStatus: keyof typeof PROFILE_STATUS | null;
  starMatchScore: number | null;
}
