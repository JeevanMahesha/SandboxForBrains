export type ToolbarAction = 'create' | 'edit' | 'view';

export interface UserActions {
  actionType: ToolbarAction;
  selectedProfileId?: string | null;
  openDrawer: boolean;
}
