import { PROFILE_STATUS } from '../constant/common.const';

export type ToolbarAction = 'create' | 'edit' | 'view' | 'delete';

export interface UserActions {
  actionType: ToolbarAction;
  selectedProfileId?: string | null;
  openDrawer: boolean;
}

export interface SortOption {
  viewOrderCheck: boolean;
  searchQuery: string;
  profileStatus: keyof typeof PROFILE_STATUS | null;
  starMatchScore: number | null;
}
